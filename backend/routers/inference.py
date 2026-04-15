from fastapi import APIRouter, Depends
from models.schemas import InferenceTickRequest, InferenceTickResponse
from services.decision_engine import AntigravityDecisionEngine

router = APIRouter()

def get_engine():
    return AntigravityDecisionEngine()

@router.post("/inference/tick", response_model=InferenceTickResponse)
async def process_tick(
    request: InferenceTickRequest,
    engine: AntigravityDecisionEngine = Depends(get_engine)
):
    return await engine.evaluate_tick(request)
