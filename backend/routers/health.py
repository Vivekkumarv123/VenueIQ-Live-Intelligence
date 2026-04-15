from fastapi import APIRouter
from pydantic import BaseModel

class HealthResponse(BaseModel):
    status: str
    edge_node: str

router = APIRouter()

@router.get("/health", response_model=HealthResponse)
async def check_health():
    return HealthResponse(status="operational", edge_node="antigravity-core-01")
