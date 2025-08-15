import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Img from "./common/Img";
import Panel from "./common/Panel";
import HudBar from "./HudBar";
import { onChatMessage, sendChat, onBattleEnded, endBattle, onBattleUpdate, sendMove } from "../online/socket";

export default function BattleView({ state, onExit, onUpdate, mv, calcDamage, typeMultiplier, applyEffect, endTurnPoisonTick, mode = 'local', roomId, playerName, youId, players }) {
  const [lockUI, setLockUI] = useState(false);
  const [chat, setChat] = useState([]);
  const chatBoxRef = React.useRef(null);
  const [chatText, setChatText] = useState("");
  const alertedRef = React.useRef(false);

  const doMove = async (who, moveId) => {
    if (state.winner || lockUI) return;
    if (mode === 'online' && state.turn !== 'player') return; // solo en tu turno
    const me = who === "player" ? state.player : state.enemy;
    const other = who === "player" ? state.enemy : state.player;

    const move = mv(moveId);
    if (!move) return;
    // Precisión
    // Trabajar sobre un borrador para no mutar estado prematuramente en online
    const draft = {
      ...state,
      player: { ...state.player },
      enemy: { ...state.enemy },
      log: [...state.log]
    };
    const dMe = who === 'player' ? draft.player : draft.enemy;
    const dOther = who === 'player' ? draft.enemy : draft.player;

    if (Math.random() * 100 > (move.accuracy || 100)) {
      draft.log.unshift(`${dMe.slime.name} falló ${move.name}.`);
    } else {
      if (move.power > 0) {
        const dmg = calcDamage(dMe, dOther, move);
        dOther.hp = Math.max(0, dOther.hp - dmg);
        const eff = typeMultiplier(move.type, dOther.slime.types);
        const effTxt = eff > 1.4 ? " ¡Es súper eficaz!" : eff < 0.7 ? " No es muy eficaz…" : "";
        draft.log.unshift(`${dMe.slime.name} usa ${move.name} y causa ${dmg} daño.${effTxt}`);
      }
      // Efecto
      applyEffect(draft, move.power === 0 ? dMe : dOther, move.effect);
    }

    // Check KO
    if (dOther.hp <= 0) {
      draft.winner = who;
      draft.log.unshift(`${dOther.slime.name} queda fuera de combate.`);
      if (mode === 'online' && roomId) {
        const myId = state._ids?.player || youId;
        const oppId = state._ids?.enemy || (players?.find(p => p.id !== myId)?.id);
        try {
          sendMove(roomId, moveId, {
            log: draft.log.slice(0, 10),
            hp: { [myId]: draft.player.hp, [oppId]: draft.enemy.hp },
            winner: myId
          });
        } catch {}
        setLockUI(true);
        return;
      }
      onUpdate({ ...draft });
      return;
    }

    // Fin de turno -> veneno
  endTurnPoisonTick(draft, who === "player" ? draft.enemy : draft.player);

    // Cambiar turno
    draft.turn = who === "player" ? "enemy" : "player";

    if (mode === 'online' && who === 'player' && roomId) {
      const myId = state._ids?.player || youId;
      const oppId = state._ids?.enemy || (players?.find(p => p.id !== myId)?.id);
      try {
        sendMove(roomId, moveId, {
          log: draft.log.slice(0, 10),
          hp: { [myId]: draft.player.hp, [oppId]: draft.enemy.hp },
          winner: null
        });
      } catch {}
      setLockUI(true);
      return;
    }

    onUpdate({ ...draft });

    // Online: enviar jugada al servidor y NO usar IA
    if (mode === 'online' && who === 'player' && roomId) {
      try {
        sendMove(roomId, moveId, {
          log: state.log.slice(0, 10),
          hp: { playerHp: state.player.hp, enemyHp: state.enemy.hp },
          winner: state.winner || null
        });
      } catch {}
      setLockUI(true);
      return;
    }

    // Local: si le toca a la IA, actuar
    if (mode !== 'online' && state.turn === "enemy") {
      setLockUI(true);
      await new Promise((r) => setTimeout(r, 650));
      const choice = other.slime.moves[Math.floor(Math.random() * other.slime.moves.length)];
      await doMove("enemy", choice);
      setLockUI(false);
    }
  };

  // Auto turno inicial (solo local); en online esperamos al rival
  useEffect(() => {
    if (mode !== 'online' && state.turn === "enemy" && !state.winner) {
      const choice = state.enemy.slime.moves[Math.floor(Math.random() * state.enemy.slime.moves.length)];
      setTimeout(() => doMove("enemy", choice), 600);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (mode !== 'online') return;
    const handler = (msg) => setChat((c) => [...c, msg]);
    onChatMessage(handler);
  }, [mode]);

  useEffect(() => {
    const el = chatBoxRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [chat]);

  // En online: cuando el servidor avisa fin de batalla, salir al lobby
  useEffect(() => {
    if (mode !== 'online') return;
    const handler = (payload) => {
      if (!alertedRef.current) {
        const myId = state._ids?.player || youId;
        const msg = payload?.winner === myId ? '¡Has ganado!' : 'Has perdido.';
        alertedRef.current = true;
        try { window.alert(msg); } catch {}
      }
      onExit && onExit();
    };
    onBattleEnded(handler);
  }, [mode, onExit]);

  // En online: aplicar actualizaciones del rival (y desbloquear UI si vuelve nuestro turno)
  useEffect(() => {
    if (mode !== 'online') return;
    const handler = (payload) => {
      const myId = state._ids?.player || youId;
      const oppId = state._ids?.enemy || (players?.find(p => p.id !== myId)?.id);
      const nextTurn = payload.turn === myId ? 'player' : 'enemy';
      const next = { ...state, player: { ...state.player }, enemy: { ...state.enemy } };
      if (payload.log) next.log = payload.log;
      if (payload.hp) {
        if (payload.hp[myId] != null) next.player.hp = payload.hp[myId];
        if (payload.hp[oppId] != null) next.enemy.hp = payload.hp[oppId];
      }
      if (payload.winner) next.winner = payload.winner === myId ? 'player' : 'enemy';
      next.turn = nextTurn;
      onUpdate(next);
      setLockUI(next.turn !== 'player');
    };
    onBattleUpdate(handler);
  }, [mode, state, youId, players, onUpdate]);

  // En online: cuando detectamos un ganador, avisar al servidor
  useEffect(() => {
    if (mode === 'online' && state.winner && roomId) {
      endBattle(roomId, state.winner, 'client-finished');
    }
  }, [mode, roomId, state.winner]);

  // Alerta local cuando se detecta ganador en el estado
  useEffect(() => {
    if (!state?.winner || alertedRef.current) return;
    alertedRef.current = true;
    const msg = state.winner === 'player' ? '¡Has ganado!' : 'Has perdido.';
    try { window.alert(msg); } catch {}
  }, [state.winner]);

  return (
    <div className="relative">
      <div className="relative rounded-3xl overflow-hidden shadow-2xl border">
        <Img src={state.bg} alt="bg" className="w-full h-72 md:h-96 object-cover" kind="bg" />
        {/* HUD superior (enemigo) */}
        <div className="absolute top-4 right-4 z-20">
          <HudBar name={state.enemy.slime.name} hp={state.enemy.hp} max={state.enemy.slime.stats.hp} status={state.enemy.status} side="right" />
        </div>
        {/* Enemigo */}
        <motion.div initial={{ x: 120, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="absolute right-8 bottom-10 sm:bottom-14 md:bottom-20 z-10">
          <Img src={state.enemy.slime.sprite} alt={state.enemy.slime.name} className="w-40 md:w-56 max-h-36 sm:max-h-40 md:max-h-56 object-contain drop-shadow-xl" />
        </motion.div>

        {/* HUD inferior (jugador) */}
  <div className="absolute left-4 bottom-48 sm:bottom-56 md:bottom-64 z-20">
          <HudBar name={state.player.slime.name} hp={state.player.hp} max={state.player.slime.stats.hp} status={state.player.status} side="left" />
        </div>
        {/* Jugador */}
        <motion.div initial={{ x: -120, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="absolute left-8 bottom-10 sm:bottom-14 md:bottom-20 z-10">
          <Img src={state.player.slime.sprite} alt={state.player.slime.name} className="w-40 md:w-56 max-h-36 sm:max-h-40 md:max-h-56 object-contain drop-shadow-xl" />
        </motion.div>
      </div>

  {/* Panel inferior: log + acciones (+ chat en online) */}
  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 items-stretch">
        <Panel title={state.winner ? (state.winner === "player" ? "¡Victoria!" : "Derrota") : "Registro"}>
          <ul className="text-sm space-y-1 min-h-[4rem]">
            {state.log.slice(0, 5).map((l, i) => (
              <li key={i} className="opacity-90">• {l}</li>
            ))}
          </ul>
          <div className="mt-3 flex gap-2">
            <button className="px-4 py-2 rounded-xl bg-zinc-200 dark:bg-zinc-700" onClick={onExit}>Salir</button>
            <button className="px-4 py-2 rounded-xl bg-emerald-600 text-white" onClick={() => window.location.reload()}>Reiniciar</button>
          </div>
        </Panel>

        <Panel title="Acciones">
          {state.winner ? (
            <div className="opacity-80">El combate ha terminado.</div>
          ) : state.turn !== "player" ? (
            <div className="opacity-80">Esperando al rival…</div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {state.player.slime.moves.map((id) => (
                <button key={id} disabled={lockUI} onClick={() => doMove("player", id)} className="px-3 py-2 rounded-xl border bg-white/70 dark:bg-zinc-900/60 hover:shadow disabled:opacity-60">
                  <div className="font-semibold leading-tight">{mv(id).name}</div>
                  <div className="text-xs opacity-70">{mv(id).type} · Pot {mv(id).power}</div>
                </button>
              ))}
            </div>
          )}
        </Panel>

        {mode === 'online' && (
          <Panel title="Chat de la partida">
            <div ref={chatBoxRef} className="h-40 overflow-y-auto rounded-xl border p-2 bg-white/70 dark:bg-zinc-900/60 text-black dark:text-white">
              {chat.map((m, i) => (
                <div key={i} className="text-sm text-black dark:text-white"><span className="font-semibold">{m.name}:</span> {m.text}</div>
              ))}
            </div>
            <div className="mt-2 flex gap-2">
              <input className="flex-1 rounded-xl border p-2 text-black placeholder:text-zinc-400 bg-white dark:text-white dark:placeholder:text-zinc-500 dark:bg-zinc-900" value={chatText} onChange={(e) => setChatText(e.target.value)} placeholder="Escribe un mensaje" />
              <button className="px-4 py-2 rounded-xl bg-emerald-600 text-white" onClick={() => { if (chatText.trim()) { sendChat(roomId, playerName || 'Tú', chatText.trim()); setChatText(''); } }}>Enviar</button>
            </div>
          </Panel>
        )}
      </div>
    </div>
  );
}
