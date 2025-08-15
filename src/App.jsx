import React, { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import Menu from "./components/Menu";
import SelectSlime from "./components/SelectSlime";
import BattleView from "./components/BattleView";
import OnlineLobby from "./components/OnlineLobby";
import { ASSETS, PLACEHOLDER_BG } from "./game/assets";
import { SLIMES, MOVES, TYPE_CHART } from "./game/data";
import { mv, calcDamage, typeMultiplier, applyEffect, endTurnPoisonTick } from "./game/logic";

const TYPES = Object.keys(TYPE_CHART);
const pick = (id) => SLIMES.find((s) => s.id === id);

function assert(name, cond) {
  if (!cond) throw new Error(name);
}

function runSelfTests() {
  try {
    console.group("[SlimeTactics] Self Tests");

    assert("Water should be strong vs Fire", typeMultiplier("water", ["fire"]) > 1);
    assert("Fire should be weak vs Water", typeMultiplier("fire", ["water"]) < 1);
    assert("Dark vs Light should be strong", typeMultiplier("dark", ["light"]) > 1);
    assert("Plant should be weak vs Fire", typeMultiplier("plant", ["fire"]) < 1);

    const A = { slime: SLIMES[0], hp: SLIMES[0].stats.hp };
    const D = { slime: SLIMES[1], hp: SLIMES[1].stats.hp };
    const dmg = calcDamage(A, D, mv("golpe"));
    assert("Damage must be > 0", dmg > 0);

    const weakAttacker = { slime: { ...A.slime, stats: { ...A.slime.stats, atk: 10 } }, hp: 10 };
    const strongAttacker = { slime: { ...A.slime, stats: { ...A.slime.stats, atk: 100 } }, hp: 10 };
    const defHigh = { slime: { ...D.slime, stats: { ...D.slime.stats, def: 200 } }, hp: 10 };
    const defLow = { slime: { ...D.slime, stats: { ...D.slime.stats, def: 10 } }, hp: 10 };
    assert("Higher ATK should do more dmg (probabilistic)", calcDamage(strongAttacker, D, mv("golpe")) >= calcDamage(weakAttacker, D, mv("golpe")));
    assert("Higher DEF should reduce dmg (probabilistic)", calcDamage(A, defHigh, mv("golpe")) <= calcDamage(A, defLow, mv("golpe")));

  const imgs = [ASSETS.logo, ...ASSETS.bgs.map((b) => b.src), ...Object.values(ASSETS.slimes)];
    imgs.forEach((src) => {
      const im = new Image();
      im.onload = () => console.debug("asset ok:", src);
      im.onerror = () => console.warn("asset missing or blocked:", src);
      im.src = src;
    });

    console.log("All tests passed ✅ (si ves warnings, son assets faltantes)");
  } catch (e) {
    console.error("Self test failed ❌:", e.message);
  } finally {
    console.groupEnd();
  }
}

export default function App() {
  const [screen, setScreen] = useState("menu"); 
  const [selection, setSelection] = useState("normal");
  const [battle, setBattle] = useState(null);
  const [mode, setMode] = useState('local'); // 'local' | 'online'

  useEffect(() => {
    runSelfTests();
  }, []);

  const startBattle = () => {
    const s = pick(selection || "normal");
    const player = { slime: s, hp: s.stats.hp, status: null };
    const enemyPool = SLIMES.filter((x) => x.id !== s.id);
    const enemySlime = enemyPool[Math.floor(Math.random() * enemyPool.length)];
    const enemy = { slime: enemySlime, hp: enemySlime.stats.hp, status: null };
  const bg = (ASSETS.bgs[Math.floor(Math.random() * ASSETS.bgs.length)] || {}).src || PLACEHOLDER_BG;

    setBattle({ player, enemy, turn: s.stats.spd >= enemySlime.stats.spd ? "player" : "enemy", bg, log: ["¡Comienza el combate!"], winner: null });
    setScreen("battle");
  };

  const [onlineCtx, setOnlineCtx] = useState({ roomId: null, name: null, youId: null, players: null });
  const onStartOnlineBattle = ({ roomId, name, payload }) => {
    // Construir batalla online real con los slimes seleccionados
    setMode('online');
    const you = payload.players.find(p => p.id === payload.youId);
    const other = payload.players.find(p => p.id !== payload.youId);
    const yourSlime = pick(you.slimeId) || pick('normal');
    const otherSlime = pick(other.slimeId) || pick('normal');
    const player = { slime: yourSlime, hp: yourSlime.stats.hp, status: null };
    const enemy = { slime: otherSlime, hp: otherSlime.stats.hp, status: null };
    const bg = (ASSETS.bgs[Math.floor(Math.random() * ASSETS.bgs.length)] || {}).src || PLACEHOLDER_BG;
    const initialTurn = payload.turn === payload.youId ? 'player' : 'enemy';
    setBattle({ player, enemy, turn: initialTurn, bg, log: ["¡Comienza el combate online!"], winner: null, _ids: { player: you.id, enemy: other.id } });
    setOnlineCtx({ roomId, name, youId: payload.youId, players: payload.players });
    setScreen('battle');
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-sky-100 to-emerald-100 dark:from-zinc-900 dark:to-zinc-800 text-zinc-900 dark:text-zinc-100">
      <div className="max-w-6xl mx-auto p-4 md:p-8">
        <AnimatePresence mode="wait">
          {screen === "menu" && <Menu key="menu-screen" assets={ASSETS} onStart={() => { setMode('local'); setScreen("select"); }} onStartOnline={() => { setMode('online'); setScreen('online'); }} />}
          {screen === 'online' && (
            <OnlineLobby key="online-screen" onStartBattle={onStartOnlineBattle} />
          )}
          {screen === "select" && (
            <SelectSlime key="select-screen"
              slimes={SLIMES}
              selection={selection}
              onSelect={setSelection}
              onBack={() => setScreen("menu")}
              onStart={startBattle}
            />
          )}
          {screen === "battle" && battle && (
            <BattleView
              key="battle-screen"
              state={battle}
              onExit={() => setScreen(mode === 'online' ? 'online' : 'menu')}
              onUpdate={setBattle}
              mv={(id) => MOVES.find((m) => m.id === id)}
              calcDamage={calcDamage}
              typeMultiplier={typeMultiplier}
              applyEffect={applyEffect}
              endTurnPoisonTick={endTurnPoisonTick}
              mode={mode}
              roomId={onlineCtx.roomId}
              playerName={onlineCtx.name}
              youId={onlineCtx.youId}
              players={onlineCtx.players}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
 
