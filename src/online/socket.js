import { io } from 'socket.io-client';

let socket;
const ENV_URL = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_SERVER_URL) ? import.meta.env.VITE_SERVER_URL : null;
const DEFAULT_URL = ENV_URL || (typeof window !== 'undefined' ? `${window.location.protocol}//${window.location.hostname}:3001` : 'http://localhost:3001');

function ensureSocket(url) {
  if (!socket) {
    socket = io(url || DEFAULT_URL, { autoConnect: true });
  }
  return socket;
}

export function connect(url) {
  return ensureSocket(url);
}

export function createRoom(roomId, name) {
  ensureSocket().emit('room:create', { roomId, name });
}

export function joinRoom(roomId, name) {
  ensureSocket().emit('room:join', { roomId, name });
}

export function onRoomState(cb) {
  ensureSocket().on('room:state', cb);
}

export function requestRoomList() {
  ensureSocket().emit('room:list');
}

export function onRoomList(cb) {
  ensureSocket().on('room:list', cb);
}

export function onBattleStart(cb) {
  ensureSocket().on('battle:start', cb);
}

export function onBattleUpdate(cb) {
  ensureSocket().on('battle:update', cb);
}

export function onBattleEnded(cb) {
  ensureSocket().on('battle:ended', cb);
}

export function selectSlime(roomId, slimeId) {
  ensureSocket().emit('pick:select', { roomId, slimeId });
}

export function playerReady(roomId) {
  ensureSocket().emit('player:ready', { roomId });
}

export function sendMove(roomId, moveId, statePatch) {
  ensureSocket().emit('turn:move', { roomId, moveId, statePatch });
}

export function onError(cb) {
  ensureSocket().on('error', cb);
}

export function endBattle(roomId, winner, reason) {
  ensureSocket().emit('battle:end', { roomId, winner, reason });
}

export function sendChat(roomId, name, text) {
  if (!roomId || !text) return;
  ensureSocket().emit('chat:send', { roomId, name, text });
}

export function onChatMessage(cb) {
  ensureSocket().on('chat:message', cb);
}

export function leaveRoom(roomId) {
  ensureSocket().emit('room:leave', { roomId });
}
