"use client";

import { useState, useEffect, useCallback } from "react";
import { Info, WifiOff, Loader2 } from "lucide-react";
import Heatmap from "@/components/Heatmap";
import SafetyStatus from "@/components/SafetyStatus";
import RoutingPanel from "@/components/RoutingPanel";
import StaffPanel from "@/components/StaffPanel";
import NudgesPanel from "@/components/NudgesPanel";
import BottleneckCard from "@/components/BottleneckCard";
import RationaleSection from "@/components/RationaleSection";

interface RoutingMessage {
  zone: string;
  display: string;
  urgency: "info" | "warn" | "critical";
}

interface StaffAction {
  staff_id: string;
  action: string;
  location: string;
  eta_min: number;
}

interface FanNudge {
  segment: string;
  push_message: string;
  offer_code: string | null;
}

interface PredictedBottleneck {
  zone: string;
  eta_minutes: number;
  confidence: number;
  trend: "increasing" | "stable" | "decreasing";
  cascade_risk: "low" | "medium" | "high";
  recommended_action: string;
}

interface InferenceResponse {
  routing_messages: RoutingMessage[];
  staff_dispatch: StaffAction[];
  fan_nudges: FanNudge[];
  predicted_bottleneck: PredictedBottleneck;
  decision_rationale: string[];
  safety_status: "green" | "amber" | "red";
  summary: string;
}

const generateMockContext = () => {
  const zones = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"].flatMap(r =>
    Array.from({ length: 10 }, (_, i) => `${r}${i + 1}`)
  );

  const crowd_density_map: Record<string, number> = {};
  const density_trend: Record<string, string> = {};

  zones.forEach(z => {
    const isHot = z.startsWith("A") || z.startsWith("B") || z.endsWith("1") || z.endsWith("2");
    crowd_density_map[z] = isHot
      ? Math.floor(Math.random() * 40) + 55
      : Math.floor(Math.random() * 40) + 10;
    density_trend[z] = Math.random() > 0.7 ? "increasing" : "stable";
  });

  return {
    crowd_density_map,
    density_trend,
    queue_lengths: {
      concessions: [9, 14, 22, 11],
      restrooms: [2, 5, 8, 3],
      gates: [40, 45, 12, 18],
    },
    event_phase: "halftime",
    fan_segments: {
      vip: { A1: 20 },
      general: { B2: 400 },
      family: { C3: 150 },
      accessibility: { D4: 30 },
    },
    weather: { temp_c: 22.5, rain_probability: 0.1, wind_kph: 12.0 },
  };
};

export default function DashboardPage() {
  const [data, setData] = useState<InferenceResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchUpdate = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:8000/api/v2/inference/tick", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(generateMockContext()),
      });

      if (!response.ok) throw new Error("API Failure");

      const result = await response.json();
      setData(result);
      setError(false);
      setLastUpdated(new Date());
    } catch (err) {
      console.error("Polling error:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUpdate();
    const interval = setInterval(fetchUpdate, 5000);
    return () => clearInterval(interval);
  }, [fetchUpdate]);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4 bg-black text-white">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        <div className="flex flex-col items-center gap-1">
          <h2 className="text-xl font-bold tracking-tighter italic uppercase">VenueIQ</h2>
          <p className="text-sm text-white/40 animate-pulse">Initializing Antigravity Engine...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-black overflow-x-hidden">
      <SafetyStatus status={data?.safety_status || "amber"} />

      <main className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-[1600px] mx-auto w-full">
        <div className="lg:col-span-3 flex flex-col gap-6 order-2 lg:order-1">
          <RoutingPanel messages={data?.routing_messages || []} />
          <NudgesPanel nudges={data?.fan_nudges || []} />
          <div className="mt-auto dashboard-card border-none bg-blue-500/5 p-4 flex flex-col gap-3">
            <h4 className="text-[10px] uppercase font-black tracking-widest text-blue-400">System Information</h4>
            <div className="flex items-center justify-between text-[11px] font-medium text-blue-400/60">
              <span>LAST TICK</span>
              <span>{lastUpdated?.toLocaleTimeString()}</span>
            </div>
            <div className="flex items-center justify-between text-[11px] font-medium text-blue-400/60">
              <span>POLLING INTERVAL</span>
              <span>5.0s</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-6 flex flex-col gap-6 order-1 lg:order-2">
          <div className="dashboard-card bg-transparent border-none p-0">
            <Heatmap
              densityMap={
                data?.predicted_bottleneck
                  ? { [data.predicted_bottleneck.zone]: 85, ...generateMockContext().crowd_density_map }
                  : generateMockContext().crowd_density_map
              }
              onZoneClick={(z, d) => console.log(`Zone ${z} selected: ${d}% density`)}
            />
          </div>
          <div className="dashboard-card">
            <RationaleSection rationale={data?.decision_rationale || []} />
          </div>
        </div>

        <div className="lg:col-span-3 flex flex-col gap-6 order-3">
          <BottleneckCard data={data?.predicted_bottleneck || null} />
          <StaffPanel actions={data?.staff_dispatch || []} />
          {error && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex flex-col gap-2 animate-bounce">
              <div className="flex items-center gap-2 text-red-500 font-bold text-xs uppercase italic">
                <WifiOff className="w-4 h-4" />
                Connection Interrupted
              </div>
              <p className="text-[10px] text-red-500/60 leading-tight">
                Lost contact with VenueIQ edge nodes. Attempting reconnection...
              </p>
            </div>
          )}
        </div>
      </main>

      <footer className="mt-auto border-t border-white/5 p-4 flex items-center justify-center gap-6">
        <div className="flex items-center gap-2 text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">
          <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
          Distributed Edge Inference
        </div>
        <div className="flex items-center gap-2 text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">
          <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
          Antigravity Engine
        </div>
      </footer>
    </div>
  );
}
