from typing import Literal

from pydantic import BaseModel, Field


class AIInsightRequest(BaseModel):
    prompt: str = Field(min_length=3, max_length=1200)
    dataset_id: str = Field(default="ds-ecomm-2025", max_length=120)


class AIInsightResponse(BaseModel):
    id: str
    category: str
    severity: Literal["high", "medium", "low", "resolved"]
    title: str
    finding: str
    evidence: str
    impact: str
    action: str
    timestamp: str
    source: str
    fallback_used: bool


class RecommendationGenerateRequest(BaseModel):
    dataset_id: str = Field(default="ds-ecomm-2025", max_length=120)


class AIRecommendation(BaseModel):
    id: str
    priority: Literal["high", "medium", "low"]
    title: str
    reason: str
    impact: str
    metric: str
    status: Literal["open", "reviewed"] = "open"


class RecommendationGenerateResponse(BaseModel):
    recommendations: list[AIRecommendation]
    source: str
    fallback_used: bool