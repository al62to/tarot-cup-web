// Platzhalter der Hauptsitzung (AP-25); wird vom schreibenden Agenten ersetzt.
export const erklaerMond = { de: {}, tr: {} };

// Englisch, Spanisch (Lateinamerika) und Portugiesisch (Brasilien) seit AP-WS1: übersetzt aus dem Deutschen, eingespielt mit
// tools/erklaer_einspielen.mjs (nicht von Hand ändern). Leere Dateien heißen: die Seite gibt es in der Sprache nicht.
import erklaerMondEn from './uebersetzt/erklaer_mond_en.json' with { type: 'json' };
import erklaerMondEs from './uebersetzt/erklaer_mond_es.json' with { type: 'json' };
import erklaerMondPt from './uebersetzt/erklaer_mond_pt.json' with { type: 'json' };
erklaerMond.en = erklaerMondEn;
erklaerMond.es = erklaerMondEs;
erklaerMond.pt = erklaerMondPt;
