import React from "react";
import { motion } from "framer-motion";
import Img from "./common/Img";

export default function SelectSlime({ slimes, selection, onSelect, onBack, onStart }) {
  return (
    <motion.div key="select" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
      <h2 className="text-2xl font-bold mb-4">Elige tu Slime</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {slimes.map((s) => (
          <button
            key={s.id}
            onClick={() => onSelect(s.id)}
            className={`group rounded-2xl p-3 border bg-white/70 dark:bg-zinc-900/60 hover:shadow-xl transition ${selection === s.id ? "ring-2 ring-emerald-500" : ""}`}
          >
            <Img src={s.sprite} alt={s.name} className="w-full aspect-square object-contain drop-shadow" />
            <div className="mt-2 text-left">
              <div className="font-semibold leading-tight">{s.name}</div>
              <div className="text-xs opacity-70">{s.types.join("/")}</div>
            </div>
          </button>
        ))}
      </div>
      <div className="flex gap-3 mt-6">
        <button className="px-5 py-2 rounded-xl bg-zinc-200 dark:bg-zinc-700" onClick={onBack}>Atrás</button>
        <button className="px-5 py-2 rounded-xl bg-emerald-600 text-white" onClick={onStart} disabled={!selection}>¡A combatir!</button>
      </div>
    </motion.div>
  );
}
