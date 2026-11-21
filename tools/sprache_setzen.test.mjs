// Kleiner Test für tools/sprache_setzen.mjs (AP-40). Aufruf: node --test tools/sprache_setzen.test.mjs
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { durchlaufe } from './sprache_setzen.mjs';

const gross = (html) => durchlaufe(html, (text) => text.toUpperCase());

test('"<" aus einer max-width-Abfrage im Stil sperrt den Text danach nicht', () => {
  const html = '<head><style>@media (width<=30rem){.a{color:red}}</style></head><body><p>wort</p></body>';
  assert.equal(gross(html), '<head><style>@media (width<=30rem){.a{color:red}}</style></head><body><p>WORT</p></body>');
});

test('Inhalt von Stil und Skript bleibt unverändert', () => {
  const html = '<style>.a>.b{color:red}</style><script>if (a<b) c("wort");</script><p>wort</p>';
  assert.equal(gross(html), '<style>.a>.b{color:red}</style><script>if (a<b) c("wort");</script><p>WORT</p>');
});

test('Text in einem Element mit lang-Attribut bleibt gesperrt', () => {
  assert.equal(gross('<p>wort <span lang="tr">kelime</span> wort</p>'), '<p>WORT <span lang="tr">kelime</span> WORT</p>');
});
