// Fremdsprachige Wörter und Namen, die im fertigen Bau ein lang-Attribut bekommen (tools/sprache_setzen.mjs), damit
// die Sprachausgabe sie richtig liest. "nur": nur auf Seiten dieser Sprache (türkische Wörter auf deutschen Seiten).
// Die türkischen Begriffe der deutschen Seiten kommen aus den Textdateien (Feld tuerkischeBegriffe).
import { kaffeesatz } from './texte/kaffeesatz.mjs';
import { tarot } from './texte/tarot.mjs';

const fest = [
  { text: 'Google Play', lang: 'en' },
  { text: 'App Store', lang: 'en' },
  { text: 'GitHub Pages', lang: 'en' },
  { text: 'SIL Open Font License', lang: 'en' },
  { text: 'Wikimedia Commons', lang: 'en' },
  // Sprachnamen in der jeweils anderen Sprache.
  { text: 'Türkçe', lang: 'tr', nur: 'de' },
  { text: 'Deutsch', lang: 'de', nur: 'tr' },
  { text: 'Offenlegung', lang: 'de', nur: 'tr' },
];

const tuerkisch = [...kaffeesatz.de.tuerkischeBegriffe, ...tarot.de.tuerkischeBegriffe].map((text) => ({ text, lang: 'tr', nur: 'de' }));

// Längere Begriffe zuerst, damit ein ganzer Satz vor einem Teil daraus greift.
export const begriffe = [...new Map([...fest, ...tuerkisch].map((eintrag) => [`${eintrag.text}|${eintrag.nur ?? ''}`, eintrag])).values()]
  .sort((a, b) => b.text.length - a.text.length);
