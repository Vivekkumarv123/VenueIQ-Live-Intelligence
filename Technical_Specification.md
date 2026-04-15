# VenueIQ — Technical Specification

## Overview

VenueIQ is a full-stack AI platform for real-time stadium crowd management. It consists of a Python/FastAPI backend that runs an inference decision engine, and a Next.js frontend dashboard that visualizes outputs and polls for updates.

---

## System Architecture

```
Client (Browser)
    │
    │  HTTP POST /api/v2/inference/tick  (every 5s)
    ▼
FastAPI Backend (port 8000)
    │
    ├── routers/health.py       → GET /api/v2/health
    └── routers/inference.py    → POST /api/v2/inference/tick
            │
            ▼
    services/decision_engine.py
    AntigravityDecisionEngine.evaluate_tick()
            │
            ▼
    InferenceTickResponse (JSON)
```

---

## Backend

### Stack
- Python 3.11+
- FastAPI 0.103+
- Pydantic v2
- Uvicorn (ASGI server)

### Endpoints

#### `GET /api/v2/health`
Returns system health status.

```json
{ "status": "operational", "edge_node": "antigravity-core-01" }
```

#### `POST /api/v2/inference/tick`

**Request body:** `InferenceTickRequest`

| Field | Type | Description |
|---|---|---|
| `crowd_density_map` | `Dict[str, float]` | Zone ID → density percentage (0–100) |
| `density_trend` | `Dict[str, TrendEnum]` | Zone ID → trend (increasing/stable/decreasing) |
| `queue_lengths` | `QueueLengthsModel` | Wait times in minutes per facility type |
| `event_phase` | `EventPhaseEnum` | Current phase (pre_game, halftime, etc.) |
| `fan_segments` | `FanSegmentsModel` | Fan counts by segment per zone |
| `weather` | `WeatherModel` | Ambient conditions |

**Response body:** `InferenceTickResponse`

| Field | Type | Description |
|---|---|---|
| `routing_messages` | `List[RoutingMessage]` | Zone-level flow instructions |
| `staff_dispatch` | `List[StaffDispatch]` | Staff assignments with ETA |
| `fan_nudges` | `List[FanNudge]` | Personalized push messages with offer codes |
| `predicted_bottleneck` | `PredictedBottleneck` | Next predicted congestion point |
| `decision_rationale` | `List[str]` | Human-readable reasoning log |
| `safety_status` | `str` | green / amber / red |
| `summary` | `str` | One-line system summary |

### Decision Engine Logic

1. **Critical density override** — Any zone exceeding 85% density triggers `safety_status: red`, immediate routing diversions, and auto staff dispatch.
2. **Halftime surge** — Detects `event_phase == halftime` and pre-emptively routes fans away from main concessions with an offer nudge.
3. **Queue threshold** — Concession queues exceeding 12 minutes trigger a skip-queue nudge with discount code.
4. **Default** — Returns nominal status with a predictive bottleneck forecast for `Concessions_North`.

---

## Frontend

### Stack
- Next.js 15 (App Router)
- React 19 RC
- TypeScript
- Tailwind CSS v3
- lucide-react (icons)
- clsx + tailwind-merge (conditional styling)

### Component Map

| Component | Responsibility |
|---|---|
| `app/page.tsx` | Root dashboard, polling loop, state management |
| `components/SafetyStatus` | Sticky header bar showing current safety level |
| `components/Heatmap` | 10×10 interactive zone grid with density coloring |
| `components/RoutingPanel` | Live flow guidance messages per zone |
| `components/NudgesPanel` | Active fan behavioral nudges with offer codes |
| `components/BottleneckCard` | Predictive intelligence card with cascade risk |
| `components/StaffPanel` | Active staff dispatch table |
| `components/RationaleSection` | Decision rationale log from the AI engine |

### Polling Strategy

The dashboard uses `setInterval` at 5-second intervals to POST a mock crowd context to the backend. On each tick, all panel components re-render with the latest inference response. The mock payload generator (`generateMockContext`) simulates realistic density distributions with hot zones in rows A/B and columns 1/2.

### Layout

Three-column responsive grid (Tailwind `lg:grid-cols-12`):
- Left (3 cols): Routing + Nudges + System info
- Center (6 cols): Heatmap + Rationale
- Right (3 cols): Bottleneck card + Staff dispatch

---

## Data Models

### Zone Grid
Zones are identified as `{Row}{Col}` where Row ∈ {A–J} and Col ∈ {1–10}, giving 100 zones total (A1 through J10).

### Density Thresholds
| Range | Status | Color |
|---|---|---|
| 0–49% | Low | Green |
| 50–74% | Medium | Amber |
| 75–100% | High | Red |
| >85% | Critical | Triggers safety override |

---

## Running Locally

See [README.md](./README.md) for setup instructions.
