"use client";

import { Brain, CornerDownRight } from "lucide-react";

interface RationaleSectionProps {
  rationale: string[];
}

export default function RationaleSection({ rationale }: RationaleSectionProps) {
  return (
    <div className="flex flex-col gap-4 animate-fade-in">
      <div className="flex items-center gap-2 text-white/60">
        <Brain className="w-4 h-4" />
        <h3 className="text-xs font-bold uppercase tracking-widest">Decision Rationale Engine</h3>
      </div>
      <div className="space-y-2">
        {rationale.length === 0 ? (
          <div className="text-sm text-white/20 italic">
            Waiting for next inference tick rationale...
          </div>
        ) : (
          rationale.map((line, i) => (
            <div key={i} className="flex gap-2 group">
              <CornerDownRight className="w-3 h-3 text-blue-500/50 mt-1 flex-shrink-0 group-hover:text-blue-500 transition-colors" />
              <p className="text-sm text-white/50 group-hover:text-white/80 transition-colors tracking-tight font-medium">
                {line}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
