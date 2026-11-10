// Fremdsprachige Wörter und Namen, die im fertigen Bau ein lang-Attribut bekommen (tools/sprache_setzen.mjs), damit
// die Sprachausgabe sie richtig liest. "nur": nur auf Seiten dieser Sprachen (türkische Wörter auf deutschen Seiten).
// Die türkischen Begriffe kommen aus den Textdateien (Feld tuerkischeBegriffe, je Sprache; Englisch und Spanisch
// übernehmen das Feld aus dem Deutschen, tools/texte_einspielen.mjs).
import { kaffeesatz } from './texte/kaffeesatz.mjs';
import { tarot } from './texte/tarot.mjs';

const fest = [
  { text: 'Google Play', lang: 'en' },
  { text: 'GitHub Pages', lang: 'en' },
  { text: 'SIL Open Font License', lang: 'en' },
  { text: 'Wikimedia Commons', lang: 'en' },
  // Sprachnamen in der jeweils anderen Sprache.
  { text: 'Türkçe', lang: 'tr', nur: ['de', 'en', 'es'] },
  { text: 'Deutsch', lang: 'de', nur: ['tr', 'en', 'es'] },
  { text: 'English', lang: 'en', nur: ['de', 'tr', 'es'] },
  { text: 'Español', lang: 'es', nur: ['de', 'tr', 'en'] },
  { text: 'Offenlegung', lang: 'de', nur: ['tr', 'en', 'es'] },
  // Deutsche Namen im Wortlaut der englischen und spanischen Rechtstexte (Behörde, Anschrift; AP-SPR2).
  { text: 'Datenschutzbehörde', lang: 'de', nur: ['en', 'es'] },
  { text: 'Bundesstraße', lang: 'de', nur: ['en', 'es'] },
  { text: 'Höchst', lang: 'de', nur: ['en', 'es'] },
];

const tuerkisch = ['de', 'en', 'es'].flatMap((sprache) =>
  [...(kaffeesatz[sprache]?.tuerkischeBegriffe ?? []), ...(tarot[sprache]?.tuerkischeBegriffe ?? [])].map((text) => ({ text, lang: 'tr', nur: [sprache] })));

// Gleiche Begriffe zusammenfassen (Sprachen der Seiten vereinigt); längere Begriffe zuerst, damit ein ganzer Satz vor
// einem Teil daraus greift.
const zusammen = new Map();
for (const eintrag of [...fest, ...tuerkisch]) {
  const schluessel = `${eintrag.text}|${eintrag.lang}`;
  const vorher = zusammen.get(schluessel);
  if (!vorher) zusammen.set(schluessel, { ...eintrag });
  else if (vorher.nur && eintrag.nur) vorher.nur = [...new Set([...vorher.nur, ...eintrag.nur])];
  else vorher.nur = undefined;
}
export const begriffe = [...zusammen.values()].sort((a, b) => b.text.length - a.text.length);
