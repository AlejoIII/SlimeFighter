import React from "react";

export default function HudBar({ name, hp, max, status, side }) {
  const pct = Math.max(0, Math.min(1, hp / max));
  return (
    <div className={`w-60 rounded-2xl p-3 backdrop-blur bg-white/70 dark:bg-zinc-900/70 border shadow-xl ${side === "left" ? "text-left" : "text-right"}`}>
      <div className="text-sm font-semibold truncate">{name}</div>
      <div className="h-3 rounded-full bg-zinc-200 dark:bg-zinc-700 overflow-hidden mt-1">
        <div className="h-full bg-emerald-500" style={{ width: `${pct * 100}%` }}></div>
      </div>
      <div className="text-xs opacity-80 mt-1">HP {hp}/{max} {status === "poison" ? "· ☠️ Veneno" : ""}</div>
    </div>
  );
}
