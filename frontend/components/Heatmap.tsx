"use client";

import { useMemo } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface HeatmapProps {
  densityMap: Record<string, number>;
  onZoneClick?: (zone: string, density: number) => void;
}

export default function Heatmap({ densityMap, onZoneClick }: HeatmapProps) {
  const grid = useMemo(() => {
    const rows = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
    const cols = Array.from({ length: 10 }, (_, i) => i + 1);
    return rows.flatMap((r) => cols.map((c) => `${r}${c}`));
  }, []);

  const getCellColor = (density: number) => {
    if (density < 50) return "bg-emerald-500/20 border-emerald-500/30 text-emerald-400";
    if (density < 75) return "bg-amber-500/30 border-amber-500/40 text-amber-300";
    return "bg-red-500/40 border-red-500/50 text-red-300";
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold tracking-tight">Crowd Density Map</h2>
        <div className="flex gap-4 text-[10px] font-bold uppercase tracking-widest text-white/40">
          <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-sm bg-emerald-500/40" /> Low</div>
          <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-sm bg-amber-500/40" /> Mid</div>
          <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-sm bg-red-500/40" /> High</div>
        </div>
      </div>

      <div className="grid grid-cols-10 gap-1.5 bg-black p-2 rounded-xl border border-white/5 shadow-inner">
        {grid.map((zone) => {
          const density = densityMap[zone] || 0;
          return (
            <button
              key={zone}
              onClick={() => onZoneClick?.(zone, density)}
              className={cn(
                "aspect-square rounded-sm border heatmap-cell flex items-center justify-center text-[8px] font-medium transition-all group",
                getCellColor(density)
              )}
              title={`${zone}: ${density}% density`}
            >
              <span className="opacity-0 group-hover:opacity-100 transition-opacity">{zone}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
