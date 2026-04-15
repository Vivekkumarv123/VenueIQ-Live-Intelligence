"use client";

import { Users, MapPin, Clock } from "lucide-react";

interface StaffAction {
  staff_id: string;
  action: string;
  location: string;
  eta_min: number;
}

interface StaffPanelProps {
  actions: StaffAction[];
}

export default function StaffPanel({ actions }: StaffPanelProps) {
  return (
    <div className="dashboard-card flex flex-col gap-4 animate-fade-in">
      <div className="flex items-center gap-2 text-white/60">
        <Users className="w-4 h-4" />
        <h3 className="text-xs font-bold uppercase tracking-widest">Active Staff Dispatches</h3>
      </div>
      <div className="overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="text-[10px] font-bold uppercase text-white/30 border-b border-white/5">
            <tr>
              <th className="pb-2 font-black">ID</th>
              <th className="pb-2">Action</th>
              <th className="pb-2">Location</th>
              <th className="pb-2 text-right">ETA</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {actions.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-8 text-center text-white/20 italic">
                  No active dispatches.
                </td>
              </tr>
            ) : (
              actions.map((staff, i) => (
                <tr key={i} className="group hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 font-mono text-xs text-blue-400">{staff.staff_id}</td>
                  <td className="py-3 font-medium text-white/90">{staff.action}</td>
                  <td className="py-3">
                    <div className="flex items-center gap-1.5 text-white/50">
                      <MapPin className="w-3 h-3" />
                      {staff.location}
                    </div>
                  </td>
                  <td className="py-3 text-right">
                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-white/5 text-xs font-bold text-white/70">
                      <Clock className="w-3 h-3" />
                      {staff.eta_min}m
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
