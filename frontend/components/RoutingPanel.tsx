"use client";

import { Navigation, Info, AlertOctagon, AlertTriangle } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface RoutingMessage {
  zone: string;
  display: string;
  urgency: "info" | "warn" | "critical";
}

interface RoutingPanelProps {
  messages: RoutingMessage[];
}

export default function RoutingPanel({ messages }: RoutingPanelProps) {
  const getUrgencyStyles = (urgency: string) => {
    switch (urgency) {
      case "critical": return "bg-red-500/10 border-red-500/20 text-red-500";
      case "warn": return "bg-amber-500/10 border-amber-500/20 text-amber-500";
      default: return "bg-blue-500/10 border-blue-500/20 text-blue-500";
    }
  };

  const getUrgencyIcon = (urgency: string) => {
    switch (urgency) {
      case "critical": return <AlertOctagon className="w-4 h-4" />;
      case "warn": return <AlertTriangle className="w-4 h-4" />;
      default: return <Info className="w-4 h-4" />;
    }
  };

  return (
    <div className="dashboard-card flex flex-col gap-4 animate-fade-in">
      <div className="flex items-center gap-2 text-white/60">
        <Navigation className="w-4 h-4" />
        <h3 className="text-xs font-bold uppercase tracking-widest">Live Flow Guidance</h3>
      </div>
      <div className="space-y-3">
        {messages.length === 0 ? (
          <div className="text-sm text-white/20 italic p-4 text-center border border-dashed border-white/5 rounded-lg">
            No active routing modifications.
          </div>
        ) : (
          messages.map((msg, i) => (
            <div key={i} className={cn("p-3 rounded-lg border flex items-start gap-3 transition-all", getUrgencyStyles(msg.urgency))}>
              <div className="mt-0.5">{getUrgencyIcon(msg.urgency)}</div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-black bg-white/10 px-1.5 py-0.5 rounded">ZONE {msg.zone}</span>
                <p className="text-sm font-medium leading-tight">{msg.display}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
