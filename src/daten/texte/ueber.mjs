// Seite „Über Tarot Cup“ (/ueber-tarot-cup/ und /tr/hakkinda/), AP-W1 Teil E. Im Mittelpunkt steht, was die App ist
// und was nicht. Kein persönlicher Name (AP-W3): wer verantwortlich ist, steht nur in der Offenlegung, auf die der
// Abschnitt „wer“ verweist. Die E-Mail-Adresse setzt die Seite hinter „kontakt“.
// Funktionsaussagen belegt in deutung-unterlagen/arbeit/apw1/belege_start_fragen_ueber.md.
// Türkisch eigenständig geschrieben, nicht übersetzt. Prüfstatus: muttersprachlich ungeprüft.

export const ueber = {
  de: {
    metaTitel: 'Über Tarot Cup: was die App ist und was nicht',
    metaBeschreibung: 'Tarot Cup ist eine App für Tarot und Kaffeesatz in zwölf Sprachen. Hier steht, was sie ist und was sie nicht ist.',
    titel: 'Über Tarot Cup',
    vorspann: 'Tarot Cup ist eine ruhige App für Tarot und Kaffeesatz. Hier steht, was sie ist und was sie nicht ist.',
    ogTitel: 'Über Tarot Cup',
    brotkrume: 'Über',
    abschnitte: [
      {
        kennung: 'was-sie-ist',
        titel: 'Was ist Tarot Cup?',
        absaetze: [
          'Mit Tarot Cup legst du Tarotkarten und liest den Kaffeesatz in deiner Tasse selbst. Du ziehst deine Karten, wählst die Zeichen, die du in der Tasse erkennst, und liest, was die Tradition dazu erzählt. Die App gibt es für Android, in zwölf Sprachen. Sie startet in der Sprache deines Handys; umstellen kannst du in der App.',
          'Jede Legung hat ihren eigenen Rhythmus. Dazwischen ruhen die Karten, und du hast Zeit, über eine Deutung nachzudenken.',
        ],
      },
      {
        kennung: 'was-sie-nicht-ist',
        titel: 'Was Tarot Cup nicht ist',
        absaetze: [
          'Tarot Cup ist keine Hellseherei. Die Deutungen sind keine Vorhersage und keine Beratung, und sie ersetzen keinen Rat von Fachleuten. Sie erzählen nach, was alte Bräuche rund um Karten und Kaffee in Bildern und Zeichen sehen.',
          'Die App ist zur Unterhaltung gedacht, mit Respekt vor der Tradition. Was davon zu dir passt, entscheidest du.',
        ],
      },
      {
        kennung: 'bei-dir',
        titel: 'Was bei dir bleibt',
        absaetze: [
          'Kein Konto, kein Internet. Verlauf und Notizen speichert die App auf deinem Handy. Ich habe darauf keinen Zugriff.',
        ],
      },
      {
        kennung: 'wer',
        titel: 'Wer hinter Tarot Cup steht',
        absaetze: [
          'Wer für diese Website verantwortlich ist, steht in der [Offenlegung](/offenlegung/).',
        ],
      },
    ],
    kontakt: 'Schreib mir: ',
  },

  tr: {
    metaTitel: 'Tarot Cup hakkında: uygulama nedir, ne değildir',
    metaBeschreibung: 'Tarot Cup, on iki dilde bir tarot ve kahve falı uygulamasıdır. Burada ne olduğunu ve ne olmadığını okuyabilirsin.',
    titel: 'Tarot Cup hakkında',
    vorspann: 'Tarot Cup, tarot ve kahve falı için sakin bir uygulama. Bu sayfada ne olduğunu ve ne olmadığını bulursun.',
    ogTitel: 'Tarot Cup hakkında',
    brotkrume: 'Hakkında',
    abschnitte: [
      {
        kennung: 'was-sie-ist',
        titel: 'Tarot Cup nedir?',
        absaetze: [
          'Tarot Cup ile tarot kartları açar ve fincanındaki kahve telvesini kendin okursun. Kartlarını çeker, fincanda gördüğün işaretleri seçer ve geleneğin bunlar hakkında anlattıklarını okursun. Uygulama Android için, on iki dilde sunulur. Telefonunun dilinde açılır; dili uygulama içinden değiştirebilirsin.',
          'Her açılımın kendi zamanı var. Aradaki günlerde kartlar dinlenir; sen de yorumun üzerine düşünmeye vakit bulursun.',
        ],
      },
      {
        kennung: 'was-sie-nicht-ist',
        titel: 'Tarot Cup ne değildir?',
        absaetze: [
          'Tarot Cup’ta kimse geleceği görmez; bu bir kâhinlik hizmeti değildir. Yorumlar kehanet ya da danışmanlık sayılmaz, bir uzmanın tavsiyesinin yerini de tutmaz. Kart ve kahve etrafındaki eski geleneklerin resimlerde ve şekillerde gördüklerini anlatır.',
          'Uygulama eğlence amaçlıdır ve geleneğe saygıyla hazırlanmıştır. Hangi yorumun sana uyduğuna sen karar verirsin.',
        ],
      },
      {
        kennung: 'bei-dir',
        titel: 'Senin olan sende kalır',
        absaetze: [
          'Üyelik yok, internet yok. Geçmişini ve notlarını uygulama telefonunda saklar. Benim bunlara erişimim yok.',
        ],
      },
      {
        kennung: 'wer',
        titel: 'Tarot Cup’ın arkasında kim var?',
        absaetze: [
          'Bu siteden kimin sorumlu olduğunu [Offenlegung (künye)](/offenlegung/) sayfasında bulabilirsin.',
        ],
      },
    ],
    kontakt: 'Bana yaz: ',
  },
};

// Übersetzungen (en, es seit AP-SPR2; bs, hr, sr, ro, pt, fr, id, hi seit AP-23): erzeugt mit tools/texte_einspielen.mjs aus deutung-unterlagen/uebersetzung/ (nicht von Hand).
import ueberEn from './uebersetzt/ueber_en.json' with { type: 'json' };
import ueberEs from './uebersetzt/ueber_es.json' with { type: 'json' };
import ueberBs from './uebersetzt/ueber_bs.json' with { type: 'json' };
import ueberHr from './uebersetzt/ueber_hr.json' with { type: 'json' };
import ueberSr from './uebersetzt/ueber_sr.json' with { type: 'json' };
import ueberRo from './uebersetzt/ueber_ro.json' with { type: 'json' };
import ueberPt from './uebersetzt/ueber_pt.json' with { type: 'json' };
import ueberFr from './uebersetzt/ueber_fr.json' with { type: 'json' };
import ueberId from './uebersetzt/ueber_id.json' with { type: 'json' };
import ueberHi from './uebersetzt/ueber_hi.json' with { type: 'json' };
ueber.en = ueberEn;
ueber.es = ueberEs;
ueber.bs = ueberBs;
ueber.hr = ueberHr;
ueber.sr = ueberSr;
ueber.ro = ueberRo;
ueber.pt = ueberPt;
ueber.fr = ueberFr;
ueber.id = ueberId;
ueber.hi = ueberHi;
