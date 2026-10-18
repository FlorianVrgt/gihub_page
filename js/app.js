/* ============================================================
   LingoPulse — Application principale (design webapp)
   Flashcards chinois (depuis le français ou l'anglais)
   Navigation par vues, préférences et progression en LocalStorage
   ============================================================ */

(function () {
  'use strict';

  // ============ CONSTANTES ============
  const STORAGE_KEY = 'lingopulse_stats';
  const PREFS_KEY = 'lingopulse_prefs';
  const MS_PER_DAY = 24 * 60 * 60 * 1000;
  const TOAST_DURATION_MS = 2200;
  const DEFAULT_RATE = 0.85;

  // ============ DONNÉES VOCABULAIRE (deck -> chinois) ============
  // Chaque carte : mot de la langue source, pinyin, sinogrammes, exemple traduit,
  // et niveau HSK (officiellement 1 à 6 ; ici seuls HSK 1 et 2 sont publiés).
  const vocab = {
    fr: {
      flag: '🇫🇷', name: 'Français → Chinois', tts: 'zh-CN',
      desc: 'Le vocabulaire essentiel du quotidien (HSK 1 et 2).',
      cards: [
        // — HSK 1 : survie & quotidien
        { word: "bonjour", pinyin: "nǐ hǎo", translation: "你好", level: 1, example: "「你好，很高兴认识你！」— Bonjour, enchanté !" },
        { word: "merci", pinyin: "xiè xie", translation: "谢谢", level: 1, example: "「非常感谢你的帮助。」— Merci beaucoup pour ton aide." },
        { word: "au revoir", pinyin: "zài jiàn", translation: "再见", level: 1, example: "「明天见，再见！」— À demain, au revoir !" },
        { word: "s'il vous plaît", pinyin: "qǐng", translation: "请", level: 1, example: "「请进。」— Entrez, je vous en prie." },
        { word: "l'eau", pinyin: "shuǐ", translation: "水", level: 1, example: "「我想喝水。」— Je voudrais boire de l'eau." },
        { word: "le thé", pinyin: "chá", translation: "茶", level: 1, example: "「你喜欢喝茶还是咖啡？」— Tu préfères le thé ou le café ?" },
        { word: "le café", pinyin: "kā fēi", translation: "咖啡", level: 1, example: "「他喜欢喝咖啡。」— Il aime boire du café." },
        { word: "le riz", pinyin: "mǐ fàn", translation: "米饭", level: 1, example: "「我们每天吃米饭。」— Nous mangeons du riz tous les jours." },
        { word: "manger", pinyin: "chī", translation: "吃", level: 1, example: "「我吃面条。」— Je mange des nouilles." },
        { word: "boire", pinyin: "hē", translation: "喝", level: 1, example: "「他喜欢喝咖啡。」— Il aime boire du café." },
        { word: "parler", pinyin: "shuō", translation: "说", level: 1, example: "「你会说法语吗？」— Sais-tu parler français ?" },
        { word: "apprendre", pinyin: "xué xí", translation: "学习", level: 1, example: "「我在学习中文。」— J'apprends le chinois." },
        { word: "aimer", pinyin: "xǐ huān", translation: "喜欢", level: 1, example: "「我喜欢看电影。」— J'aime regarder des films." },
        { word: "voir", pinyin: "kàn", translation: "看", level: 1, example: "「我喜欢看电影。」— J'aime regarder des films." },
        { word: "ami · amie", pinyin: "péng you", translation: "朋友", level: 1, example: "「他是我的好朋友。」— C'est mon meilleur ami." },
        { word: "la maison", pinyin: "fáng zi", translation: "房子", level: 1, example: "「我的房子很小。」— Ma maison est petite." },
        { word: "aujourd'hui", pinyin: "jīn tiān", translation: "今天", level: 1, example: "「今天是星期一。」— Nous sommes lundi." },
        { word: "demain", pinyin: "míng tiān", translation: "明天", level: 1, example: "「明天见！」— À demain !" },
        { word: "maintenant", pinyin: "xiàn zài", translation: "现在", level: 1, example: "「现在几点了？」— Quelle heure est-il ?" },
        { word: "le père", pinyin: "bà ba", translation: "爸爸", level: 1, example: "「我爸爸是老师。」— Mon père est professeur." },
        { word: "la mère", pinyin: "mā ma", translation: "妈妈", level: 1, example: "「我妈妈在做饭。」— Ma mère cuisine." },
        { word: "l'école", pinyin: "xué xiào", translation: "学校", level: 1, example: "「孩子们去学校。」— Les enfants vont à l'école." },
        // — HSK 2 : éléments de base complémentaires
        { word: "comprendre", pinyin: "míng bái", translation: "明白", level: 2, example: "「我不明白你的意思。」— Je ne comprends pas ce que tu veux dire." },
        { word: "travailler", pinyin: "gōng zuò", translation: "工作", level: 2, example: "「她在北京工作。」— Elle travaille à Pékin." },
        { word: "voyager", pinyin: "lǚ xíng", translation: "旅行", level: 2, example: "「我想去日本旅行。」— Je veux voyager au Japon." },
        { word: "la famille", pinyin: "jiā tíng", translation: "家庭", level: 2, example: "「我的家庭很大。」— Ma famille est nombreuse." },
        { word: "le temps · la météo", pinyin: "tiān qì", translation: "天气", level: 2, example: "「今天天气很好。」— Il fait beau aujourd'hui." },
        { word: "l'argent", pinyin: "qián", translation: "钱", level: 2, example: "「我没有带钱。」— Je n'ai pas d'argent sur moi." },
        { word: "le téléphone", pinyin: "diàn huà", translation: "电话", level: 2, example: "「我给你打电话。」— Je t'appelle au téléphone." },
        { word: "facile", pinyin: "róng yì", translation: "容易", level: 2, example: "「这个问题很容易。」— Cette question est facile." },
        { word: "difficile", pinyin: "kùn nán", translation: "困难", level: 2, example: "「学中文不容易。」— Apprendre le chinois est difficile." },
        { word: "important", pinyin: "zhòng yào", translation: "重要", level: 2, example: "「健康很重要。」— La santé est importante." },
        { word: "la gare", pinyin: "huǒ chē zhàn", translation: "火车站", level: 2, example: "「火车站在哪里？」— Où est la gare ?" },
        { word: "l'aéroport", pinyin: "jī chǎng", translation: "机场", level: 2, example: "「我们去机场。」— Nous allons à l'aéroport." },
        { word: "le restaurant", pinyin: "cān tīng", translation: "餐厅", level: 2, example: "「这家餐厅很有名。」— Ce restaurant est célèbre." },
        { word: "le cinéma", pinyin: "diàn yǐng yuàn", translation: "电影院", level: 2, example: "「我们去看电影吧。」— Allons au cinéma." },
        { word: "la bibliothèque", pinyin: "tú shū guǎn", translation: "图书馆", level: 2, example: "「我去图书馆借书。」— Je vais emprunter un livre à la bibliothèque." },
        { word: "le lit", pinyin: "chuáng", translation: "床", level: 2, example: "「我的床很舒服。」— Mon lit est confortable." },
        { word: "la couleur", pinyin: "yán sè", translation: "颜色", level: 2, example: "「你最喜欢什么颜色？」— Quelle est ta couleur préférée ?" },
        { word: "le sport", pinyin: "yùn dòng", translation: "运动", level: 2, example: "「我每天做运动。」— Je fais du sport tous les jours." },
        { word: "la rue", pinyin: "jiē", translation: "街", level: 2, example: "「这条街很热闹。」— Cette rue est animée." },
        { word: "le vélo", pinyin: "zì xíng chē", translation: "自行车", level: 2, example: "「我骑自行车上班。」— Je vais au travail à vélo." }
      ]
    },
    en: {
      flag: '🇬🇧', name: 'Anglais → Chinois', tts: 'zh-CN',
      desc: 'Daily essentials, HSK levels 1 and 2.',
      cards: [
        // — HSK 1 : survival & daily life
        { word: "hello", pinyin: "nǐ hǎo", translation: "你好", level: 1, example: "「你好，很高兴认识你！」— Hello, nice to meet you!" },
        { word: "thank you", pinyin: "xiè xie", translation: "谢谢", level: 1, example: "「非常感谢你的帮助。」— Thank you very much for your help." },
        { word: "goodbye", pinyin: "zài jiàn", translation: "再见", level: 1, example: "「明天见！」— See you tomorrow!" },
        { word: "please", pinyin: "qǐng", translation: "请", level: 1, example: "「请进。」— Please, come in." },
        { word: "water", pinyin: "shuǐ", translation: "水", level: 1, example: "「我想喝水。」— I would like some water." },
        { word: "tea", pinyin: "chá", translation: "茶", level: 1, example: "「你喜欢喝茶还是咖啡？」— Do you prefer tea or coffee?" },
        { word: "rice", pinyin: "mǐ fàn", translation: "米饭", level: 1, example: "「我们每天吃米饭。」— We eat rice every day." },
        { word: "to eat", pinyin: "chī", translation: "吃", level: 1, example: "「我吃面条。」— I eat noodles." },
        { word: "to drink", pinyin: "hē", translation: "喝", level: 1, example: "「他喜欢喝咖啡。」— He likes to drink coffee." },
        { word: "to speak", pinyin: "shuō", translation: "说", level: 1, example: "「你会说法语吗？」— Can you speak French?" },
        { word: "to learn", pinyin: "xué xí", translation: "学习", level: 1, example: "「我在学习中文。」— I am learning Chinese." },
        { word: "to like", pinyin: "xǐ huān", translation: "喜欢", level: 1, example: "「我喜欢看电影。」— I like watching movies." },
        { word: "friend", pinyin: "péng you", translation: "朋友", level: 1, example: "「他是我的好朋友。」— He is my best friend." },
        { word: "house", pinyin: "fáng zi", translation: "房子", level: 1, example: "「我的房子很小。」— My house is small." },
        { word: "today", pinyin: "jīn tiān", translation: "今天", level: 1, example: "「今天是星期一。」— Today is Monday." },
        { word: "tomorrow", pinyin: "míng tiān", translation: "明天", level: 1, example: "「明天见！」— See you tomorrow!" },
        { word: "now", pinyin: "xiàn zài", translation: "现在", level: 1, example: "「现在几点了？」— What time is it now?" },
        { word: "father", pinyin: "bà ba", translation: "爸爸", level: 1, example: "「我爸爸是老师。」— My father is a teacher." },
        { word: "mother", pinyin: "mā ma", translation: "妈妈", level: 1, example: "「我妈妈在做饭。」— My mother is cooking." },
        { word: "school", pinyin: "xué xiào", translation: "学校", level: 1, example: "「孩子们去学校。」— The children go to school." },
        // — HSK 2 : elementary building blocks
        { word: "to understand", pinyin: "míng bái", translation: "明白", level: 2, example: "「我不明白你的意思。」— I don't understand what you mean." },
        { word: "to work", pinyin: "gōng zuò", translation: "工作", level: 2, example: "「她在北京工作。」— She works in Beijing." },
        { word: "travel", pinyin: "lǚ xíng", translation: "旅行", level: 2, example: "「我想去日本旅行。」— I want to travel to Japan." },
        { word: "family", pinyin: "jiā tíng", translation: "家庭", level: 2, example: "「我的家庭很大。」— My family is big." },
        { word: "weather", pinyin: "tiān qì", translation: "天气", level: 2, example: "「今天天气很好。」— The weather is nice today." },
        { word: "money", pinyin: "qián", translation: "钱", level: 2, example: "「我没有带钱。」— I have no money with me." },
        { word: "telephone", pinyin: "diàn huà", translation: "电话", level: 2, example: "「我给你打电话。」— I'll call you on the phone." },
        { word: "easy", pinyin: "róng yì", translation: "容易", level: 2, example: "「这个问题很容易。」— This question is easy." },
        { word: "difficult", pinyin: "kùn nán", translation: "困难", level: 2, example: "「学中文不容易。」— Learning Chinese is not easy." },
        { word: "important", pinyin: "zhòng yào", translation: "重要", level: 2, example: "「健康很重要。」— Health is important." },
        { word: "train station", pinyin: "huǒ chē zhàn", translation: "火车站", level: 2, example: "「火车站在哪里？」— Where is the train station?" },
        { word: "airport", pinyin: "jī chǎng", translation: "机场", level: 2, example: "「我们去机场。」— We are going to the airport." },
        { word: "restaurant", pinyin: "cān tīng", translation: "餐厅", level: 2, example: "「这家餐厅很有名。」— This restaurant is famous." },
        { word: "movie theater", pinyin: "diàn yǐng yuàn", translation: "电影院", level: 2, example: "「我们去看电影吧。」— Let's go to the movies." },
        { word: "library", pinyin: "tú shū guǎn", translation: "图书馆", level: 2, example: "「我去图书馆借书。」— I'm going to borrow a book from the library." },
        { word: "bed", pinyin: "chuáng", translation: "床", level: 2, example: "「我的床很舒服。」— My bed is comfortable." },
        { word: "color", pinyin: "yán sè", translation: "颜色", level: 2, example: "「你最喜欢什么颜色？」— What is your favorite color?" },
        { word: "sports", pinyin: "yùn dòng", translation: "运动", level: 2, example: "「我每天做运动。」— I exercise every day." },
        { word: "street", pinyin: "jiē", translation: "街", level: 2, example: "「这条街很热闹。」— This street is busy." },
        { word: "bicycle", pinyin: "zì xíng chē", translation: "自行车", level: 2, example: "「我骑自行车上班。」— I ride my bike to work." }
      ]
    }
  };

  // Niveaux HSK publiés : seuls HSK 1 et 2 sont disponibles pour le moment.
  // (Les niveaux 3 à 6 pourront être ajoutés plus tard dans les données.)
  const LEVEL_NAMES = {
    1: 'HSK 1 · Débutant',
    2: 'HSK 2 · Élémentaire',
    3: 'HSK 3 · Intermédiaire',
    4: 'HSK 4 · Avancé',
    5: 'HSK 5 · Expert',
    6: 'HSK 6 · Maîtrise'
  };
  const AVAILABLE_LEVELS = [1, 2];

  const VIEW_TITLES = {
    study: 'Étudier',
    stats: 'Progression',
    decks: 'Decks',
    settings: 'Réglages'
  };

  // ============ ÉTAT ============
  let currentLang = 'fr';
  let levelFilter = 0; // 0 = tous les niveaux
  let currentCardIndex = 0;
  let toastTimer = null;
  let session = { seen: 0, known: 0, review: 0 };

  function defaultStats() {
    return {
      streak: 1,
      cards: 0,
      known: 0,
      total: 0,
      lastDate: new Date().toDateString(),
      byDeck: { fr: { total: 0, known: 0 }, en: { total: 0, known: 0 } }
    };
  }

  function defaultPrefs() {
    return { rate: DEFAULT_RATE, shuffle: false, theme: 'light' };
  }

  function loadJSON(key, mergeDefaults) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return mergeDefaults();
      return Object.assign(mergeDefaults(), JSON.parse(raw));
    } catch (err) {
      console.warn('LingoPulse : données illisibles (' + key + '), réinitialisation.', err);
      return mergeDefaults();
    }
  }

  function saveJSON(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.warn('LingoPulse : impossible de sauvegarder (' + key + ').', err);
    }
  }

  const stats = loadJSON(STORAGE_KEY, defaultStats);
  const prefs = loadJSON(PREFS_KEY, defaultPrefs);

  // Tolère un schéma obsolète pour byDeck
  if (!stats.byDeck || typeof stats.byDeck !== 'object') {
    stats.byDeck = { fr: { total: 0, known: 0 }, en: { total: 0, known: 0 } };
  }

  function saveStats() { saveJSON(STORAGE_KEY, stats); }
  function savePrefs() { saveJSON(PREFS_KEY, prefs); }

  // Met à jour la série quotidienne au chargement
  function refreshStreak() {
    const today = new Date().toDateString();
    if (stats.lastDate === today) return;

    const diff = Math.round(
      (new Date(today).getTime() - new Date(stats.lastDate).getTime()) / MS_PER_DAY
    );
    if (diff === 1) {
      stats.streak += 1;
    } else if (diff > 1) {
      stats.streak = 1;
    }
    stats.lastDate = today;
    saveStats();
  }

  // ============ RÉFÉRENCES DOM ============
  const el = {
    sidebar: document.querySelector('.sidebar'),
    menuBtn: document.getElementById('menuBtn'),
    overlay: document.getElementById('overlay'),
    sideItems: Array.from(document.querySelectorAll('.side-item[data-view]')),
    views: Array.from(document.querySelectorAll('.view')),
    viewTitle: document.getElementById('viewTitle'),
    deckSelect: document.getElementById('deckSelect'),
    flashcard: document.getElementById('flashcard'),
    wordFront: document.getElementById('wordFront'),
    phonetic: document.getElementById('phonetic'),
    wordBack: document.getElementById('wordBack'),
    example: document.getElementById('example'),
    cardLang: document.getElementById('cardLang'),
    levelChips: document.getElementById('levelChips'),
    audioBtn: document.getElementById('audioBtn'),
    btnKnow: document.getElementById('btnKnow'),
    btnReview: document.getElementById('btnReview'),
    progressFill: document.getElementById('progressFill'),
    cardCounter: document.getElementById('cardCounter'),
    streakValue: document.getElementById('streakValue'),
    cardsValue: document.getElementById('cardsValue'),
    successValue: document.getElementById('successValue'),
    sideStreak: document.getElementById('sideStreak'),
    sessionSeen: document.getElementById('sessionSeen'),
    sessionKnown: document.getElementById('sessionKnown'),
    sessionReview: document.getElementById('sessionReview'),
    miniKnown: document.getElementById('miniKnown'),
    miniReview: document.getElementById('miniReview'),
    btnResetSession: document.getElementById('btnResetSession'),
    deckPreview: document.getElementById('deckPreview'),
    kpiStreak: document.getElementById('kpiStreak'),
    kpiCards: document.getElementById('kpiCards'),
    kpiSuccess: document.getElementById('kpiSuccess'),
    kpiMastered: document.getElementById('kpiMastered'),
    deckStatsBody: document.getElementById('deckStatsBody'),
    btnResetStats: document.getElementById('btnResetStats'),
    deckCards: document.getElementById('deckCards'),
    rateSlider: document.getElementById('rateSlider'),
    shuffleToggle: document.getElementById('shuffleToggle'),
    darkToggle: document.getElementById('darkToggle'),
    toast: document.getElementById('toast'),
    toastIcon: document.getElementById('toastIcon'),
    toastMsg: document.getElementById('toastMsg')
  };

  // ============ SÉLECTIONNEURS ============
  function currentDeck() {
    return vocab[currentLang];
  }

  // Cartes du deck courant filtrées selon le niveau HSK sélectionné.
  // « Tous » ne montre que les niveaux publiés (HSK 1 et 2 pour le moment).
  function activeCards() {
    const cards = currentDeck().cards;
    if (levelFilter === 0) {
      return cards.filter((c) => AVAILABLE_LEVELS.includes(c.level));
    }
    return cards.filter((c) => c.level === levelFilter);
  }

  function currentCard() {
    return activeCards()[currentCardIndex];
  }

  function successRate() {
    return stats.total > 0 ? Math.round((stats.known / stats.total) * 100) : 0;
  }

  // ============ NAVIGATION PAR VUES ============
  function switchView(view) {
    if (!VIEW_TITLES[view]) view = 'study';
    el.views.forEach((v) => v.classList.toggle('active', v.id === 'view-' + view));
    el.sideItems.forEach((b) => b.classList.toggle('active', b.dataset.view === view));
    el.viewTitle.textContent = VIEW_TITLES[view];
    closeMobileNav();
    if (view === 'stats') renderStatsView();
    if (view === 'decks') renderDecksView();
    window.scrollTo({ top: 0 });
  }

  // Menu mobile
  function openMobileNav() {
    el.sidebar.classList.add('open');
    document.body.classList.add('nav-open');
  }

  function closeMobileNav() {
    el.sidebar.classList.remove('open');
    document.body.classList.remove('nav-open');
  }

  // ============ AFFICHAGE ============
  function renderCard() {
    const data = currentDeck();
    const cards = activeCards();
    if (currentCardIndex >= cards.length) currentCardIndex = 0;
    const card = cards[currentCardIndex];
    el.wordFront.textContent = card.word;
    el.phonetic.textContent = card.pinyin;
    el.wordBack.textContent = card.translation;
    el.example.textContent = card.example;
    el.cardLang.innerHTML = `${data.flag} Mot à traduire` +
      `<span class="card-level lv${card.level}">${LEVEL_NAMES[card.level]}</span>`;
    el.flashcard.classList.remove('flipped');
    el.cardCounter.textContent = `Carte ${currentCardIndex + 1} / ${cards.length}`;
    el.progressFill.style.width = ((currentCardIndex + 1) / cards.length * 100) + '%';
  }

  function nextCard() {
    const len = activeCards().length;
    if (prefs.shuffle && len > 1) {
      let next = currentCardIndex;
      while (next === currentCardIndex) {
        next = Math.floor(Math.random() * len);
      }
      currentCardIndex = next;
    } else {
      currentCardIndex = (currentCardIndex + 1) % len;
    }
    renderCard();
  }

  function prevCard() {
    const len = activeCards().length;
    currentCardIndex = (currentCardIndex - 1 + len) % len;
    renderCard();
  }

  function updateStatsUI() {
    const success = successRate();
    el.streakValue.textContent = stats.streak;
    el.cardsValue.textContent = stats.cards;
    el.successValue.textContent = success + '%';
    el.sideStreak.textContent = stats.streak;
  }

  function updateSessionUI() {
    el.sessionSeen.textContent = session.seen;
    el.sessionKnown.textContent = session.known;
    el.sessionReview.textContent = session.review;
    const total = Math.max(session.seen, 1);
    el.miniKnown.style.width = (session.known / total * 100) + '%';
    el.miniReview.style.width = (session.review / total * 100) + '%';
  }

  function renderDeckPreview() {
    const cards = activeCards();
    // Aperçu : jusqu'à 8 cartes, avec pastille de niveau
    el.deckPreview.innerHTML = cards.slice(0, 8).map((c) =>
      `<li><span class="dp-word">${c.word}</span>` +
      `<span class="dp-right"><span class="dp-zh">${c.translation}</span>` +
      `<span class="card-level lv${c.level}">${c.level}</span></span></li>`
    ).join('') + (cards.length > 8
      ? `<li class="dp-more">… ${cards.length - 8} autres cartes</li>` : '');
  }

  // Puces de filtrage par niveau HSK (vue Étudier) — seuls les niveaux publiés
  // (AVAILABLE_LEVELS, i.e. HSK 1 et 2 pour le moment) sont proposés.
  function renderLevelChips() {
    const published = currentDeck().cards.filter((c) => AVAILABLE_LEVELS.includes(c.level));
    const counts = {};
    published.forEach((c) => {
      counts[c.level] = (counts[c.level] || 0) + 1;
    });
    let html = `<button class="level-chip${levelFilter === 0 ? ' active' : ''}" data-level="0">Tous · ${published.length}</button>`;
    AVAILABLE_LEVELS.forEach((lv) => {
      if (!counts[lv]) return;
      html += `<button class="level-chip lv${lv}${levelFilter === lv ? ' active' : ''}" data-level="${lv}">${LEVEL_NAMES[lv]} · ${counts[lv]}</button>`;
    });
    el.levelChips.innerHTML = html;
  }

  function setLevelFilter(lv) {
    levelFilter = lv;
    currentCardIndex = 0;
    renderLevelChips();
    renderCard();
    renderDeckPreview();
  }

  function showToast(icon, msg) {
    el.toastIcon.textContent = icon;
    el.toastMsg.textContent = msg;
    el.toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.toast.classList.remove('show'), TOAST_DURATION_MS);
  }

  // ============ AUDIO (synthèse vocale du navigateur) ============
  function speak() {
    const card = currentCard();
    if (!('speechSynthesis' in window)) {
      showToast('⚠️', 'Synthèse vocale non supportée');
      return;
    }
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(card.translation);
    utter.lang = currentDeck().tts; // zh-CN
    utter.rate = prefs.rate;
    el.audioBtn.classList.add('playing');
    const stopPulse = () => el.audioBtn.classList.remove('playing');
    utter.onend = stopPulse;
    utter.onerror = stopPulse;
    window.speechSynthesis.speak(utter);
  }

  // ============ LOGIQUE DE RÉVISION ============
  function recordAnswer(known) {
    stats.cards += 1;
    stats.total += 1;
    if (known) stats.known += 1;

    const deck = stats.byDeck[currentLang] ||
      (stats.byDeck[currentLang] = { total: 0, known: 0 });
    deck.total += 1;
    if (known) deck.known += 1;

    session.seen += 1;
    if (known) session.known += 1; else session.review += 1;

    saveStats();
    updateStatsUI();
    updateSessionUI();
    nextCard();
  }

  function selectLanguage(lang) {
    if (!vocab[lang]) return;
    currentLang = lang;
    currentCardIndex = 0;
    levelFilter = 0;
    el.deckSelect.value = lang;
    renderLevelChips();
    renderCard();
    renderDeckPreview();
  }

  // ============ VUES DYNAMIQUES ============
  function renderStatsView() {
    el.kpiStreak.textContent = stats.streak;
    el.kpiCards.textContent = stats.cards;
    el.kpiSuccess.textContent = successRate() + '%';
    el.kpiMastered.textContent = stats.known;

    el.deckStatsBody.innerHTML = Object.keys(vocab).map((key) => {
      const d = stats.byDeck[key] || { total: 0, known: 0 };
      const pct = d.total > 0 ? Math.round(d.known / d.total * 100) : 0;
      return `<tr>
        <td>${vocab[key].flag} ${vocab[key].name}</td>
        <td>${d.total} réponse${d.total > 1 ? 's' : ''}</td>
        <td>
          <span class="mastery-bar"><span class="mastery-fill" style="width:${pct}%"></span></span>
          ${pct}%
        </td>
      </tr>`;
    }).join('');
  }

  function renderDecksView() {
    el.deckCards.innerHTML = Object.keys(vocab).map((key) => {
      const d = stats.byDeck[key] || { total: 0, known: 0 };
      const pct = d.total > 0 ? Math.round(d.known / d.total * 100) : 0;
      // Seules les cartes des niveaux publiés (HSK 1 et 2) sont comptées ;
      // répartition par niveau pour la légende du deck.
      const published = vocab[key].cards.filter((c) => AVAILABLE_LEVELS.includes(c.level));
      const counts = {};
      published.forEach((c) => { counts[c.level] = (counts[c.level] || 0) + 1; });
      const legend = AVAILABLE_LEVELS.filter((lv) => counts[lv]).map((lv) =>
        `<span class="card-level lv${lv}">${LEVEL_NAMES[lv]} · ${counts[lv]}</span>`
      ).join('');
      return `<div class="deck-card">
        <div class="deck-flag">${vocab[key].flag}</div>
        <h3>${vocab[key].name}</h3>
        <p class="deck-desc">${vocab[key].desc}</p>
        <div class="deck-meta">
          <span>${published.length} cartes</span>
          <span>${pct}% maîtrise</span>
        </div>
        <div class="deck-levels">${legend}</div>
        <button class="btn btn-primary" data-start-deck="${key}">Étudier ce deck</button>
      </div>`;
    }).join('');
  }

  // ============ THÈME ============
  function applyTheme() {
    document.documentElement.setAttribute('data-theme', prefs.theme);
    el.darkToggle.checked = prefs.theme === 'dark';
  }

  // ============ ÉVÉNEMENTS ============
  el.sideItems.forEach((btn) => {
    btn.addEventListener('click', () => switchView(btn.dataset.view));
  });

  document.querySelector('.logo').addEventListener('click', (e) => {
    e.preventDefault();
    switchView('study');
  });

  el.menuBtn.addEventListener('click', () => {
    el.sidebar.classList.contains('open') ? closeMobileNav() : openMobileNav();
  });

  el.overlay.addEventListener('click', closeMobileNav);

  el.deckSelect.addEventListener('change', () => selectLanguage(el.deckSelect.value));

  // Délégation : puces de filtre par niveau (vue Étudier)
  el.levelChips.addEventListener('click', (e) => {
    const chip = e.target.closest('[data-level]');
    if (!chip) return;
    setLevelFilter(parseInt(chip.dataset.level, 10) || 0);
  });

  el.flashcard.addEventListener('click', () =>
    el.flashcard.classList.toggle('flipped')
  );

  el.audioBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    speak();
  });

  el.btnKnow.addEventListener('click', () => {
    recordAnswer(true);
    showToast('✅', 'Bien joué !');
  });

  el.btnReview.addEventListener('click', () => {
    recordAnswer(false);
    showToast('🔁', 'On reverra ce mot plus tard');
  });

  el.btnResetSession.addEventListener('click', () => {
    session = { seen: 0, known: 0, review: 0 };
    updateSessionUI();
    showToast('🧹', 'Session réinitialisée');
  });

  el.btnResetStats.addEventListener('click', () => {
    Object.assign(stats, defaultStats());
    saveStats();
    updateStatsUI();
    renderStatsView();
    showToast('🗑️', 'Statistiques réinitialisées');
  });

  // Délégation : boutons "Étudier ce deck" dans la vue Decks
  el.deckCards.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-start-deck]');
    if (!btn) return;
    selectLanguage(btn.dataset.startDeck);
    switchView('study');
  });

  // Raccourcis clavier
  document.addEventListener('keydown', (e) => {
    const active = document.activeElement;
    const tag = active && active.tagName;
    // Ne capture pas les touches dans un champ ; mais si c'est un bouton
    // focusable, on redonne le focus au corps pour éviter le "double clic"
    // déclenché par Espace sur ledit bouton.
    if (tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA') return;
    if (tag === 'BUTTON' || (active && active.getAttribute('role') === 'button')) {
      active.blur();
    }

    const studyActive = document.getElementById('view-study').classList.contains('active');
    if (!studyActive) return;

    if (e.code === 'Space') {
      e.preventDefault();
      if (el.flashcard.classList.contains('flipped')) {
        recordAnswer(true);
        showToast('✅', 'Bien joué !');
      } else {
        el.flashcard.classList.toggle('flipped');
      }
    } else if (e.key === 'r' || e.key === 'R') {
      recordAnswer(false);
      showToast('🔁', 'On reverra ce mot plus tard');
    } else if (e.key === 'ArrowRight') {
      nextCard();
    } else if (e.key === 'ArrowLeft') {
      prevCard();
    }
  });

  // Réglages
  el.rateSlider.value = prefs.rate;
  el.rateSlider.addEventListener('input', () => {
    prefs.rate = parseFloat(el.rateSlider.value) || DEFAULT_RATE;
    savePrefs();
  });

  el.shuffleToggle.checked = !!prefs.shuffle;
  el.shuffleToggle.addEventListener('change', () => {
    prefs.shuffle = el.shuffleToggle.checked;
    savePrefs();
    showToast(prefs.shuffle ? '🔀' : '📋',
      prefs.shuffle ? 'Ordre aléatoire activé' : 'Ordre séquentiel activé');
  });

  el.darkToggle.addEventListener('change', () => {
    prefs.theme = el.darkToggle.checked ? 'dark' : 'light';
    applyTheme();
    savePrefs();
  });

  // ============ INITIALISATION ============
  applyTheme();
  refreshStreak();
  renderLevelChips();
  renderCard();
  renderDeckPreview();
  updateStatsUI();
  updateSessionUI();
})();
