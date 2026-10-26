// sitemap.xml: alle Seiten mit Index-Anspruch (src/daten/seiten.mjs), beide Sprachen mit xhtml:link auf die Gegenseite
// und x-default, lastmod aus Git (src/daten/stand.mjs), Priorität je Seite (Rechts- und Archivseiten niedrig).
// Kurzlink und 404 stehen nicht darin.
import { seite } from '../daten/seite.mjs';
import { SEITEN, seiteVon } from '../daten/seiten.mjs';
import { standVon } from '../daten/stand.mjs';

const adresse = (pfad) => seite.adresse + pfad;

export function GET() {
  const eintraege = SEITEN.filter((eintrag) => eintrag.index).map((eintrag) => {
    const links = eintrag.gegenseite
      ? [
          `    <xhtml:link rel="alternate" hreflang="${eintrag.sprache}" href="${adresse(eintrag.pfad)}"/>`,
          `    <xhtml:link rel="alternate" hreflang="${seiteVon(eintrag.gegenseite).sprache}" href="${adresse(eintrag.gegenseite)}"/>`,
          `    <xhtml:link rel="alternate" hreflang="x-default" href="${adresse(eintrag.sprache === 'de' ? eintrag.pfad : eintrag.gegenseite)}"/>`,
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
