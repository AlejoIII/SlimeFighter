// Asset helpers and catalog
export const ASSET_BASE = "/";
export const a = (p) => `${ASSET_BASE}${p}`;

export const PLACEHOLDER_SPRITE =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256"><rect width="100%" height="100%" fill="#e5e7eb"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="16" fill="#6b7280">sprite not found</text></svg>`
  );

export const PLACEHOLDER_BG =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="600"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#cffafe"/><stop offset="100%" stop-color="#bbf7d0"/></linearGradient></defs><rect width="100%" height="100%" fill="url(#g)"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="24" fill="#0f172a">background not found</text></svg>`
  );

export const ASSETS = {
  logo: a("Logo_Slime.png"),
  mainMenu: a("Ventana_inicio.png"),
  bgs: [
    { id: "jungle", name: "Jungla", src: a("Slime_escena1.png") },
    { id: "desert", name: "Desierto", src: a("Slime_escena2.png") },
    { id: "cave", name: "Cascada Nocturna", src: a("Slime_escena3.png") },
    { id: "ruins", name: "Ruinas Verdes", src: a("Slime_escena4.png") },
    { id: "ranch", name: "Rancho", src: a("Slime_escena5.png") },
  ],
  slimes: {
    gato: a("Gato_monedas.png"),
    lunar: a("Slime_Lunar.png"),
    miel: a("Slime_miel.png"),
    // Nota: recibido como "Siime_Lava.png" (doble i)
    lava: a("Siime_Lava.png"),
    toxico: a("Slime_Toxico.png"),
    agua: a("Slime_agua.png"),
    corrupto: a("Slime_Corrupto.png"),
    dorado: a("Slime_dorado.png"),
    normal: a("Slime_Normal.png"),
    podrido: a("Slime_podrido.png"),
  },
};
