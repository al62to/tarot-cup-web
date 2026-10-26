// robots.txt am Schalter E8 (src/daten/seite.mjs, suche.freigegeben): vor der Freigabe sperrt sie alles, danach erlaubt
// sie alles und nennt die Sitemap.
import { seite, suche } from '../daten/seite.mjs';

export function GET() {
  const inhalt = suche.freigegeben
    ? `User-agent: *\nAllow: /\n\nSitemap: ${seite.adresse}/sitemap.xml\n`
    : 'User-agent: *\nDisallow: /\n';
  return new Response(inhalt, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
