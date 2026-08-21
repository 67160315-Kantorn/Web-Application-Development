"""
API Estimate: scrape ข้อมูลหินแกรนิตจาก siamtak.com แล้วเก็บเป็น CSV
- รัน scrape อัตโนมัติทุก 1 วัน
- Endpoints: อ่านข้อมูล, ดาวน์โหลด CSV, รัน scrape ทันที (refresh)
- Calculate: คำนวณตาม Flow (input → AI ราคาหิน Real Time → คำนวณพื้นที่/ราคารวม → แสดงผล)
"""
import csv
import logging
import sys
from pathlib import Path
from typing import Optional

from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
from pydantic import BaseModel

# ให้ import จากโปรเจกต์ root (โฟลเดอร์ที่มี scrape_granite.py)
_project_root = Path(__file__).resolve().parent.parent
if str(_project_root) not in sys.path:
    sys.path.insert(0, str(_project_root))

from scrape_granite import CSV_PATH, run_granite_scrape

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/estimate", tags=["Estimate"])

# Scheduler รัน scrape ทุก 1 วัน
_scheduler = None


def _get_scheduler():
    global _scheduler
    if _scheduler is None:
        from apscheduler.schedulers.background import BackgroundScheduler
        _scheduler = BackgroundScheduler()
        _scheduler.add_job(run_granite_scrape, "interval", days=1, id="granite_scrape")
        logger.info("Estimate: scheduled granite scrape every 1 day")
    return _scheduler


def start_estimate_scheduler():
    """เรียกจาก main.py ตอน startup เพื่อให้รัน scrape ทุก 1 วัน"""
    _get_scheduler().start()


# ---------------------------------------------------------------------------
# Calculate ตาม Flow: Input → AI ราคาหิน Real Time → คำนวณพื้นที่/ราคารวม → แสดงผล
# ---------------------------------------------------------------------------

def _load_products_csv():
    """โหลดรายการหินจาก CSV (ใช้เป็นข้อมูล Real Time สำหรับตรวจสอบราคา)"""
    if not CSV_PATH.exists():
        return []
    with open(CSV_PATH, "r", encoding="utf-8-sig", newline="") as f:
        return list(csv.DictReader(f))


def _get_stone_price_by_type(products: list, stone_type: str) -> Optional[float]:
    """
    ใช้ AI/ข้อมูล Real Time ตรวจสอบราคาหินตามประเภท (product_title).
    คืนราคาต่อ ตร.ม (บาท) หรือ None ถ้าไม่เจอ
    """
    stone_upper = (stone_type or "").strip().upper()
    if not stone_upper:
        return None
    for row in products:
        title = (row.get("product_title") or "").strip().upper()
        if stone_upper in title or title in stone_upper:
            try:
                return float((row.get("product_price") or "0").replace(",", ""))
            except ValueError:
                continue
    # fuzzy: ถ้าไม่ match เต็ม ใช้ตัวแรกที่ขึ้นต้นตรง
    for row in products:
        title = (row.get("product_title") or "").strip().upper()
        if title.startswith(stone_upper) or stone_upper.startswith(title):
            try:
                return float((row.get("product_price") or "0").replace(",", ""))
            except ValueError:
                continue
    return None


class CalculateRequest(BaseModel):
    """Input ตาม Flow: พื้นที่ (ตร.ม), ประเภทหิน, งบประมาณ (ถ้ามี). หรือส่งกว้าง×ยาวแทนพื้นที่"""
    # ส่งอย่างใดอย่างหนึ่ง: area_sqm หรือ (width_m + length_m)
    area_sqm: Optional[float] = None  # พื้นที่ (ตร.ม)
    width_m: Optional[float] = None   # กว้าง (เมตร) สำหรับคำนวณพื้นที่ = กว้าง × ยาว
    length_m: Optional[float] = None # ยาว (เมตร)
    stone_type: str                  # ประเภทหิน (ชื่อหินจากรายการ)
    budget: Optional[float] = None  # งบประมาณ (บาท) ถ้าต้องการเปรียบเทียบ


class CalculateResponse(BaseModel):
    """ผลลัพธ์แสดงในหน้าจอ ตาม Flow"""
    area_sqm: float          # พื้นที่ (ตร.ม) ที่ใช้คำนวณ
    price_per_sqm: float    # ราคาหินต่อหน่วย (บาท/ตร.ม) จากข้อมูล Real Time
    total_price: float      # ราคารวม = พื้นที่ × ราคาต่อหน่วย
    stone_type: str         # ประเภทหินที่ใช้
    within_budget: Optional[bool] = None  # อยู่ในงบหรือไม่ (ถ้ามี budget)
    message: str            # ข้อความสรุป


@router.post("/calculate", response_model=CalculateResponse)
def calculate(request: CalculateRequest):
    """
    คำนวณตาม Flow:
    1. Input: พื้นที่ (หรือ กว้าง×ยาว), ประเภทหิน, งบประมาณ(ถ้ามี)
    2. ใช้ AI/ข้อมูล Real Time ตรวจสอบราคาหิน (จาก CSV ที่ scrape ล่าสุด)
    3. คำนวณพื้นที่ = กว้าง × ยาว (ถ้าไม่ได้ส่ง area_sqm)
    4. คำนวณราคารวม = พื้นที่ × ราคาต่อหน่วย
    5. แสดงคำตอบ (และเปรียบกับงบถ้ามี)
    """
    products = _load_products_csv()
    if not products:
        raise HTTPException(
            status_code=404,
            detail="ยังไม่มีข้อมูลราคาหิน ให้รัน POST /estimate/refresh ก่อน",
        )

    # 1) พื้นที่: ถ้ามี area_sqm ใช้เลย ไม่ก็คำนวณจาก กว้าง × ยาว
    if request.area_sqm is not None and request.area_sqm > 0:
        area_sqm = request.area_sqm
    elif request.width_m is not None and request.length_m is not None and request.width_m > 0 and request.length_m > 0:
        area_sqm = request.width_m * request.length_m
    else:
        raise HTTPException(
            status_code=400,
            detail="กรุณาส่ง area_sqm หรือ (width_m และ length_m) ที่ถูกต้อง",
        )

    # 2) ใช้ AI / ข้อมูล Real Time ตรวจสอบราคาหิน
    price_per_sqm = _get_stone_price_by_type(products, request.stone_type)
    if price_per_sqm is None:
        raise HTTPException(
            status_code=404,
            detail=f"ไม่พบประเภทหิน '{request.stone_type}' ในรายการ กรุณาใช้ชื่อจาก GET /estimate/products",
        )

    # 3) คำนวณราคารวม = พื้นที่ × ราคาต่อหน่วย
    total_price = area_sqm * price_per_sqm

    # 4) เปรียบกับงบประมาณ (ถ้ามี)
    within_budget = None
    if request.budget is not None:
        within_budget = total_price <= request.budget

    message = (
        f"พื้นที่ {area_sqm:.2f} ตร.ม × ราคา {price_per_sqm:,.0f} บาท/ตร.ม = ราคารวม {total_price:,.2f} บาท"
    )
    if request.budget is not None:
        message += (
            " อยู่ในงบประมาณ" if within_budget else " เกินงบประมาณ"
        )

    return CalculateResponse(
        area_sqm=round(area_sqm, 2),
        price_per_sqm=price_per_sqm,
        total_price=round(total_price, 2),
        stone_type=request.stone_type,
        within_budget=within_budget,
        message=message,
    )


@router.get("/products")
def get_products():
    """อ่านข้อมูลหินแกรนิตจาก CSV ที่ scrape ไว้ (JSON)"""
    if not CSV_PATH.exists():
        raise HTTPException(status_code=404, detail="ยังไม่มีข้อมูล CSV ให้รัน POST /estimate/refresh ก่อน")
    rows = []
    with open(CSV_PATH, "r", encoding="utf-8-sig", newline="") as f:
        reader = csv.DictReader(f)
        for row in reader:
            rows.append(row)
    return {"count": len(rows), "products": rows}


@router.get("/csv")
def download_csv():
    """ดาวน์โหลดไฟล์ CSV ข้อมูลหินแกรนิต"""
    if not CSV_PATH.exists():
        raise HTTPException(status_code=404, detail="ยังไม่มีไฟล์ CSV ให้รัน POST /estimate/refresh ก่อน")
    return FileResponse(
        path=CSV_PATH,
        filename=CSV_PATH.name,
        media_type="text/csv",
    )


@router.post("/refresh")
def refresh_scrape():
    """รัน scrape หินแกรนิตจาก siamtak ทันที แล้วอัปเดต CSV (ไม่ต้องรอ 1 วัน)"""
    result = run_granite_scrape()
    if not result.get("success"):
        raise HTTPException(status_code=502, detail=result.get("message", "Scrape failed"))
    return result
