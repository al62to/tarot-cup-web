// Posen der gezeichneten Figuren für die Erklärseiten (AP-25): ganze Bilder im Format der Originale (etwa 9:16, mit
// Rahmen und Himmel), nie beschnitten. Gebaut mit node tools/bilder_bauen.mjs posen aus werbung/figuren/posen/ nach
// public/bilder/begleiter/posen/<figur>-<pose>-<breite>.<format>; die Maße der Originale stehen in fotos_masse.json.
// Figuren: erzaehlerin = Aylin, erzaehler = Ozan (Dateinamen der Originale: aylin, ozan).
import masse from './fotos_masse.json' with { type: 'json' };

export const POSEN = ['mond', 'geschenk', 'schreibt', 'karten'];
export const FIGUREN_POSEN = { erzaehlerin: 'aylin', erzaehler: 'ozan' };
// Breiten für srcset; ist das Original schmaler, ist die größte Datei so breit wie das Original, auf eine gerade Zahl
// abgerundet (AVIF speichert Farbe in Paaren von Pixeln; bei ungerader Breite meldet Chrome ein Pixel mehr).
export const POSE_BREITEN = [240, 360, 480];

export const poseBreiten = (original) => [...new Set(POSE_BREITEN.map((breite) => Math.min(breite, original - (original % 2))))].sort((a, b) => a - b);

// Maße des Originals, Breiten und Dateipfad einer Pose.
export function poseVon(figur, pose) {
  if (!FIGUREN_POSEN[figur]) throw new Error(`Posen: unbekannte Figur ${figur}`);
  if (!POSEN.includes(pose)) throw new Error(`Posen: unbekannte Pose ${pose}`);
  const original = masse[`posen/${figur}-${pose}`];
  if (!original) throw new Error(`Posen: Maße fehlen für ${figur}-${pose} (node tools/bilder_bauen.mjs posen)`);
  const breiten = poseBreiten(original.breite);
  return {
    breite: original.breite,
    hoehe: original.hoehe,
    breiten,
    pfad: (breite, format) => `/bilder/begleiter/posen/${figur}-${pose}-${breite}.${format}`,
  };
}
