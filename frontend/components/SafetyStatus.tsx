"use client";

import { Shield, AlertTriangle, CheckCircle } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface SafetyStatusProps {
  status: "green" | "amber" | "red";
}

export default function SafetyStatus({ status }: SafetyStatusProps) {
  const config = {
    green: {
      color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
      icon: <CheckCircle className="w-4 h-4" />,
      label: "System Safe",
    },
    amber: {
      color: "bg-amber-500/10 text-amber-500 border-amber-500/20",
      icon: <AlertTriangle className="w-4 h-4" />,
      label: "Heightened Alert",
    },
    red: {
      color: "bg-red-500/10 text-red-500 border-red-500/20",
      icon: <Shield className="w-4 h-4" />,
      label: "Critical Condition",
    },
  };

  const active = config[status] || config.amber;

  return (
    <div className="sticky top-0 z-50 w-full bg-black/80 backdrop-blur-md border-b border-white/5 py-3 px-6 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)] animate-pulse" />
        <span className="text-sm font-medium tracking-tight text-white/90">VenueIQ Live Intelligence</span>
      </div>
      <div className={cn(
        "flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-semibold uppercase tracking-wider",
        active.color
      )}>
        {active.icon}
        {active.label}
      </div>
    </div>
  );
}
