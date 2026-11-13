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
  { text: 'Türkçe', lang: 'tr', nur: ['de', 'en', 'es', 'bs', 'hr', 'sr', 'ro', 'pt', 'fr', 'id', 'hi'] },
  { text: 'Deutsch', lang: 'de', nur: ['tr', 'en', 'es', 'bs', 'hr', 'sr', 'ro', 'pt', 'fr', 'id', 'hi'] },
  { text: 'English', lang: 'en', nur: ['de', 'tr', 'es', 'bs', 'hr', 'sr', 'ro', 'pt', 'fr', 'id', 'hi'] },
  { text: 'Español', lang: 'es', nur: ['de', 'tr', 'en', 'bs', 'hr', 'sr', 'ro', 'pt', 'fr', 'id', 'hi'] },
  { text: 'Bosanski', lang: 'bs', nur: ['de', 'tr', 'en', 'es', 'hr', 'sr', 'ro', 'pt', 'fr', 'id', 'hi'] },
  { text: 'Hrvatski', lang: 'hr', nur: ['de', 'tr', 'en', 'es', 'bs', 'sr', 'ro', 'pt', 'fr', 'id', 'hi'] },
  { text: 'Srpski', lang: 'sr', nur: ['de', 'tr', 'en', 'es', 'bs', 'hr', 'ro', 'pt', 'fr', 'id', 'hi'] },
  { text: 'Română', lang: 'ro', nur: ['de', 'tr', 'en', 'es', 'bs', 'hr', 'sr', 'pt', 'fr', 'id', 'hi'] },
  { text: 'Português', lang: 'pt', nur: ['de', 'tr', 'en', 'es', 'bs', 'hr', 'sr', 'ro', 'fr', 'id', 'hi'] },
  { text: 'Français', lang: 'fr', nur: ['de', 'tr', 'en', 'es', 'bs', 'hr', 'sr', 'ro', 'pt', 'id', 'hi'] },
  { text: 'Bahasa Indonesia', lang: 'id', nur: ['de', 'tr', 'en', 'es', 'bs', 'hr', 'sr', 'ro', 'pt', 'fr', 'hi'] },
  { text: 'हिन्दी', lang: 'hi', nur: ['de', 'tr', 'en', 'es', 'bs', 'hr', 'sr', 'ro', 'pt', 'fr', 'id'] },
  { text: 'Offenlegung', lang: 'de', nur: ['tr', 'en', 'es', 'bs', 'hr', 'sr', 'ro', 'pt', 'fr', 'id', 'hi'] },
  // Deutsche Namen im Wortlaut der englischen und spanischen Rechtstexte (Behörde, Anschrift; AP-SPR2).
  { text: 'Datenschutzbehörde', lang: 'de', nur: ['en', 'es', 'bs', 'hr', 'sr', 'ro', 'pt', 'fr', 'id', 'hi'] },
  { text: 'Bundesstraße', lang: 'de', nur: ['en', 'es', 'bs', 'hr', 'sr', 'ro', 'pt', 'fr', 'id', 'hi'] },
  { text: 'kısmet', lang: 'tr', nur: ['de', 'en', 'es', 'bs', 'hr', 'sr', 'ro', 'pt', 'fr', 'id', 'hi'] },
  { text: 'Kısmet', lang: 'tr', nur: ['de', 'en', 'es', 'bs', 'hr', 'sr', 'ro', 'pt', 'fr', 'id', 'hi'] },
  { text: 'Österreich', lang: 'de', nur: ['tr', 'en', 'es', 'bs', 'hr', 'sr', 'ro', 'pt', 'fr', 'id', 'hi'] },
  { text: 'Höchst', lang: 'de', nur: ['en', 'es', 'bs', 'hr', 'sr', 'ro', 'pt', 'fr', 'id', 'hi'] },
];

const tuerkisch = ['de', 'en', 'es', 'bs', 'hr', 'sr', 'ro', 'pt', 'fr', 'id', 'hi'].flatMap((sprache) =>
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
