"use client";

import { Target, Ticket, Send } from "lucide-react";

interface FanNudge {
  segment: string;
  push_message: string;
  offer_code: string | null;
}

interface NudgesPanelProps {
  nudges: FanNudge[];
}

export default function NudgesPanel({ nudges }: NudgesPanelProps) {
  return (
    <div className="dashboard-card flex flex-col gap-4 animate-fade-in">
      <div className="flex items-center gap-2 text-white/60">
        <Target className="w-4 h-4" />
        <h3 className="text-xs font-bold uppercase tracking-widest">Active Fan Nudges</h3>
      </div>
      <div className="space-y-3">
        {nudges.length === 0 ? (
          <div className="text-sm text-white/20 italic p-4 text-center border border-dashed border-white/5 rounded-lg">
            No behavioral nudges currently active.
          </div>
        ) : (
          nudges.map((nudge, i) => (
            <div key={i} className="p-4 rounded-lg bg-white/[0.03] border border-white/5 flex flex-col gap-3 group hover:bg-white/[0.05] transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black tracking-widest uppercase text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded">
                  {nudge.segment} Segment
                </span>
                <Send className="w-3 h-3 text-white/20 group-hover:text-blue-500/50 transition-colors" />
              </div>
              <p className="text-sm text-white/90 leading-snug">{nudge.push_message}</p>
              {nudge.offer_code && (
                <div className="flex items-center gap-2 px-3 py-2 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  <Ticket className="w-4 h-4" />
                  <span className="text-xs font-mono font-bold tracking-tighter uppercase">{nudge.offer_code}</span>
                  <span className="text-[10px] text-emerald-500/50 font-medium ml-auto">OFFER ATTACHED</span>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
