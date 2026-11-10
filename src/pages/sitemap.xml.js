// sitemap.xml: alle Seiten mit Index-Anspruch (src/daten/seiten.mjs), alle Sprachen mit xhtml:link auf jede
// Sprachfassung (die Seite selbst eingeschlossen) und x-default (englische Fassung, sonst die deutsche; wie im Kopf der
// Seite, src/layouts/Basis.astro), lastmod aus Git (src/daten/stand.mjs), Priorität je Seite.
// Seiten ohne Index (rechtliche Seiten, Kurzlink, 404) stehen nicht darin.
import { seite } from '../daten/seite.mjs';
import { SEITEN } from '../daten/seiten.mjs';
import { standVon } from '../daten/stand.mjs';
import { STANDARD_SPRACHE } from '../daten/adressen.mjs';

const adresse = (pfad) => seite.adresse + pfad;

export function GET() {
  const eintraege = SEITEN.filter((eintrag) => eintrag.index).map((eintrag) => {
    const fassungen = eintrag.fassungen ?? [];
    const standard = fassungen.find((fassung) => fassung.sprache === STANDARD_SPRACHE) ?? fassungen.find((fassung) => fassung.sprache === 'de');
    const eigene = fassungen.find((fassung) => fassung.sprache === eintrag.sprache);
    const links = fassungen.length
      ? [
          `    <xhtml:link rel="alternate" hreflang="${eigene.sprache}" href="${adresse(eigene.pfad)}"/>`,
          ...fassungen.filter((fassung) => fassung !== eigene).map((fassung) => `    <xhtml:link rel="alternate" hreflang="${fassung.sprache}" href="${adresse(fassung.pfad)}"/>`),
          `    <xhtml:link rel="alternate" hreflang="x-default" href="${adresse(standard.pfad)}"/>`,
        ]
      : [];
    return [
      '  <url>',
      `    <loc>${adresse(eintrag.pfad)}</loc>`,
      ...links,
      `    <lastmod>${standVon(eintrag.quellen)}</lastmod>`,
      `    <priority>${eintrag.prioritaet.toFixed(1)}</priority>`,
      '  </url>',
    ].join('\n');
  });
  const inhalt = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${eintraege.join('\n')}\n</urlset>\n`;
  return new Response(inhalt, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
