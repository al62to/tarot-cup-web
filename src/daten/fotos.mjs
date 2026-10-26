// Bildschirmfotos der App auf der Website. "app": Store-Fotos aus AP-16 (aufnahmen/AP16/store/<sprache>/),
// "sogehts": Fotos für die Anleitung aus AP-W1 (aufnahmen/APW1/sogehts/<sprache>/). tools/bilder_bauen.mjs macht
// daraus WebP in zwei Breiten unter public/bilder/<art>/<name>-<sprache>-<breite>.webp.
export const FOTOS_START = ['01_start_tageskarte', '03_deutung_drei_karten', '05_kaffee_tasse'];
export const FOTO_BREITEN = [360, 720];
// Maße jedes Fotos in voller Größe, geschrieben von tools/bilder_bauen.mjs (Store-Fotos 1080 x 2160, Emulator-Fotos
// 1080 x 2400, das Teilen-Bild 1080 x 1620). Fehlt ein Eintrag, bricht der Bau ab.
import masse from './fotos_masse.json' with { type: 'json' };

export function fotoMasse(art, name, sprache) {
  const eintrag = masse[`${art}/${name}-${sprache}`];
  if (!eintrag) throw new Error(`Fotos: Maße fehlen für ${art}/${name}-${sprache} (node tools/bilder_bauen.mjs ${art})`);
  return eintrag;
}

export const fotoPfad = (art, name, sprache, breite) => `/bilder/${art}/${name}-${sprache}-${breite}.webp`;
