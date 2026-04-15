from pydantic import BaseModel, Field
from typing import List, Dict, Optional, Any
from enum import Enum

class TrendEnum(str, Enum):
    increasing = "increasing"
    stable = "stable"
    decreasing = "decreasing"

class EventPhaseEnum(str, Enum):
    pre_game = "pre_game"
    in_play = "in_play"
    halftime = "halftime"
    post_game = "post_game"
    emergency = "emergency"

class WeatherModel(BaseModel):
    temp_c: float
    rain_probability: float
    wind_kph: float

class FanSegmentsModel(BaseModel):
    vip: Dict[str, int]
    general: Dict[str, int]
    family: Dict[str, int]
    accessibility: Dict[str, int]

class QueueLengthsModel(BaseModel):
    concessions: List[int]
    restrooms: List[int]
    gates: List[int]

class InferenceTickRequest(BaseModel):
    crowd_density_map: Dict[str, float]
    density_trend: Dict[str, TrendEnum]
    queue_lengths: QueueLengthsModel
    event_phase: EventPhaseEnum
    fan_segments: FanSegmentsModel
    weather: WeatherModel

class RoutingMessage(BaseModel):
    zone: str
    display: str
    urgency: str

class StaffDispatch(BaseModel):
    staff_id: str
    action: str
    location: str
    eta_min: int

class FanNudge(BaseModel):
    segment: str
    push_message: str
    offer_code: Optional[str] = None

class PredictedBottleneck(BaseModel):
    zone: str
    eta_minutes: int
    confidence: float
    trend: str
    cascade_risk: str
    recommended_action: str

class InferenceTickResponse(BaseModel):
    routing_messages: List[RoutingMessage]
    staff_dispatch: List[StaffDispatch]
    fan_nudges: List[FanNudge]
    predicted_bottleneck: PredictedBottleneck
    decision_rationale: List[str]
    safety_status: str
    summary: str
