/**
 * The Posh Lab — British Immersion & Shadowing Studio Engine
 * Features:
 * 1. 30-Day Immersion Trail (Primary View): ~2-minute master audios, full scripts,
 *    multi-paragraph breakdowns, Interlinear Sentence & Word-by-Word Translation.
 * 2. Instant Word & Collocation Inspector: Click ANY word (e.g. 'grounding', 'bathed in')
 *    to view instant Portuguese meaning, phonetic IPA, audio, and star to Vault!
 * 3. Expression Vault & Revision: 140+ pre-mapped British expressions,
 *    starring to personal notebook, Spaced Repetition flashcards, active recall.
 * 4. Quick Soundboard (Secondary View): 34 quick cards, soundboard playback,
 *    and instant phonetic drills.
 */

(function () {
  'use strict';

  // =========================================================================
  // 1. Storage Keys & Global State
  // =========================================================================
  const STORAGE_COMPLETED_KEY = 'the_posh_lab_trail_completed_v1';
  const STORAGE_VAULT_STARRED_KEY = 'the_posh_lab_vault_starred_v1';
  const STORAGE_VAULT_MASTERED_KEY = 'the_posh_lab_vault_mastered_v1';
  const STORAGE_CUSTOM_EXPR_KEY = 'the_posh_lab_custom_expressions_v1';
  const STORAGE_CUSTOM_PHRASES_KEY = 'the_posh_lab_custom_phrases_v1';

  let currentMode = 'trail'; // 'trail', 'vault', or 'soundboard'
  let completedDays = new Set();
  let currentTrailDay = null;
  let playbackSpeed = 1.0;
  let selectedBritishVoice = null;
  let isMasterAudioLooping = false;
  let isTranslationVisible = true; // Default to visible for effortless comprehension
  let readingMode = 'interlinear'; // 'interlinear' (sentence-by-sentence) or 'paragraph'
  let activeInspectedTerm = null;

  // Expression Vault State
  let vaultStarred = new Set();
  let vaultMastered = new Set();
  let customExpressions = [];
  let vaultFilter = 'all';
  let vaultSearchQuery = '';
  let vaultSubMode = 'list'; // 'list' or 'cards'
  let flashcardsDeck = [];
  let currentFcIndex = 0;

  // Soundboard State
  let allSoundboardPhrases = [];
  let currentCategory = 'all';
  let searchQuery = '';
  let activePhrase = null;
  let loopActiveOnCard = null;
  let loopInterval = null;

  // Recording State (Studio & Master Record)
  let studioRecorder = null;
  let studioChunks = [];
  let studioBlob = null;
  let studioAudioUrl = null;
  let isStudioRecording = false;

  let masterRecorder = null;
  let masterChunks = [];
  let masterBlob = null;
  let masterAudioUrl = null;
  let isMasterRecording = false;

  // Web Audio Context & Analyser
  let audioContext = null;
  let studioAnalyser = null;
  let masterAnalyser = null;

  // Speech Recognition (STT)
  let recognition = null;
  let isRecognizing = false;

  // =========================================================================
  // 2. DOM Elements
  // =========================================================================
  // Mode Nav
  const navTrailBtn = document.getElementById('navTrailBtn');
  const navVaultBtn = document.getElementById('navVaultBtn');
  const navSoundboardBtn = document.getElementById('navSoundboardBtn');
  const trailView = document.getElementById('trailView');
  const vaultView = document.getElementById('vaultView');
  const soundboardView = document.getElementById('soundboardView');
  const trailStreakBadge = document.getElementById('trailStreakBadge');
  const vaultCountBadge = document.getElementById('vaultCountBadge');

  // Global Voice & Speed Controls
  const voiceSelect = document.getElementById('voiceSelect');
  const speedBtns = document.querySelectorAll('.site-header .speed-btn');

  // Trail View Elements
  const trailProgressBar = document.getElementById('trailProgressBar');
  const trailPercentText = document.getElementById('trailPercentText');
  const trailDaysCompletedCount = document.getElementById('trailDaysCompletedCount');
  const trailDaysSidebarList = document.getElementById('trailDaysSidebarList');

  // Workout Active Day Elements
  const workoutDayBadge = document.getElementById('workoutDayBadge');
  const workoutVoiceBadge = document.getElementById('workoutVoiceBadge');
  const workoutMainTitle = document.getElementById('workoutMainTitle');
  const workoutFocusTag = document.getElementById('workoutFocusTag');

  // Master Audio Player
  const trailMasterPlayBtn = document.getElementById('trailMasterPlayBtn');
  const trailMasterSlider = document.getElementById('trailMasterSlider');
  const trailMasterTimeReadout = document.getElementById('trailMasterTimeReadout');
  const trailMasterLoopBtn = document.getElementById('trailMasterLoopBtn');
  const trailMasterAudioElem = document.getElementById('trailMasterAudioElem');
  const playerSpeedBtns = document.querySelectorAll('.player-speed-btn');

  // Workout Internal Tabs & Panes
  const workoutTabBtns = document.querySelectorAll('.workout-tab-btn');
  const workoutTabPanes = document.querySelectorAll('.workout-tab-pane');
  const dayExprCount = document.getElementById('dayExprCount');
  const toggleTranslationCheck = document.getElementById('toggleTranslationCheck');
  const modeInterlinearBtn = document.getElementById('modeInterlinearBtn');
  const modeParagraphBtn = document.getElementById('modeParagraphBtn');

  // Word Inspector Popover
  const wordInspectorPopup = document.getElementById('wordInspectorPopup');
  const inspTerm = document.getElementById('inspTerm');
  const inspIpa = document.getElementById('inspIpa');
  const inspMeaning = document.getElementById('inspMeaning');
  const inspNote = document.getElementById('inspNote');
  const inspAudioBtn = document.getElementById('inspAudioBtn');
  const inspStarBtn = document.getElementById('inspStarBtn');
  const inspStarIcon = document.getElementById('inspStarIcon');
  const inspStarLabel = document.getElementById('inspStarLabel');
  const closeInspectorBtn = document.getElementById('closeInspectorBtn');

  // Steps & Content
  const workoutFullScriptBox = document.getElementById('workoutFullScriptBox');
  const workoutGlossaryGrid = document.getElementById('workoutGlossaryGrid');
  const workoutParagraphsList = document.getElementById('workoutParagraphsList');

  // 2-Minute Master Recorder
  const trailRecordMasterBtn = document.getElementById('trailRecordMasterBtn');
  const trailRecordMasterLabel = document.getElementById('trailRecordMasterLabel');
  const trailPlayUserRecordingBtn = document.getElementById('trailPlayUserRecordingBtn');
  const trailDualCompareBtn = document.getElementById('trailDualCompareBtn');
  const trailVisualizerCanvas = document.getElementById('trailVisualizerCanvas');

  // Finish Day Button
  const btnCompleteDay = document.getElementById('btnCompleteDay');
  const finishDayIcon = document.getElementById('finishDayIcon');
  const finishDayLabel = document.getElementById('finishDayLabel');

  // Vault View Elements
  const statTotalMapped = document.getElementById('statTotalMapped');
  const statSavedReview = document.getElementById('statSavedReview');
  const statMastered = document.getElementById('statMastered');
  const vaultTabListBtn = document.getElementById('vaultTabListBtn');
  const vaultTabCardsBtn = document.getElementById('vaultTabCardsBtn');
  const vaultModeList = document.getElementById('vaultModeList');
  const vaultModeCards = document.getElementById('vaultModeCards');
  const openAddExpressionBtn = document.getElementById('openAddExpressionBtn');
  const addExpressionModal = document.getElementById('addExpressionModal');
  const closeExprModalBtn = document.getElementById('closeExprModalBtn');
  const cancelExprModalBtn = document.getElementById('cancelExprModalBtn');
  const addExpressionForm = document.getElementById('addExpressionForm');
  const customTerm = document.getElementById('customTerm');
  const customMeaning = document.getElementById('customMeaning');
  const customContext = document.getElementById('customContext');
  const vaultSearchInput = document.getElementById('vaultSearchInput');
  const vPills = document.querySelectorAll('.v-pill');
  const vCountAll = document.getElementById('vCountAll');
  const vCountStarred = document.getElementById('vCountStarred');
  const vCountMastered = document.getElementById('vCountMastered');
  const vaultExpressionsGrid = document.getElementById('vaultExpressionsGrid');

  // Flashcards Elements
  const flashcardElement = document.getElementById('flashcardElement');
  const flashcardCounter = document.getElementById('flashcardCounter');
  const fcDayTag = document.getElementById('fcDayTag');
  const fcTerm = document.getElementById('fcTerm');
  const fcAudioBtn = document.getElementById('fcAudioBtn');
  const fcMeaning = document.getElementById('fcMeaning');
  const fcContext = document.getElementById('fcContext');
  const fcFlipBtn = document.getElementById('fcFlipBtn');
  const fcRepeatBtn = document.getElementById('fcRepeatBtn');
  const fcMasterBtn = document.getElementById('fcMasterBtn');

  // Soundboard Elements
  const searchInput = document.getElementById('searchInput');
  const clearSearchBtn = document.getElementById('clearSearchBtn');
  const catPills = document.querySelectorAll('.cat-pill');
  const phrasesGrid = document.getElementById('phrasesGrid');
  const displayedCount = document.getElementById('displayedCount');
  const countAll = document.getElementById('countAll');

  // Soundboard Studio Dock
  const studioDock = document.getElementById('shadowingStudio');
  const closeStudioBtn = document.getElementById('closeStudioBtn');
  const studioPhraseText = document.getElementById('studioPhraseText');
  const studioIpa = document.getElementById('studioIpa');
  const studioCheat = document.getElementById('studioCheat');
  const studioTip = document.getElementById('studioTip');
  const studioPlayNativeBtn = document.getElementById('studioPlayNativeBtn');
  const studioRecordBtn = document.getElementById('studioRecordBtn');
  const studioRecordLabel = document.getElementById('studioRecordLabel');
  const studioPlayUserBtn = document.getElementById('studioPlayUserBtn');
  const studioPlayDualBtn = document.getElementById('studioPlayDualBtn');
  const sttStatusText = document.getElementById('sttStatusText');
  const sttTranscriptWrap = document.getElementById('sttTranscriptWrap');
  const sttTranscriptText = document.getElementById('sttTranscriptText');
  const studioVisualizerCanvas = document.getElementById('studioVisualizerCanvas');

  // =========================================================================
  // 3. Initialization
  // =========================================================================
  function init() {
    loadCompletedDays();
    loadVaultData();
    initVoices();
    initSpeechRecognition();
    setupCanvases();
    bindEvents();
    renderTrailSidebar();
    loadDayWorkout(1); // Default to Day 1
    loadSoundboardPhrases();
  }

  function loadCompletedDays() {
    try {
      const saved = localStorage.getItem(STORAGE_COMPLETED_KEY);
      if (saved) completedDays = new Set(JSON.parse(saved));
    } catch (e) {}
    updateProgressUI();
  }

  function updateProgressUI() {
    const total = (window.CHALLENGE_30_DAYS || []).length || 30;
    const count = completedDays.size;
    const pct = Math.round((count / total) * 100);

    if (trailStreakBadge) trailStreakBadge.textContent = `${count}/${total}`;
    if (trailDaysCompletedCount) trailDaysCompletedCount.textContent = count;
    if (trailPercentText) trailPercentText.textContent = `${pct}% Concluído`;
    if (trailProgressBar) trailProgressBar.style.width = `${pct}%`;
  }

  // =========================================================================
  // 4. Expression Vault Data & Methods
  // =========================================================================
  function loadVaultData() {
    try {
      const savedStarred = localStorage.getItem(STORAGE_VAULT_STARRED_KEY);
      if (savedStarred) {
        vaultStarred = new Set(JSON.parse(savedStarred));
      } else {
        // First-time friendly seed: star 8 classic expressions from Week 1
        vaultStarred = new Set([
          'Grounding',
          'Bathed in',
          'Brisk stroll',
          'In earnest',
          'Buffer zone',
          'Natural gravitas',
          'Rather brilliant',
          'Spot on'
        ]);
        saveVaultData();
      }

      const savedMastered = localStorage.getItem(STORAGE_VAULT_MASTERED_KEY);
      if (savedMastered) vaultMastered = new Set(JSON.parse(savedMastered));

      const savedCustom = localStorage.getItem(STORAGE_CUSTOM_EXPR_KEY);
      if (savedCustom) customExpressions = JSON.parse(savedCustom);
    } catch (e) {
      console.error('Error loading vault data:', e);
    }

    updateVaultBadge();
    updateVaultStats();
  }

  function saveVaultData() {
    try {
      localStorage.setItem(STORAGE_VAULT_STARRED_KEY, JSON.stringify([...vaultStarred]));
      localStorage.setItem(STORAGE_VAULT_MASTERED_KEY, JSON.stringify([...vaultMastered]));
      localStorage.setItem(STORAGE_CUSTOM_EXPR_KEY, JSON.stringify(customExpressions));
    } catch (e) {
      console.error('Error saving vault data:', e);
    }
  }

  function getAllExpressions() {
    const base = window.MASTER_LEXICON || [];
    return [...base, ...customExpressions];
  }

  function updateVaultBadge() {
    if (vaultCountBadge) {
      vaultCountBadge.textContent = vaultStarred.size;
    }
  }

  function updateVaultStats() {
    const all = getAllExpressions();
    const totalCount = all.length;
    const starredCount = vaultStarred.size;
    const masteredCount = vaultMastered.size;

    if (statTotalMapped) statTotalMapped.textContent = totalCount;
    if (statSavedReview) statSavedReview.textContent = starredCount;
    if (statMastered) statMastered.textContent = masteredCount;

    if (vCountAll) vCountAll.textContent = totalCount;
    if (vCountStarred) vCountStarred.textContent = starredCount;
    if (vCountMastered) vCountMastered.textContent = masteredCount;
  }

  function toggleStarExpression(term) {
    if (!term) return;
    const norm = term.trim();
    if (vaultStarred.has(norm)) {
      vaultStarred.delete(norm);
    } else {
      vaultStarred.add(norm);
    }
    saveVaultData();
    updateVaultBadge();
    updateVaultStats();

    // Sync button states on screen
    document.querySelectorAll(`[data-star-term="${escapeHtmlAttr(norm)}"]`).forEach(btn => {
      const isStarred = vaultStarred.has(norm);
      btn.classList.toggle('active', isStarred);
      btn.classList.toggle('starred', isStarred);
    });

    if (currentMode === 'vault' && vaultSubMode === 'list') {
      renderVaultList();
    }
  }

  function toggleMasterExpression(term) {
    if (!term) return;
    const norm = term.trim();
    if (vaultMastered.has(norm)) {
      vaultMastered.delete(norm);
    } else {
      vaultMastered.add(norm);
    }
    saveVaultData();
    updateVaultStats();

    if (currentMode === 'vault' && vaultSubMode === 'list') {
      renderVaultList();
    }
  }

  function renderVaultList() {
    if (!vaultExpressionsGrid) return;
    const all = getAllExpressions();
    const query = vaultSearchQuery.toLowerCase();

    const filtered = all.filter(item => {
      // Filter tab
      if (vaultFilter === 'starred' && !vaultStarred.has(item.term)) return false;
      if (vaultFilter === 'mastered' && !vaultMastered.has(item.term)) return false;
      if (vaultFilter === 'w1' && (item.day < 1 || item.day > 7)) return false;
      if (vaultFilter === 'w2' && (item.day < 8 || item.day > 14)) return false;
      if (vaultFilter === 'w3' && (item.day < 15 || item.day > 21)) return false;
      if (vaultFilter === 'w4' && item.day < 22) return false;

      // Search query
      if (query) {
        const tMatch = (item.term || '').toLowerCase().includes(query);
        const mMatch = (item.meaning || '').toLowerCase().includes(query);
        const eMatch = (item.example || '').toLowerCase().includes(query);
        if (!tMatch && !mMatch && !eMatch) return false;
      }

      return true;
    });

    vaultExpressionsGrid.innerHTML = '';

    if (filtered.length === 0) {
      vaultExpressionsGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 3rem 1rem; background: #ffffff; border: 1px dashed var(--border-card); border-radius: var(--radius-md);">
          <div style="font-size: 2.2rem; margin-bottom: 0.5rem;">⭐️</div>
          <h4 style="font-family: var(--font-serif); font-size: 1.4rem; color: var(--navy-primary); margin-bottom: 0.35rem;">Nenhuma expressão encontrada</h4>
          <p style="color: var(--text-secondary); font-size: 0.9rem; max-width: 460px; margin: 0 auto 1.25rem;">
            ${vaultFilter === 'starred' ? 'Você ainda não favoritou expressões nesta categoria. Clique na estrela ⭐️ nas lições diárias ou no texto para salvar.' : 'Tente ajustar sua busca ou selecionar outro filtro.'}
          </p>
        </div>
      `;
      return;
    }

    filtered.forEach(item => {
      const isStarred = vaultStarred.has(item.term);
      const isMastered = vaultMastered.has(item.term);

      const card = document.createElement('div');
      card.className = `vault-card ${isMastered ? 'is-mastered' : ''}`;

      const dayDisplay = typeof item.day === 'number' ? `Day ${String(item.day).padStart(2, '0')}` : (item.day || 'Custom');

      card.innerHTML = `
        <div>
          <div class="vault-card-header">
            <span class="vault-day-badge">${dayDisplay} • ${escapeHtml(item.lessonTitle || 'Expressão')}</span>
            <button class="vault-star-btn ${isStarred ? 'active' : ''}" data-star-term="${escapeHtmlAttr(item.term)}" title="Salvar para revisão no Caderno">⭐️</button>
          </div>
          <h4 class="vault-term">${escapeHtml(item.term)}</h4>
          <p class="vault-meaning">${escapeHtml(item.meaning)}</p>
          ${item.example ? `<p class="vault-context">"${escapeHtml(item.example)}..."</p>` : ''}
        </div>
        <div class="vault-card-footer">
          <button class="vault-audio-btn play-vault-audio-btn" data-term="${escapeHtmlAttr(item.term)}">
            <span>🔊</span> <span>Pronúncia</span>
          </button>
          <button class="vault-master-btn ${isMastered ? 'active' : ''}" data-master-term="${escapeHtmlAttr(item.term)}">
            ${isMastered ? '✅ Dominada' : 'Marcar Dominada'}
          </button>
        </div>
      `;

      // Audio button
      card.querySelector('.play-vault-audio-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        speakBritish(item.term);
      });

      // Star button
      card.querySelector('.vault-star-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        toggleStarExpression(item.term);
      });

      // Master button
      card.querySelector('.vault-master-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMasterExpression(item.term);
      });

      vaultExpressionsGrid.appendChild(card);
    });
  }

  // =========================================================================
  // 5. Flashcards Mode (Active Recall 3D Flip)
  // =========================================================================
  function startFlashcards() {
    const all = getAllExpressions();
    if (vaultStarred.size > 0) {
      flashcardsDeck = all.filter(i => vaultStarred.has(i.term));
    } else {
      flashcardsDeck = all.slice(0, 25);
    }

    currentFcIndex = 0;
    renderFlashcard();
  }

  function renderFlashcard() {
    if (!flashcardElement) return;

    if (!flashcardsDeck.length) {
      fcTerm.textContent = "Nenhum cartão selecionado";
      fcMeaning.textContent = "Adicione expressões com a estrela ⭐️ para revisar.";
      fcContext.textContent = "";
      flashcardCounter.textContent = "0 de 0";
      return;
    }

    if (currentFcIndex >= flashcardsDeck.length) {
      // Completed round
      flashcardElement.classList.remove('flipped');
      fcDayTag.textContent = "Parabéns!";
      fcTerm.textContent = "Rodada Concluída! 🎉";
      fcMeaning.textContent = "Você revisou todos os cartões desta sessão.";
      fcContext.textContent = "Continue praticando nas lições de 2 minutos ou reinicie o deck.";
      flashcardCounter.textContent = `Fim da revisão (${flashcardsDeck.length} revisados)`;
      return;
    }

    const item = flashcardsDeck[currentFcIndex];
    flashcardElement.classList.remove('flipped');

    const dayDisplay = typeof item.day === 'number' ? `Day ${String(item.day).padStart(2, '0')}` : (item.day || 'Custom');
    fcDayTag.textContent = `${dayDisplay} • ${item.lessonTitle || 'Expressão'}`;
    fcTerm.textContent = item.term;
    fcMeaning.textContent = item.meaning;
    fcContext.textContent = item.example ? `"${item.example}..."` : '';
    flashcardCounter.textContent = `Cartão ${currentFcIndex + 1} de ${flashcardsDeck.length}`;
  }

  function flipFlashcard() {
    if (flashcardElement) {
      flashcardElement.classList.toggle('flipped');
    }
  }

  function nextFlashcard(markedAsMastered = false) {
    if (currentFcIndex < flashcardsDeck.length) {
      const currentItem = flashcardsDeck[currentFcIndex];
      if (markedAsMastered && currentItem) {
        vaultMastered.add(currentItem.term);
        saveVaultData();
        updateVaultStats();
      }
    }
    currentFcIndex++;
    renderFlashcard();
  }

  // =========================================================================
  // 6. Interactive Word & Sentence Inspector Engine
  // =========================================================================
  function makeInteractiveTokens(plainText, sentenceContext) {
    if (!plainText) return '';
    // Split into words, whitespace and punctuation tokens
    const tokens = plainText.split(/(\s+|[.,!?;:"()]+)/);
    let html = '';

    tokens.forEach(tok => {
      if (/^[a-zA-Z0-9'-]+$/.test(tok)) {
        html += `<span class="word-token" data-word="${escapeHtmlAttr(tok)}" data-sentence="${escapeHtmlAttr(sentenceContext || plainText)}">${escapeHtml(tok)}</span>`;
      } else {
        html += escapeHtml(tok);
      }
    });

    return html;
  }

  function openWordInspector(tokenEl) {
    const word = tokenEl.getAttribute('data-word');
    const sentence = tokenEl.getAttribute('data-sentence') || '';

    // Lookup word / collocation
    const info = (window.lookupWord && typeof window.lookupWord === 'function')
      ? window.lookupWord(word, sentence)
      : { term: word, meaning: 'Vocabulário do roteiro britânico' };

    activeInspectedTerm = info.term || word;

    // Highlight token visually
    document.querySelectorAll('.word-token.is-active-inspect').forEach(el => el.classList.remove('is-active-inspect'));
    tokenEl.classList.add('is-active-inspect');

    // Populate Inspector UI
    inspTerm.textContent = info.term || word;
    if (info.ipa) {
      inspIpa.textContent = info.ipa;
      inspIpa.style.display = 'inline-block';
    } else {
      inspIpa.style.display = 'none';
    }

    inspMeaning.textContent = info.meaning || 'Tradução contextual';
    inspNote.textContent = info.note || (info.pos ? `Classe gramatical: ${info.pos}` : '');

    // Sync Star button state
    const isStarred = vaultStarred.has(activeInspectedTerm);
    inspStarBtn.classList.toggle('starred', isStarred);
    inspStarIcon.textContent = isStarred ? '✅' : '⭐️';
    inspStarLabel.textContent = isStarred ? 'Salvo no Caderno' : 'Salvar no Caderno';

    // Position popover relative to full script container
    const boxRect = workoutFullScriptBox.getBoundingClientRect();
    const tokenRect = tokenEl.getBoundingClientRect();

    wordInspectorPopup.classList.remove('hidden');

    const popupWidth = 320;
    let left = tokenRect.left - boxRect.left;
    if (left + popupWidth > boxRect.width) {
      left = Math.max(10, boxRect.width - popupWidth - 10);
    }
    let top = tokenRect.bottom - boxRect.top + 8;

    wordInspectorPopup.style.left = `${Math.max(10, left)}px`;
    wordInspectorPopup.style.top = `${top}px`;

    // Speak British pronunciation
    speakBritish(activeInspectedTerm);
  }

  function closeWordInspector() {
    if (wordInspectorPopup) {
      wordInspectorPopup.classList.add('hidden');
    }
    document.querySelectorAll('.word-token.is-active-inspect').forEach(el => el.classList.remove('is-active-inspect'));
  }

  function renderWorkoutScript() {
    if (!currentTrailDay || !workoutFullScriptBox) return;
    workoutFullScriptBox.innerHTML = '';
    const paragraphs = currentTrailDay.paragraphs || [];

    if (readingMode === 'interlinear') {
      // 1. Interlinear Sentence-by-Sentence View
      paragraphs.forEach((pObj, pIdx) => {
        const pWrapper = document.createElement('div');
        pWrapper.className = 'script-paragraph-item';

        const sentences = (pObj.sentences && pObj.sentences.length)
          ? pObj.sentences
          : [{ en: pObj.text, pt: pObj.textPt }];

        sentences.forEach((sPair, sIdx) => {
          const sCard = document.createElement('div');
          sCard.className = 'bilingual-sentence-pair';

          const enHtml = makeInteractiveTokens(sPair.en, sPair.en);
          sCard.innerHTML = `
            <p class="sentence-en">${enHtml}</p>
            <p class="sentence-pt ${isTranslationVisible ? '' : 'hidden'}">${escapeHtml(sPair.pt)}</p>
          `;
          pWrapper.appendChild(sCard);
        });

        workoutFullScriptBox.appendChild(pWrapper);
      });
    } else {
      // 2. Continuous Block Paragraph View
      paragraphs.forEach((pObj, pIdx) => {
        const pItem = document.createElement('div');
        pItem.className = 'script-paragraph-item';

        const enHtml = makeInteractiveTokens(pObj.text, pObj.text);
        pItem.innerHTML = `
          <p class="script-paragraph-en">${enHtml}</p>
          <p class="translation-text-pt ${isTranslationVisible ? '' : 'hidden'}">${escapeHtml(pObj.textPt || '')}</p>
        `;
        workoutFullScriptBox.appendChild(pItem);
      });
    }

    // Bind click events on all word tokens
    workoutFullScriptBox.querySelectorAll('.word-token').forEach(tokEl => {
      tokEl.addEventListener('click', (e) => {
        e.stopPropagation();
        openWordInspector(tokEl);
      });
    });
  }

  // =========================================================================
  // 7. Mode Navigation (Trail vs Vault vs Soundboard)
  // =========================================================================
  function setMode(mode) {
    currentMode = mode;

    navTrailBtn.classList.toggle('active', mode === 'trail');
    navVaultBtn.classList.toggle('active', mode === 'vault');
    navSoundboardBtn.classList.toggle('active', mode === 'soundboard');

    trailView.classList.toggle('hidden', mode !== 'trail');
    vaultView.classList.toggle('hidden', mode !== 'vault');
    soundboardView.classList.toggle('hidden', mode !== 'soundboard');

    if (mode === 'vault') {
      if (trailMasterAudioElem) trailMasterAudioElem.pause();
      closeStudio();
      closeWordInspector();
      if (vaultSubMode === 'list') {
        renderVaultList();
      } else {
        startFlashcards();
      }
      updateVaultStats();
    } else if (mode === 'soundboard') {
      if (trailMasterAudioElem) trailMasterAudioElem.pause();
      closeWordInspector();
      renderSoundboardGrid();
    } else {
      closeStudio();
      closeWordInspector();
    }
  }

  // =========================================================================
  // 8. Speech Synthesis & British Voices
  // =========================================================================
  function initVoices() {
    if (!('speechSynthesis' in window)) return;

    function populateVoiceList() {
      const voices = window.speechSynthesis.getVoices();
      if (!voices || voices.length === 0) return;

      const britishVoices = voices.filter(v => {
        const lang = (v.lang || '').toLowerCase();
        const name = (v.name || '').toLowerCase();
        return lang.includes('en-gb') ||
               lang.includes('en_gb') ||
               name.includes('united kingdom') ||
               name.includes('uk') ||
               name.includes('british') ||
               name.includes('george') ||
               name.includes('hazel') ||
               name.includes('daniel') ||
               name.includes('oliver') ||
               name.includes('serena') ||
               name.includes('stephanie');
      });

      voiceSelect.innerHTML = '';
      const pool = britishVoices.length > 0 ? britishVoices : voices.filter(v => v.lang.startsWith('en'));

      pool.forEach((v, index) => {
        const opt = document.createElement('option');
        opt.value = index;
        const isGb = v.lang.toLowerCase().includes('gb') || v.name.toLowerCase().includes('uk');
        opt.textContent = `${v.name} ${isGb ? '(🇬🇧 British)' : `(${v.lang})`}`;
        voiceSelect.appendChild(opt);
      });

      const preferredIdx = pool.findIndex(v => {
        const n = v.name.toLowerCase();
        return n.includes('natural') || n.includes('google uk') || n.includes('george') || n.includes('hazel') || n.includes('daniel');
      });

      if (preferredIdx !== -1) {
        voiceSelect.selectedIndex = preferredIdx;
        selectedBritishVoice = pool[preferredIdx];
      } else {
        selectedBritishVoice = pool[0];
      }
    }

    populateVoiceList();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = populateVoiceList;
    }

    voiceSelect.addEventListener('change', (e) => {
      const voices = window.speechSynthesis.getVoices();
      const britishVoices = voices.filter(v => {
        const lang = (v.lang || '').toLowerCase();
        const name = (v.name || '').toLowerCase();
        return lang.includes('en-gb') || lang.includes('en_gb') || name.includes('united kingdom') || name.includes('uk') || name.includes('british');
      });
      const pool = britishVoices.length > 0 ? britishVoices : voices.filter(v => v.lang.startsWith('en'));
      selectedBritishVoice = pool[e.target.value] || null;
    });
  }

  function speakBritish(text, onEndCallback = null) {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-GB';
    utterance.rate = playbackSpeed;
    utterance.pitch = 1.0;

    if (selectedBritishVoice) {
      utterance.voice = selectedBritishVoice;
    }

    if (onEndCallback) {
      utterance.onend = onEndCallback;
      utterance.onerror = onEndCallback;
    }

    window.speechSynthesis.speak(utterance);
  }

  // =========================================================================
  // 9. Speech Recognition (STT) for Pronunciation Check
  // =========================================================================
  function initSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    recognition = new SpeechRecognition();
    recognition.lang = 'en-GB';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = function () {
      isRecognizing = true;
      sttStatusText.textContent = "🎙️ Ouvindo... Fale com dicção britânica!";
      setSttDot('active');
    };

    recognition.onresult = function (event) {
      if (!event.results || event.results.length === 0) return;
      const transcript = event.results[0][0].transcript;
      evaluatePronunciation(transcript);
    };

    recognition.onerror = function (event) {
      sttStatusText.textContent = `Nota: ${event.error}`;
      setSttDot('idle');
      isRecognizing = false;
    };

    recognition.onend = function () {
      isRecognizing = false;
    };
  }

  function setSttDot(state) {
    const dot = document.querySelector('.stt-dot');
    if (!dot) return;
    dot.className = 'stt-dot';
    if (state === 'active') dot.classList.add('active');
    if (state === 'success') dot.classList.add('success');
  }

  function evaluatePronunciation(spokenText) {
    if (!activePhrase) return;

    sttTranscriptWrap.classList.remove('hidden');
    sttTranscriptText.textContent = `"${spokenText}"`;

    const target = cleanText(activePhrase.en);
    const spoken = cleanText(spokenText);

    if (target === spoken || spoken.includes(target) || target.includes(spoken)) {
      sttStatusText.innerHTML = "✨ <strong>Excelente!</strong> Reconhecido perfeitamente com sotaque britânico.";
      setSttDot('success');
    } else {
      const targetWords = target.split(' ');
      const spokenWords = spoken.split(' ');
      const matches = targetWords.filter(w => spokenWords.includes(w));
      const pct = Math.round((matches.length / targetWords.length) * 100);

      if (pct >= 65) {
        sttStatusText.innerHTML = `👍 <strong>Muito bom (${pct}% de correspondência).</strong> Quase idêntico ao nativo.`;
        setSttDot('success');
      } else {
        sttStatusText.innerHTML = `⚠️ <strong>Atenção (${pct}%):</strong> Tente articular com mais calma e ritmo pausado.`;
        setSttDot('idle');
      }
    }
  }

  function cleanText(txt) {
    return (txt || '').toLowerCase().replace(/[^a-z0-9 ]/g, '').trim();
  }

  // =========================================================================
  // 10. 30-Day Immersion Trail (Primary Engine)
  // =========================================================================
  const WEEK_LABELS = [
    "🏛️ Semana 1: Fundamentos da Articulação & Cadência Serena (Dias 1-7)",
    "☕ Semana 2: Diplomacia, Polidez & Situações Sociais (Dias 8-14)",
    "💼 Semana 3: Corporativo, Negociações & Elegância no Trabalho (Dias 15-21)",
    "⚡ Semana 4: Fluência Avançada, Ritmo Rápido & Espontaneidade (Dias 22-28)",
    "👑 Grand Finale: Maestria & O Monólogo Diplomático (Dias 29-30)"
  ];

  function renderTrailSidebar() {
    const days = window.CHALLENGE_30_DAYS || [];
    if (!days.length) return;

    trailDaysSidebarList.innerHTML = '';
    let currentWeek = -1;
    let currentGroupDiv = null;

    days.forEach((item, idx) => {
      const weekIdx = Math.min(Math.floor(idx / 7), 4);

      if (weekIdx !== currentWeek) {
        currentWeek = weekIdx;
        currentGroupDiv = document.createElement('div');
        currentGroupDiv.className = 'week-group';
        currentGroupDiv.innerHTML = `<h4 class="week-group-title">${WEEK_LABELS[weekIdx]}</h4>`;
        trailDaysSidebarList.appendChild(currentGroupDiv);
      }

      const isDone = completedDays.has(item.day);
      const isSelected = currentTrailDay && currentTrailDay.day === item.day;

      const btn = document.createElement('button');
      btn.className = `trail-day-item-btn ${isSelected ? 'active' : ''}`;
      btn.dataset.day = item.day;
      btn.innerHTML = `
        <div class="trail-day-meta-box">
          <span class="trail-day-num">D${String(item.day).padStart(2, '0')}</span>
          <span class="trail-day-name">${escapeHtml(item.title)}</span>
        </div>
        <span>${isDone ? '✅' : '⚪'}</span>
      `;

      btn.addEventListener('click', () => {
        loadDayWorkout(item.day);
      });

      currentGroupDiv.appendChild(btn);
    });
  }

  function loadDayWorkout(dayNum) {
    const days = window.CHALLENGE_30_DAYS || [];
    const item = days.find(d => d.day === dayNum) || days[0];
    if (!item) return;

    currentTrailDay = item;

    // Update Sidebar active state
    document.querySelectorAll('.trail-day-item-btn').forEach(b => {
      b.classList.toggle('active', parseInt(b.dataset.day, 10) === item.day);
    });

    // Populate Main Header
    workoutDayBadge.textContent = `Dia ${String(item.day).padStart(2, '0')} de 30`;
    workoutVoiceBadge.textContent = `🎙️ Narrador Oficial: ${item.voice && item.voice.includes('Sonia') ? 'Sonia (Londres RP)' : 'Ryan (Oxford RP)'}`;
    workoutMainTitle.textContent = item.title;
    workoutFocusTag.textContent = `Foco Fonético: ${item.accentFocus}`;

    // Setup Master Audio Player
    const audioPath = `audio/day-${String(item.day).padStart(2, '0')}.mp3`;
    trailMasterAudioElem.src = audioPath;
    trailMasterAudioElem.playbackRate = playbackSpeed;
    trailMasterSlider.value = 0;
    trailMasterTimeReadout.textContent = "0:00 / 0:00";
    trailMasterPlayBtn.textContent = "▶";

    // Update expressions count on tab
    const exprCount = (item.glossary && item.glossary.length) || 0;
    if (dayExprCount) dayExprCount.textContent = exprCount;

    // Close any open inspector
    closeWordInspector();

    // Render Tab 1: Full Script with Interlinear & Word Token Support
    renderWorkoutScript();

    // Setup Tab 2: Key Expressions of the Day
    workoutGlossaryGrid.innerHTML = '';
    if (item.glossary && item.glossary.length) {
      item.glossary.forEach(g => {
        const isStarred = vaultStarred.has(g.term);
        const card = document.createElement('div');
        card.className = 'glossary-card';
        card.innerHTML = `
          <div>
            <div class="glossary-header">
              <strong class="glossary-term">${escapeHtml(g.term)}</strong>
              <button class="btn-star-expr ${isStarred ? 'starred' : ''}" data-star-term="${escapeHtmlAttr(g.term)}" title="Salvar no seu Caderno de Revisão">⭐️</button>
            </div>
            <p class="glossary-pt">${escapeHtml(g.meaning)}</p>
          </div>
          <div class="glossary-footer">
            <button class="btn-speak-expr" data-speak-term="${escapeHtmlAttr(g.term)}">
              <span>🔊</span> <span>Ouvir Pronúncia</span>
            </button>
          </div>
        `;

        // Star button
        card.querySelector('.btn-star-expr').addEventListener('click', (e) => {
          e.stopPropagation();
          toggleStarExpression(g.term);
        });

        // Speak button
        card.querySelector('.btn-speak-expr').addEventListener('click', (e) => {
          e.stopPropagation();
          speakBritish(g.term);
        });

        workoutGlossaryGrid.appendChild(card);
      });
    }

    // Setup Tab 3: 3 Workout Blocks
    workoutParagraphsList.innerHTML = '';
    (item.paragraphs || []).forEach((b, bIdx) => {
      const blockEl = document.createElement('div');
      blockEl.className = 'workout-block-item';
      blockEl.innerHTML = `
        <div class="block-title-row">
          <span class="block-name">${escapeHtml(b.title)}</span>
          <div class="block-actions">
            <button class="block-btn play-block-btn" data-idx="${bIdx}">
              <span>🔊</span> <span>Ouvir Bloco</span>
            </button>
            <button class="block-btn studio-block-btn" data-idx="${bIdx}">
              <span>🎙️</span> <span>Praticar</span>
            </button>
          </div>
        </div>
        <p class="block-text">${makeInteractiveTokens(b.text, b.text)}</p>
        <p class="translation-text-pt ${isTranslationVisible ? '' : 'hidden'}" style="margin-bottom: 0.65rem;">${escapeHtml(b.textPt || '')}</p>
        <div class="block-cheat-tip">
          💡 <strong>Dica Fonética & Fôlego:</strong> ${escapeHtml(b.cheatTips || item.brazilianCheatTips || '')}
        </div>
      `;

      // Word click in block
      blockEl.querySelectorAll('.word-token').forEach(tok => {
        tok.addEventListener('click', (e) => {
          e.stopPropagation();
          openWordInspector(tok);
        });
      });

      // Play block speech
      blockEl.querySelector('.play-block-btn').addEventListener('click', () => {
        speakBritish(b.text);
      });

      // Practice block in studio dock
      blockEl.querySelector('.studio-block-btn').addEventListener('click', () => {
        openStudio({
          id: `day_${item.day}_b_${bIdx}`,
          en: b.text,
          pt: `Bloco ${b.part} do Dia ${item.day}: ${item.title}`,
          ipa: `[Bloco ${b.part} • ${item.voice}]`,
          cheat: `Treino de fôlego do Bloco ${b.part}`,
          tip: b.cheatTips || item.brazilianCheatTips
        });
      });

      workoutParagraphsList.appendChild(blockEl);
    });

    // Reset Master Recording state
    resetMasterRecordState();

    // Update Finish Button
    updateFinishDayBtn();
  }

  function updateFinishDayBtn() {
    if (!currentTrailDay) return;
    const isDone = completedDays.has(currentTrailDay.day);
    if (isDone) {
      btnCompleteDay.classList.add('completed');
      finishDayIcon.textContent = "✓";
      finishDayLabel.textContent = "Dia Concluído! (Clique para desmarcar)";
    } else {
      btnCompleteDay.classList.remove('completed');
      finishDayIcon.textContent = "⚪";
      finishDayLabel.textContent = "Marcar Dia como Concluído & Salvar Progresso";
    }
  }

  function toggleCompleteCurrentDay() {
    if (!currentTrailDay) return;
    const day = currentTrailDay.day;
    if (completedDays.has(day)) {
      completedDays.delete(day);
    } else {
      completedDays.add(day);
    }
    localStorage.setItem(STORAGE_COMPLETED_KEY, JSON.stringify([...completedDays]));
    updateProgressUI();
    renderTrailSidebar();
    updateFinishDayBtn();
  }

  // =========================================================================
  // 11. Master 2-Minute Audio Player Controls
  // =========================================================================
  function setupTrailMasterPlayer() {
    trailMasterPlayBtn.addEventListener('click', () => {
      if (trailMasterAudioElem.paused) {
        trailMasterAudioElem.play();
        trailMasterPlayBtn.textContent = "⏸";
      } else {
        trailMasterAudioElem.pause();
        trailMasterPlayBtn.textContent = "▶";
      }
    });

    trailMasterAudioElem.addEventListener('timeupdate', () => {
      if (!trailMasterAudioElem.duration) return;
      const pct = (trailMasterAudioElem.currentTime / trailMasterAudioElem.duration) * 100;
      trailMasterSlider.value = pct;
      trailMasterTimeReadout.textContent = `${formatTime(trailMasterAudioElem.currentTime)} / ${formatTime(trailMasterAudioElem.duration)}`;
    });

    trailMasterAudioElem.addEventListener('ended', () => {
      if (isMasterAudioLooping) {
        trailMasterAudioElem.currentTime = 0;
        trailMasterAudioElem.play();
      } else {
        trailMasterPlayBtn.textContent = "▶";
        trailMasterSlider.value = 0;
      }
    });

    trailMasterSlider.addEventListener('input', (e) => {
      if (!trailMasterAudioElem.duration) return;
      const targetTime = (e.target.value / 100) * trailMasterAudioElem.duration;
      trailMasterAudioElem.currentTime = targetTime;
    });

    trailMasterLoopBtn.addEventListener('click', () => {
      isMasterAudioLooping = !isMasterAudioLooping;
      trailMasterLoopBtn.classList.toggle('active', isMasterAudioLooping);
    });

    playerSpeedBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        playerSpeedBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const spd = parseFloat(btn.dataset.speed) || 1.0;
        trailMasterAudioElem.playbackRate = spd;
      });
    });
  }

  function formatTime(seconds) {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }

  // =========================================================================
  // 12. 2-Minute Master Recorder (Full Continuous Recording)
  // =========================================================================
  function resetMasterRecordState() {
    masterBlob = null;
    if (masterAudioUrl) URL.revokeObjectURL(masterAudioUrl);
    masterAudioUrl = null;
    trailPlayUserRecordingBtn.disabled = true;
    trailDualCompareBtn.disabled = true;
    trailRecordMasterLabel.textContent = "Gravar Minha Sessão de 2 Minutos";
    trailRecordMasterBtn.classList.remove('recording');
    isMasterRecording = false;
    drawIdleCanvas(trailVisualizerCanvas);
  }

  async function toggleMasterRecording() {
    if (isMasterRecording) {
      stopMasterRecording();
    } else {
      startMasterRecording();
    }
  }

  async function startMasterRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setupMasterAudioStream(stream);

      masterChunks = [];
      masterRecorder = new MediaRecorder(stream);

      masterRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) masterChunks.push(e.data);
      };

      masterRecorder.onstop = () => {
        masterBlob = new Blob(masterChunks, { type: 'audio/webm' });
        if (masterAudioUrl) URL.revokeObjectURL(masterAudioUrl);
        masterAudioUrl = URL.createObjectURL(masterBlob);

        trailPlayUserRecordingBtn.disabled = false;
        trailDualCompareBtn.disabled = false;

        stream.getTracks().forEach(track => track.stop());
        drawIdleCanvas(trailVisualizerCanvas);
      };

      masterRecorder.start();
      isMasterRecording = true;
      trailRecordMasterBtn.classList.add('recording');
      trailRecordMasterLabel.textContent = "Parar Gravação (Gravando seus 2 min...)";

      startMasterVisualizerLoop();
    } catch (err) {
      console.error('Microfone inacessível:', err);
      alert('Não foi possível acessar seu microfone. Verifique as permissões do seu navegador.');
    }
  }

  function stopMasterRecording() {
    if (masterRecorder && masterRecorder.state !== 'inactive') {
      masterRecorder.stop();
    }
    isMasterRecording = false;
    trailRecordMasterBtn.classList.remove('recording');
    trailRecordMasterLabel.textContent = "Gravar Minha Sessão de 2 Minutos";
  }

  function playMasterUserAudio() {
    if (!masterAudioUrl) return;
    const userAudio = new Audio(masterAudioUrl);
    userAudio.play();
  }

  function playMasterDualCompare() {
    if (!masterAudioUrl || !trailMasterAudioElem.src) return;
    trailMasterAudioElem.currentTime = 0;
    trailMasterAudioElem.play();
    trailMasterPlayBtn.textContent = "⏸";

    const userAudio = new Audio(masterAudioUrl);
    userAudio.play();
  }

  // =========================================================================
  // 13. Studio Dock (Phonetics & Individual Block Shadowing)
  // =========================================================================
  function openStudio(phrase) {
    activePhrase = phrase;
    studioDock.classList.remove('hidden');

    studioPhraseText.textContent = phrase.en;
    studioIpa.textContent = phrase.ipa || '/.../';
    studioCheat.textContent = phrase.cheat || 'Cadência suave';
    studioTip.textContent = phrase.tip || 'Foque em respirar com calma e manter o tom aveludado.';

    resetStudioRecordingState();
    sttTranscriptWrap.classList.add('hidden');
    sttStatusText.textContent = "Aguardando gravação para validação de pronúncia...";
    setSttDot('idle');

    studioDock.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function closeStudio() {
    studioDock.classList.add('hidden');
    activePhrase = null;
    stopStudioRecording();
    if (window.speechSynthesis) window.speechSynthesis.cancel();
  }

  function resetStudioRecordingState() {
    studioBlob = null;
    if (studioAudioUrl) URL.revokeObjectURL(studioAudioUrl);
    studioAudioUrl = null;
    studioPlayUserBtn.disabled = true;
    studioPlayDualBtn.disabled = true;
    studioRecordLabel.textContent = "Gravar Minha Voz";
    studioRecordBtn.classList.remove('recording');
    isStudioRecording = false;
    drawIdleCanvas(studioVisualizerCanvas);
  }

  async function toggleStudioRecording() {
    if (isStudioRecording) {
      stopStudioRecording();
    } else {
      startStudioRecording();
    }
  }

  async function startStudioRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setupStudioAudioStream(stream);

      studioChunks = [];
      studioRecorder = new MediaRecorder(stream);

      studioRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) studioChunks.push(e.data);
      };

      studioRecorder.onstop = () => {
        studioBlob = new Blob(studioChunks, { type: 'audio/webm' });
        if (studioAudioUrl) URL.revokeObjectURL(studioAudioUrl);
        studioAudioUrl = URL.createObjectURL(studioBlob);

        studioPlayUserBtn.disabled = false;
        studioPlayDualBtn.disabled = false;

        stream.getTracks().forEach(track => track.stop());
        drawIdleCanvas(studioVisualizerCanvas);
      };

      studioRecorder.start();
      isStudioRecording = true;
      studioRecordBtn.classList.add('recording');
      studioRecordLabel.textContent = "Parar Gravação";

      if (recognition && !isRecognizing) {
        try { recognition.start(); } catch (e) {}
      }

      startStudioVisualizerLoop();
    } catch (err) {
      console.error('Microfone inacessível:', err);
      alert('Não foi possível acessar seu microfone. Verifique as permissões.');
    }
  }

  function stopStudioRecording() {
    if (studioRecorder && studioRecorder.state !== 'inactive') {
      studioRecorder.stop();
    }
    isStudioRecording = false;
    studioRecordBtn.classList.remove('recording');
    studioRecordLabel.textContent = "Gravar Minha Voz";

    if (recognition && isRecognizing) {
      try { recognition.stop(); } catch (e) {}
    }
  }

  function playStudioUserAudio() {
    if (!studioAudioUrl) return;
    const userAudio = new Audio(studioAudioUrl);
    userAudio.play();
  }

  function playStudioDualShadowing() {
    if (!studioAudioUrl || !activePhrase) return;
    speakBritish(activePhrase.en);
    const userAudio = new Audio(studioAudioUrl);
    setTimeout(() => {
      userAudio.play();
    }, 120);
  }

  // =========================================================================
  // 14. Canvas Audio Visualizer
  // =========================================================================
  function setupCanvases() {
    drawIdleCanvas(studioVisualizerCanvas);
    drawIdleCanvas(trailVisualizerCanvas);
  }

  function getAudioContext() {
    if (!audioContext) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) audioContext = new AudioCtx();
    }
    return audioContext;
  }

  function setupStudioAudioStream(stream) {
    const ctx = getAudioContext();
    if (!ctx) return;
    if (ctx.state === 'suspended') ctx.resume();

    const source = ctx.createMediaStreamSource(stream);
    studioAnalyser = ctx.createAnalyser();
    studioAnalyser.fftSize = 64;
    source.connect(studioAnalyser);
  }

  function setupMasterAudioStream(stream) {
    const ctx = getAudioContext();
    if (!ctx) return;
    if (ctx.state === 'suspended') ctx.resume();

    const source = ctx.createMediaStreamSource(stream);
    masterAnalyser = ctx.createAnalyser();
    masterAnalyser.fftSize = 64;
    source.connect(masterAnalyser);
  }

  function drawIdleCanvas(canvas) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width = canvas.offsetWidth || 300;
    const h = canvas.height = canvas.offsetHeight || 50;

    ctx.fillStyle = '#0e1e38';
    ctx.fillRect(0, 0, w, h);

    ctx.strokeStyle = 'rgba(196, 151, 51, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, h / 2);
    ctx.lineTo(w, h / 2);
    ctx.stroke();
  }

  function startStudioVisualizerLoop() {
    if (!studioAnalyser || !studioVisualizerCanvas) return;
    const canvas = studioVisualizerCanvas;
    const ctx = canvas.getContext('2d');
    const bufferLength = studioAnalyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    function draw() {
      if (!isStudioRecording) {
        drawIdleCanvas(canvas);
        return;
      }
      requestAnimationFrame(draw);
      studioAnalyser.getByteFrequencyData(dataArray);

      const w = canvas.width = canvas.offsetWidth;
      const h = canvas.height = canvas.offsetHeight;

      ctx.fillStyle = '#0e1e38';
      ctx.fillRect(0, 0, w, h);

      const barWidth = (w / bufferLength) * 1.5;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * h;
        ctx.fillStyle = `rgba(196, 151, 51, ${0.4 + (dataArray[i] / 255) * 0.6})`;
        ctx.fillRect(x, h - barHeight, barWidth - 1, barHeight);
        x += barWidth;
      }
    }
    draw();
  }

  function startMasterVisualizerLoop() {
    if (!masterAnalyser || !trailVisualizerCanvas) return;
    const canvas = trailVisualizerCanvas;
    const ctx = canvas.getContext('2d');
    const bufferLength = masterAnalyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    function draw() {
      if (!isMasterRecording) {
        drawIdleCanvas(canvas);
        return;
      }
      requestAnimationFrame(draw);
      masterAnalyser.getByteFrequencyData(dataArray);

      const w = canvas.width = canvas.offsetWidth;
      const h = canvas.height = canvas.offsetHeight;

      ctx.fillStyle = '#0e1e38';
      ctx.fillRect(0, 0, w, h);

      const barWidth = (w / bufferLength) * 1.5;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * h;
        ctx.fillStyle = `rgba(196, 151, 51, ${0.4 + (dataArray[i] / 255) * 0.6})`;
        ctx.fillRect(x, h - barHeight, barWidth - 1, barHeight);
        x += barWidth;
      }
    }
    draw();
  }

  // =========================================================================
  // 15. Soundboard de Bolso (Secondary View)
  // =========================================================================
  const DEFAULT_SOUNDBOARD = [
    { id: 'p1', cat: 'politeness', en: "I'm afraid that won't be possible.", pt: "Receio que isso não será possível.", ipa: "/aɪm əˈfreɪd ðæt wəʊnt biː ˈpɒsəbl̩/", cheat: "áim uh-frêid dhét wôunt bi póssubôul", tip: "'Won't' com o ditongo /əʊ/ e 't' final seco." },
    { id: 'p2', cat: 'politeness', en: "Would you mind awfully if I took this seat?", pt: "Você se importaria se eu me sentasse aqui?", ipa: "/wʊd juː maɪnd ˈɔːfəli ɪf aɪ tʊk ðɪs siːt/", cheat: "uud iu máind óo-fuli if ái tuk dhis síit?", tip: "'Awfully' usado para polidez refinada." },
    { id: 'p3', cat: 'politeness', en: "I'd rather not, to be perfectly honest.", pt: "Eu preferiria não, para ser sincero.", ipa: "/aɪd ˈrɑːðə nɒt tə bi ˈpɜːfɪktli ˈɒnɪst/", cheat: "áid ráa-dhuh nót, tuh bi péer-fiktli ónist", tip: "Broad A de garganta em 'rather', sem R final." },
    { id: 'p4', cat: 'politeness', en: "Could you possibly pass the water?", pt: "Poderia por favor me passar a água?", ipa: "/kʊd juː ˈpɒsəbli pɑːs ðə ˈwɔːtə/", cheat: "kud iu póssubli páas dhuh uóo-tuh?", tip: "O teste clássico: T estalado limpo, sem virar D." },
    { id: 's1', cat: 'social', en: "Rather brilliant, actually.", pt: "Bastante brilhante, para falar a verdade.", ipa: "/ˈrɑːðə ˈbrɪljənt ˈæktʃuəli/", cheat: "ráa-dhuh brí-liant, ék-tchu-uh-li", tip: "Três palavras com cadência rítmica perfeita." },
    { id: 's2', cat: 'social', en: "Fancy grabbing a quick coffee?", pt: "A fim de tomar um cafezinho rápido?", ipa: "/ˈfænsi ˈɡræbɪŋ ə kwɪk ˈkɒfi/", cheat: "fén-si gré-bin uh kuík kó-fi?", tip: "'Fancy' substitui 'do you want' com classe." },
    { id: 's3', cat: 'social', en: "Spot on, that's precisely what I meant.", pt: "Na mosca, é exatamente isso que eu quis dizer.", ipa: "/spɒt ɒn ðæts prɪˈsaɪsli wɒt aɪ ment/", cheat: "spót ón, dhéts pri-sáiss-li uót ái mént", tip: "'Spot on' conecta: 'spó-tón'." },
    { id: 's4', cat: 'social', en: "Fair enough, makes total sense.", pt: "Justo, faz todo o sentido.", ipa: "/feə ɪˈnʌf meɪks ˈtəʊtl sens/", cheat: "fê-uh i-nâf, mêiks tôu-tôul sénss", tip: "'Fair' termina em /feə/, sem som de R." },
    { id: 'd1', cat: 'debate', en: "To be quite frank, it's rather underwhelming.", pt: "Para ser franco, ficou aquém do esperado.", ipa: "/tə bi kwaɪt fræŋk ɪts ˈrɑːðər ˌʌndəˈwelmɪŋ/", cheat: "tuh bi kuáit frênk, its ráa-dhur ân-duh-uél-min", tip: "Como criticar com máxima classe e calma." },
    { id: 'd2', cat: 'debate', en: "I see your point, but I'm not entirely convinced.", pt: "Entendo o seu ponto, mas não estou convencido.", ipa: "/aɪ siː jɔː pɔɪnt bʌt aɪm nɒt ɪnˈtaɪəli kənˈvɪnst/", cheat: "ái síi ióo póint, bât áim nót in-tái-uh-li kun-vínst", tip: "Diga com tom firme e aveludado." },
    { id: 'k1', cat: 'drills', en: "Water", pt: "Água (O teste clássico)", ipa: "/ˈwɔːtə/", cheat: "uóo-tuh (NUNCA 'wá-der')", tip: "Arredonde os lábios para 'wóo', T estalado, e 'uh' final." },
    { id: 'k2', cat: 'drills', en: "Schedule", pt: "Cronograma / Agenda", ipa: "/ˈʃedjuːl/", cheat: "shéd-yool (som de SH)", tip: "No Reino Unido começa com 'SH', nunca com 'SK'." },
    { id: 'k3', cat: 'drills', en: "Comfortable", pt: "Confortável", ipa: "/ˈkʌmftəbl̩/", cheat: "kâmf-tuh-bôul (Apenas 3 sílabas!)", tip: "Coma a segunda sílaba; são apenas 3 sílabas." },
    { id: 'k4', cat: 'drills', en: "Garage", pt: "Garagem", ipa: "/ˈɡærɑːʒ/", cheat: "gé-rahzh (ênfase na 1ª sílaba)", tip: "Ênfase na primeira sílaba: GÉ-rahzh." }
  ];

  function loadSoundboardPhrases() {
    let custom = [];
    try {
      const saved = localStorage.getItem(STORAGE_CUSTOM_PHRASES_KEY);
      if (saved) custom = JSON.parse(saved);
    } catch (e) {}
    allSoundboardPhrases = [...DEFAULT_SOUNDBOARD, ...custom];
    if (countAll) countAll.textContent = allSoundboardPhrases.length;
  }

  function renderSoundboardGrid() {
    if (!phrasesGrid) return;
    const q = searchQuery.toLowerCase();
    const list = allSoundboardPhrases.filter(p => {
      const matchCat = currentCategory === 'all' || p.cat === currentCategory;
      if (!matchCat) return false;
      if (!q) return true;
      return p.en.toLowerCase().includes(q) || p.pt.toLowerCase().includes(q) || (p.cheat && p.cheat.toLowerCase().includes(q));
    });

    if (displayedCount) displayedCount.textContent = list.length;
    phrasesGrid.innerHTML = '';

    list.forEach(item => {
      const card = document.createElement('article');
      card.className = 'phrase-card';
      card.id = `card-${item.id}`;

      card.innerHTML = `
        <div>
          <div class="card-top">
            <span class="card-category-badge">${item.cat}</span>
            <div class="card-quick-actions">
              <button class="card-btn-icon loop-btn" title="Repetir em loop" data-id="${item.id}">🔁</button>
            </div>
          </div>
          <h3 class="card-phrase-en">${escapeHtml(item.en)}</h3>
          <p class="card-phrase-pt">${escapeHtml(item.pt)}</p>
          <div class="card-phonetics-box">
            <span class="card-ipa">${escapeHtml(item.ipa)}</span>
            <span class="card-cheat">🇧🇷 ${escapeHtml(item.cheat)}</span>
          </div>
          <p class="card-tip">${escapeHtml(item.tip || '')}</p>
        </div>
        <div class="card-footer">
          <button class="card-btn-play play-sb-btn" data-id="${item.id}">
            <span>🔊</span> <span>Ouvir</span>
          </button>
          <button class="card-btn-studio open-sb-studio-btn" data-id="${item.id}">
            <span>🎙️</span> <span>Praticar</span>
          </button>
        </div>
      `;

      card.querySelector('.play-sb-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        speakBritish(item.en);
      });

      card.querySelector('.open-sb-studio-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        openStudio(item);
      });

      card.querySelector('.loop-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        toggleCardLoop(item.id, card.querySelector('.loop-btn'));
      });

      phrasesGrid.appendChild(card);
    });
  }

  function toggleCardLoop(id, btn) {
    if (loopActiveOnCard === id) {
      clearInterval(loopInterval);
      loopActiveOnCard = null;
      btn.classList.remove('active');
      window.speechSynthesis.cancel();
    } else {
      if (loopInterval) clearInterval(loopInterval);
      document.querySelectorAll('.loop-btn').forEach(b => b.classList.remove('active'));

      loopActiveOnCard = id;
      btn.classList.add('active');

      const phrase = allSoundboardPhrases.find(p => p.id === id);
      if (!phrase) return;

      speakBritish(phrase.en);
      loopInterval = setInterval(() => {
        if (loopActiveOnCard !== id) {
          clearInterval(loopInterval);
          return;
        }
        speakBritish(phrase.en);
      }, 3500);
    }
  }

  // =========================================================================
  // 16. Event Listeners & Binding
  // =========================================================================
  function bindEvents() {
    // Mode Navigation
    navTrailBtn.addEventListener('click', () => setMode('trail'));
    navVaultBtn.addEventListener('click', () => setMode('vault'));
    navSoundboardBtn.addEventListener('click', () => setMode('soundboard'));

    // Workout Internal Tabs Switching
    workoutTabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        workoutTabBtns.forEach(b => b.classList.remove('active'));
        workoutTabPanes.forEach(pane => pane.classList.add('hidden'));

        btn.classList.add('active');
        const targetTabId = btn.getAttribute('data-tab');
        const targetPane = document.getElementById(targetTabId);
        if (targetPane) targetPane.classList.remove('hidden');
      });
    });

    // Translation Checkbox Toggle
    if (toggleTranslationCheck) {
      toggleTranslationCheck.addEventListener('change', (e) => {
        isTranslationVisible = e.target.checked;
        document.querySelectorAll('.sentence-pt, .translation-text-pt').forEach(el => {
          el.classList.toggle('hidden', !isTranslationVisible);
        });
      });
    }

    // Reading Mode Pills (Interlinear vs Paragraph)
    if (modeInterlinearBtn && modeParagraphBtn) {
      modeInterlinearBtn.addEventListener('click', () => {
        readingMode = 'interlinear';
        modeInterlinearBtn.classList.add('active');
        modeParagraphBtn.classList.remove('active');
        closeWordInspector();
        renderWorkoutScript();
      });

      modeParagraphBtn.addEventListener('click', () => {
        readingMode = 'paragraph';
        modeParagraphBtn.classList.add('active');
        modeInterlinearBtn.classList.remove('active');
        closeWordInspector();
        renderWorkoutScript();
      });
    }

    // Word Inspector Actions
    if (closeInspectorBtn) {
      closeInspectorBtn.addEventListener('click', closeWordInspector);
    }

    if (inspAudioBtn) {
      inspAudioBtn.addEventListener('click', () => {
        if (activeInspectedTerm) {
          speakBritish(activeInspectedTerm);
        }
      });
    }

    if (inspStarBtn) {
      inspStarBtn.addEventListener('click', () => {
        if (!activeInspectedTerm) return;
        toggleStarExpression(activeInspectedTerm);
        const isStarred = vaultStarred.has(activeInspectedTerm);
        inspStarBtn.classList.toggle('starred', isStarred);
        inspStarIcon.textContent = isStarred ? '✅' : '⭐️';
        inspStarLabel.textContent = isStarred ? 'Salvo no Caderno' : 'Salvar no Caderno';
      });
    }

    // Dismiss inspector when clicking outside
    document.addEventListener('click', (e) => {
      if (wordInspectorPopup && !wordInspectorPopup.classList.contains('hidden')) {
        if (!wordInspectorPopup.contains(e.target) && !e.target.classList.contains('word-token')) {
          closeWordInspector();
        }
      }
    });

    // Master Player Controls
    setupTrailMasterPlayer();

    // 2-Minute Master Recorder
    trailRecordMasterBtn.addEventListener('click', toggleMasterRecording);
    trailPlayUserRecordingBtn.addEventListener('click', () => playMasterUserAudio());
    trailDualCompareBtn.addEventListener('click', playMasterDualCompare);

    // Complete Day
    btnCompleteDay.addEventListener('click', toggleCompleteCurrentDay);

    // Vault Subnav: List vs Flashcards
    if (vaultTabListBtn && vaultTabCardsBtn) {
      vaultTabListBtn.addEventListener('click', () => {
        vaultSubMode = 'list';
        vaultTabListBtn.classList.add('active');
        vaultTabCardsBtn.classList.remove('active');
        vaultModeList.classList.remove('hidden');
        vaultModeCards.classList.add('hidden');
        renderVaultList();
      });

      vaultTabCardsBtn.addEventListener('click', () => {
        vaultSubMode = 'cards';
        vaultTabCardsBtn.classList.add('active');
        vaultTabListBtn.classList.remove('active');
        vaultModeCards.classList.remove('hidden');
        vaultModeList.classList.add('hidden');
        startFlashcards();
      });
    }

    // Flashcard Flip & Buttons
    if (flashcardElement) {
      flashcardElement.addEventListener('click', flipFlashcard);
    }
    if (fcFlipBtn) {
      fcFlipBtn.addEventListener('click', flipFlashcard);
    }
    if (fcAudioBtn) {
      fcAudioBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (flashcardsDeck[currentFcIndex]) {
          speakBritish(flashcardsDeck[currentFcIndex].term);
        }
      });
    }
    if (fcRepeatBtn) {
      fcRepeatBtn.addEventListener('click', () => nextFlashcard(false));
    }
    if (fcMasterBtn) {
      fcMasterBtn.addEventListener('click', () => nextFlashcard(true));
    }

    // Vault Filter Pills
    vPills.forEach(pill => {
      pill.addEventListener('click', () => {
        vPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        vaultFilter = pill.getAttribute('data-filter') || 'all';
        renderVaultList();
      });
    });

    // Vault Search Input
    if (vaultSearchInput) {
      vaultSearchInput.addEventListener('input', (e) => {
        vaultSearchQuery = e.target.value.trim();
        renderVaultList();
      });
    }

    // Modal: Add Custom Expression
    if (openAddExpressionBtn && addExpressionModal) {
      openAddExpressionBtn.addEventListener('click', () => {
        addExpressionModal.classList.remove('hidden');
        customTerm.focus();
      });
      if (closeExprModalBtn) {
        closeExprModalBtn.addEventListener('click', () => addExpressionModal.classList.add('hidden'));
      }
      if (cancelExprModalBtn) {
        cancelExprModalBtn.addEventListener('click', () => addExpressionModal.classList.add('hidden'));
      }
      if (addExpressionForm) {
        addExpressionForm.addEventListener('submit', (e) => {
          e.preventDefault();
          const t = customTerm.value.trim();
          const m = customMeaning.value.trim();
          const c = customContext ? customContext.value.trim() : '';

          if (!t || !m) return;

          const newExpr = {
            id: 'cust_expr_' + Date.now(),
            day: 'Custom',
            lessonTitle: 'Caderno Pessoal',
            week: 0,
            term: t,
            meaning: m,
            example: c
          };

          customExpressions.unshift(newExpr);
          vaultStarred.add(t);
          saveVaultData();
          updateVaultBadge();
          updateVaultStats();

          addExpressionModal.classList.add('hidden');
          addExpressionForm.reset();
          renderVaultList();
        });
      }
    }

    // Studio Dock controls
    closeStudioBtn.addEventListener('click', closeStudio);
    studioPlayNativeBtn.addEventListener('click', () => {
      if (activePhrase) speakBritish(activePhrase.en);
    });
    studioRecordBtn.addEventListener('click', toggleStudioRecording);
    studioPlayUserBtn.addEventListener('click', () => playStudioUserAudio());
    studioPlayDualBtn.addEventListener('click', playStudioDualShadowing);

    // Global speed buttons (header)
    speedBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        speedBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        playbackSpeed = parseFloat(btn.dataset.speed) || 1.0;
        if (trailMasterAudioElem) trailMasterAudioElem.playbackRate = playbackSpeed;
      });
    });

    // Soundboard search & categories
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.trim();
        clearSearchBtn.classList.toggle('hidden', searchQuery.length === 0);
        renderSoundboardGrid();
      });
    }

    if (clearSearchBtn) {
      clearSearchBtn.addEventListener('click', () => {
        searchInput.value = '';
        searchQuery = '';
        clearSearchBtn.classList.add('hidden');
        renderSoundboardGrid();
      });
    }

    catPills.forEach(pill => {
      pill.addEventListener('click', () => {
        catPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        currentCategory = pill.dataset.cat;
        renderSoundboardGrid();
      });
    });
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function escapeHtmlAttr(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Auto-start
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
