import React from "react";
import { motion } from "framer-motion";
import Img from "./common/Img";
import Panel from "./common/Panel";

export default function Menu({ assets, onStart, onStartOnline }) {
  return (
    <motion.div key="menu" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="grid md:grid-cols-2 gap-6 items-center">
      <Img alt="logo" src={assets.logo} className="w-72 md:w-96 drop-shadow-2xl mx-auto" />
      <Panel>
        <h1 className="text-3xl md:text-4xl font-extrabold">SlimeFighters</h1>
        <p className="opacity-80 mt-2">Combate por turnos al estilo Pokemon, pero con slimes.</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <button className="px-5 py-2 rounded-xl bg-emerald-600 text-white shadow hover:scale-[1.02] transition" onClick={onStart}>
            Jugar
          </button>
          <button className="px-5 py-2 rounded-xl bg-indigo-600 text-white shadow hover:scale-[1.02] transition" onClick={onStartOnline}>
            Jugar Online
          </button>
          <button className="px-5 py-2 rounded-xl bg-white/70 dark:bg-zinc-800 border" onClick={() => alert("Próximamente: Opciones")}>Opciones</button>
        </div>
      </Panel>
    </motion.div>
  );
}
