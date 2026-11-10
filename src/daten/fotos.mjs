// Bildschirmfotos der App auf der Website. "app": Store-Fotos aus AP-16 (aufnahmen/AP16/store/<sprache>/),
// "sogehts": Fotos für die Anleitung aus AP-W1 (aufnahmen/APW1/sogehts/<sprache>/). tools/bilder_bauen.mjs macht
// daraus WebP in zwei Breiten unter public/bilder/<art>/<name>-<sprache>-<breite>.webp.
export const FOTOS_START = ['01_start_tageskarte', '03_deutung_drei_karten', '05_kaffee_tasse'];
export const FOTO_BREITEN = [360, 720];
// Maße jedes Fotos in voller Größe, geschrieben von tools/bilder_bauen.mjs (Store-Fotos 1080 x 2160, Emulator-Fotos
// 1080 x 2400, das Teilen-Bild 1080 x 1620). Fehlt ein Eintrag, bricht der Bau ab.
import masse from './fotos_masse.json' with { type: 'json' };

// Ersatz (AP-SPR2): Für Englisch und Spanisch gibt es die Bildschirmfotos noch nicht (Store-Fotos kommen aus Teil B,
// die Fotos der Anleitung fehlen noch). Bis sie da sind, zeigen diese Seiten die deutschen Fotos; der Bau meldet jede
// Seite mit Ersatzfotos als Warnung (tools/pruefe_bau.mjs). Sobald die Fotos da sind: node tools/bilder_bauen.mjs app
// sogehts (Quellen dort). Für Deutsch und Türkisch gibt es keinen Ersatz.
export const FOTO_ERSATZ = { en: 'de', es: 'de' };
const fotoSprache = (art, name, sprache) => (masse[`${art}/${name}-${sprache}`] || !FOTO_ERSATZ[sprache] ? sprache : FOTO_ERSATZ[sprache]);

export function fotoMasse(art, name, sprache) {
  const eintrag = masse[`${art}/${name}-${fotoSprache(art, name, sprache)}`];
  if (!eintrag) throw new Error(`Fotos: Maße fehlen für ${art}/${name}-${sprache} (node tools/bilder_bauen.mjs ${art})`);
  return eintrag;
}

export const fotoPfad = (art, name, sprache, breite) => `/bilder/${art}/${name}-${fotoSprache(art, name, sprache)}-${breite}.webp`;
