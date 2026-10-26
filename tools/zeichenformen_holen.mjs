// Holt die Linienformen der Kaffeesatz-Zeichen aus der App (Vektor-Ressourcen zf_*.xml, Ansicht 28 x 28, Linie 1,5)
// und schreibt sie nach src/gestaltung/zeichenformen.mjs, damit die Website dieselben Formen zeigt wie die App.
// Die Zuordnung Kennung -> Ressource kommt aus ZeichenFormRessourcen.kt im Code-Repo.
// Aufruf (aus tarot-cup-web): node tools/zeichenformen_holen.mjs
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const WURZEL = join(dirname(fileURLToPath(import.meta.url)), '..');
const APP = join(WURZEL, '..', 'deutung', 'app', 'app', 'src', 'main');
const zuordnung = readFileSync(join(APP, 'kotlin', 'at', 'tonc', 'kaffeesatztarot', 'ui', 'ZeichenFormRessourcen.kt'), 'utf8');

const formen = {};
for (const [, id, ressource] of zuordnung.matchAll(/"(kf_[a-z0-9_]+)"\s*->\s*R\.drawable\.([a-z0-9_]+)/g)) {
  const xml = readFileSync(join(APP, 'res', 'drawable', `${ressource}.xml`), 'utf8');
  formen[id] = [...xml.matchAll(/android:pathData="([^"]+)"/g)].map((treffer) => treffer[1]);
}

const ziel = join(WURZEL, 'src', 'gestaltung', 'zeichenformen.mjs');
mkdirSync(dirname(ziel), { recursive: true });
writeFileSync(ziel, `// Linienformen der Kaffeesatz-Zeichen wie in der App (Ansicht 0 bis 28, Linie 1,5, runde Enden).
// Erzeugt von tools/zeichenformen_holen.mjs aus den Vektor-Ressourcen der App; nicht von Hand ändern.
export const ZEICHENFORMEN = ${JSON.stringify(formen, null, 1)};
`, 'utf8');
console.log(`${Object.keys(formen).length} Formen nach ${ziel}`);
