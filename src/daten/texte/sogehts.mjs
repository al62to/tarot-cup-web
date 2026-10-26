// So geht's (AP-W1, Teil D). Deutsch und Türkisch eigenständig; Türkisch muttersprachlich ungeprüft. Belege: deutung-unterlagen/arbeit/apw1/belege_sogehts.md
export const sogehts = {
  de: {
    metaTitel: 'Anleitung: So geht’s mit der App | Tarot Cup',
    metaBeschreibung: 'Die Anleitung erklärt Tarot Cup in neun kurzen Kapiteln: erster Start, Tageskarte, Tarot legen, Kaffeesatz selbst lesen, Lexikon, Verlauf und mehr.',
    titel: 'So geht’s',
    vorspann: 'Neun kurze Kapitel mit Bildschirmfotos, vom ersten Start bis zum Wechsel der Sprache. Knöpfe und Bildschirme heißen hier so wie in der App.',
    ogTitel: 'So geht’s: Tarot Cup',
    brotkrume: 'So geht’s',
    inhaltTitel: 'Kapitel',
    kapitel: [
      {
        kennung: 'erster-start',
        titel: 'Was passiert beim ersten Start?',
        absaetze: [
          'Beim ersten Öffnen wählst du die Sprache und tippst nach „Willkommen“ auf „Weiter“. Im Schritt „Bevor es losgeht“ bestätigst du, dass du mindestens 16 Jahre alt bist, und nimmst mit „Annehmen und weiter“ die Nutzungsbedingungen an. Eine kurze Einführung stellt Tageskarte, Kaffeesatz, Tarot und Lexikon vor, mit „Überspringen“ kannst du sie auslassen. Zum Schluss fragt die App, ob sie dich morgens an deine Tageskarte erinnern soll.',
        ],
        foto: '01_erster_start',
        alt: 'Der Schritt „Bevor es losgeht“ mit angehaktem Kästchen zum Alter, den Links zu Datenschutzerklärung und Nutzungsbedingungen und dem Knopf „Annehmen und weiter“.',
      },
      {
        kennung: 'tageskarte',
        titel: 'Wie bekomme ich meine Tageskarte?',
        absaetze: [
          'Ganz oben auf der Startseite liegt deine Tageskarte verdeckt. Tippst du sie an, deckt sie sich auf; darunter stehen ihre Kurzbedeutung und „Mehr lesen“ für die ganze Deutung. Den ganzen Tag bleibt es dieselbe Karte, auch wenn du die App neu öffnest, und ab Mitternacht wartet eine neue verdeckte Karte. Jede Tageskarte steht auch im Verlauf.',
        ],
        foto: '02_tageskarte',
        alt: 'Die Startseite mit einer aufgedeckten Tageskarte, ihrer Kurzbedeutung und „Mehr lesen“, darunter die Kacheln „Tarot legen“ und „Kaffeesatz lesen“.',
      },
      {
        kennung: 'tarot-legen',
        titel: 'Wie lege ich Tarotkarten?',
        absaetze: [
          'Über „Tarot legen“ wählst du „Ja oder Nein“, „Drei Karten“ oder „Liebe“ und denkst still an deine Frage. Du mischst, indem du über den Stapel wischst, wählst nach „Fertig gemischt“ deine Karten im Fächer und deckst sie nach „Karten umdrehen“ einzeln auf. „Zur Gesamtdeutung“ zeigt, was sie zusammen erzählen. Danach ruht die Legung: Ja oder Nein ist am nächsten Tag wieder frei, Drei Karten nach drei Tagen, Liebe nach einer Woche, jeweils ab Mitternacht.',
        ],
        foto: '03_tarot',
        alt: 'Die Legung Drei Karten mit drei aufgedeckten Karten unter Vergangenheit, Gegenwart und Zukunft und dem Knopf „Zur Gesamtdeutung“.',
      },
      {
        kennung: 'kaffeesatz',
        titel: 'Wie lese ich den Kaffeesatz selbst?',
        absaetze: [
          'Hast du deinen Mokka getrunken, tippst du auf „Kaffeesatz lesen“ und wählst einen Lebensbereich. Unter „Zeichen wählen“ suchst du bis zu acht der 80 Zeichen und setzt jedes auf der Tassenkarte an seine Stelle: Rand, Mitte, Boden oder Untertasse. Ab drei Zeichen gibt es die volle Deutung, alle drei Tage; ein oder zwei Zeichen ergeben eine Kurzform, bis zu dreimal am Tag. Wie man die Tasse nach alter Sitte vorbereitet, steht im [Ratgeber Kaffeesatz](/kaffeesatz-lesen/).',
        ],
        foto: '04_kaffeesatz',
        alt: 'Die Tassenkarte „Wo liegt welches Zeichen?“: die Tasse von oben mit dem Henkel rechts, darauf mehrere gesetzte Zeichen, darunter der Knopf „Deutung ansehen“.',
      },
      {
        kennung: 'lexikon',
        titel: 'Wie finde ich eine Karte oder ein Zeichen im Lexikon?',
        absaetze: [
          'Im Reiter „Lexikon“ wechselst du oben zwischen „Tarot“ und „Kaffeesatz“. Die 78 Karten filterst du nach „Große Arkana“ und den vier Farben, die 80 Zeichen findest du über die Suche oder die Kategorien. Jeder Eintrag erklärt die Bedeutung: bei Karten aufrecht und umgekehrt, bei Zeichen auch, woran du sie in der Tasse erkennst. Das Lexikon ist immer frei und braucht kein Internet.',
        ],
        foto: '05_lexikon',
        alt: 'Das Lexikon im Teil „Kaffeesatz“ mit Suchfeld, Kategorien und einer Liste von Zeichen mit Linienform und Kurzbedeutung.',
      },
      {
        kennung: 'verlauf',
        titel: 'Wo finde ich frühere Deutungen und Notizen?',
        absaetze: [
          'Jede Legung landet von selbst im Reiter „Verlauf“, die neueste oben, mit Datum und Art. Tippst du einen Eintrag an, öffnet sich die ganze Deutung; im Feld „Deine Notiz“ hältst du fest, was daraus geworden ist, und die App speichert es sofort. Mit „Eintrag löschen“ entfernst du einen Eintrag nach einer Rückfrage endgültig aus der App. Verlauf und Notizen speichert die App auf deinem Handy.',
        ],
        foto: '06_verlauf',
        alt: 'Ein geöffneter Eintrag aus dem Verlauf mit der Deutung, dem ausgefüllten Feld „Deine Notiz“ und den Knöpfen zum Teilen und Löschen.',
      },
      {
        kennung: 'erinnerung',
        titel: 'Wie stelle ich die Erinnerung an die Tageskarte ein?',
        absaetze: [
          'Unter „Einstellungen“ schaltest du „Erinnerung an die Tageskarte“ ein und stellst darunter die „Uhrzeit“ in Stunden und Fünf-Minuten-Schritten ein. Fragt Android, ob die App Benachrichtigungen senden darf, erlaubst du es; ohne Erlaubnis bleibt der Schalter aus. Die Erinnerung kommt jeden Tag ungefähr zur gewählten Zeit und verrät die Karte nicht.',
        ],
        foto: '07_erinnerung',
        alt: 'Die Einstellungen mit eingeschalteter „Erinnerung an die Tageskarte“ und der Uhrzeit, die sich mit Minus und Plus einstellen lässt.',
      },
      {
        kennung: 'teilen',
        titel: 'Wie teile ich eine Deutung?',
        absaetze: [
          'Unter einer Deutung steht „Als Bild teilen“, auch bei Einträgen im Verlauf. Die App macht daraus ein Bild mit der Legung, dem Datum, den Namen der Karten oder Zeichen, einem kurzen Satz aus der Deutung und dem Namen „Tarot Cup“. Deine Frage steht nicht darauf, die App kennt sie nicht. Wohin das Bild geht, wählst du im Teilen-Menü von Android.',
        ],
        foto: '08_teilen',
        alt: 'Das Teilen-Bild auf dunklem Grund: oben Legung und Datum, in der Mitte die Namen der Karten und ein Satz in Anführungszeichen, unten „Tarot Cup“.',
      },
      {
        kennung: 'sprache',
        titel: 'Wie wechsle ich die Sprache?',
        absaetze: [
          'Ganz oben in den „Einstellungen“ wählst du unter „Sprache“ zwischen „Deutsch“ und „Türkçe“. Die App wechselt sofort, unabhängig von der Sprache deines Handys. Auch frühere Deutungen im Verlauf, das Lexikon, die Rechtstexte und die Erinnerung erscheinen dann in der neuen Sprache; deine Notizen bleiben, wie du sie geschrieben hast.',
        ],
        foto: '09_sprache',
        alt: 'Der obere Teil der Einstellungen mit dem Abschnitt „Sprache“ und den Knöpfen „Deutsch“ und „Türkçe“.',
      },
    ],
    abschluss: {
      titel: 'Noch Fragen?',
      text: 'Kurze Antworten, etwa ob die App Internet braucht oder warum eine Legung gerade ruht, findest du unter [Häufige Fragen](/fragen/).',
    },
  },
  tr: {
    metaTitel: 'Nasıl kullanılır: uygulama rehberi | Tarot Cup',
    metaBeschreibung: 'Tarot Cup’ı dokuz kısa bölümde tanı: ilk açılış, günün kartı, tarot açmak, kahve falına kendin bakmak, sözlük, geçmiş, hatırlatma ve dil.',
    titel: 'Nasıl kullanılır?',
    vorspann: 'İlk açılıştan dil değiştirmeye kadar dokuz kısa bölüm, her birinde uygulamadan bir ekran görüntüsü. Düğmelerin ve ekranların adları burada da uygulamadaki gibi.',
    ogTitel: 'Tarot Cup nasıl kullanılır?',
    brotkrume: 'Nasıl kullanılır',
    inhaltTitel: 'Bölümler',
    kapitel: [
      {
        kennung: 'ilk-acilis',
        titel: 'Uygulamayı ilk açtığında neler olur?',
        absaetze: [
          'İlk açılışta önce dilini seçersin, “Hoş geldin” ekranında da “Devam” dersin. “Başlamadan önce” adımında kutucuğu işaretleyip en az 16 yaşında olduğunu onaylarsın; “Kabul et ve devam et” düğmesi ancak o zaman çalışır ve onunla Kullanım Koşulları’nı kabul etmiş olursun. Sonra kısa bir tanıtım günün kartını, kahve falını, tarotu ve sözlüğü gösterir, istersen “Geç” diyebilirsin. En sonda uygulama, günün kartını sana sabahları hatırlatıp hatırlatmayacağını sorar.',
        ],
        foto: '01_erster_start',
        alt: '“Başlamadan önce” adımı: işaretlenmiş yaş kutucuğu, Gizlilik Politikası ve Kullanım Koşulları bağlantıları ve “Kabul et ve devam et” düğmesi.',
      },
      {
        kennung: 'gunun-karti',
        titel: 'Günün kartı nasıl açılır?',
        absaetze: [
          'Ana sayfanın en üstünde günün kartın kapalı olarak durur. Üzerine dokununca açılır; altında kısa anlamı ve yorumun tamamı için “Devamını oku” çıkar. Gün boyunca uygulamayı kaç kez açarsan aç aynı kartı görürsün, gece yarısından sonra ise seni yeni ve kapalı bir kart bekler. Açtığın her kart Geçmiş’e de kaydedilir.',
        ],
        foto: '02_tageskarte',
        alt: 'Ana sayfa: açılmış bir günün kartı, kısa anlamı ve “Devamını oku”, altında “Tarot aç” ile “Kahve falına bak” kutuları.',
      },
      {
        kennung: 'tarot-acmak',
        titel: 'Tarot falı nasıl açılır?',
        absaetze: [
          '“Tarot aç” ile “Evet mi, Hayır mı”, “Üç Kart” ya da “Aşk” açılımını seçer, niyetini içinden tutarsın; uygulama niyetini sormaz. Parmağını destenin üzerinde kaydırarak kartları karıştırır, “Karıştırdım” dedikten sonra yelpazeden kartlarını seçersin. “Kartları çevir” dedikten sonra kartlara sırayla dokunup açarsın, “Genel yoruma geç” ise hepsini birlikte yorumlar. Ardından açılım bir süre dinlenir: Evet mi, Hayır mı her gün, Üç Kart üç günde bir, Aşk haftada bir, hep gece yarısından itibaren yeniden açılır.',
        ],
        foto: '03_tarot',
        alt: 'Üç Kart açılımı: Geçmiş, Şimdi ve Gelecek altında açılmış üç kart ve “Genel yoruma geç” düğmesi.',
      },
      {
        kennung: 'kahve-fali',
        titel: 'Kahve falına kendin nasıl bakarsın?',
        absaetze: [
          'Kahveni içtikten sonra “Kahve falına bak” kutusuna dokunur, bir hayat alanı seçersin. “İşaret seç” ile 80 işaret arasından en fazla sekiz tanesini bulur, fincan haritasında her birini durduğu yere koyarsın: ağız, orta, dip ya da tabak. Üç ve daha fazla işaretle tam yorum üç günde bir açılır; bir ya da iki işaretle günde en fazla üç kez kısa yorum alırsın. Fincanı geleneğe göre nasıl hazırlayacağını [Kahve falı rehberi](/tr/kahve-fali/) sayfasında bulursun.',
        ],
        foto: '04_kaffeesatz',
        alt: '“Hangi işaret nerede?” ekranı: kulbu sağda, yukarıdan görülen fincan, üzerine yerleştirilmiş birkaç işaret ve altta “Yorumu gör” düğmesi.',
      },
      {
        kennung: 'sozluk',
        titel: 'Sözlükte bir kartı ya da işareti nasıl bulursun?',
        absaetze: [
          '“Sözlük” sekmesinde üstteki “Tarot” ile “Kahve falı” arasında geçiş yaparsın. 78 kartı “Büyük Arkana” ile dört takıma göre süzebilir, 80 işareti arama kutusuyla ya da kategorilerden bulabilirsin. Her kayıt anlamını anlatır: kartlarda düz ve ters hâliyle, işaretlerde ayrıca fincanda nasıl tanınacağıyla. Sözlük her zaman açıktır ve internete ihtiyaç duymaz.',
        ],
        foto: '05_lexikon',
        alt: 'Sözlüğün “Kahve falı” bölümü: arama kutusu, kategoriler ve çizgi şekli ile kısa anlamı yazılı işaretlerin listesi.',
      },
      {
        kennung: 'gecmis',
        titel: 'Eski fallarını ve notlarını nerede bulursun?',
        absaetze: [
          'Baktığın her fal kendiliğinden “Geçmiş” sekmesine kaydedilir; en yenisi en üstte, tarihi ve türüyle. Bir kayda dokununca yorumun tamamı açılır; “Notun” alanına sonradan neler olduğunu yazabilirsin, uygulama bunu hemen saklar. “Kaydı sil” bir kaydı, sen onaylayınca uygulamadan geri dönüşü olmadan siler. Geçmişini ve notlarını uygulama telefonunda saklar.',
        ],
        foto: '06_verlauf',
        alt: 'Geçmiş’ten açılmış bir kayıt: yorum, doldurulmuş “Notun” alanı ve paylaşma ile silme düğmeleri.',
      },
      {
        kennung: 'hatirlatici',
        titel: 'Günün kartı hatırlatması nasıl kurulur?',
        absaetze: [
          '“Ayarlar” sayfasında “Günün kartı hatırlatması” anahtarını açar, hemen altındaki “Saat” satırında saati ve beşer dakikalık adımlarla dakikayı ayarlarsın. Android bildirim izni isterse izin ver; izin olmadan anahtar kapalı kalır. Hatırlatma her gün seçtiğin saate yakın bir zamanda gelir ve kartın ne olduğunu söylemez.',
        ],
        foto: '07_erinnerung',
        alt: '“Ayarlar” sayfası: açık “Günün kartı hatırlatması” anahtarı ve eksi ile artı düğmeleriyle ayarlanan saat.',
      },
      {
        kennung: 'paylasma',
        titel: 'Falını nasıl paylaşırsın?',
        absaetze: [
          'Yorumun altında “Görsel olarak paylaş” düğmesi bulunur, Geçmiş’teki kayıtlarda da. Uygulama bundan bir görsel hazırlar: açılımın adı, tarih, kartların ya da işaretlerin adları, yorumdan kısa bir cümle ve “Tarot Cup” yazısı. Niyetin görselde yer almaz, çünkü uygulama onu bilmez. Görseli nereye göndereceğini Android’in paylaşım menüsünden seçersin.',
        ],
        foto: '08_teilen',
        alt: 'Koyu zeminli paylaşım görseli: üstte açılımın adı ve tarih, ortada kart adları ve tırnak içinde bir cümle, altta “Tarot Cup”.',
      },
      {
        kennung: 'dil',
        titel: 'Uygulamanın dili nasıl değiştirilir?',
        absaetze: [
          '“Ayarlar” sayfasının en üstündeki “Dil” bölümünde “Deutsch” ile “Türkçe” arasında seçim yaparsın. Uygulama, telefonun hangi dilde olursa olsun, hemen seçtiğin dile geçer. Geçmiş’teki eski yorumlar, sözlük, hukuki metinler ve hatırlatma da yeni dilde görünür; notların ise yazdığın gibi kalır.',
        ],
        foto: '09_sprache',
        alt: '“Ayarlar” sayfasının üst kısmı: “Dil” bölümü ve “Deutsch” ile “Türkçe” düğmeleri.',
      },
    ],
    abschluss: {
      titel: 'Aklına takılan başka bir şey mi var?',
      text: 'İnternet gerekip gerekmediği ya da bir açılımın neden dinlendiği gibi soruların kısa cevaplarını [Sık sorulan sorular](/tr/sorular/) sayfasında bulabilirsin.',
    },
  },
};
