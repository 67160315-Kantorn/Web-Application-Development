"""
scrape_granite.py — จัดการข้อมูลหินแกรนิต/หินอ่อนจาก siamtak.com

CSV_PATH: path ของไฟล์ข้อมูลที่ Chat.py และ Estimate.py ใช้อ่าน
run_granite_scrape(): ดึงข้อมูลสินค้าล่าสุดจากเว็บ แล้วเขียนทับ CSV_PATH

หมายเหตุสำคัญ:
- ไฟล์ data/siamtak_granite.csv ที่แนบมาด้วยเป็นข้อมูล "seed" (ชุดข้อมูลตั้งต้น) เพื่อให้
  /chat และ /estimate ใช้งานได้ทันทีโดยไม่ต้อง scrape ก่อนสักครั้ง
- ฟังก์ชัน run_granite_scrape() ด้านล่างเป็นโครงที่ใช้งานได้จริง (requests + BeautifulSoup)
  แต่ CSS selector อาจต้องปรับให้ตรงกับโครงสร้าง HTML ปัจจุบันของ siamtak.com ก่อนใช้งานจริง
  เพราะโครงสร้างเว็บอาจเปลี่ยนไปตามเวลา — ทดสอบด้วย POST /estimate/refresh แล้วดู log
- ถ้า scrape ล้มเหลว ฟังก์ชันจะคืนค่า success=False และ "ไม่แตะ" ไฟล์ CSV เดิม
  (ระบบยังใช้ข้อมูลชุดล่าสุดที่เคย scrape สำเร็จต่อไปได้ ไม่พังทั้งเว็บ)
"""
import csv
import logging
from pathlib import Path
from typing import Optional

logger = logging.getLogger(__name__)

BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "data"
DATA_DIR.mkdir(exist_ok=True)
CSV_PATH = DATA_DIR / "siamtak_granite.csv"

SITE_URL = "https://www.siamtak.com"
CSV_FIELDS = ["product_url", "product_title", "product_description", "product_price", "image_url", "image_path"]


def _scrape_product_list() -> Optional[list]:
    """
    ดึงรายการสินค้าจาก siamtak.com
    คืน list ของ dict ตาม CSV_FIELDS หรือ None ถ้าล้มเหลว

    TODO: ปรับ selector (`.product-card`, `.product-title` ฯลฯ) ให้ตรงกับ HTML จริงของเว็บ
    เปิด view-source ของหน้าสินค้าจริงเทียบดูก่อนใช้งาน — เว็บ e-commerce ส่วนใหญ่เปลี่ยน
    class name บ่อยเวลามีการอัปเดตธีม
    """
    try:
        import requests
        from bs4 import BeautifulSoup
    except ImportError:
        logger.error("ต้องติดตั้ง requests และ beautifulsoup4 ก่อน: pip install requests beautifulsoup4")
        return None

    try:
        resp = requests.get(f"{SITE_URL}/products", timeout=20)
        resp.raise_for_status()
    except Exception as e:
        logger.error("scrape ล้มเหลว (เชื่อมต่อ %s ไม่ได้): %s", SITE_URL, e)
        return None

    soup = BeautifulSoup(resp.text, "html.parser")
    cards = soup.select(".product-card")  # TODO: ปรับ selector ให้ตรงกับเว็บจริง
    if not cards:
        logger.warning("ไม่พบ .product-card ในหน้า — selector อาจไม่ตรงกับโครงสร้างเว็บปัจจุบันแล้ว")
        return None

    rows = []
    for card in cards:
        try:
            link = card.select_one("a")
            title_el = card.select_one(".product-title")
            desc_el = card.select_one(".product-description")
            price_el = card.select_one(".product-price")
            img_el = card.select_one("img")

            product_url = link["href"] if link and link.has_attr("href") else ""
            if product_url and not product_url.startswith("http"):
                product_url = SITE_URL + product_url
            title = title_el.get_text(strip=True) if title_el else ""
            desc = desc_el.get_text(strip=True) if desc_el else ""
            price = price_el.get_text(strip=True).replace(",", "").replace("฿", "") if price_el else ""
            image_url = img_el["src"] if img_el and img_el.has_attr("src") else ""

            if not title:
                continue
            rows.append({
                "product_url": product_url,
                "product_title": title,
                "product_description": desc,
                "product_price": price,
                "image_url": image_url,
                "image_path": "",
            })
        except Exception as e:
            logger.warning("ข้าม product card ที่ parse ไม่ได้: %s", e)
            continue

    return rows or None


def run_granite_scrape() -> dict:
    """
    รัน scrape แล้วเขียนทับ CSV_PATH ถ้าสำเร็จ
    คืน {"success": bool, "message": str, "count": int}
    """
    rows = _scrape_product_list()
    if not rows:
        return {
            "success": False,
            "message": "Scrape ไม่สำเร็จ หรือไม่พบสินค้า — ใช้ข้อมูลชุดเดิมใน CSV ต่อไป "
                        "(ตรวจสอบ selector ใน scrape_granite.py หรือดู log เพิ่มเติม)",
            "count": 0,
        }

    try:
        with open(CSV_PATH, "w", encoding="utf-8-sig", newline="") as f:
            writer = csv.DictWriter(f, fieldnames=CSV_FIELDS)
            writer.writeheader()
            writer.writerows(rows)
    except Exception as e:
        logger.exception("เขียน CSV ไม่สำเร็จ: %s", e)
        return {"success": False, "message": f"เขียนไฟล์ CSV ไม่สำเร็จ: {e}", "count": 0}

    logger.info("Scrape สำเร็จ: %d รายการ", len(rows))
    return {"success": True, "message": f"อัปเดตข้อมูลสำเร็จ {len(rows)} รายการ", "count": len(rows)}
