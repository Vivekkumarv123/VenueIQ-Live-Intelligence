from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import health, inference
import uvicorn

app = FastAPI(title="VenueIQ Antigravity Core v2.1")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router, prefix="/api/v2")
app.include_router(inference.router, prefix="/api/v2")

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
