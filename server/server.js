import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express();
app.use(cors());
// Health endpoints
app.get('/', (req, res) => res.send('SlimeFighter server OK'));
app.get('/healthz', (req, res) => res.json({ ok: true }));

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: '*'}
});

// Simple in-memory rooms
// rooms[roomId] = { players: [{id, name, slimeId, ready}], turn: 'p1'|'p2', battle: {...} }
const rooms = new Map();

function getOrCreateRoom(roomId) {
  if (!rooms.has(roomId)) {
    rooms.set(roomId, { players: [], turn: 'p1', battle: null, createdAt: Date.now() });
  }
  return rooms.get(roomId);
}

function roomSummary() {
  const list = [];
  for (const [id, r] of rooms.entries()) {
    list.push({ roomId: id, players: r.players.length, createdAt: r.createdAt });
  }
  return list;
}

function emitRoomState(roomId) {
  const room = rooms.get(roomId);
  if (!room) return;
  io.to(roomId).emit('room:state', {
    players: room.players.map(p => ({ id: p.id, sid: p.sid, name: p.name, slimeId: p.slimeId || null, ready: !!p.ready })),
    turn: room.turn,
    battle: room.battle ? { ...room.battle, log: room.battle.log?.slice(0, 10) } : null
  });
}

io.on('connection', (socket) => {
  // Send current rooms to the newly connected client
  socket.emit('room:list', roomSummary());

  socket.on('room:list', () => {
    socket.emit('room:list', roomSummary());
  });

  socket.on('room:create', ({ roomId, name }) => {
    const room = getOrCreateRoom(roomId);
    if (room.players.length >= 2) return socket.emit('error', { code: 'ROOM_FULL', message: 'Sala llena' });
    socket.join(roomId);
    const p = { sid: socket.id, id: `p${room.players.length + 1}`, name, ready: false, slimeId: null, hp: null, status: null };
    room.players.push(p);
    emitRoomState(roomId);
    io.emit('room:list', roomSummary());
  });

  socket.on('room:join', ({ roomId, name }) => {
    const room = getOrCreateRoom(roomId);
    if (room.players.length >= 2) return socket.emit('error', { code: 'ROOM_FULL', message: 'Sala llena' });
    socket.join(roomId);
    const p = { sid: socket.id, id: `p${room.players.length + 1}`, name, ready: false, slimeId: null, hp: null, status: null };
    room.players.push(p);
    emitRoomState(roomId);
  io.emit('room:list', roomSummary());
  });

  socket.on('pick:select', ({ roomId, slimeId }) => {
    const room = rooms.get(roomId);
    if (!room) return;
    const p = room.players.find(x => x.sid === socket.id);
    if (!p) return;
    p.slimeId = slimeId;
    emitRoomState(roomId);
  });

  socket.on('player:ready', ({ roomId }) => {
    const room = rooms.get(roomId);
    if (!room) return;
    const p = room.players.find(x => x.sid === socket.id);
    if (!p) return;
    p.ready = true;
    // If both ready and both selected, start battle state
    if (room.players.length === 2 && room.players.every(x => x.ready && x.slimeId)) {
      // Build minimal battle snapshot; detailed logic runs on client in MVP
      const [p1, p2] = room.players;
      room.turn = 'p1';
      room.battle = { player: { id: p1.id, hp: null }, enemy: { id: p2.id, hp: null }, log: ['¡Comienza el combate online!'] };
      // Emit start to each player with personalized youId
      room.players.forEach(pl => {
        io.to(pl.sid).emit('battle:start', {
          players: room.players.map(({ id, name, slimeId, sid }) => ({ id, name, slimeId, sid })),
          turn: room.turn,
          youId: pl.id,
          roomId
        });
      });
    }
    emitRoomState(roomId);
  });

  socket.on('turn:move', ({ roomId, moveId, statePatch }) => {
    const room = rooms.get(roomId);
    if (!room || !room.battle) return;
    // Authoritative turn switch on server
    room.battle.log = statePatch?.log || room.battle.log;
    const actor = room.players.find(x => x.sid === socket.id);
    const from = actor ? actor.id : null;
    room.turn = room.turn === 'p1' ? 'p2' : 'p1';
    io.to(roomId).emit('battle:update', {
      turn: room.turn,
      log: room.battle.log,
      moveId,
      from,
      hp: statePatch?.hp || null,
      winner: statePatch?.winner || null
    });
  });

  socket.on('battle:end', ({ roomId, winner, reason }) => {
    const room = rooms.get(roomId);
    if (!room) return;
    io.to(roomId).emit('battle:ended', { winner, reason });
    // reset room to lobby
    if (room.battle) room.battle = null;
    room.players.forEach(p => { p.ready = false; });
    emitRoomState(roomId);
  });

  socket.on('chat:send', ({ roomId, name, text }) => {
    if (!rooms.has(roomId) || !text) return;
    io.to(roomId).emit('chat:message', { name, text, ts: Date.now() });
  });

  socket.on('room:leave', ({ roomId }) => {
    socket.leave(roomId);
    const room = rooms.get(roomId);
    if (room) {
      const idx = room.players.findIndex(p => p.sid === socket.id);
      if (idx >= 0) {
        room.players.splice(idx, 1);
        emitRoomState(roomId);
      }
      if (room.players.length === 0) rooms.delete(roomId);
    }
    io.emit('room:list', roomSummary());
  });

  socket.on('disconnect', () => {
    // Remove from rooms
    for (const [roomId, room] of rooms.entries()) {
      const idx = room.players.findIndex(p => p.sid === socket.id);
      if (idx >= 0) {
        room.players.splice(idx, 1);
        io.to(roomId).emit('room:state', { players: room.players, turn: room.turn, battle: room.battle });
        if (room.players.length === 0) rooms.delete(roomId);
      }
    }
  io.emit('room:list', roomSummary());
  });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => console.log(`[server] listening on :${PORT}`));
