"""
API Chat: Chatbot เรียก Gemini API (ผ่าน OpenAI-compatible endpoint) รองรับข้อความและรูปภาพ
- โหลด product_title, product_description, product_price จาก CSV เป็น context ให้ LLM แนะนำหินให้ลูกค้า
- POST /chat/completions: คืนคำตอบแบบเต็ม (ไม่ stream)
- POST /chat/completions/stream: คืนคำตอบแบบ streaming (SSE)

การตั้งค่า (.env หรือ environment variables):
    GEMINI_API_KEY=xxxxxxxx        (จำเป็น — ขอได้ฟรีที่ https://aistudio.google.com/apikey)
    GEMINI_CHAT_MODEL=gemini-2.5-flash   (ไม่ใส่ก็ได้ มีค่า default ให้)

หมายเหตุ: โค้ดนี้ยังใช้ไลบรารี `openai` เหมือนเดิม เพราะ Gemini มี endpoint ที่เข้ากันได้กับ
OpenAI Chat Completions API โดยตรง (https://ai.google.dev/gemini-api/docs/openai) — แค่เปลี่ยน
base_url, api_key และชื่อ model เท่านั้น ไม่ต้องเขียน client ใหม่
"""
import csv
import json
import logging
import os
import sys
from pathlib import Path
from typing import List, Optional, Union

from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from openai import OpenAI
from pydantic import BaseModel, Field

_project_root = Path(__file__).resolve().parent.parent
if str(_project_root) not in sys.path:
    sys.path.insert(0, str(_project_root))
from scrape_granite import CSV_PATH

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/chat", tags=["Chat"])

# ---------------------------------------------------------------------------
# Gemini config — อ่านจาก environment variable เท่านั้น (ห้าม hardcode คีย์ในโค้ด!)
# ---------------------------------------------------------------------------
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")
GEMINI_BASE_URL = "https://generativelanguage.googleapis.com/v1beta/openai/"

# โมเดล Gemini ที่แนะนำสำหรับแชทบอทแบบนี้ (เร็ว ราคาถูก รองรับรูปภาพ):
#   gemini-2.5-flash       -> สมดุลระหว่างคุณภาพ/ราคา/ความเร็ว (ค่า default)
#   gemini-2.5-flash-lite  -> ถูกและเร็วที่สุด เหมาะกับงานตอบคำถามสั้นๆ
#   gemini-2.5-pro         -> ฉลาดที่สุด แต่ช้ากว่าและแพงกว่า
# ตรวจสอบรายชื่อ/ราคาโมเดลล่าสุดได้ที่ https://ai.google.dev/gemini-api/docs/models ก่อนใช้งานจริง
CHAT_MODEL = os.environ.get("GEMINI_CHAT_MODEL", "gemini-2.5-flash")
MAX_TOKENS = int(os.environ.get("GEMINI_MAX_TOKENS", "8192"))

_openai_client: Optional[OpenAI] = None


def _get_client() -> OpenAI:
    global _openai_client
    if not GEMINI_API_KEY:
        # ล้มเหลวทันทีตอนเรียกใช้จริง พร้อมข้อความชัดเจน แทนที่จะปล่อยให้ไป error ตอนยิง request จริง
        raise HTTPException(
            status_code=500,
            detail="ยังไม่ได้ตั้งค่า GEMINI_API_KEY — เพิ่มใน .env แล้ว restart server "
                   "(ขอคีย์ได้ฟรีที่ https://aistudio.google.com/apikey)",
        )
    if _openai_client is None:
        _openai_client = OpenAI(
            api_key=GEMINI_API_KEY,
            base_url=GEMINI_BASE_URL,
        )
    return _openai_client


def _load_products_context() -> str:
    """
    โหลด product_title, product_description, product_price จาก CSV
    สร้างเป็นข้อความ context ให้ LLM ใช้แนะนำหินให้ลูกค้า
    """
    if not CSV_PATH.exists():
        return ""
    lines = []
    with open(CSV_PATH, "r", encoding="utf-8-sig", newline="") as f:
        reader = csv.DictReader(f)
        for i, row in enumerate(reader):
            title = (row.get("product_title") or "").strip()
            desc = (row.get("product_description") or "").strip()
            price = (row.get("product_price") or "").strip().replace(",", "")
            if not title:
                continue
            lines.append(f"- ชื่อ: {title} | ราคา: {price} บาท/ตร.ม. | รายละเอียด: {desc}")
    if not lines:
        return ""
    block = "\n".join(lines)
    return (
        "คุณเป็นผู้เชี่ยวชาญแนะนำหินแกรนิตและหินอ่อน ให้แนะนำลูกค้าจากรายการสินค้าที่มีในระบบเท่านั้น "
        "โดยอ้างอิงชื่อหิน ราคา (บาท/ตร.ม.) และรายละเอียดด้านล่างนี้:\n\n"
        f"{block}\n\n"
        "ตอบเป็นภาษาไทย อธิบายให้เหมาะกับความต้องการของลูกค้า และระบุชื่อหินกับราคาจากรายการด้านบนเมื่อแนะนำ."
    )


def _messages_with_products_context(messages: list) -> list:
    """ใส่ context รายการหินเป็น system message ด้านหน้าสุด"""
    context = _load_products_context()
    if not context:
        return messages
    return [{"role": "system", "content": context}] + messages


# ---------------------------------------------------------------------------
# Request/Response models
# ---------------------------------------------------------------------------

class ImageUrlContent(BaseModel):
    """รูปภาพส่งเป็น URL"""
    url: str


class TextContent(BaseModel):
    """ข้อความธรรมดา"""
    type: str = "text"
    text: str


class ImageUrlPart(BaseModel):
    """ส่วน content แบบ image_url (สำหรับ vision) — Gemini รองรับรูปแบบนี้เหมือน OpenAI"""
    type: str = "image_url"
    image_url: ImageUrlContent


# Message content: ได้ทั้ง string หรือ list ของ text/image_url
ChatContent = Union[str, List[Union[dict, TextContent, ImageUrlPart]]]


class ChatMessage(BaseModel):
    role: str  # "user" | "assistant" | "system"
    content: Union[str, List[dict]] = Field(
        ...,
        description="ข้อความหรือ list ของ {type: 'text', text: '...'} หรือ {type: 'image_url', image_url: {url: '...'}}",
    )

    class Config:
        extra = "allow"


class ChatCompletionsRequest(BaseModel):
    """Body เหมือน OpenAI Chat Completions"""
    messages: List[ChatMessage]
    model: Optional[str] = Field(None, description="ถ้าไม่ส่ง ใช้ model เริ่มต้น (gemini-2.5-flash)")
    max_tokens: Optional[int] = Field(None, description="ถ้าไม่ส่ง ใช้ค่า default")
    stream: Optional[bool] = Field(False, description="ใช้ endpoint /stream แทน")

    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "messages": [
                        {"role": "user", "content": "อยากได้หินสีดำสำหรับท็อปครัว งบประมาณไม่เกิน 2500 บาท/ตร.ม. แนะนำหน่อย"}
                    ],
                    "max_tokens": 1024,
                },
                {
                    "messages": [
                        {"role": "user", "content": "มีหินแกรนิตสีขาวอะไรบ้าง"}
                    ],
                },
                {
                    "messages": [
                        {
                            "role": "user",
                            "content": [
                                {"type": "text", "text": "รูปนี้เป็นหินชนิดไหน อธิบายและแนะนำหินใกล้เคียงจากรายการ"},
                                {"type": "image_url", "image_url": {"url": "https://example.com/stone.jpg"}},
                            ],
                        }
                    ],
                    "max_tokens": 1024,
                },
            ]
        }
    }


def _messages_to_openai(messages: List[ChatMessage]) -> list:
    """แปลง Pydantic messages เป็นรูปแบบที่ OpenAI client รับ"""
    out = []
    for m in messages:
        msg = {"role": m.role, "content": m.content}
        out.append(msg)
    return out


# ---------------------------------------------------------------------------
# Schema สำหรับทดลอง: GET /chat/schema
# ---------------------------------------------------------------------------

CHAT_SCHEMA_EXAMPLES = {
    "request_schema": {
        "messages": [
            {"role": "user", "content": "ข้อความจากลูกค้า"}
        ],
        "model": "ไม่ส่งได้ (ใช้ model เริ่มต้น: gemini-2.5-flash)",
        "max_tokens": 1024,
    },
    "examples": [
        {
            "name": "แนะนำหินตามงบ",
            "body": {
                "messages": [
                    {"role": "user", "content": "อยากได้หินสีดำสำหรับท็อปครัว งบประมาณไม่เกิน 2500 บาท/ตร.ม. แนะนำหน่อย"}
                ],
                "max_tokens": 1024,
            },
        },
        {
            "name": "ถามรายการหินสีขาว",
            "body": {
                "messages": [{"role": "user", "content": "มีหินแกรนิตสีขาวอะไรบ้าง"}],
            },
        },
        {
            "name": "ข้อความ + รูป (vision)",
            "body": {
                "messages": [
                    {
                        "role": "user",
                        "content": [
                            {"type": "text", "text": "รูปนี้เป็นหินชนิดไหน แนะนำหินใกล้เคียงจากรายการ"},
                            {"type": "image_url", "image_url": {"url": "https://example.com/stone.jpg"}},
                        ],
                    }
                ],
                "max_tokens": 1024,
            },
        },
    ],
    "endpoints": {
        "completions": "POST /chat/completions — คืนคำตอบเต็มครั้งเดียว",
        "completions_stream": "POST /chat/completions/stream — คืนคำตอบแบบ streaming (SSE)",
    },
}


@router.get("/schema", summary="Schema สำหรับทดลอง")
def chat_schema():
    """คืน request schema และตัวอย่าง body สำหรับทดลอง Chat API"""
    return CHAT_SCHEMA_EXAMPLES


# ---------------------------------------------------------------------------
# Non-streaming: POST /chat/completions
# ---------------------------------------------------------------------------

@router.post("/completions")
def chat_completions(request: ChatCompletionsRequest):
    """
    ส่งข้อความ (และ optional รูปภาพ) ไปที่ Gemini ได้คำตอบแบบเต็มครั้งเดียว
    มี context รายการหิน (ชื่อ, รายละเอียด, ราคา) ให้ LLM แนะนำหินให้ลูกค้า
    """
    client = _get_client()
    model = request.model or CHAT_MODEL
    max_tokens = request.max_tokens or MAX_TOKENS
    messages = _messages_with_products_context(_messages_to_openai(request.messages))

    try:
        completion = client.chat.completions.create(
            model=model,
            max_tokens=max_tokens,
            messages=messages,
        )
    except Exception as e:
        logger.exception("Gemini chat error: %s", e)
        raise HTTPException(status_code=502, detail=str(e))

    choice = completion.choices[0] if completion.choices else None
    if not choice:
        raise HTTPException(status_code=502, detail="No response from model")

    content = choice.message.content or ""
    usage = completion.usage
    return {
        "content": content,
        "role": choice.message.role,
        "usage": {
            "prompt_tokens": getattr(usage, "prompt_tokens", None),
            "completion_tokens": getattr(usage, "completion_tokens", None),
            "total_tokens": getattr(usage, "total_tokens", None),
        },
    }


# ---------------------------------------------------------------------------
# Streaming: POST /chat/completions/stream (SSE)
# ---------------------------------------------------------------------------

def _stream_events(messages: list, model: str, max_tokens: int):
    """Generator ส่ง SSE chunks จาก Gemini stream"""
    client = _get_client()
    stream = client.chat.completions.create(
        model=model,
        max_tokens=max_tokens,
        messages=messages,
        stream=True,
    )
    for chunk in stream:
        if not chunk.choices:
            continue
        delta = chunk.choices[0].delta
        content = getattr(delta, "content", None)
        if content:
            # SSE format: data: {...}\n\n
            data = json.dumps({"content": content})
            yield f"data: {data}\n\n"
    yield "data: [DONE]\n\n"


@router.post("/completions/stream")
def chat_completions_stream(request: ChatCompletionsRequest):
    """
    Chatbot แบบ streaming (SSE): คืนข้อความทีละส่วน
    มี context รายการหิน (ชื่อ, รายละเอียด, ราคา) ให้ LLM แนะนำหินให้ลูกค้า
    """
    model = request.model or CHAT_MODEL
    max_tokens = request.max_tokens or MAX_TOKENS
    messages = _messages_with_products_context(_messages_to_openai(request.messages))

    try:
        return StreamingResponse(
            _stream_events(messages, model, max_tokens),
            media_type="text/event-stream",
            headers={
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
                "X-Accel-Buffering": "no",
            },
        )
    except Exception as e:
        logger.exception("Gemini stream error: %s", e)
        raise HTTPException(status_code=502, detail=str(e))
