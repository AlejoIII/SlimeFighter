import React, { useEffect, useRef, useState } from "react";
import Panel from "./common/Panel";
import { connect, createRoom, joinRoom, selectSlime, playerReady, leaveRoom } from "../online/socket";
import { SLIMES } from "../game/data";
import Img from "./common/Img";

export default function OnlineLobby({ serverUrl, onStartBattle }) {
  const [roomId, setRoomId] = useState("");
  const [name, setName] = useState("");
  const [connected, setConnected] = useState(false);
  const [roomState, setRoomState] = useState(null);
  const [selected, setSelected] = useState(null);
  const [rooms, setRooms] = useState([]);
  const inRoom = !!roomState; // recibes room:state solo si estás dentro

  const roomIdRef = useRef("");
  const nameRef = useRef("");
  useEffect(() => { roomIdRef.current = roomId; }, [roomId]);
  useEffect(() => { nameRef.current = name; }, [name]);

  useEffect(() => {
    const s = connect(serverUrl);
    s.on("connect", () => setConnected(true));

    const handleRoomState = (st) => setRoomState(st);
  const handleBattleStart = (payload) => onStartBattle({ roomId: roomIdRef.current, name: nameRef.current, payload });
    const handleRoomList = (list) => setRooms(list);

    s.off && s.off("room:state", handleRoomState);
    s.on("room:state", handleRoomState);
    s.off && s.off("battle:start", handleBattleStart);
    s.on("battle:start", handleBattleStart);
    s.off && s.off("room:list", handleRoomList);
    s.on("room:list", handleRoomList);

    s.emit("room:list");

    return () => {
      s.off && s.off("room:state", handleRoomState);
      s.off && s.off("battle:start", handleBattleStart);
      s.off && s.off("room:list", handleRoomList);
    };
  }, [serverUrl, onStartBattle]);

  const handleCreate = () => {
    if (!roomId || !name) return;
    createRoom(roomId, name);
  };
  const handleJoin = () => {
    if (!roomId || !name) return;
    joinRoom(roomId, name);
  };

  const handleSelect = (id) => {
    setSelected(id);
    if (roomId) selectSlime(roomId, id);
  };

  const handleReady = () => {
    if (roomId) playerReady(roomId);
  };

  // Chat se mueve a la partida (BattleView) según requerimiento

  return (
    <div className="space-y-4">
      <Panel title="Jugar Online">
        <div className="grid gap-3 sm:grid-cols-3 items-end">
          <div>
            <label className="text-sm">Room ID</label>
            <input className="w-full rounded-xl border p-2 text-black placeholder:text-zinc-400 bg-white dark:text-white dark:placeholder:text-zinc-500 dark:bg-zinc-900" value={roomId} onChange={(e) => setRoomId(e.target.value)} placeholder="p.ej. sala-123" />
          </div>
          <div>
            <label className="text-sm">Tu nombre</label>
            <input className="w-full rounded-xl border p-2 text-black placeholder:text-zinc-400 bg-white dark:text-white dark:placeholder:text-zinc-500 dark:bg-zinc-900" value={name} onChange={(e) => setName(e.target.value)} placeholder="p.ej. Alex" />
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 rounded-xl bg-emerald-600 text-white" onClick={handleCreate}>Crear</button>
            <button className="px-4 py-2 rounded-xl bg-sky-600 text-white" onClick={handleJoin}>Unirse</button>
          </div>
        </div>
        {connected ? (
          <div className="text-xs opacity-70 mt-2">Conectado al servidor</div>
        ) : (
          <div className="text-xs opacity-70 mt-2">Conectando…</div>
        )}
      </Panel>

      {!inRoom && (
        <Panel title="Salas disponibles">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {rooms.map((r, idx) => (
              <button key={r.roomId || `room-${idx}`} className="p-3 rounded-xl border bg-white/70 dark:bg-zinc-900/60 text-left" onClick={() => { setRoomId(r.roomId); if (name) joinRoom(r.roomId, name); }}>
                <div className="font-semibold">{r.roomId}</div>
                <div className="text-xs opacity-70">Jugadores: {r.players}/2</div>
              </button>
            ))}
            {rooms.length === 0 && <div className="text-sm opacity-70">No hay salas todavía.</div>}
          </div>
        </Panel>
      )}

      {/* El chat se mostrará en la partida (no en la lista de salas) */}

      {inRoom && (
      <Panel title="Selecciona tu Slime">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {SLIMES.map((s) => (
            <button key={s.id} onClick={() => handleSelect(s.id)} className={`rounded-2xl p-3 border bg-white/70 dark:bg-zinc-900/60 ${selected === s.id ? 'ring-2 ring-emerald-500' : ''}`}>
              <Img src={s.sprite} alt={s.name} className="w-full aspect-square object-contain" />
              <div className="mt-2 text-left">
                <div className="font-semibold leading-tight">{s.name}</div>
                <div className="text-xs opacity-70">{s.types.join("/")}</div>
              </div>
            </button>
          ))}
        </div>
        <div className="mt-3 flex gap-2 items-center">
          <button className="px-4 py-2 rounded-xl bg-emerald-600 text-white" onClick={handleReady} disabled={!selected}>Estoy listo</button>
          <button className="px-4 py-2 rounded-xl bg-zinc-200 dark:bg-zinc-700" onClick={() => { if (roomId) { leaveRoom(roomId); setRoomState(null); } }}>Salir de la sala</button>
          <div className="text-xs opacity-70">Comparte el Room ID "{roomId}" para que otro jugador se una.</div>
        </div>
      </Panel>
      )}

      {inRoom && (
        <Panel title="Estado de la sala">
          <div className="space-y-2">
            {(roomState?.players || []).map((p, idx) => (
              <div key={p.sid || p.id || p.name || `player-${idx}`} className="flex items-center justify-between rounded-xl border p-2 bg-white/60 dark:bg-zinc-900/50">
                <div className="truncate"><span className="font-semibold">{p.name || p.id}</span> {p.slimeId ? `· ${p.slimeId}` : '· Sin seleccionar'}</div>
                <span className={`text-xs px-2 py-1 rounded ${p.ready ? 'bg-emerald-100 text-emerald-700' : 'bg-zinc-200 dark:bg-zinc-700'}`}>{p.ready ? 'Listo' : 'Esperando'}</span>
              </div>
            ))}
            {(!roomState?.players || roomState.players.length < 2) && (
              <div className="text-sm opacity-70">Esperando a que se una el segundo jugador…</div>
            )}
          </div>
        </Panel>
      )}
    </div>
  );
}
