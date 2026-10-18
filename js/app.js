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

  // ============ DONNÉES VOCABULAIRE (langue source -> chinois) ============
  const vocab = {
    fr: {
      flag: '🇫🇷', name: 'Français → Chinois', tts: 'zh-CN',
      cards: [
        { word: 'le défi', pinyin: 'tiǎo zhàn', translation: '挑战', example: '「接受挑战」— Accepter le défi' },
        { word: 'l\'aventure', pinyin: 'mào xiǎn', translation: '冒险', example: '「一次伟大的冒险」— Une grande aventure' },
        { word: 'le cœur', pinyin: 'xīn', translation: '心', example: '「全心全意」— De tout cœur' },
        { word: 'la bibliothèque', pinyin: 'tú shū guǎn', translation: '图书馆', example: '「我去图书馆」— Je vais à la bibliothèque' },
        { word: 'développer', pinyin: 'kāi fā', translation: '开发', example: '「开发技能」— Développer des compétences' }
      ]
    },
    en: {
      flag: '🇬🇧', name: 'Anglais → Chinois', tts: 'zh-CN',
      cards: [
        { word: 'serendipity', pinyin: 'qì yù', translation: '奇遇', example: '「美好的奇遇」— A fortunate serendipity' },
        { word: 'to thrive', pinyin: 'fāng xīng', translation: '方兴', example: '「在困难时期蓬勃发展」— To thrive in difficult times' },
        { word: 'resilience', pinyin: 'jīn lì', translation: '筋力', example: '「展现你的韧性」— Show your resilience' },
        { word: 'to wander', pinyin: 'màn yóu', translation: '漫游', example: '「在城市中漫游」— To wander through the city' },
        { word: 'mindful', pinyin: 'liú yì', translation: '留意', example: '「留意他人」— Be mindful of others' }
      ]
    }
  };

  const VIEW_TITLES = {
    study: 'Étudier',
    stats: 'Progression',
    decks: 'Decks',
    settings: 'Réglages'
  };

  // ============ ÉTAT ============
  let currentLang = 'fr';
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

  function currentCard() {
    return currentDeck().cards[currentCardIndex];
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
    const card = currentCard();
    el.wordFront.textContent = card.word;
    el.phonetic.textContent = card.pinyin;
    el.wordBack.textContent = card.translation;
    el.example.textContent = card.example;
    el.cardLang.textContent = `${data.flag} Mot à traduire`;
    el.flashcard.classList.remove('flipped');
    el.cardCounter.textContent = `Carte ${currentCardIndex + 1} / ${data.cards.length}`;
    el.progressFill.style.width =
      ((currentCardIndex + 1) / data.cards.length * 100) + '%';
  }

  function nextCard() {
    const len = currentDeck().cards.length;
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
    const len = currentDeck().cards.length;
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
    el.deckPreview.innerHTML = currentDeck().cards.map((c) =>
      `<li><span class="dp-word">${c.word}</span><span class="dp-zh">${c.translation}</span></li>`
    ).join('');
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
    el.deckSelect.value = lang;
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
      return `<div class="deck-card">
        <div class="deck-flag">${vocab[key].flag}</div>
        <h3>${vocab[key].name}</h3>
        <div class="deck-meta">
          <span>${vocab[key].cards.length} cartes</span>
          <span>${pct}% maîtrise</span>
        </div>
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
  renderCard();
  renderDeckPreview();
  updateStatsUI();
  updateSessionUI();
})();
