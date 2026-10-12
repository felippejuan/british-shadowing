/**
 * The Posh Lab — British Immersion & Shadowing Studio Engine
 * Features:
 * 1. 30-Day Immersion Trail (Primary View): ~2-minute master audios, full scripts,
 *    idiomatic glossaries, 3-block paragraph drills, 2-minute master recording.
 * 2. Soundboard de Bolso (Secondary View): 34 quick cards, soundboard playback,
 *    and instant phonetic drills.
 */

(function () {
  'use strict';

  // =========================================================================
  // 1. Storage Keys & State
  // =========================================================================
  const STORAGE_CUSTOM_KEY = 'the_posh_lab_custom_phrases_v1';
  const STORAGE_COMPLETED_KEY = 'the_posh_lab_trail_completed_v1';

  let currentMode = 'trail'; // 'trail' (default) or 'soundboard'
  let completedDays = new Set();
  let currentTrailDay = null;
  let playbackSpeed = 1.0;
  let selectedBritishVoice = null;
  let isMasterAudioLooping = false;

  // Soundboard state
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
  const navSoundboardBtn = document.getElementById('navSoundboardBtn');
  const trailView = document.getElementById('trailView');
  const soundboardView = document.getElementById('soundboardView');
  const trailStreakBadge = document.getElementById('trailStreakBadge');

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

  // Custom Phrase Modal
  const addModal = document.getElementById('addModal');
  const openAddCustomModalBtn = document.getElementById('openAddCustomModalBtn');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const cancelModalBtn = document.getElementById('cancelModalBtn');
  const addCustomForm = document.getElementById('addCustomForm');

  // =========================================================================
  // 3. Initialization
  // =========================================================================
  function init() {
    loadCompletedDays();
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

    trailStreakBadge.textContent = `${count}/${total}`;
    trailDaysCompletedCount.textContent = count;
    trailPercentText.textContent = `${pct}% Concluído`;
    trailProgressBar.style.width = `${pct}%`;
  }

  // =========================================================================
  // 4. Mode Switcher (Trail vs Soundboard)
  // =========================================================================
  function setMode(mode) {
    currentMode = mode;
    if (mode === 'trail') {
      navTrailBtn.classList.add('active');
      navSoundboardBtn.classList.remove('active');
      trailView.classList.remove('hidden');
      soundboardView.classList.add('hidden');
      closeStudio();
    } else {
      navSoundboardBtn.classList.add('active');
      navTrailBtn.classList.remove('active');
      soundboardView.classList.remove('hidden');
      trailView.classList.add('hidden');
      if (trailMasterAudioElem) trailMasterAudioElem.pause();
      renderSoundboardGrid();
    }
  }

  // =========================================================================
  // 5. Speech Synthesis & Voices
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
  // 6. Speech Recognition (STT) for Pronunciation Check
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
  // 7. 30-Day Immersion Trail (Primary Engine)
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
          <span class="trail-day-num">D${item.day}</span>
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
    workoutDayBadge.textContent = `Dia ${item.day} de 30`;
    workoutVoiceBadge.textContent = `🎙️ Narrador Oficial: ${item.voice.includes('Sonia') ? 'Sonia (Londres)' : 'Ryan (Oxford RP)'}`;
    workoutMainTitle.textContent = item.title;
    workoutFocusTag.textContent = `Foco Fonético: ${item.accentFocus}`;

    // Setup Master Audio Player
    const audioPath = `audio/day-${String(item.day).padStart(2, '0')}.mp3`;
    trailMasterAudioElem.src = audioPath;
    trailMasterAudioElem.playbackRate = playbackSpeed;
    trailMasterSlider.value = 0;
    trailMasterTimeReadout.textContent = "0:00 / 0:00";
    trailMasterPlayBtn.textContent = "▶";

    // Setup Passo 2: Full Script
    workoutFullScriptBox.innerHTML = '';
    const paragraphs = item.script.split('\n\n');
    paragraphs.forEach(pText => {
      const p = document.createElement('p');
      p.textContent = pText.trim();
      workoutFullScriptBox.appendChild(p);
    });

    // Setup Passo 3: Glossary Cards
    workoutGlossaryGrid.innerHTML = '';
    if (item.glossary && item.glossary.length) {
      item.glossary.forEach(g => {
        const card = document.createElement('div');
        card.className = 'glossary-card';
        card.innerHTML = `
          <strong>${escapeHtml(g.term)}</strong>
          <span>${escapeHtml(g.meaning)}</span>
        `;
        workoutGlossaryGrid.appendChild(card);
      });
    }

    // Setup Passo 4: 3 Workout Blocks
    workoutParagraphsList.innerHTML = '';
    const blocks = item.paragraphs || [];
    blocks.forEach((b, bIdx) => {
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
        <p class="block-text">${escapeHtml(b.text)}</p>
        <div class="block-cheat-tip">
          💡 <strong>Dica Fonética:</strong> ${escapeHtml(b.cheatTips || item.brazilianCheatTips || '')}
        </div>
      `;

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
  // 8. Master 2-Minute Audio Player Controls
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
  // 9. 2-Minute Master Recorder (Full Reading Recording)
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
    trailRecordMasterLabel.textContent = "Regravar Minha Sessão";
  }

  function playMasterUserAudio(onEndCallback = null) {
    if (!masterAudioUrl) return;
    const audio = new Audio(masterAudioUrl);
    if (onEndCallback) audio.onended = onEndCallback;
    audio.play();
  }

  function playMasterDualCompare() {
    if (!currentTrailDay || !masterAudioUrl) return;

    trailDualCompareBtn.disabled = true;
    trailDualCompareBtn.innerHTML = '<span>⚡ Tocando Trecho Nativo...</span>';

    // Play 15 seconds of master audio, then 15 seconds of user recording to compare cadence
    trailMasterAudioElem.currentTime = 0;
    trailMasterAudioElem.play();

    setTimeout(() => {
      trailMasterAudioElem.pause();
      trailDualCompareBtn.innerHTML = '<span>🎧 Ouvindo Sua Voz...</span>';
      playMasterUserAudio(() => {
        trailDualCompareBtn.disabled = false;
        trailDualCompareBtn.innerHTML = '<span class="icon">⚡</span><span>Comparar Ritmo (Dual)</span>';
      });
    }, 12000);
  }

  // =========================================================================
  // 10. Canvases & Waveform Visualizers
  // =========================================================================
  function setupCanvases() {
    drawIdleCanvas(trailVisualizerCanvas);
    drawIdleCanvas(studioVisualizerCanvas);
  }

  function drawIdleCanvas(canvas) {
    if (!canvas) return;
    canvas.width = canvas.offsetWidth || 500;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#0e1e38';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = '#c49733';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, canvas.height / 2);
    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.stroke();
  }

  function setupMasterAudioStream(stream) {
    if (!audioContext) audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const source = audioContext.createMediaStreamSource(stream);
    masterAnalyser = audioContext.createAnalyser();
    masterAnalyser.fftSize = 64;
    source.connect(masterAnalyser);
  }

  function startMasterVisualizerLoop() {
    if (!masterAnalyser || !trailVisualizerCanvas) return;
    const ctx = trailVisualizerCanvas.getContext('2d');
    const bufferLength = masterAnalyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    function draw() {
      if (!isMasterRecording) return;
      requestAnimationFrame(draw);

      masterAnalyser.getByteFrequencyData(dataArray);

      ctx.fillStyle = '#0e1e38';
      ctx.fillRect(0, 0, trailVisualizerCanvas.width, trailVisualizerCanvas.height);

      const barWidth = (trailVisualizerCanvas.width / bufferLength) * 1.5;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * trailVisualizerCanvas.height;
        ctx.fillStyle = i % 2 === 0 ? '#c49733' : '#1b8a5a';
        ctx.fillRect(x, trailVisualizerCanvas.height - barHeight, barWidth - 1, barHeight);
        x += barWidth;
      }
    }
    draw();
  }

  // =========================================================================
  // 11. Studio Dock (Block & Phrase Practice)
  // =========================================================================
  function openStudio(phrase) {
    activePhrase = phrase;
    studioPhraseText.textContent = phrase.en;
    studioIpa.textContent = phrase.ipa;
    studioCheat.textContent = `Mapeamento: "${phrase.cheat}"`;
    studioTip.textContent = phrase.tip || "Articule com cadência pausada.";

    studioBlob = null;
    if (studioAudioUrl) URL.revokeObjectURL(studioAudioUrl);
    studioAudioUrl = null;
    studioPlayUserBtn.disabled = true;
    studioPlayDualBtn.disabled = true;
    studioRecordLabel.textContent = "Gravar Minha Voz";
    sttStatusText.textContent = "Aguardando gravação para validação de pronúncia...";
    setSttDot('idle');
    sttTranscriptWrap.classList.add('hidden');
    sttTranscriptText.textContent = '';

    drawIdleCanvas(studioVisualizerCanvas);

    studioDock.classList.remove('hidden');
    studioDock.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    speakBritish(phrase.en);
  }

  function closeStudio() {
    if (isStudioRecording) stopStudioRecording();
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    studioDock.classList.add('hidden');
    activePhrase = null;
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
      studioRecordLabel.textContent = "Parar Gravação (Gravando...)";
      sttStatusText.textContent = "Gravando sua voz... Fale com dicção clara!";
      setSttDot('active');

      if (recognition && !isRecognizing) {
        try { recognition.start(); } catch (e) {}
      }

      startStudioVisualizerLoop();
    } catch (err) {
      console.error('Microfone inacessível:', err);
      alert('Não foi possível acessar seu microfone.');
    }
  }

  function stopStudioRecording() {
    if (studioRecorder && studioRecorder.state !== 'inactive') {
      studioRecorder.stop();
    }
    isStudioRecording = false;
    studioRecordBtn.classList.remove('recording');
    studioRecordLabel.textContent = "Regravar Minha Voz";
    if (recognition && isRecognizing) {
      try { recognition.stop(); } catch (e) {}
    }
  }

  function setupStudioAudioStream(stream) {
    if (!audioContext) audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const source = audioContext.createMediaStreamSource(stream);
    studioAnalyser = audioContext.createAnalyser();
    studioAnalyser.fftSize = 64;
    source.connect(studioAnalyser);
  }

  function startStudioVisualizerLoop() {
    if (!studioAnalyser || !studioVisualizerCanvas) return;
    const ctx = studioVisualizerCanvas.getContext('2d');
    const bufferLength = studioAnalyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    function draw() {
      if (!isStudioRecording) return;
      requestAnimationFrame(draw);

      studioAnalyser.getByteFrequencyData(dataArray);

      ctx.fillStyle = '#0e1e38';
      ctx.fillRect(0, 0, studioVisualizerCanvas.width, studioVisualizerCanvas.height);

      const barWidth = (studioVisualizerCanvas.width / bufferLength) * 1.5;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * studioVisualizerCanvas.height;
        ctx.fillStyle = i % 2 === 0 ? '#c49733' : '#1b8a5a';
        ctx.fillRect(x, studioVisualizerCanvas.height - barHeight, barWidth - 1, barHeight);
        x += barWidth;
      }
    }
    draw();
  }

  function playStudioUserAudio(onEndCallback = null) {
    if (!studioAudioUrl) return;
    const audio = new Audio(studioAudioUrl);
    if (onEndCallback) audio.onended = onEndCallback;
    audio.play();
  }

  function playStudioDualShadowing() {
    if (!activePhrase || !studioAudioUrl) return;

    studioPlayDualBtn.disabled = true;
    studioPlayDualBtn.innerHTML = '<span>⚡ Tocando Modelo Nativo...</span>';

    speakBritish(activePhrase.en, () => {
      studioPlayDualBtn.innerHTML = '<span>🎧 Ouvindo Sua Voz...</span>';
      setTimeout(() => {
        playStudioUserAudio(() => {
          studioPlayDualBtn.disabled = false;
          studioPlayDualBtn.innerHTML = '<span class="icon">⚡</span><span>Comparar Ritmo (Dual)</span>';
        });
      }, 350);
    });
  }

  // =========================================================================
  // 12. Soundboard de Bolso (Secondary View)
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
      const saved = localStorage.getItem(STORAGE_CUSTOM_KEY);
      if (saved) custom = JSON.parse(saved);
    } catch (e) {}
    allSoundboardPhrases = [...DEFAULT_SOUNDBOARD, ...custom];
    countAll.textContent = allSoundboardPhrases.length;
  }

  function renderSoundboardGrid() {
    const q = searchQuery.toLowerCase();
    const list = allSoundboardPhrases.filter(p => {
      const matchCat = currentCategory === 'all' || p.cat === currentCategory;
      if (!matchCat) return false;
      if (!q) return true;
      return p.en.toLowerCase().includes(q) || p.pt.toLowerCase().includes(q) || p.cheat.toLowerCase().includes(q);
    });

    displayedCount.textContent = list.length;
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
  // 13. Event Listeners & Binding
  // =========================================================================
  function bindEvents() {
    // Mode Navigation
    navTrailBtn.addEventListener('click', () => setMode('trail'));
    navSoundboardBtn.addEventListener('click', () => setMode('soundboard'));

    // Master Player Controls
    setupTrailMasterPlayer();

    // 2-Minute Master Recorder
    trailRecordMasterBtn.addEventListener('click', toggleMasterRecording);
    trailPlayUserRecordingBtn.addEventListener('click', () => playMasterUserAudio());
    trailDualCompareBtn.addEventListener('click', playMasterDualCompare);

    // Complete Day
    btnCompleteDay.addEventListener('click', toggleCompleteCurrentDay);

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
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.trim();
      clearSearchBtn.classList.toggle('hidden', searchQuery.length === 0);
      renderSoundboardGrid();
    });

    clearSearchBtn.addEventListener('click', () => {
      searchInput.value = '';
      searchQuery = '';
      clearSearchBtn.classList.add('hidden');
      renderSoundboardGrid();
    });

    catPills.forEach(pill => {
      pill.addEventListener('click', () => {
        catPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        currentCategory = pill.dataset.cat;
        renderSoundboardGrid();
      });
    });

    // Modal Add Custom Phrase
    openAddCustomModalBtn.addEventListener('click', () => addModal.classList.remove('hidden'));
    closeModalBtn.addEventListener('click', () => addModal.classList.add('hidden'));
    cancelModalBtn.addEventListener('click', () => addModal.classList.add('hidden'));

    addCustomForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const en = document.getElementById('customEn').value.trim();
      const pt = document.getElementById('customPt').value.trim() || 'Frase pessoal';
      const cheat = document.getElementById('customCheat').value.trim() || 'Treino livre';
      const tip = document.getElementById('customTip').value.trim() || 'Pratique com dicção serena.';

      if (!en) return;

      const newPhrase = {
        id: 'cust_' + Date.now(),
        cat: 'custom',
        en,
        pt,
        ipa: '/custom/',
        cheat,
        tip
      };

      allSoundboardPhrases.push(newPhrase);
      localStorage.setItem(STORAGE_CUSTOM_KEY, JSON.stringify(allSoundboardPhrases.filter(p => p.cat === 'custom')));
      addModal.classList.add('hidden');
      addCustomForm.reset();
      renderSoundboardGrid();
      openStudio(newPhrase);
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

  // Auto-start
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
