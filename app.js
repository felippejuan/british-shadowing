/**
 * The Posh Lab — High Society British Shadowing Engine
 * Full Suite: Soundboard & Drills + 30-Day Audio Challenge
 */

(function () {
  'use strict';

  // =========================================================================
  // 1. Database: Soundboard Phrases (Modern RP)
  // =========================================================================
  const DEFAULT_PHRASES = [
    // --- Politeness & Diplomacy ---
    {
      id: 'p1',
      cat: 'politeness',
      en: "I'm afraid that won't be possible.",
      pt: "Receio que isso não será possível. (Recusa diplomática clássica)",
      ipa: "/aɪm əˈfreɪd ðæt wəʊnt biː ˈpɒsəbl̩/",
      cheat: "áim uh-frêid dhét wôunt bi póssubôul",
      tip: "Em Modern RP, 'won't' tem o ditongo /əʊ/ (wôunt), e o 't' final é seco. 'I'm afraid' soa suave e comedido, nunca rude."
    },
    {
      id: 'p2',
      cat: 'politeness',
      en: "Would you mind awfully if I took this seat?",
      pt: "Você se importaria terrivelmente se eu me sentasse aqui?",
      ipa: "/wʊd juː maɪnd ˈɔːfəli ɪf aɪ tʊk ðɪs siːt/",
      cheat: "uud iu máind óo-fuli if ái tuk dhis síit?",
      tip: "'Awfully' é o advérbio favorito da alta sociedade para intensificar polidez. Pronuncie 'took' com vogal curta /ʊ/ e 'seat' longo /iː/."
    },
    {
      id: 'p3',
      cat: 'politeness',
      en: "I'd rather not, to be perfectly honest.",
      pt: "Eu preferiria não, para ser perfeitamente sincero.",
      ipa: "/aɪd ˈrɑːðə nɒt tə bi ˈpɜːfɪktli ˈɒnɪst/",
      cheat: "áid ráa-dhuh nót, tuh bi péer-fiktli ónist",
      tip: "'Rather' leva o 'Broad A' /ɑː/ profundo de garganta, e NENHUM 'r' no final. O 'honest' tem H totalmente mudo e O curto /ɒ/."
    },
    {
      id: 'p4',
      cat: 'politeness',
      en: "Could you possibly pass the water?",
      pt: "Você poderia por favor me passar a água?",
      ipa: "/kʊd juː ˈpɒsəbli pɑːs ðə ˈwɔːtə/",
      cheat: "kud iu póssubli páas dhuh uóo-tuh?",
      tip: "O teste clássico: 'pass' leva /ɑː/ longo de dentista, e 'water' tem um 'T' estalado limpo, sem virar o 'D' americano nem engolir no glotal."
    },
    {
      id: 'p5',
      cat: 'politeness',
      en: "I dreadfully apologize for keeping you waiting.",
      pt: "Peço imensas desculpas por tê-lo feito esperar.",
      ipa: "/aɪ ˈdredfəli əˈpɒlədʒaɪz fə ˈkiːpɪŋ juː ˈweɪtɪŋ/",
      cheat: "ái dréd-fuli uh-pó-luh-djaiz fuh kíiping iu uêiting",
      tip: "'For' vira a forma fraca /fə/ (fuh). A entonação desce no final com compostura."
    },
    {
      id: 'p6',
      cat: 'politeness',
      en: "Not to worry in the slightest.",
      pt: "Não se preocupe de modo algum / De jeito nenhum.",
      ipa: "/nɒt tə ˈwʌri ɪn ðə ˈslaɪtɪst/",
      cheat: "nót tuh uâ-ri in dhuh slái-tist",
      tip: "Frase muito natural para acalmar a outra pessoa com sofisticação. 'Slightest' termina com um 'T' nítido."
    },
    {
      id: 'p7',
      cat: 'politeness',
      en: "Could I trouble you for a pen, please?",
      pt: "Poderia incomodá-lo pedindo uma caneta, por favor?",
      ipa: "/kʊd aɪ ˈtrʌbl juː fər ə pen pliːz/",
      cheat: "kud ái trâb-l iu fur uh pén, plíiz?",
      tip: "Forma polida casual de pedir pequenos favores. 'Trouble' soa compacto, quase monossilábico na transição para 'you'."
    },
    {
      id: 'p8',
      cat: 'politeness',
      en: "Much obliged, you've been most helpful.",
      pt: "Muito obrigado, você foi extremamente prestativo.",
      ipa: "/mʌtʃ əˈblaɪdʒd juːv biːn məʊst ˈhelpfl/",
      cheat: "mâtch uh-bláidjd, iúuv biin môust hélpful",
      tip: "'Much obliged' é uma expressão atemporal e distinta. 'Most helpful' soa muito mais elegante do que 'very helpful'."
    },

    // --- Social & Casual Small Talk ---
    {
      id: 's1',
      cat: 'social',
      en: "Rather brilliant, actually.",
      pt: "Bastante brilhante, para falar a verdade.",
      ipa: "/ˈrɑːðə ˈbrɪljənt ˈæktʃuəli/",
      cheat: "ráa-dhuh brí-liant, ék-tchu-uh-li",
      tip: "A assinatura da conversa britânica casual. Três palavras com cadência rítmica perfeita: 'ráa-dhuh' (sem R final), 'brilliant' seco e 'actually' suave."
    },
    {
      id: 's2',
      cat: 'social',
      en: "Fancy grabbing a quick coffee?",
      pt: "A fim de tomar um cafezinho rápido?",
      ipa: "/ˈfænsi ˈɡræbɪŋ ə kwɪk ˈkɒfi/",
      cheat: "fén-si gré-bin uh kuík kó-fi?",
      tip: "'Fancy' substitui 'do you want' com muita naturalidade e charme. 'Coffee' tem o 'o' curto arredondado /ɒ/, não o 'cáfi' americano."
    },
    {
      id: 's3',
      cat: 'social',
      en: "Spot on, that's precisely what I meant.",
      pt: "Na mosca, é exatamente isso que eu quis dizer.",
      ipa: "/spɒt ɒn ðæts prɪˈsaɪsli wɒt aɪ ment/",
      cheat: "spót ón, dhéts pri-sáiss-li uót ái mént",
      tip: "'Spot on' conecta as palavras: 'spó-tón'. O 'precisely' substitui 'exactly' conferindo tom refinado."
    },
    {
      id: 's4',
      cat: 'social',
      en: "Fair enough, makes total sense.",
      pt: "Justo / Compreensível, faz todo o sentido.",
      ipa: "/feə ɪˈnʌf meɪks ˈtəʊtl sens/",
      cheat: "fê-uh i-nâf, mêiks tôu-tôul sénss",
      tip: "'Fair' não tem som de R no final! Soa como /feə/ (fê-uh). 'Total' tem o 'Dark L' suave no final."
    },
    {
      id: 's5',
      cat: 'social',
      en: "I haven't got the foggiest idea.",
      pt: "Não faço a menor ideia. (Gíria elegante britânica)",
      ipa: "/aɪ ˈhævnt ɡɒt ðə ˈfɒɡiɪst aɪˈdɪə/",
      cheat: "ái hévnt gót dhuh fó-gui-ist ai-dii-uh",
      tip: "Muito mais charmoso que 'I don't know'. O 'idea' britânico termina com 'uh' (/aɪˈdɪə/), nunca com 'r'."
    },
    {
      id: 's6',
      cat: 'social',
      en: "Shall we call it a day, then?",
      pt: "Vamos encerrar por hoje, então?",
      ipa: "/ʃəl wi kɔːl ɪt ə deɪ ðen/",
      cheat: "shul ui kóol it uh dêi, dhén?",
      tip: "'Shall' é usado com naturalidade em sugestões na 1ª pessoa plural. 'Call it a' é emendado: 'kóo-li-tuh'."
    },
    {
      id: 's7',
      cat: 'social',
      en: "I'm running a tad late, see you shortly.",
      pt: "Estou um tiquinho atrasado, te vejo em breve.",
      ipa: "/aɪm ˈrʌnɪŋ ə tæd leɪt siː juː ˈʃɔːtli/",
      cheat: "áim rânin uh téd lêit, síi iu shóot-li",
      tip: "'A tad' significa 'um pouquinho'. Em 'shortly', o som /ɔː/ é longo e o 'r' é totalmente silenciado."
    },
    {
      id: 's8',
      cat: 'social',
      en: "I'm absolutely knackered, to tell you the truth.",
      pt: "Estou completamente exausto, para falar a verdade.",
      ipa: "/aɪm ˌæbsəˈluːtli ˈnækəd tə tel juː ðə truːθ/",
      cheat: "áim éb-suh-luut-li né-kud, tuh tél iu dhuh trúuth",
      tip: "'Knackered' é a gíria favorita de todas as classes britânicas para exaustão. O K inicial é mudo e o R final não existe."
    },

    // --- Debate, Meetings & Assertiveness ---
    {
      id: 'd1',
      cat: 'debate',
      en: "To be quite frank, it's rather underwhelming.",
      pt: "Para ser bastante franco, ficou aquém do esperado.",
      ipa: "/tə bi kwaɪt fræŋk ɪts ˈrɑːðər ˌʌndəˈwelmɪŋ/",
      cheat: "tuh bi kuáit frênk, its ráa-dhur ân-duh-uél-min",
      tip: "Como criticar com máxima classe. 'Underwhelming' soa culto e cirúrgico. Aqui o R de 'rather' conecta suavemente no 'underwhelming' (Linking R!)."
    },
    {
      id: 'd2',
      cat: 'debate',
      en: "I see your point, but I'm not entirely convinced.",
      pt: "Entendo o seu ponto, mas não estou inteiramente convencido.",
      ipa: "/aɪ siː jɔː pɔɪnt bʌt aɪm nɒt ɪnˈtaɪəli kənˈvɪnst/",
      cheat: "ái síi ióo póint, bât áim nót in-tái-uh-li kun-vínst",
      tip: "Diga com tom calmo e voz firme. 'Entirely' tem 4 fonemas de vogal /ɪnˈtaɪəli/, sem R."
    },
    {
      id: 'd3',
      cat: 'debate',
      en: "That sounds utterly delightful.",
      pt: "Isso soa absolutamente encantador.",
      ipa: "/ðæt saʊndz ˈʌtəli dɪˈlaɪtfl/",
      cheat: "dhét sáundz â-tuh-li di-láit-ful",
      tip: "'Utterly' (completamente) pronunciado com dois Ts limpos e estalados /ʌtəli/, seguido do som aberto de 'delightful'."
    },
    {
      id: 'd4',
      cat: 'debate',
      en: "Let's not jump to conclusions just yet.",
      pt: "Não vamos tirar conclusões precipitadas ainda.",
      ipa: "/lets nɒt dʒʌmp tə kənˈkluːʒnz dʒʌst jet/",
      cheat: "léts nót djâmp tuh kun-klúu-juns djâst iét",
      tip: "O 'let's not' é falado com ritmo seco e seguro. 'Conclusions' tem o som /ʒ/ (como o 'j' de janela em português)."
    },
    {
      id: 'd5',
      cat: 'debate',
      en: "Splendid. We'll touch base tomorrow morning.",
      pt: "Esplêndido. Nos falaremos amanhã de manhã.",
      ipa: "/ˈsplendɪd wiːl tʌtʃ beɪs təˈmɒrəʊ ˈmɔːnɪŋ/",
      cheat: "splén-did. uíil tâtch bêiss tuh-mó-rou móo-nin",
      tip: "'Splendid' é a palavra de aprovação britânica por excelência. 'Tomorrow' termina em /əʊ/ e 'morning' não tem R."
    },
    {
      id: 'd6',
      cat: 'debate',
      en: "Right, let's get down to business, shall we?",
      pt: "Certo, vamos ao que interessa, então?",
      ipa: "/raɪt lets ɡet daʊn tə ˈbɪznəs ʃəl wi/",
      cheat: "ráit, léts gét dáun tuh bíz-niss, shul uíi?",
      tip: "'Right' no início de frases é o gatilho britânico para iniciar reuniões. O 'business' tem apenas 2 sílabas ('bíz-niss')."
    },
    {
      id: 'd7',
      cat: 'debate',
      en: "As a matter of fact, that was my proposal.",
      pt: "A bem da verdade / De fato, essa foi minha proposta.",
      ipa: "/əz ə ˈmætər əv fækt ðæt wɒz maɪ prəˈpəʊzl/",
      cheat: "uz uh mé-tur uv fékt, dhét uoz mái pruh-pôu-zôul",
      tip: "Em 'matter of', o R conecta a palavra seguinte (Linking R). Em 'proposal', a ênfase é na sílaba 'pôu'."
    },
    {
      id: 'd8',
      cat: 'debate',
      en: "I'm in two minds about this proposal.",
      pt: "Estou indeciso / dividido quanto a essa proposta.",
      ipa: "/aɪm ɪn tuː maɪndz əˈbaʊt ðɪs prəˈpəʊzl/",
      cheat: "áim in túu máindz uh-báut dhis pruh-pôu-zôul",
      tip: "Expressão idiomática excelente para evitar 'I'm undecided'. Soe pausado e reflexivo."
    },

    // --- Critical Pronunciation Drills ---
    {
      id: 'k1',
      cat: 'drills',
      en: "Water",
      pt: "Água — O teste supremo do sotaque britânico",
      ipa: "/ˈwɔːtə/",
      cheat: "uóo-tuh (NUNCA 'wá-der')",
      tip: "A primeira sílaba é 'wóo' (arredonde os lábios). O 't' bate estalado e o final morre num 'uh' relaxado. Sem som de R!"
    },
    {
      id: 'k2',
      cat: 'drills',
      en: "Schedule",
      pt: "Cronograma / Agenda",
      ipa: "/ˈʃedjuːl/",
      cheat: "shéd-yool (Britânico) vs skéd-jool (Americano)",
      tip: "No Reino Unido começa com som de 'SH' (/ʃ/), nunca com 'SK'. Dá um ar instantaneamente britânico."
    },
    {
      id: 'k3',
      cat: 'drills',
      en: "Garage",
      pt: "Garagem",
      ipa: "/ˈɡærɑːʒ/ ou /ˈɡærɪdʒ/",
      cheat: "gé-rahzh ou gé-ridj (ênfase na 1ª sílaba)",
      tip: "Britânicos colocam a ênfase na primeira sílaba ('GÉ-ridge' ou 'GÉ-rahzh'), enquanto os americanos dizem 'guh-RÁHDJ'."
    },
    {
      id: 'k4',
      cat: 'drills',
      en: "Comfortable",
      pt: "Confortável",
      ipa: "/ˈkʌmftəbl̩/",
      cheat: "kâmf-tuh-bôul (Apenas 3 sílabas!)",
      tip: "Coma a segunda sílaba! Não diga 'com-for-ta-ble'. É direto: 'kâmf' + 'tuh-bôul'."
    },
    {
      id: 'k5',
      cat: 'drills',
      en: "Advertisement",
      pt: "Anúncio / Publicidade",
      ipa: "/ədˈvɜːtɪsmənt/",
      cheat: "ud-VÉER-tiss-munt (ênfase no VÉER)",
      tip: "Na Inglaterra a ênfase fica na segunda sílaba: ad-VER-tis-ment. Nos EUA é AD-ver-tize-ment."
    },
    {
      id: 'k6',
      cat: 'drills',
      en: "Often",
      pt: "Frequentemente",
      ipa: "/ˈɒfn/ ou /ˈɒftən/",
      cheat: "óf-un (em Modern RP o T é mudo)",
      tip: "A pronúncia tradicional de prestígio silencia o 'T', soando 'óf-un'. O 'O' é curto e nítido."
    },
    {
      id: 'k7',
      cat: 'drills',
      en: "Neither",
      pt: "Nem um nem outro",
      ipa: "/ˈnaɪðə/",
      cheat: "nái-dhuh (com som de 'ái')",
      tip: "Britânicos preferem 'nái-dhuh' com ditongo /aɪ/, sem R final. Americanos costumam dizer 'ní-dher'."
    },
    {
      id: 'k8',
      cat: 'drills',
      en: "Tomato",
      pt: "Tomate",
      ipa: "/təˈmɑːtəʊ/",
      cheat: "tuh-MÁA-tôu",
      tip: "O clássico 'Broad A': a sílaba central é aberta e profunda (/mɑː/), e o final é o ditongo elegante /təʊ/."
    },
    {
      id: 'k9',
      cat: 'drills',
      en: "I can't believe this bath is cold.",
      pt: "Não acredito que este banho está frio. (Treino do Broad A)",
      ipa: "/aɪ kɑːnt bɪˈliːv ðɪs bɑːθ ɪz kəʊld/",
      cheat: "ái káant bi-líiv dhis báath iz kôuld",
      tip: "Tanto 'can't' quanto 'bath' usam a vogal /ɑː/ aberta e profunda. É o oposto do 'ként' e 'bét' americano."
    },
    {
      id: 'k10',
      cat: 'drills',
      en: "Privacy and Secretary",
      pt: "Privacidade e Secretária",
      ipa: "/ˈprɪvəsi/ & /ˈsekrətri/",
      cheat: "prí-vuh-si e sé-kruh-tri",
      tip: "Em 'Privacy', a 1ª vogal é curta /ɪ/ (prí-vuh-si), não 'prái-vuh-si'. Em 'Secretary', são apenas 3 sílabas sem enrolação."
    }
  ];

  // Storage Keys
  const STORAGE_CUSTOM_KEY = 'the_posh_lab_custom_phrases_v1';
  const STORAGE_COMPLETED_KEY = 'the_posh_lab_challenge_completed_v1';

  // Global State
  let allPhrases = [];
  let currentCategory = 'all';
  let searchQuery = '';
  let activePhrase = null;
  let playbackSpeed = 1.0;
  let selectedBritishVoice = null;
  let loopActiveOnCard = null;

  // Challenge State
  let completedDays = new Set();
  let currentChallengeDay = null;

  // Audio Recording State
  let mediaRecorder = null;
  let audioChunks = [];
  let userAudioBlob = null;
  let userAudioUrl = null;
  let isRecording = false;
  let audioContext = null;
  let analyser = null;

  // Speech Recognition (STT) State
  let recognition = null;
  let isRecognizing = false;

  // DOM Elements - Mode Nav
  const navSoundboardBtn = document.getElementById('navSoundboardBtn');
  const navChallengeBtn = document.getElementById('navChallengeBtn');
  const soundboardView = document.getElementById('soundboardView');
  const challengeView = document.getElementById('challengeView');
  const streakBadge = document.getElementById('streakBadge');

  // DOM Elements - Voice & Global Controls
  const voiceSelect = document.getElementById('voiceSelect');
  const speedBtns = document.querySelectorAll('.speed-btn');

  // DOM Elements - Soundboard
  const searchInput = document.getElementById('searchInput');
  const clearSearchBtn = document.getElementById('clearSearchBtn');
  const catPills = document.querySelectorAll('.cat-pill');
  const phrasesGrid = document.getElementById('phrasesGrid');
  const displayedCount = document.getElementById('displayedCount');
  const countAll = document.getElementById('countAll');

  // DOM Elements - Shadowing Studio Dock
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
  const visualizerCanvas = document.getElementById('studioVisualizerCanvas');

  // DOM Elements - Challenge View
  const challengeProgressBar = document.getElementById('challengeProgressBar');
  const challengePercent = document.getElementById('challengePercent');
  const challengeCompletedCount = document.getElementById('challengeCompletedCount');
  const challengeDaysList = document.getElementById('challengeDaysList');
  const workoutDayTag = document.getElementById('workoutDayTag');
  const workoutDayTitle = document.getElementById('workoutDayTitle');
  const workoutFocusBadge = document.getElementById('workoutFocusBadge');
  const masterPlayBtn = document.getElementById('masterPlayBtn');
  const masterSeekSlider = document.getElementById('masterSeekSlider');
  const masterTimeDisplay = document.getElementById('masterTimeDisplay');
  const masterAudioElem = document.getElementById('masterAudioElem');
  const workoutScriptFull = document.getElementById('workoutScriptFull');
  const workoutBrazilianTip = document.getElementById('workoutBrazilianTip');
  const workoutSentenceList = document.getElementById('workoutSentenceList');
  const toggleCompleteDayBtn = document.getElementById('toggleCompleteDayBtn');
  const completeDayIcon = document.getElementById('completeDayIcon');
  const completeDayLabel = document.getElementById('completeDayLabel');
  const challengeSpeedChips = document.querySelectorAll('.audio-speed-chip');

  // DOM Elements - Custom Phrase Modal
  const addModal = document.getElementById('addModal');
  const openAddCustomModalBtn = document.getElementById('openAddCustomModalBtn');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const cancelModalBtn = document.getElementById('cancelModalBtn');
  const addCustomForm = document.getElementById('addCustomForm');

  // =========================================================================
  // 2. Initialization
  // =========================================================================
  function init() {
    loadPhrases();
    loadCompletedDays();
    initVoices();
    initSpeechRecognition();
    setupCanvas();
    bindEvents();
    renderGrid();
    renderChallengeSidebar();
    loadDayWorkout(1); // Default to Day 1
  }

  function loadPhrases() {
    let custom = [];
    try {
      const saved = localStorage.getItem(STORAGE_CUSTOM_KEY);
      if (saved) custom = JSON.parse(saved);
    } catch (e) {}
    allPhrases = [...DEFAULT_PHRASES, ...custom];
    countAll.textContent = allPhrases.length;
  }

  function loadCompletedDays() {
    try {
      const saved = localStorage.getItem(STORAGE_COMPLETED_KEY);
      if (saved) {
        completedDays = new Set(JSON.parse(saved));
      }
    } catch (e) {}
    updateProgressUI();
  }

  function updateProgressUI() {
    const count = completedDays.size;
    const total = (window.CHALLENGE_30_DAYS || []).length || 30;
    const pct = Math.round((count / total) * 100);

    streakBadge.textContent = `${count}/${total}`;
    challengeCompletedCount.textContent = count;
    challengePercent.textContent = `${pct}%`;
    challengeProgressBar.style.width = `${pct}%`;
  }

  // =========================================================================
  // 3. Mode Navigation (Soundboard vs Challenge)
  // =========================================================================
  function setMode(mode) {
    if (mode === 'soundboard') {
      navSoundboardBtn.classList.add('active');
      navChallengeBtn.classList.remove('active');
      soundboardView.classList.remove('hidden');
      challengeView.classList.add('hidden');
      if (masterAudioElem) masterAudioElem.pause();
    } else {
      navChallengeBtn.classList.add('active');
      navSoundboardBtn.classList.remove('active');
      challengeView.classList.remove('hidden');
      soundboardView.classList.add('hidden');
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      closeStudio();
    }
  }

  // =========================================================================
  // 4. Speech Synthesis & British Voice Selection
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
  // 5. Speech Recognition (STT) for British Pronunciation Check
  // =========================================================================
  function initSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      sttStatusText.textContent = "Reconhecimento de fala disponível em navegadores Chromium (Chrome/Edge).";
      return;
    }

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
        sttStatusText.innerHTML = `👍 <strong>Muito bom (${pct}% de clareza).</strong> Quase idêntico ao modelo nativo.`;
        setSttDot('success');
      } else {
        sttStatusText.innerHTML = `⚠️ <strong>Atenção (${pct}% de correspondência):</strong> Tente articular com mais clareza e ritmo pausado.`;
        setSttDot('idle');
      }
    }
  }

  function cleanText(txt) {
    return (txt || '').toLowerCase().replace(/[^a-z0-9 ]/g, '').trim();
  }

  // =========================================================================
  // 6. Audio Recording & Web Audio Visualizer
  // =========================================================================
  async function toggleRecording() {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  }

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setupAudioStream(stream);

      audioChunks = [];
      mediaRecorder = new MediaRecorder(stream);

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunks.push(e.data);
      };

      mediaRecorder.onstop = () => {
        userAudioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        if (userAudioUrl) URL.revokeObjectURL(userAudioUrl);
        userAudioUrl = URL.createObjectURL(userAudioBlob);

        studioPlayUserBtn.disabled = false;
        studioPlayDualBtn.disabled = false;

        stream.getTracks().forEach(track => track.stop());
        if (analyser) drawIdleVisualizer();
      };

      mediaRecorder.start();
      isRecording = true;
      studioRecordBtn.classList.add('recording');
      studioRecordLabel.textContent = "Parar Gravação (Gravando...)";
      sttStatusText.textContent = "Gravando sua voz... Fale com dicção clara!";
      setSttDot('active');

      if (recognition && !isRecognizing) {
        try { recognition.start(); } catch (e) {}
      }

      startVisualizerLoop();
    } catch (err) {
      console.error('Microfone inacessível:', err);
      alert('Não foi possível acessar seu microfone. Verifique as permissões do navegador.');
    }
  }

  function stopRecording() {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
    }
    isRecording = false;
    studioRecordBtn.classList.remove('recording');
    studioRecordLabel.textContent = "Regravar Minha Voz";
    if (recognition && isRecognizing) {
      try { recognition.stop(); } catch (e) {}
    }
  }

  function setupAudioStream(stream) {
    if (!audioContext) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    const source = audioContext.createMediaStreamSource(stream);
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 64;
    source.connect(analyser);
  }

  function setupCanvas() {
    if (!visualizerCanvas) return;
    const ctx = visualizerCanvas.getContext('2d');
    visualizerCanvas.width = visualizerCanvas.offsetWidth || 500;
    visualizerCanvas.height = 50;
    drawIdleVisualizer();
  }

  function drawIdleVisualizer() {
    if (!visualizerCanvas) return;
    const ctx = visualizerCanvas.getContext('2d');
    ctx.clearRect(0, 0, visualizerCanvas.width, visualizerCanvas.height);
    ctx.fillStyle = '#0e1e38';
    ctx.fillRect(0, 0, visualizerCanvas.width, visualizerCanvas.height);

    ctx.strokeStyle = '#c49733';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, visualizerCanvas.height / 2);
    ctx.lineTo(visualizerCanvas.width, visualizerCanvas.height / 2);
    ctx.stroke();
  }

  function startVisualizerLoop() {
    if (!analyser || !visualizerCanvas) return;
    const ctx = visualizerCanvas.getContext('2d');
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    function draw() {
      if (!isRecording) return;
      requestAnimationFrame(draw);

      analyser.getByteFrequencyData(dataArray);

      ctx.fillStyle = '#0e1e38';
      ctx.fillRect(0, 0, visualizerCanvas.width, visualizerCanvas.height);

      const barWidth = (visualizerCanvas.width / bufferLength) * 1.5;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * visualizerCanvas.height;
        ctx.fillStyle = i % 2 === 0 ? '#c49733' : '#1b8a5a';
        ctx.fillRect(x, visualizerCanvas.height - barHeight, barWidth - 1, barHeight);
        x += barWidth;
      }
    }

    draw();
  }

  function playUserAudio(onEndCallback = null) {
    if (!userAudioUrl) return;
    const audio = new Audio(userAudioUrl);
    if (onEndCallback) audio.onended = onEndCallback;
    audio.play();
  }

  function playDualShadowing() {
    if (!activePhrase || !userAudioUrl) return;

    studioPlayDualBtn.disabled = true;
    studioPlayDualBtn.innerHTML = '<span>⚡ Tocando Modelo Nativo...</span>';

    speakBritish(activePhrase.en, () => {
      studioPlayDualBtn.innerHTML = '<span>🎧 Ouvindo Sua Voz...</span>';
      setTimeout(() => {
        playUserAudio(() => {
          studioPlayDualBtn.disabled = false;
          studioPlayDualBtn.innerHTML = '<span class="icon">⚡</span><span>Comparar Ritmo (Dual)</span>';
        });
      }, 350);
    });
  }

  // =========================================================================
  // 7. Studio Drawer Management
  // =========================================================================
  function openStudio(phrase) {
    activePhrase = phrase;
    studioPhraseText.textContent = phrase.en;
    studioIpa.textContent = phrase.ipa;
    studioCheat.textContent = `Mapeamento: "${phrase.cheat}"`;
    studioTip.textContent = phrase.tip || "Repita focando na cadência britânica.";

    userAudioBlob = null;
    if (userAudioUrl) URL.revokeObjectURL(userAudioUrl);
    userAudioUrl = null;
    studioPlayUserBtn.disabled = true;
    studioPlayDualBtn.disabled = true;
    studioRecordLabel.textContent = "Gravar Minha Voz";
    sttStatusText.textContent = "Aguardando gravação para validação de pronúncia...";
    setSttDot('idle');
    sttTranscriptWrap.classList.add('hidden');
    sttTranscriptText.textContent = '';

    drawIdleVisualizer();

    studioDock.classList.remove('hidden');
    studioDock.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    speakBritish(phrase.en);
  }

  function closeStudio() {
    if (isRecording) stopRecording();
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    studioDock.classList.add('hidden');
    activePhrase = null;
  }

  // =========================================================================
  // 8. Soundboard Grid Rendering
  // =========================================================================
  function getFilteredPhrases() {
    return allPhrases.filter(p => {
      const matchCat = currentCategory === 'all' || p.cat === currentCategory;
      if (!matchCat) return false;

      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        p.en.toLowerCase().includes(q) ||
        p.pt.toLowerCase().includes(q) ||
        (p.cheat && p.cheat.toLowerCase().includes(q)) ||
        (p.tip && p.tip.toLowerCase().includes(q)) ||
        (p.ipa && p.ipa.toLowerCase().includes(q))
      );
    });
  }

  function renderGrid() {
    const list = getFilteredPhrases();
    displayedCount.textContent = list.length;
    phrasesGrid.innerHTML = '';

    if (list.length === 0) {
      phrasesGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 3rem 1rem; color: var(--text-muted);">
          <p style="font-size: 1.2rem; font-family: var(--font-serif); margin-bottom: 0.5rem;">Nenhuma frase encontrada.</p>
        </div>
      `;
      return;
    }

    list.forEach(item => {
      const card = document.createElement('article');
      card.className = 'phrase-card';
      card.id = `card-${item.id}`;

      const catLabel = {
        politeness: 'Polidez & Diplomacia',
        social: 'Social & Conversa',
        debate: 'Reunião & Assertividade',
        drills: 'Palavra Crítica',
        custom: 'Frase Própria'
      }[item.cat] || item.cat;

      const isCustom = item.cat === 'custom';

      card.innerHTML = `
        <div>
          <div class="card-top">
            <span class="card-category-badge">${catLabel}</span>
            <div class="card-quick-actions">
              <button class="card-btn-icon loop-btn" title="Repetir em loop" data-id="${item.id}">🔁</button>
              ${isCustom ? `<button class="card-btn-icon delete-btn" title="Excluir frase" data-id="${item.id}">🗑️</button>` : ''}
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
          <button class="card-btn-play play-native-btn" data-id="${item.id}">
            <span>🔊</span>
            <span>Ouvir</span>
          </button>
          <button class="card-btn-studio open-studio-btn" data-id="${item.id}">
            <span>🎙️</span>
            <span>Praticar</span>
          </button>
        </div>
      `;

      phrasesGrid.appendChild(card);
    });
  }

  function highlightCard(id) {
    const el = document.getElementById(`card-${id}`);
    if (el) el.classList.add('playing');
  }

  function unhighlightCard(id) {
    const el = document.getElementById(`card-${id}`);
    if (el) el.classList.remove('playing');
  }

  function toggleLoop(id, btn) {
    if (loopActiveOnCard === id) {
      clearInterval(loopInterval);
      loopActiveOnCard = null;
      btn.classList.remove('active');
      window.speechSynthesis.cancel();
      unhighlightCard(id);
    } else {
      if (loopInterval) clearInterval(loopInterval);
      document.querySelectorAll('.loop-btn').forEach(b => b.classList.remove('active'));

      loopActiveOnCard = id;
      btn.classList.add('active');

      const phrase = allPhrases.find(p => p.id === id);
      if (!phrase) return;

      highlightCard(id);
      speakBritish(phrase.en);

      loopInterval = setInterval(() => {
        if (loopActiveOnCard !== id) {
          clearInterval(loopInterval);
          return;
        }
        highlightCard(id);
        speakBritish(phrase.en);
      }, 3500);
    }
  }
  let loopInterval = null;

  // =========================================================================
  // 9. 30-Day Challenge Engine (1-Minute Workouts)
  // =========================================================================
  function renderChallengeSidebar() {
    const days = window.CHALLENGE_30_DAYS || [];
    if (!days.length) return;

    challengeDaysList.innerHTML = '';

    const weekLabels = [
      "Semana 1: Fundamentos da Boca Britânica (Dias 1-7)",
      "Semana 2: Diplomacia, Polidez & Situações Sociais (Dias 8-14)",
      "Semana 3: Corporativo, Negociações & Elegância (Dias 15-21)",
      "Semana 4: Fluência Avançada & Ritmo Rápido (Dias 22-28)",
      "Grand Finale: Maestria & O Monólogo Diplomático (Dias 29-30)"
    ];

    let currentWeekIdx = -1;
    let currentWeekDiv = null;

    days.forEach((item, idx) => {
      const weekIdx = Math.min(Math.floor(idx / 7), 4);

      if (weekIdx !== currentWeekIdx) {
        currentWeekIdx = weekIdx;
        currentWeekDiv = document.createElement('div');
        currentWeekDiv.className = 'week-group';
        currentWeekDiv.innerHTML = `<h4 class="week-group-title">${weekLabels[weekIdx]}</h4>`;
        challengeDaysList.appendChild(currentWeekDiv);
      }

      const isDone = completedDays.has(item.day);
      const isSelected = currentChallengeDay && currentChallengeDay.day === item.day;

      const btn = document.createElement('button');
      btn.className = `day-item-btn ${isSelected ? 'active' : ''}`;
      btn.dataset.day = item.day;
      btn.innerHTML = `
        <div class="day-item-info">
          <span class="day-item-num">D${item.day}</span>
          <span class="day-item-title">${escapeHtml(item.title)}</span>
        </div>
        <span class="day-item-status">${isDone ? '✅' : '⚪'}</span>
      `;

      btn.addEventListener('click', () => {
        loadDayWorkout(item.day);
      });

      currentWeekDiv.appendChild(btn);
    });
  }

  function loadDayWorkout(dayNum) {
    const days = window.CHALLENGE_30_DAYS || [];
    const item = days.find(d => d.day === dayNum) || days[0];
    if (!item) return;

    currentChallengeDay = item;

    // Update active highlight in sidebar
    document.querySelectorAll('.day-item-btn').forEach(b => {
      b.classList.toggle('active', parseInt(b.dataset.day, 10) === item.day);
    });

    // Populate Workout Header
    workoutDayTag.textContent = `Dia ${item.day} de 30`;
    workoutDayTitle.textContent = item.title;
    workoutFocusBadge.textContent = `Foco Fonético: ${item.accentFocus}`;

    // Audio Element Setup
    const audioPath = `audio/day-${String(item.day).padStart(2, '0')}.mp3`;
    masterAudioElem.src = audioPath;
    masterAudioElem.playbackRate = playbackSpeed;
    masterSeekSlider.value = 0;
    masterTimeDisplay.textContent = "0:00 / 0:00";
    masterPlayBtn.textContent = "▶";

    // Populate Script & Brazilian Advice
    workoutScriptFull.textContent = item.script;
    workoutBrazilianTip.textContent = item.brazilianCheatTips;

    // Populate Sentence Breakdown
    workoutSentenceList.innerHTML = '';
    item.sentences.forEach((s, sIdx) => {
      const card = document.createElement('div');
      card.className = 'sentence-card';
      card.innerHTML = `
        <div class="sentence-left">
          <h4 class="sentence-text-en">${escapeHtml(s.en)}</h4>
          <p class="sentence-text-pt">${escapeHtml(s.pt)}</p>
          <div>
            <span class="sentence-ipa-badge">${escapeHtml(s.ipa)}</span>
            <span class="sentence-cheat-badge">🇧🇷 ${escapeHtml(s.cheat)}</span>
          </div>
        </div>
        <div class="sentence-actions">
          <button class="card-btn-icon play-sentence-btn" title="Ouvir esta frase individualmente" data-en="${escapeHtml(s.en)}">🔊</button>
          <button class="card-btn-icon studio-sentence-btn" title="Gravar e testar pronúncia" data-idx="${sIdx}">🎙️</button>
        </div>
      `;

      // Event listener for individual sentence speech
      card.querySelector('.play-sentence-btn').addEventListener('click', () => {
        speakBritish(s.en);
      });

      // Event listener for opening studio dock for this sentence
      card.querySelector('.studio-sentence-btn').addEventListener('click', () => {
        openStudio({
          id: `day_${item.day}_s_${sIdx}`,
          en: s.en,
          pt: s.pt,
          ipa: s.ipa,
          cheat: s.cheat,
          tip: item.brazilianCheatTips
        });
      });

      workoutSentenceList.appendChild(card);
    });

    // Update Completed Button state
    updateCompletedBtnState();
  }

  function updateCompletedBtnState() {
    if (!currentChallengeDay) return;
    const isDone = completedDays.has(currentChallengeDay.day);
    if (isDone) {
      toggleCompleteDayBtn.classList.add('completed');
      completeDayIcon.textContent = "✓";
      completeDayLabel.textContent = "Dia Concluído! (Clique para desmarcar)";
    } else {
      toggleCompleteDayBtn.classList.remove('completed');
      completeDayIcon.textContent = "⚪";
      completeDayLabel.textContent = "Marcar Dia como Concluído";
    }
  }

  function toggleCompleteCurrentDay() {
    if (!currentChallengeDay) return;
    const day = currentChallengeDay.day;
    if (completedDays.has(day)) {
      completedDays.delete(day);
    } else {
      completedDays.add(day);
    }
    localStorage.setItem(STORAGE_COMPLETED_KEY, JSON.stringify([...completedDays]));
    updateProgressUI();
    renderChallengeSidebar();
    updateCompletedBtnState();
  }

  // =========================================================================
  // 10. Master Audio Player Controls
  // =========================================================================
  function setupMasterAudioControls() {
    masterPlayBtn.addEventListener('click', () => {
      if (masterAudioElem.paused) {
        masterAudioElem.play();
        masterPlayBtn.textContent = "⏸";
      } else {
        masterAudioElem.pause();
        masterPlayBtn.textContent = "▶";
      }
    });

    masterAudioElem.addEventListener('timeupdate', () => {
      if (!masterAudioElem.duration) return;
      const pct = (masterAudioElem.currentTime / masterAudioElem.duration) * 100;
      masterSeekSlider.value = pct;
      masterTimeDisplay.textContent = `${formatTime(masterAudioElem.currentTime)} / ${formatTime(masterAudioElem.duration)}`;
    });

    masterAudioElem.addEventListener('ended', () => {
      masterPlayBtn.textContent = "▶";
      masterSeekSlider.value = 0;
    });

    masterSeekSlider.addEventListener('input', (e) => {
      if (!masterAudioElem.duration) return;
      const targetTime = (e.target.value / 100) * masterAudioElem.duration;
      masterAudioElem.currentTime = targetTime;
    });

    challengeSpeedChips.forEach(chip => {
      chip.addEventListener('click', () => {
        challengeSpeedChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        const spd = parseFloat(chip.dataset.speed) || 1.0;
        masterAudioElem.playbackRate = spd;
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
  // 11. Event Listeners & Binding
  // =========================================================================
  function bindEvents() {
    // Mode Navigation Switchers
    navSoundboardBtn.addEventListener('click', () => setMode('soundboard'));
    navChallengeBtn.addEventListener('click', () => setMode('challenge'));

    // Master Audio Player
    setupMasterAudioControls();

    // Toggle Complete Day
    toggleCompleteDayBtn.addEventListener('click', toggleCompleteCurrentDay);

    // Global speed buttons
    speedBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        speedBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        playbackSpeed = parseFloat(btn.dataset.speed) || 1.0;
        if (masterAudioElem) masterAudioElem.playbackRate = playbackSpeed;
      });
    });

    // Search Input
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.trim();
      clearSearchBtn.classList.toggle('hidden', searchQuery.length === 0);
      renderGrid();
    });

    clearSearchBtn.addEventListener('click', () => {
      searchInput.value = '';
      searchQuery = '';
      clearSearchBtn.classList.add('hidden');
      renderGrid();
    });

    // Category Tabs
    catPills.forEach(pill => {
      pill.addEventListener('click', () => {
        catPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        currentCategory = pill.dataset.cat;
        renderGrid();
      });
    });

    // Card delegation (Play, Studio, Loop, Delete)
    phrasesGrid.addEventListener('click', (e) => {
      const playBtn = e.target.closest('.play-native-btn');
      const studioBtn = e.target.closest('.open-studio-btn');
      const loopBtn = e.target.closest('.loop-btn');
      const deleteBtn = e.target.closest('.delete-btn');
      const card = e.target.closest('.phrase-card');

      if (deleteBtn) {
        e.stopPropagation();
        const id = deleteBtn.dataset.id;
        if (confirm('Deseja realmente remover esta frase?')) {
          deleteCustomPhrase(id);
        }
        return;
      }

      if (loopBtn) {
        e.stopPropagation();
        const id = loopBtn.dataset.id;
        toggleLoop(id, loopBtn);
        return;
      }

      if (playBtn) {
        e.stopPropagation();
        const id = playBtn.dataset.id;
        const phrase = allPhrases.find(p => p.id === id);
        if (phrase) {
          highlightCard(id);
          speakBritish(phrase.en, () => unhighlightCard(id));
        }
        return;
      }

      if (studioBtn || card) {
        const id = (studioBtn ? studioBtn.dataset.id : card.id.replace('card-', ''));
        const phrase = allPhrases.find(p => p.id === id);
        if (phrase) openStudio(phrase);
      }
    });

    // Studio Dock controls
    closeStudioBtn.addEventListener('click', closeStudio);
    studioPlayNativeBtn.addEventListener('click', () => {
      if (activePhrase) speakBritish(activePhrase.en);
    });
    studioRecordBtn.addEventListener('click', toggleRecording);
    studioPlayUserBtn.addEventListener('click', () => playUserAudio());
    studioPlayDualBtn.addEventListener('click', playDualShadowing);

    // Custom Phrase Modal
    openAddCustomModalBtn.addEventListener('click', () => addModal.classList.remove('hidden'));
    closeModalBtn.addEventListener('click', () => addModal.classList.add('hidden'));
    cancelModalBtn.addEventListener('click', () => addModal.classList.add('hidden'));

    addCustomForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const en = document.getElementById('customEn').value.trim();
      const pt = document.getElementById('customPt').value.trim() || 'Minha frase de treino';
      const cheat = document.getElementById('customCheat').value.trim() || 'Treino livre de articulação';
      const tip = document.getElementById('customTip').value.trim() || 'Pratique com fala pausada, sem enrolar o R final e com o T limpo.';

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

      saveCustomPhrase(newPhrase);
      addModal.classList.add('hidden');
      addCustomForm.reset();
      openStudio(newPhrase);
    });
  }

  function saveCustomPhrase(item) {
    let custom = [];
    try {
      const saved = localStorage.getItem(STORAGE_CUSTOM_KEY);
      if (saved) custom = JSON.parse(saved);
    } catch (e) {}
    custom.push(item);
    localStorage.setItem(STORAGE_CUSTOM_KEY, JSON.stringify(custom));
    loadPhrases();
    renderGrid();
  }

  function deleteCustomPhrase(id) {
    let custom = [];
    try {
      const saved = localStorage.getItem(STORAGE_CUSTOM_KEY);
      if (saved) custom = JSON.parse(saved);
    } catch (e) {}
    custom = custom.filter(p => p.id !== id);
    localStorage.setItem(STORAGE_CUSTOM_KEY, JSON.stringify(custom));
    loadPhrases();
    renderGrid();
    if (activePhrase && activePhrase.id === id) closeStudio();
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
