# VenueIQ — AI-Powered Stadium Intelligence System

> Real-time crowd intelligence for large-scale sporting venues.

---

## Problem Statement

Large sporting venues host tens of thousands of fans simultaneously, creating unpredictable crowd surges, long queues, and safety risks — especially during high-pressure moments like halftime or post-game exits. Traditional venue management relies on reactive, manual coordination that is too slow to prevent bottlenecks before they form.

---

## Solution

VenueIQ is an AI-driven stadium intelligence platform that monitors crowd density in real time, predicts bottlenecks before they occur, and automatically dispatches staff and fan guidance to keep people moving safely and efficiently.

The system ingests live crowd density data across a 10×10 zone grid, runs it through a decision engine, and surfaces actionable routing instructions, staff dispatch orders, and personalized fan nudges — all updated every 5 seconds.

---

## Key Features

- **Real-time crowd heatmap** — Visual 10×10 zone grid showing live density levels (low / mid / high) with color-coded alerts
- **AI-based routing guidance** — Dynamic flow instructions pushed per zone to redirect fans away from congestion
- **Predictive bottleneck detection** — Cascade risk scoring with ETA and confidence level for upcoming surges
- **Staff dispatch system** — Automated staff assignments with location and ETA tracking
- **Fan experience optimization** — Personalized push nudges with offer codes to incentivize behavioral change (e.g. skip queues, use alternate concessions)

---

## Architecture

```
venueiq/
├── backend/        # FastAPI (Python) — inference API + decision engine
└── frontend/       # Next.js + Tailwind — live dashboard UI
```

| Layer       | Technology                          |
|-------------|-------------------------------------|
| Frontend    | Next.js 15, Tailwind CSS, TypeScript |
| Backend     | FastAPI, Python, Pydantic v2        |
| AI Engine   | Antigravity prompt-based decision system |
| Data Layer  | Mock simulation + local state       |

The frontend polls the backend `/api/v2/inference/tick` endpoint every 5 seconds with a simulated crowd context payload. The backend decision engine evaluates density thresholds, event phase, queue lengths, and fan segments to produce routing, dispatch, and nudge outputs.

---

## Screenshots

| Crowd Heatmap UI & Predictive Intelligence Panel |
|------|
<img width="1911" height="919" alt="image" src="https://github.com/user-attachments/assets/a0628f6e-2add-4268-aad8-03fc8d793504" />

---

## How to Run

### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

API will be available at `http://localhost:8000`
Interactive docs at `http://localhost:8000/docs`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Dashboard will be available at `http://localhost:3000`

> Make sure the backend is running before starting the frontend.

---

## Future Improvements

- **WebSocket streaming** — Replace polling with real-time push for sub-second latency
- **Mobile app** — Attendee-facing app for personal navigation and wait-time estimates
- **IoT sensor integration** — Connect physical footfall sensors and turnstile data for ground-truth density readings
- **Historical analytics** — Post-event crowd flow replay and heatmap analysis
- **Multi-venue support** — Extend the platform to manage multiple stadiums from a single dashboard
