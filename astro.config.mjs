import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';
import { setzeSprachen } from './tools/sprache_setzen.mjs';
import { pruefeBau } from './tools/pruefe_bau.mjs';

// Nach dem Bau: zuerst lang-Attribute um fremdsprachige Wörter (src/daten/sprachen.mjs), dann alle Prüfungen
// (tools/pruefe_bau.mjs). Ein Fund bricht den Bau ab; die Meldung nennt Datei und Fund.
const nachDemBau = {
  name: 'nach-dem-bau',
  hooks: {
    'astro:build:done': ({ dir, logger }) => {
      const ordner = fileURLToPath(dir);
      const { seiten, stellen } = setzeSprachen(ordner);
      logger.info(`lang-Attribut an ${stellen} Stellen auf ${seiten} Seiten gesetzt`);
      const ergebnis = pruefeBau(ordner, { still: true });
      logger.info(`Prüfung: ${ergebnis.dateien} Dateien, ${ergebnis.seiten} Seiten, ${ergebnis.adressenVorher} Adressen von vorher, kein Befund`);
    },
  },
};

export default defineConfig({
  site: 'https://tarot-cup.com',
  trailingSlash: 'always',
  // Stile direkt in jede Seite (klein, komprimiert wenige KB): keine blockierende Anfrage vor dem ersten Zeichnen.
  build: { format: 'directory', inlineStylesheets: 'always' },
  devToolbar: { enabled: false },
  integrations: [nachDemBau],
});
