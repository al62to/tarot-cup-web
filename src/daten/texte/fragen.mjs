// Häufige Fragen (/fragen/ und /tr/sorular/), AP-W1 Teil E. Die ersten vier Fragen stehen auch auf der Startseite
// (start.mjs, fragen.ids). Jede Antwort ist gegen den Code der Fassung 0.4.0 geprüft
// (deutung-unterlagen/arbeit/apw1/belege_start_fragen_ueber.md). Die id ist in beiden Sprachen gleich.
// Türkisch eigenständig geschrieben, nicht übersetzt. Prüfstatus: muttersprachlich ungeprüft.

export const fragen = {
  de: {
    metaTitel: 'Fragen und Antworten zur App | Tarot Cup',
    metaBeschreibung: 'Hier findest du Antworten zu Tarot Cup: ob die App die Zukunft vorhersagt, warum eine Legung ruht und ob du Internet oder ein Konto brauchst.',
    titel: 'Häufige Fragen',
    vorspann: 'Hier findest du Antworten auf die Fragen, die zu Tarot Cup am häufigsten kommen. Fehlt dir etwas, schreib mir.',
    ogTitel: 'Häufige Fragen zu Tarot Cup',
    brotkrume: 'Fragen',
    liste: [
      {
        id: 'zukunft',
        frage: 'Sagt die App die Zukunft voraus?',
        antwort: [
          'Nein. Die Deutungen folgen alten Traditionen rund um Tarot und Kaffeesatz. Was davon zu dir passt, entscheidest du.',
          'Zur Unterhaltung. Die Deutungen sind keine Vorhersage und keine Beratung. Sie sagen die Zukunft nicht voraus und ersetzen keinen Rat von Fachleuten.',
        ],
      },
      {
        id: 'foto-der-tasse',
        frage: 'Brauche ich ein Foto meiner Tasse?',
        antwort: [
          'Nein. Die App braucht weder Kamera noch Foto. Du schaust selbst in deine Tasse, wählst unter 80 Zeichen die Formen, die du erkennst, und zeigst auf der Tassenkarte, wo sie liegen. Daraus entsteht die Deutung.',
        ],
      },
      {
        id: 'tuerkisch',
        frage: 'Gibt es die App auf Türkisch?',
        antwort: [
          'Ja. Tarot Cup gibt es ganz auf Deutsch und ganz auf Türkisch: Bedienung, Deutungen, Lexikon und Rechtstexte. Die Sprache wählst du beim ersten Start und wechselst sie später in den Einstellungen.',
        ],
      },
      {
        id: 'fragen-gespeichert',
        frage: 'Werden meine Fragen gespeichert?',
        antwort: [
          'Nein. Die App hat kein Feld für deine Frage, du behältst sie still für dich. Sie fragt nicht danach und speichert sie nicht.',
          'Im Verlauf hält die App fest, was du gelegt hast: Datum und Uhrzeit, die Art der Legung, die Karten (auch ob sie umgekehrt lagen) oder die Zeichen mit ihrem Platz in der Tasse, beim Kaffeesatz den Lebensbereich und deine Notiz, wenn du eine schreibst. Deine Frage ist nie dabei.',
        ],
      },
      {
        id: 'internet',
        frage: 'Brauche ich Internet?',
        antwort: [
          'Nein. Tarot Cup hat keine Erlaubnis, ins Internet zu gehen. Legungen, Lexikon und Verlauf funktionieren ganz ohne Verbindung, und auch die Erinnerung an die Tageskarte plant die App auf deinem Handy.',
        ],
      },
      {
        id: 'konto',
        frage: 'Brauche ich ein Konto?',
        antwort: [
          'Nein. Es gibt kein Anmelden und kein Konto, und die App fragt nicht nach deiner E-Mail-Adresse. Werbung gibt es auch keine.',
        ],
      },
      {
        id: 'legung-gesperrt',
        frage: 'Warum ist eine Legung manchmal gesperrt?',
        antwort: [
          'Jede Legung hat ihren eigenen Rhythmus. Tageskarte und Ja oder Nein gibt es jeden Tag, Drei Karten und die volle Deutung beim Kaffeesatz alle drei Tage, die Legung zur Liebe einmal pro Woche. Dazwischen ruht die Legung.',
          'Die App zeigt dir, wann sie wieder frei ist, zum Beispiel „Morgen kannst du wieder legen.“ Frei wird eine Legung um Mitternacht nach der Uhr deines Handys. Lexikon und Verlauf sind immer offen.',
          'Beim Kaffeesatz gibt es mit einem oder zwei Zeichen eine Kurzform. Sie zählt nicht zum Rhythmus, ist aber auf drei am Tag begrenzt.',
          'Selten gibt es noch einen zweiten Grund: Bei einer neuen Fassung der Nutzungsbedingungen kannst du sofort annehmen oder später entscheiden. Nimmst du sie innerhalb von 30 Tagen nicht an, gibt es neue Legungen erst wieder nach der Annahme. Verlauf, Notizen und Lexikon bleiben offen.',
        ],
      },
      {
        id: 'notizen',
        frage: 'Was passiert mit meinen Notizen?',
        antwort: [
          'Zu jeder Deutung im Verlauf kannst du eine Notiz schreiben, etwa: Was ist daraus geworden? Notizen und Verlauf speichert die App auf deinem Handy. Ich habe darauf keinen Zugriff. Auf dem Bild, das du teilst, stehen deine Notizen nicht.',
          'Einen Eintrag samt Notiz löschst du im Verlauf mit „Eintrag löschen“. Das lässt sich nicht rückgängig machen.',
          'Hast du die Sicherung deines Handys eingeschaltet, darf Android Verlauf, Notizen, die Sprache und die Uhrzeit der Erinnerung in deinem Google-Konto sichern. Beim Umzug auf ein neues Handy kann Android sie mitnehmen. Der Rhythmus der Legungen und die Altersbestätigung werden nicht gesichert, sie gehören zum jeweiligen Handy.',
          'Mehr dazu steht in der [Datenschutzerklärung](/datenschutz/).',
        ],
      },
      {
        id: 'iphone',
        frage: 'Gibt es die App fürs iPhone?',
        antwort: ['Noch nicht. Tarot Cup gibt es derzeit nur für Android.'],
      },
      {
        id: 'zeichen',
        frage: 'Wie viele Zeichen kennt die App?',
        antwort: [
          'Für den Kaffeesatz kennt die App 80 Zeichen in sechs Kategorien: Tiere, Menschen und Figuren, Gegenstände, Natur und Orte, Formen sowie Buchstaben und Zahlen. Du findest sie über die Kategorien oder die Suche, auch unter anderen Namen, unter denen eine Form bekannt ist.',
          'Siehst du eine Form, die nicht dabei ist, wählst du „Form, die ich nicht finde“. Eine Deutung fasst bis zu acht Zeichen. Für Tarot kennt die App alle 78 Karten.',
        ],
      },
      {
        id: 'sprache',
        frage: 'Kann ich die Sprache wechseln?',
        antwort: [
          'Ja. Beim ersten Start wählst du Deutsch oder Türkisch. Später wechselst du in den Einstellungen der App, unabhängig von der Sprache deines Handys.',
          'Auch frühere Deutungen im Verlauf zeigt die App dann in der neuen Sprache. Deine Notizen bleiben so, wie du sie geschrieben hast.',
        ],
      },
      {
        id: 'alter',
        frage: 'Ab welchem Alter ist Tarot Cup?',
        antwort: [
          'Ab 16 Jahren. Beim ersten Start bestätigst du, dass du mindestens 16 Jahre alt bist, und nimmst die [Nutzungsbedingungen](/nutzungsbedingungen/) an. Vorher geht es nicht weiter.',
        ],
      },
    ],
  },

  tr: {
    metaTitel: 'Sık sorulan sorular | Tarot Cup',
    metaBeschreibung: 'Tarot Cup hakkında merak edilenleri burada yanıtlıyorum: uygulama geleceği söyler mi, bir açılım neden dinlenir, internet gerekir mi?',
    titel: 'Sık sorulan sorular',
    vorspann: 'Tarot Cup hakkında en çok merak edilenler ve yanıtları burada. Aradığını bulamazsan bana yaz.',
    ogTitel: 'Tarot Cup: sık sorulan sorular',
    brotkrume: 'Sorular',
    liste: [
      {
        id: 'zukunft',
        frage: 'Uygulama geleceği söyler mi?',
        antwort: [
          'Hayır. Yorumlar, tarot ve kahve falı etrafında yaşayan eski geleneklere dayanır. Hangisinin sana uyduğuna sen karar verirsin.',
          'Eğlence amaçlıdır. Yorumlar kehanet ya da danışmanlık değildir; geleceği önceden söylemez ve bir uzmanın tavsiyesinin yerini tutmaz.',
        ],
      },
      {
        id: 'foto-der-tasse',
        frage: 'Fincanımın fotoğrafı gerekiyor mu?',
        antwort: [
          'Hayır. Uygulama kamera da fotoğraf da istemez. Fincanına kendin bakarsın, tanıdığın şekilleri 80 işaret arasından seçersin ve fincan haritasında nerede durduklarını gösterirsin. Yorum bunlardan oluşur.',
        ],
      },
      {
        id: 'tuerkisch',
        frage: 'Uygulamayı Türkçe kullanabilir miyim?',
        antwort: [
          'Evet. Tarot Cup baştan sona Türkçe ve baştan sona Almanca kullanılabilir: menüler, yorumlar, sözlük ve hukuki metinler. Dili ilk açılışta seçer, sonra istersen Ayarlar’dan değiştirirsin.',
        ],
      },
      {
        id: 'fragen-gespeichert',
        frage: 'Sorularım kaydediliyor mu?',
        antwort: [
          'Hayır. Uygulamada sorunu yazacağın bir alan yok; niyetini içinden tutarsın. Uygulama onu sormaz ve kaydetmez.',
          'Geçmiş bölümünde açtıkların durur: tarih ve saat, açılımın türü, çıkan kartlar (ters gelip gelmedikleri de) ya da fincandaki yerleriyle birlikte işaretler, kahve falında seçtiğin hayat alanı ve yazdıysan notun. Niyetin hiçbir zaman orada yer almaz.',
        ],
      },
      {
        id: 'internet',
        frage: 'İnternet gerekiyor mu?',
        antwort: [
          'Hayır. Tarot Cup’ın internete bağlanma izni yok. Açılımlar, sözlük ve geçmiş bağlantı olmadan çalışır; günün kartı hatırlatmasını da uygulama telefonunda kendisi planlar.',
        ],
      },
      {
        id: 'konto',
        frage: 'Üye olmam gerekiyor mu?',
        antwort: [
          'Hayır. Kayıt ya da hesap yok; uygulama e-posta adresini sormaz ve reklam göstermez.',
        ],
      },
      {
        id: 'legung-gesperrt',
        frage: 'Bir açılım neden bazen kapalı?',
        antwort: [
          'Her açılımın kendi düzeni var. Günün Kartı ile “Evet mi, Hayır mı” her gün; Üç Kart ve kahve falındaki tam yorum üç günde bir; Aşk açılımı haftada bir açılır. Arada kalan günlerde açılım dinlenir.',
          'Uygulama ne zaman yeniden açılacağını gösterir, örneğin “Kartları yarın yeniden açabilirsin.” Açılımlar telefonundaki saate göre gece yarısı yeniden açılır. Sözlük ve Geçmiş her zaman açıktır.',
          'Kahve falında bir ya da iki işaret seçersen kısa bir yorum alırsın. Kısa yorum bu düzene sayılmaz, ama günde en fazla üç kez okunur.',
          'Nadiren başka bir sebep de olabilir: Kullanım Koşulları’nın yeni bir sürümü geldiğinde onu hemen kabul edebilir ya da kararını sonraya bırakabilirsin. 30 gün içinde kabul etmezsen yeni açılım ancak kabulden sonra mümkün olur. Geçmiş, notlar ve sözlük açık kalır.',
        ],
      },
      {
        id: 'notizen',
        frage: 'Notlarıma ne oluyor?',
        antwort: [
          'Geçmişteki her yorum için kendine bir not yazabilirsin, mesela: Sonuçta ne oldu? Notlarını ve geçmişini uygulama telefonunda saklar. Benim bunlara erişimim yok. Paylaştığın görselde notların yer almaz.',
          'Bir kaydı notuyla birlikte Geçmiş bölümünde “Kaydı sil” ile silersin. Bu işlem geri alınamaz.',
          'Telefonunda yedekleme açıksa geçmişin, notların, dil seçimin ve hatırlatma saatin Android tarafından Google hesabına yedeklenebilir. Yeni bir telefona geçtiğinde Android bunları oraya taşıyabilir. Açılımların düzeni ve yaş onayı yedeklenmez, her telefonda ayrı tutulur.',
          'Ayrıntılar [Gizlilik Politikası](/tr/gizlilik/) sayfasında.',
        ],
      },
      {
        id: 'iphone',
        frage: 'iPhone için uygulama var mı?',
        antwort: ['Henüz değil. Tarot Cup şimdilik yalnızca Android için var.'],
      },
      {
        id: 'zeichen',
        frage: 'Uygulamada kaç işaret var?',
        antwort: [
          'Kahve falı için 80 işaret var, altı kategoride toplanır: hayvanlar, insanlar ve figürler, eşyalar, doğa ve yerler, şekiller, harf ve rakamlar. İşaretleri kategoriden ya da aramayla bulursun; bir şeklin bilinen başka adlarıyla aradığında da çıkar.',
          'Gördüğün şekil listede yoksa “Bulamadığım şekil” seçeneğine dokunursun. Bir yorumda en fazla sekiz işaret olabilir. Tarot tarafında 78 kartın hepsi var.',
        ],
      },
      {
        id: 'sprache',
        frage: 'Dili değiştirebilir miyim?',
        antwort: [
          'Evet. İlk açılışta Türkçe ya da Almanca seçersin. Sonra uygulamanın Ayarlar bölümünden, telefonunun dilinden bağımsız olarak değiştirebilirsin.',
          'Geçmişteki eski yorumlar da yeni dilde görünür. Notların ise yazdığın gibi kalır.',
        ],
      },
      {
        id: 'alter',
        frage: 'Tarot Cup kaç yaşından itibaren kullanılabilir?',
        antwort: [
          '16 yaşından itibaren. İlk açılışta en az 16 yaşında olduğunu onaylar ve [Kullanım Koşulları](/tr/kullanim-kosullari/)’nı kabul edersin. Bu adım olmadan devam edilemez.',
        ],
      },
    ],
  },
};
