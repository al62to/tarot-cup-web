// Inhalt von /llms.txt (Deutsch) und /<sprache>/llms.txt (Türkisch, Englisch, Spanisch) nach dem Format von
// llmstxt.org: Überschrift, ein Absatz als Zitat, kurze Angaben, was die App ist und was nicht, dann die wichtigsten
// Seiten mit ihrer Beschreibung. Nur Seiten im Index; die rechtlichen Seiten tragen noindex und stehen nicht darin
// (AP-W3). Am Ende die Links zu llms.txt in den anderen Sprachen, mit dem Sprachnamen in eigener Schreibweise (AP-SPR2).
import { seite, store } from './seite.mjs';
import { SEITEN } from './seiten.mjs';
import { start } from './texte/start.mjs';
import { llmsTexte } from './texte/llms.mjs';
import { SPRACHNAMEN, startVon } from './adressen.mjs';

export const llmsPfad = (sprache) => `${startVon(sprache)}llms.txt`;

export function llmsText(sprache) {
  const T = llmsTexte[sprache];
  const link = (schluessel) => {
    const eintrag = SEITEN.find((kandidat) => kandidat.schluessel === schluessel && kandidat.sprache === sprache);
    if (!eintrag.index) throw new Error(`llms.txt: ${eintrag.pfad} ist nicht im Index`);
    return `- [${eintrag.titel}](${seite.adresse}${eintrag.pfad}): ${eintrag.beschreibung}`;
  };
  const zeilen = [
    `# ${seite.name}`,
    '',
    `> ${start[sprache].wasIst.text}`,
    '',
    ...T.angaben.map((angabe) => `- ${angabe}`),
    ...(store.oeffentlich ? [`- ${T.store}: ${store.adresse}`] : []),
    '',
    `## ${T.seiten}`,
    ...['start', 'tarot', 'kaffeesatz', 'sogehts', 'fragen', 'ueber'].map(link),
    '',
    `## ${T.weitereSprachen}`,
    ...seite.sprachen.filter((andere) => andere !== sprache).map((andere) => `- [${SPRACHNAMEN[andere]}](${seite.adresse}${llmsPfad(andere)})`),
    '',
  ];
  return zeilen.join('\n');
}
