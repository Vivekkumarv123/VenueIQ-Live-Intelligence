from models.schemas import (
    InferenceTickRequest, InferenceTickResponse,
    RoutingMessage, StaffDispatch, FanNudge, PredictedBottleneck
)

class AntigravityDecisionEngine:
    def __init__(self, redis_client=None):
        self.redis = redis_client

    async def evaluate_tick(self, request: InferenceTickRequest) -> InferenceTickResponse:
        safety_status = "green"
        rationale = []
        routing = []
        dispatch = []
        nudges = []

        # Critical density override
        for zone, density in request.crowd_density_map.items():
            if density > 85.0:
                safety_status = "red"
                rationale.append(f"{zone} has critical density ({density}%). Immediate safety diversion.")
                routing.append(RoutingMessage(zone=zone, display="Please leave area immediately", urgency="critical"))
                dispatch.append(StaffDispatch(staff_id="auto-alert", action="Crowd control", location=zone, eta_min=1))

        if safety_status == "red":
            return InferenceTickResponse(
                routing_messages=routing,
                staff_dispatch=dispatch,
                fan_nudges=[],
                predicted_bottleneck=PredictedBottleneck(
                    zone="Multiple", eta_minutes=0, confidence=0.99,
                    trend="increasing", cascade_risk="high",
                    recommended_action="Evacuate"
                ),
                decision_rationale=rationale,
                safety_status=safety_status,
                summary="CRITICAL: Density threshold exceeded. Initiating safety protocols."
            )

        # Halftime surge prediction
        if request.event_phase == "halftime":
            rationale.append("Halftime surge detected. Routing away from main concessions.")
            routing.append(RoutingMessage(
                zone="Stadium_Bowl",
                display="Use South Concessions. 10% off with STAY10",
                urgency="info"
            ))
            nudges.append(FanNudge(
                segment="general",
                push_message="Skip the lines! 10% off at East level.",
                offer_code="STAY10"
            ))

        # Queue wait time check
        if any(q > 12 for q in request.queue_lengths.concessions):
            rationale.append("Concession queues >12 minutes. Diverting traffic.")
            nudges.append(FanNudge(
                segment="general",
                push_message="Concessions are busy. Order ahead for 5% off.",
                offer_code="SKIPQ"
            ))

        if not rationale:
            rationale.append("Optimizing flow before expected surge.")

        return InferenceTickResponse(
            routing_messages=routing,
            staff_dispatch=dispatch,
            fan_nudges=nudges,
            predicted_bottleneck=PredictedBottleneck(
                zone="Concessions_North",
                eta_minutes=8,
                confidence=0.85,
                trend="increasing",
                cascade_risk="medium",
                recommended_action="Dispatch queue managers"
            ),
            decision_rationale=rationale,
            safety_status="green",
            summary="All systems nominal. Flow optimization active."
        )
