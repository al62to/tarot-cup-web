// Feste Angaben für /llms.txt und /tr/llms.txt (src/daten/llms.mjs): kurz und sachlich, was die App ist und was nicht.
// Die Aussagen über die App sind durch die Belege zu Start, Fragen und So geht’s gedeckt (deutung-unterlagen/arbeit/apw1/). Türkisch muttersprachlich
// ungeprüft.
export const llmsTexte = {
  de: {
    angaben: [
      'Plattform: Android. Sprachen: Deutsch, Türkisch, Englisch, Spanisch, Bosnisch, Kroatisch, Serbisch, Rumänisch, Portugiesisch, Französisch, Indonesisch und Hindi, in der App umschaltbar.',
      'Funktionen: Tageskarte, Ja oder Nein, Drei Karten und eine Legung zur Liebe mit 78 Tarotkarten; Kaffeesatz selbst lesen mit 80 Zeichen und der Tassenkarte; Lexikon, Verlauf mit eigenen Notizen, Teilen als Bild, Erinnerung an die Tageskarte.',
      'Traumdeutung: Das Gefühl des Traums, ein Lebensbereich und bis zu fünf von 124 Traumsymbolen ergeben eine Deutung mit Gesamtbild, der Bedeutung jedes Symbols in seiner Überlieferung und einem Rat; möglich ist ein Traum alle zwei Tage.',
      'Mondkalender auf der Startseite: die Mondphase von heute mit dem beleuchteten Anteil in Prozent, die Phasen der nächsten sechs Tage, der nächste Neumond und Vollmond und ein kurzer, ruhiger Text zur Phase; berechnet auf dem Handy, ohne Standort, ohne Sternzeichen und ohne Vorhersagen.',
      'Die App läuft ohne Internet und ohne Konto. Verlauf und Notizen speichert sie auf dem Handy.',
      'Jede Legung hat ihren Rhythmus: Tageskarte und Ja oder Nein täglich, Drei Karten und die volle Kaffeesatz-Deutung alle drei Tage, Liebe einmal pro Woche. Lexikon und Verlauf sind immer offen.',
      'Zur Unterhaltung: Die Deutungen folgen alten Traditionen und sind keine Vorhersage und keine Beratung.',
      'Tarot Cup gibt es nur für Android. Eine Fassung fürs iPhone ist nicht geplant.',
    ],
    store: 'Google Play',
    seiten: 'Wichtige Seiten',
    // Überschrift über den Links zu llms.txt in den anderen Sprachen (AP-SPR2; andereSprache und andereLink nutzt
    // llms.txt seitdem nicht mehr).
    weitereSprachen: 'Andere Sprachen',
    andereSprache: 'Türkisch',
    andereLink: '[llms.txt auf Türkisch](https://tarot-cup.com/tr/llms.txt)',
  },
  tr: {
    angaben: [
      'Platform: Android. Diller: Almanca, Türkçe, İngilizce, İspanyolca, Boşnakça, Hırvatça, Sırpça, Rumence, Portekizce, Fransızca, Endonezce ve Hintçe; uygulama içinden değiştirilebilir.',
      'Özellikler: 78 tarot kartıyla Günün Kartı, “Evet mi, Hayır mı”, Üç Kart ve bir aşk açılımı; 80 işaret ve fincan haritasıyla kendi kahve falına bakma; sözlük, kendi notlarınla geçmiş, görsel olarak paylaşma, günün kartı için hatırlatıcı.',
      'Rüya tabiri: Rüyanın bıraktığı his, bir hayat alanı ve 124 rüya sembolünden en fazla beşi seçilir; yorumda genel bir bakış, her sembolün gelenekte neye yorulduğu ve bir tavsiye yer alır; iki günde bir rüya yorumlatılabilir.',
      'Ay takvimi ana sayfada: bugünkü Ay evresi ve aydınlık kısmın yüzdesi, sonraki altı günün evreleri, sıradaki Yeni Ay ve Dolunay, evreye dair kısa ve sakin bir yazı; evreler telefonda hesaplanır, konum istenmez, burç ya da kehanet yoktur.',
      'Uygulama internetsiz ve üyeliksiz çalışır. Geçmişi ve notları telefonda saklar.',
      'Her açılımın kendi ritmi vardır: Günün Kartı ve “Evet mi, Hayır mı” her gün, Üç Kart ve tam kahve falı yorumu üç günde bir, aşk açılımı haftada bir. Sözlük ve geçmiş her zaman açıktır.',
      'Eğlence amaçlıdır: Yorumlar eski geleneklere dayanır; kehanet ya da danışmanlık değildir.',
      'Tarot Cup yalnızca Android için var. iPhone sürümü planlanmıyor.',
    ],
    store: 'Google Play',
    seiten: 'Önemli sayfalar',
    weitereSprachen: 'Diğer diller',
    andereSprache: 'Almanca',
    andereLink: '[Almanca llms.txt](https://tarot-cup.com/llms.txt)',
  },
};

// Übersetzungen (en, es seit AP-SPR2; bs, hr, sr, ro, pt, fr, id, hi seit AP-23): erzeugt mit tools/texte_einspielen.mjs aus deutung-unterlagen/uebersetzung/ (nicht von Hand).
import llmsTexteEn from './uebersetzt/llms_en.json' with { type: 'json' };
import llmsTexteEs from './uebersetzt/llms_es.json' with { type: 'json' };
import llmsTexteBs from './uebersetzt/llms_bs.json' with { type: 'json' };
import llmsTexteHr from './uebersetzt/llms_hr.json' with { type: 'json' };
import llmsTexteSr from './uebersetzt/llms_sr.json' with { type: 'json' };
import llmsTexteRo from './uebersetzt/llms_ro.json' with { type: 'json' };
import llmsTextePt from './uebersetzt/llms_pt.json' with { type: 'json' };
import llmsTexteFr from './uebersetzt/llms_fr.json' with { type: 'json' };
import llmsTexteId from './uebersetzt/llms_id.json' with { type: 'json' };
import llmsTexteHi from './uebersetzt/llms_hi.json' with { type: 'json' };
llmsTexte.en = llmsTexteEn;
llmsTexte.es = llmsTexteEs;
llmsTexte.bs = llmsTexteBs;
llmsTexte.hr = llmsTexteHr;
llmsTexte.sr = llmsTexteSr;
llmsTexte.ro = llmsTexteRo;
llmsTexte.pt = llmsTextePt;
llmsTexte.fr = llmsTexteFr;
llmsTexte.id = llmsTexteId;
llmsTexte.hi = llmsTexteHi;
