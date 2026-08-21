"""
main.py — จุดเริ่มต้นของ Granite Design Advisor backend

รันด้วย:
    uvicorn main:app --reload

แล้วเปิดเบราว์เซอร์ที่ http://127.0.0.1:8000
(ไฟล์นี้ serve ทั้ง API และหน้าเว็บ frontend จาก server เดียวกัน เลยไม่ต้องยุ่งกับ CORS
ตอน dev ในเครื่อง — frontend เรียก API ด้วย path สัมพัทธ์ เช่น /chat/completions/stream
ซึ่งจะชี้กลับมาที่ server ตัวเดียวกันโดยอัตโนมัติ)
"""
import logging
import os
from pathlib import Path

from dotenv import load_dotenv
load_dotenv()  # อ่านค่าจาก .env เข้า os.environ — ต้องเรียกก่อน import router ที่อ่าน os.environ.get(...)

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from routers.Chat import router as chat_router
from routers.Estimate import router as estimate_router, start_estimate_scheduler

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

BASE_DIR = Path(__file__).resolve().parent
FRONTEND_DIR = BASE_DIR.parent / "frontend"

app = FastAPI(title="Granite Design Advisor API")

# CORS: มีไว้เผื่ออนาคตแยก deploy frontend/backend คนละโดเมน
# ตอนรันในเครื่องแบบนี้ (frontend ถูก serve จาก server เดียวกัน) ไม่จำเป็นต้องใช้ก็ได้
allowed_origins = os.environ.get("CORS_ALLOWED_ORIGINS", "").split(",")
allowed_origins = [o.strip() for o in allowed_origins if o.strip()]
if allowed_origins:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=allowed_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

# --- API routers (ต้อง include ก่อน mount static ที่ "/" ด้านล่าง) ---
app.include_router(chat_router)
app.include_router(estimate_router)


@app.on_event("startup")
def on_startup():
    if not os.environ.get("GEMINI_API_KEY"):
        logger.warning(
            "⚠️  ยังไม่ได้ตั้งค่า GEMINI_API_KEY ใน .env — หน้า AI Chat จะใช้งานไม่ได้จนกว่าจะตั้งค่า"
        )
    try:
        start_estimate_scheduler()
    except Exception as e:
        logger.warning("เริ่ม scheduler ไม่สำเร็จ (ไม่กระทบการใช้งานทั่วไป): %s", e)


@app.get("/health")
def health():
    return {"status": "ok"}


# --- Frontend: serve ไฟล์ static ทั้งโฟลเดอร์ ../frontend ---
# ต้อง mount เป็นอันดับสุดท้าย เพราะ "/" จะกิน route ทุกอันที่เหลือ
if FRONTEND_DIR.exists():
    app.mount("/", StaticFiles(directory=str(FRONTEND_DIR), html=True), name="frontend")
else:
    logger.warning("ไม่พบโฟลเดอร์ frontend ที่ %s — จะรันได้แค่ API", FRONTEND_DIR)
