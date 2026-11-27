// Kurzfassung der Folgenabschätzung mit Meldekanal (AP-AS2, Teil C 3): eine Seite nur auf Portugiesisch (Brasilien)
// unter /pt/avaliacao-de-impacto/, nach Art. 47 Decreto 12.880/2026 (ECA Digital). Verlinkt nur im Fuß der pt-Seiten
// (components/Fuss.astro). Wortlaut unverändert aus deutung-unterlagen/recht/entwurf_1.10/avaliacao_de_impacto_pt.md,
// als HTML-Baustein in src/inhalte/avaliacao/avaliacao_de_impacto_pt.html; die deutsche Prüffassung geht nicht online.
// Im Baustein stehen nur die Platzhalter {{CLASSIND}}, {{STAND_DATUM}} und {{EMAIL}}; ihre Werte stehen hier und nur hier.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { seite, kodiert } from './seite.mjs';

// Altersfreigabe in Brasilien (ClassInd über IARC bei Google Play). Stand AP-AS2: Vorschau der neuen IARC-Einstufung,
// noch nicht amtlich. Ändert sich die Einstufung, nur diesen Wert anpassen (Wortlaut aus der Play Console abschreiben).
// Die Inhaltsbeschreibungen „(Violência, Nudez)“ stehen im Baustein direkt hinter dem Platzhalter (Entwurf 1.10);
// ändern sie sich, dort anpassen. Die 16 ist die ClassInd-Stufe, nicht die Altersgrenze der App (18).
export const CLASSIND = 'Não recomendado para menores de 16 anos';

// Tag der letzten Aktualisierung, wie in den pt-Rechtstexten als TT/MM/JJJJ.
export const STAND_DATUM = '27/11/2026';

// Betreff der Meldung, wie im Text genannt.
export const BETREFF = 'Denúncia – Tarot Cup';

export const AVALIACAO = {
  pfad: '/pt/avaliacao-de-impacto/',
  metaTitel: 'Avaliação de impacto e canal de denúncia | Tarot Cup',
  metaBeschreibung: 'Resumo da avaliação de impacto do Tarot Cup sobre crianças e adolescentes, conforme o ECA Digital, e o canal para enviar denúncias.',
  brotkrume: 'Avaliação de impacto',
  // Linktext im Fuß der pt-Seiten, Spalte Rechtliches.
  fusslink: 'Avaliação de impacto e denúncias',
};

const BAUSTEIN = join(process.cwd(), 'src', 'inhalte', 'avaliacao', 'avaliacao_de_impacto_pt.html');

// Baustein mit eingesetzten Werten. Die E-Mail steht wie überall als HTML-Entitäten, als mailto-Link mit Betreff.
export function avaliacaoHtml() {
  const mailto = `mailto:${seite.email}?subject=${encodeURIComponent(BETREFF)}`;
  const werte = {
    CLASSIND,
    STAND_DATUM,
    EMAIL: `<a href="${kodiert(mailto)}">${kodiert(seite.email)}</a>`,
  };
  const baustein = readFileSync(BAUSTEIN, 'utf8').trim();
  for (const name of Object.keys(werte)) {
    if (!baustein.includes(`{{${name}}}`)) throw new Error(`Avaliação: Platzhalter {{${name}}} fehlt im Baustein`);
  }
  return baustein.replace(/\{\{(\w+)\}\}/g, (ganz, name) => {
    if (!(name in werte)) throw new Error(`Avaliação: unbekannter Platzhalter ${ganz}`);
    return werte[name];
  });
}
