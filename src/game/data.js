import { a, ASSETS } from "./assets.index";

export const TYPES = ["normal", "water", "fire", "toxic", "dark", "light", "earth", "plant"];

export const TYPE_CHART = {
  normal: { dark: 1, light: 1, water: 1, fire: 1, toxic: 1, earth: 1, plant: 1, normal: 1 },
  water: { fire: 2, earth: 1.5, plant: 0.5, water: 0.5, toxic: 1, dark: 1, light: 1, normal: 1 },
  fire: { plant: 2, water: 0.5, earth: 0.5, fire: 0.5, toxic: 1, dark: 1, light: 1, normal: 1 },
  toxic: { plant: 1.5, water: 1, fire: 1, dark: 1, light: 1, earth: 1, toxic: 0.5, normal: 1 },
  dark: { light: 2, dark: 0.5, normal: 1, water: 1, fire: 1, toxic: 1, earth: 1, plant: 1 },
  light: { dark: 2, light: 0.5, normal: 1, water: 1, fire: 1, toxic: 1, earth: 1, plant: 1 },
  earth: { fire: 1.5, water: 1, plant: 1, earth: 0.5, toxic: 1, normal: 1, dark: 1, light: 1 },
  plant: { water: 2, fire: 0.5, toxic: 0.8, earth: 1.2, normal: 1, dark: 1, light: 1, plant: 0.5 },
};

export const MOVES = [
  { id: "salpicadura", name: "Salpicadura", type: "water", power: 38, accuracy: 100 },
  { id: "chorro", name: "Chorro", type: "water", power: 52, accuracy: 95 },
  { id: "ascuas", name: "Ascuas", type: "fire", power: 40, accuracy: 100 },
  { id: "llamarada", name: "Llamarada", type: "fire", power: 70, accuracy: 90 },
  { id: "mielazo", name: "Mielazo", type: "plant", power: 45, accuracy: 100 },
  { id: "toxina", name: "Toxina", type: "toxic", power: 30, accuracy: 90, effect: "poison" },
  { id: "purificar", name: "Purificar", type: "light", power: 0, accuracy: 100, effect: "cleanse" },
  { id: "mordisco", name: "Mordisco", type: "dark", power: 50, accuracy: 100 },
  { id: "golpe", name: "Golpe", type: "normal", power: 42, accuracy: 100 },
  { id: "curita", name: "Curita", type: "light", power: 0, accuracy: 100, effect: "heal" },
  { id: "roca", name: "Roca", type: "earth", power: 55, accuracy: 95 },
  { id: "fango", name: "Fango", type: "earth", power: 35, accuracy: 100 },
];

export const SLIMES = [
  { id: "gato", name: "Gato Monedas", sprite: ASSETS.slimes.gato, types: ["normal"], stats: { hp: 58, atk: 45, def: 40, spd: 55 }, moves: ["golpe", "mordisco", "curita"] },
  { id: "lunar", name: "Slime Lunar", sprite: ASSETS.slimes.lunar, types: ["light"], stats: { hp: 52, atk: 40, def: 42, spd: 60 }, moves: ["purificar", "golpe", "mielazo"] },
  { id: "miel", name: "Slime Miel", sprite: ASSETS.slimes.miel, types: ["plant"], stats: { hp: 66, atk: 38, def: 45, spd: 40 }, moves: ["mielazo", "curita", "fango"] },
  { id: "lava", name: "Slime Lava", sprite: ASSETS.slimes.lava, types: ["fire", "earth"], stats: { hp: 62, atk: 55, def: 44, spd: 35 }, moves: ["ascuas", "llamarada", "roca"] },
  { id: "toxico", name: "Slime Tóxico", sprite: ASSETS.slimes.toxico, types: ["toxic"], stats: { hp: 60, atk: 42, def: 48, spd: 36 }, moves: ["toxina", "golpe", "fango"] },
  { id: "agua", name: "Slime Agua", sprite: ASSETS.slimes.agua, types: ["water"], stats: { hp: 64, atk: 44, def: 46, spd: 42 }, moves: ["salpicadura", "chorro", "golpe"] },
  { id: "corrupto", name: "Slime Corrupto", sprite: ASSETS.slimes.corrupto, types: ["dark"], stats: { hp: 58, atk: 52, def: 40, spd: 44 }, moves: ["mordisco", "golpe", "toxina"] },
  { id: "dorado", name: "Slime Dorado", sprite: ASSETS.slimes.dorado, types: ["light", "normal"], stats: { hp: 55, atk: 50, def: 42, spd: 62 }, moves: ["golpe", "curita", "purificar"] },
  { id: "normal", name: "Slime Normal", sprite: ASSETS.slimes.normal, types: ["normal"], stats: { hp: 60, atk: 40, def: 40, spd: 40 }, moves: ["golpe", "mordisco", "curita"] },
  { id: "podrido", name: "Slime Podrido", sprite: ASSETS.slimes.podrido, types: ["toxic", "dark"], stats: { hp: 62, atk: 46, def: 42, spd: 35 }, moves: ["toxina", "fango", "mordisco"] },
];
