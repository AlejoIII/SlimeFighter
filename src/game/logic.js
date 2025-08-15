import { TYPE_CHART, MOVES } from "./data";

export const mv = (id) => MOVES.find((m) => m.id === id);

export function typeMultiplier(moveType, defenderTypes) {
  return defenderTypes.reduce((mul, t) => mul * ((TYPE_CHART[moveType] && TYPE_CHART[moveType][t]) || 1), 1);
}

export function calcDamage(attacker, defender, move) {
  if (move.power === 0) return 0;
  const stab = attacker.slime.types.includes(move.type) ? 1.1 : 1; // mismo tipo
  const typeMul = typeMultiplier(move.type, defender.slime.types);
  const rand = 0.85 + Math.random() * 0.3; // 0.85–1.15
  const base = ((attacker.slime.stats.atk / Math.max(1, defender.slime.stats.def)) * move.power) / 10;
  return Math.max(1, Math.floor(base * stab * typeMul * rand));
}

export function applyEffect(state, target, effect) {
  if (!effect) return;
  if (effect === "heal") {
    const heal = Math.floor(target.slime.stats.hp * 0.25);
    target.hp = Math.min(target.slime.stats.hp, target.hp + heal);
    state.log.unshift(`${target.slime.name} recupera ${heal} HP.`);
  } else if (effect === "poison") {
    if (!target.status) {
      target.status = "poison";
      state.log.unshift(`${target.slime.name} ha sido envenenado.`);
    }
  } else if (effect === "cleanse") {
    target.status = null;
    state.log.unshift(`Se purifica el estado de ${target.slime.name}.`);
  }
}

export function endTurnPoisonTick(state, target) {
  if (target.status === "poison") {
    const dmg = Math.max(1, Math.floor(target.slime.stats.hp * 0.07));
    target.hp = Math.max(0, target.hp - dmg);
    state.log.unshift(`${target.slime.name} sufre ${dmg} por veneno.`);
  }
}
