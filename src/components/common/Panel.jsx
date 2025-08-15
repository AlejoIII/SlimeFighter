import React from "react";

export default function Panel({ title, children }) {
  return (
    <div className="backdrop-blur-sm bg-white/70 dark:bg-zinc-900/70 rounded-2xl shadow-xl p-4 border border-white/40">
      {title && <h3 className="text-lg font-semibold mb-2">{title}</h3>}
      {children}
    </div>
  );
}
