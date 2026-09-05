import asyncio
import json
import logging
import os
import uuid
from datetime import datetime, timezone
from typing import AsyncIterator, TypeVar

from emergentintegrations.llm.chat import LlmChat, StreamDone, TextDelta, UserMessage
from fastapi import APIRouter
from pydantic import BaseModel, ValidationError
from starlette.responses import StreamingResponse

from lib.db import db
from models.ai import (
    AIInsightRequest,
    AIInsightResponse,
    AIRecommendation,
    RecommendationGenerateRequest,
    RecommendationGenerateResponse,
)

router = APIRouter()
logger = logging.getLogger(__name__)

MODEL_PROVIDER = "openai"
MODEL_NAME = "gpt-5.4"
BUSINESS_CONTEXT = """
Dataset: Global Ecommerce Transactions 2025.
Current KPIs: revenue INR 24.8M (+12.4%), 18,429 orders (+8.7%), 12,840 customers
(+5.2%), average order value INR 1,346 (-2.1%).
Regional performance: North INR 7.8M (+18%), South INR 5.9M (+6%), East INR 6.2M
(+11%), West INR 4.9M (-18.7%).
Key anomalies: West Electronics revenue is INR 3.4M vs INR 4.2M expected (-19%);
West repeat purchase rate is 28.4% vs 34% expected (-16.5%); South shipping cost is
23.6% above baseline. Home & Living revenue is growing 32.4% month over month.
""".strip()

ModelT = TypeVar("ModelT", bound=BaseModel)


def _sse(event: str, payload: dict) -> str:
    return f"event: {event}\ndata: {json.dumps(payload, ensure_ascii=False)}\n\n"


def _extract_json(text: str) -> dict:
    cleaned = text.strip().replace("```json", "").replace("```", "").strip()
    start = cleaned.find("{")
    end = cleaned.rfind("}")
    if start < 0 or end <= start:
        raise ValueError("AI response did not contain a JSON object")
    return json.loads(cleaned[start : end + 1])


async def _persist_history(
    flow: str,
    dataset_id: str,
    prompt: str,
    response: BaseModel,
    fallback_used: bool,
) -> None:
    try:
        await db.ai_history.insert_one(
            {
                "id": str(uuid.uuid4()),
                "flow": flow,
                "dataset_id": dataset_id,
                "prompt": prompt,
                "response": response.model_dump(),
                "model": MODEL_NAME,
                "fallback_used": fallback_used,
                "created_at": datetime.now(timezone.utc),
            }
        )
    except Exception as exc:
        logger.warning("Unable to persist AI history: %s", exc)


async def _stream_structured_response(
    *,
    flow: str,
    dataset_id: str,
    user_prompt: str,
    system_message: str,
    response_model: type[ModelT],
    fallback: ModelT,
) -> AsyncIterator[str]:
    api_key = os.environ.get("EMERGENT_LLM_KEY", "")
    if not api_key:
        await _persist_history(flow, dataset_id, user_prompt, fallback, True)
        yield _sse("result", fallback.model_dump())
        return

    chunks: list[str] = []
    try:
        chat = LlmChat(
            api_key=api_key,
            session_id=f"insightflow-{flow}-{uuid.uuid4()}",
            system_message=system_message,
        ).with_model(MODEL_PROVIDER, MODEL_NAME)

        contextual_prompt = (
            f"Selected dataset id: {dataset_id}\n\n"
            f"Trusted business context:\n{BUSINESS_CONTEXT}\n\n"
            f"User request:\n{user_prompt}"
        )
        async with asyncio.timeout(55):
            async for event in chat.stream_message(UserMessage(text=contextual_prompt)):
                if isinstance(event, TextDelta):
                    chunks.append(event.content)
                    yield _sse("token", {"token": event.content})
                elif isinstance(event, StreamDone):
                    break

        parsed = _extract_json("".join(chunks))
        parsed["source"] = f"ChatGPT · {MODEL_NAME}"
        parsed["fallback_used"] = False
        result = response_model.model_validate(parsed)
        await _persist_history(flow, dataset_id, user_prompt, result, False)
        yield _sse("result", result.model_dump())
    except (TimeoutError, ValueError, ValidationError, json.JSONDecodeError, Exception) as exc:
        logger.warning("%s generation fell back: %s", flow, exc)
        await _persist_history(flow, dataset_id, user_prompt, fallback, True)
        yield _sse("result", fallback.model_dump())


@router.post("/insights/query")
async def query_insights(input: AIInsightRequest) -> StreamingResponse:
    fallback = AIInsightResponse(
        id=f"fallback-{uuid.uuid4()}",
        category="AI analysis",
        severity="high",
        title="West region is the clearest recovery opportunity",
        finding="Revenue declined 18.7% in the West region.",
        evidence="Electronics revenue is 19% below baseline and repeat purchase rate is down 16.5%.",
        impact="INR 2.4M at risk",
        action="Restore Electronics stock coverage and launch a targeted repeat-customer retention campaign.",
        timestamp="Just now",
        source="Deterministic fallback",
        fallback_used=True,
    )
    system_message = """
You are InsightFlow, a precise senior business analyst. Answer only from the trusted
business context supplied by the application. Do not invent metrics. Return one JSON
object only, without markdown, using exactly these keys: id, category, severity, title,
finding, evidence, impact, action, timestamp. severity must be high, medium, or low.
Use a short UUID-like id, set timestamp to Just now, make the finding direct, cite numeric
evidence, state business impact, and recommend a concrete next action.
""".strip()
    return StreamingResponse(
        _stream_structured_response(
            flow="insight",
            dataset_id=input.dataset_id,
            user_prompt=input.prompt,
            system_message=system_message,
            response_model=AIInsightResponse,
            fallback=fallback,
        ),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )


@router.post("/recommendations/generate")
async def generate_recommendations(input: RecommendationGenerateRequest) -> StreamingResponse:
    fallback = RecommendationGenerateResponse(
        recommendations=[
            AIRecommendation(id="ai-rec-01", priority="high", title="Recover repeat customers in West", reason="Repeat purchase rate is 16.5% below baseline in the region with the largest revenue decline.", impact="Potential revenue recovery of 8–12%", metric="Repeat purchase rate"),
            AIRecommendation(id="ai-rec-02", priority="high", title="Restore West Electronics availability", reason="Electronics revenue is 19% below its expected baseline and inventory coverage is constrained.", impact="Protect up to INR 1.1M in demand", metric="Revenue vs expected"),
            AIRecommendation(id="ai-rec-03", priority="medium", title="Rebalance South shipping lanes", reason="Shipping costs are 23.6% above the operating baseline.", impact="Reduce fulfillment cost by approximately INR 280K monthly", metric="Average shipping cost"),
        ],
        source="Deterministic fallback",
        fallback_used=True,
    )
    system_message = """
You are InsightFlow, a senior decision-support analyst. Use only the trusted business
context supplied by the application. Return one JSON object only, without markdown, with
a recommendations array of exactly three objects. Each object must contain id, priority,
title, reason, impact, metric, status. priority must be high, medium, or low; status must
be open. Rank actions by urgency and quantified impact. Do not invent unsupported facts.
""".strip()
    return StreamingResponse(
        _stream_structured_response(
            flow="recommendations",
            dataset_id=input.dataset_id,
            user_prompt="Generate and prioritize the three highest-leverage business actions.",
            system_message=system_message,
            response_model=RecommendationGenerateResponse,
            fallback=fallback,
        ),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )