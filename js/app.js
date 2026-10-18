/* ============================================================
   LingoPulse — Application principale
   Flashcards chinois (depuis le français ou l'anglais)
   Données et progression stockées localement (LocalStorage)
   ============================================================ */

(function () {
  'use strict';

  // ============ CONSTANTES ============
  const STORAGE_KEY = 'lingopulse_stats';
  const MS_PER_DAY = 24 * 60 * 60 * 1000;
  const TOAST_DURATION_MS = 2200;
  const SPEECH_RATE = 0.85;

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

  // ============ ÉTAT ============
  let currentLang = 'fr';
  let currentCardIndex = 0;
  let toastTimer = null;

  function defaultStats() {
    return {
      streak: 1,
      cards: 0,
      known: 0,
      total: 0,
      lastDate: new Date().toDateString()
    };
  }

  function loadStats() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return defaultStats();
      const parsed = JSON.parse(raw);
      // Fusion avec les valeurs par défaut pour tolérer un schéma obsolète
      return Object.assign(defaultStats(), parsed);
    } catch (err) {
      console.warn('LingoPulse : stats illisibles, réinitialisation.', err);
      return defaultStats();
    }
  }

  function saveStats() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
    } catch (err) {
      console.warn('LingoPulse : impossible de sauvegarder les stats.', err);
    }
  }

  const stats = loadStats();

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
    flashcard: document.getElementById('flashcard'),
    wordFront: document.getElementById('wordFront'),
    phonetic: document.getElementById('phonetic'),
    wordBack: document.getElementById('wordBack'),
    example: document.getElementById('example'),
    cardLang: document.getElementById('cardLang'),
    audioBtn: document.getElementById('audioBtn'),
    btnKnow: document.getElementById('btnKnow'),
    btnReview: document.getElementById('btnReview'),
    streakValue: document.getElementById('streakValue'),
    cardsValue: document.getElementById('cardsValue'),
    successValue: document.getElementById('successValue'),
    toast: document.getElementById('toast'),
    toastIcon: document.getElementById('toastIcon'),
    toastMsg: document.getElementById('toastMsg'),
    langButtons: Array.from(document.querySelectorAll('.lang-btn'))
  };

  // ============ SÉLECTIONNEURS ============
  function currentDeck() {
    return vocab[currentLang];
  }

  function currentCard() {
    return currentDeck().cards[currentCardIndex];
  }

  // ============ AFFICHAGE ============
  function renderCard() {
    const data = currentDeck();
    const card = currentCard();
    el.wordFront.textContent = card.word;
    el.phonetic.textContent = `${card.translation} · ${card.pinyin}`;
    el.wordBack.textContent = card.translation;
    el.example.textContent = card.example;
    el.cardLang.textContent = `${data.flag} ${data.name}`;
    el.flashcard.classList.remove('flipped');
  }

  function nextCard() {
    currentCardIndex = (currentCardIndex + 1) % currentDeck().cards.length;
    renderCard();
  }

  function updateStatsUI() {
    el.streakValue.textContent = stats.streak;
    el.cardsValue.textContent = stats.cards;
    const success = stats.total > 0 ? Math.round((stats.known / stats.total) * 100) : 0;
    el.successValue.textContent = success + '%';
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
    // Prononce le mot en chinois (langue cible)
    const utter = new SpeechSynthesisUtterance(card.translation);
    utter.lang = currentDeck().tts; // zh-CN
    utter.rate = SPEECH_RATE;
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
    saveStats();
    updateStatsUI();
    nextCard();
  }

  function selectLanguage(lang) {
    currentLang = lang;
    currentCardIndex = 0;
    el.langButtons.forEach((b) =>
      b.classList.toggle('active', b.dataset.lang === lang)
    );
    renderCard();
  }

  // ============ ÉVÉNEMENTS ============
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

  el.langButtons.forEach((btn) => {
    btn.addEventListener('click', () => selectLanguage(btn.dataset.lang));
  });

  // Révélation au défilement
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal').forEach((node) => observer.observe(node));

  // ============ INITIALISATION ============
  refreshStreak();
  renderCard();
  updateStatsUI();
})();
