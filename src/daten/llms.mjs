// Inhalt von /llms.txt (Deutsch) und /tr/llms.txt (Türkisch) nach dem Format von llmstxt.org: Überschrift, ein Absatz
// als Zitat, kurze Angaben, was die App ist und was nicht, dann die wichtigsten Seiten mit ihrer Beschreibung.
import { seite, store } from './seite.mjs';
import { SEITEN } from './seiten.mjs';
import { start } from './texte/start.mjs';
import { llmsTexte } from './texte/llms.mjs';

export function llmsText(sprache) {
  const T = llmsTexte[sprache];
  const link = (schluessel) => {
    const eintrag = SEITEN.find((kandidat) => kandidat.schluessel === schluessel && kandidat.sprache === sprache);
    return `- [${eintrag.titel}](${seite.adresse}${eintrag.pfad}): ${eintrag.beschreibung}`;
  };
  const recht = sprache === 'de'
    ? ['recht:datenschutz', 'recht:nutzungsbedingungen', 'offenlegung', 'bildnachweis']
    : ['recht:tr/gizlilik', 'recht:tr/kullanim-kosullari', 'bildnachweis'];
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
    `## ${T.recht}`,
    ...recht.map(link),
    '',
    `## ${T.andereSprache}`,
    `- ${T.andereLink}`,
    '',
  ];
  return zeilen.join('\n');
}
