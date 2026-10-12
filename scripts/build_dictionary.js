/**
 * Comprehensive Dictionary & Collocations Builder for The Posh Lab
 * Maps multi-word expressions, phrasal verbs, and vocabulary words
 * with explicit "In this context, it means..." (Neste contexto, significa:) explanations,
 * general meanings, phonetic IPA, and seamless switching between Expression and Isolated Word.
 */

const fs = require('fs');
const path = require('path');

// 1. Curated Multi-Word Expressions & Phrasal Verbs with Rich Context
const COLLOCATIONS_RICH = [
  // Day 1
  {
    en: "bathed in",
    type: "Expressão Poética / Locução Descritiva",
    contextMeaning: "Descreve a iluminação suave e difusa do amanhecer que cobre as ruas históricas de Marylebone com um brilho prateado e sereno.",
    generalMeaning: "banhado por, envolto suavemente em luz ou líquido",
    ipa: "/beɪðd ɪn/",
    note: "Usado comumente na literatura britânica para descrever atmosferas visuais com requinte.",
    triggerWords: ["bathed", "in"]
  },
  {
    en: "bathed in light",
    type: "Expressão / Colocação de Prestígio",
    contextMeaning: "Iluminado suavemente pelo sol fraco da manhã antes das oito horas.",
    generalMeaning: "banhado pela luz matinal",
    ipa: "/beɪðd ɪn laɪt/",
    note: "Evita o uso de palavras comuns como 'very sunny' ou 'bright'.",
    triggerWords: ["bathed", "light"]
  },
  {
    en: "brisk stroll",
    type: "Colocação Britânica Clássica",
    contextMeaning: "Uma caminhada matinal com passos firmes, enérgicos e revigorantes pelos parques de Londres.",
    generalMeaning: "caminhada rápida, passeio a passo acelerado",
    ipa: "/brɪsk strəʊl/",
    note: "No Reino Unido, 'stroll' é um passeio; 'brisk' dá o tom de exercício elegante para despertar o corpo.",
    triggerWords: ["brisk", "stroll"]
  },
  {
    en: "tucked firmly",
    type: "Expressão / Locução Adverbial",
    contextMeaning: "Estar com o celular bem guardado e seguro no fundo do bolso para evitar a tentação de checar notificações.",
    generalMeaning: "bem guardado, encaixado com segurança",
    ipa: "/tʌkt ˈfɜːm.li/",
    note: "'Tuck' significa enfiar ou acomodar com cuidado; 'firmly' reforça a decisão deliberada de desconectar.",
    triggerWords: ["tucked", "firmly"]
  },
  {
    en: "take in",
    type: "Phrasal Verb",
    contextMeaning: "Absorver sensorialmente e contemplar com calma os sons e a atmosfera matinal da cidade.",
    generalMeaning: "absorver, assimilar, contemplar uma paisagem",
    ipa: "/teɪk ɪn/",
    note: "Diferente de 'to look at', 'to take in' implica presença mental e apreciação consciente.",
    triggerWords: ["take", "in"]
  },
  {
    en: "quiet cadence",
    type: "Colocação Estilística",
    contextMeaning: "O ritmo calmo, melódico e sem afobação que a cidade de Londres tem logo cedo.",
    generalMeaning: "cadência serena, ritmo pausado",
    ipa: "/ˈkwaɪ.ət ˈkeɪ.dəns/",
    note: "'Cadence' é um termo musical que os britânicos usam para descrever o fluxo elegante da fala e da vida.",
    triggerWords: ["quiet", "cadence"]
  },
  {
    en: "shifting gears",
    type: "Expressão Descritiva",
    contextMeaning: "O som mecânico e suave de um ônibus vermelho de dois andares trocando de marcha ao longe na Baker Street.",
    generalMeaning: "trocando de marcha (veículo)",
    ipa: "/ˈʃɪf.tɪŋ ɡɪəz/",
    note: "Cria a ambientação sonora típica de uma manhã londrina sem poluição acústica.",
    triggerWords: ["shifting", "gears"]
  },
  {
    en: "on my feet",
    type: "Expressão Idiomática",
    contextMeaning: "Após meia hora caminhando ativamente pelas calçadas de Londres.",
    generalMeaning: "em pé, em movimento físico, de pé",
    ipa: "/ɒn maɪ fiːt/",
    note: "Forma natural de dizer que esteve caminhando ou de pé por determinado período.",
    triggerWords: ["feet", "on"]
  },
  {
    en: "flat white",
    type: "Termo de Cafeteria Britânica",
    contextMeaning: "Café preparado com espresso duplo e microespuma de leite vaporizada aveludada, popular nas confeitarias de Londres.",
    generalMeaning: "café estilo flat white",
    ipa: "/ˌflæt ˈwaɪt/",
    note: "Item indispensável do ritual matinal executivo e boêmio da capital inglesa.",
    triggerWords: ["flat", "white"]
  },
  {
    en: "pacing oneself",
    type: "Expressão / Princípio Psicológico",
    contextMeaning: "A disciplina de ditar o próprio ritmo com calma e não se atropelar antes que as tarefas comecem.",
    generalMeaning: "ditar o próprio ritmo, dosar a própria energia",
    ipa: "/ˈpeɪ.sɪŋ wʌn.self/",
    note: "Fundamental na postura britânica de compostura (equanimidade diante da pressão).",
    triggerWords: ["pacing", "oneself"]
  },
  {
    en: "in earnest",
    type: "Locução Adverbial Idiomática",
    contextMeaning: "Quando as demandas do dia de trabalho começam para valer, a todo vapor e com intensidade total.",
    generalMeaning: "para valer, a sério, com firmeza e dedicação total",
    ipa: "/ɪn ˈɜː.nɪst/",
    note: "Expressão clássica de prestígio para indicar o início vigoroso de algo sério.",
    triggerWords: ["earnest", "in"]
  },
  {
    en: "buffer zone",
    type: "Metáfora / Colocação Moderna",
    contextMeaning: "Um intervalo de respiro mental intencional entre acordar e abrir caixas de e-mails corporativos.",
    generalMeaning: "zona de amortecimento, área de respiro",
    ipa: "/ˈbʌf.ə zəʊn/",
    note: "Espaço de proteção para que a mente acorde em paz sem ser invadida por urgências.",
    triggerWords: ["buffer", "zone"]
  },
  {
    en: "thoroughly composed",
    type: "Colocação de Alta Sociedade",
    contextMeaning: "Estar em pleno controle emocional, calmo, centrado e com a respiração tranquila ao sentar na mesa de trabalho.",
    generalMeaning: "totalmente calmo, sereno e centrado",
    ipa: "/ˈθʌr.ə.li kəmˈpəʊzd/",
    note: "'Thoroughly' eleva o advérbio com elegância nobre; 'composed' expressa máxima equanimidade.",
    triggerWords: ["thoroughly", "composed"]
  },
  {
    en: "undivided attention",
    type: "Colocação Executiva Refinada",
    contextMeaning: "Foco mental exclusivo e total dedicado a assuntos estratégicos, sem celular ou dispersão.",
    generalMeaning: "total atenção exclusiva",
    ipa: "/ˌʌn.dɪˈvaɪ.dɪd əˈten.ʃn̩/",
    note: "Muito usado em reuniões diplomáticas para indicar respeito máximo pelo assunto.",
    triggerWords: ["undivided", "attention"]
  },
  {
    en: "deliberate composure",
    type: "Colocação de Postura / Dicção",
    contextMeaning: "Uma postura de fala calma, intencional e sem afobação que transmite autoridade natural.",
    generalMeaning: "compostura deliberada e intencional",
    ipa: "/dɪˈlɪb.ər.ət kəmˈpəʊ.ʒə/",
    note: "'Deliberate' aqui não é lento por preguiça, mas sim pausado por autocontrole e respeito.",
    triggerWords: ["deliberate", "composure"]
  },
  {
    en: "steady breath",
    type: "Termo de Fonoaudiologia & Postura",
    contextMeaning: "A respiração pausada pelo diafragma que ancora as cordas vocais e permite o tom aveludado do RP.",
    generalMeaning: "respiração firme e estável",
    ipa: "/ˈsted.i breθ/",
    note: "O segredo fisiológico para cortar a pressa e falar como um nativo britânico educado.",
    triggerWords: ["steady", "breath"]
  },

  // Day 2
  {
    en: "could I trouble you for",
    type: "Fórmula de Polidez de Alto Nível",
    contextMeaning: "A forma mais educada e elegante de pedir um café ou água em um restaurante sem jamais parecer imperativo.",
    generalMeaning: "poderia incomodá-lo pedindo... / faria a gentileza de me trazer",
    ipa: "/kʊd aɪ ˈtrʌb.l̩ juː fɔː/",
    note: "Na alta sociedade britânica, pedidos são sempre estruturados como indagações gentis.",
    triggerWords: ["trouble", "could", "for"]
  },
  {
    en: "undignified sprint",
    type: "Understatement / Colocação Humorística",
    contextMeaning: "A correria desesperada e deselegante das pessoas no metrô e nas calçadas em horário de pico.",
    generalMeaning: "correria deselegante, corrida apressada e indigna",
    ipa: "/ʌnˈdɪɡ.nɪ.faɪd sprɪnt/",
    note: "Mostra como o britânico culto desaprova afobação física em público.",
    triggerWords: ["undignified", "sprint"]
  },
  {
    en: "step through",
    type: "Phrasal Verb",
    contextMeaning: "Cruzar as pesadas portas de mogno de uma cafeteria em Mayfair para entrar com tranquilidade.",
    generalMeaning: "passar por, cruzar uma entrada, transpor",
    ipa: "/step θruː/",
    note: "Implica um passo comedido e consciente ao entrar em um espaço nobre.",
    triggerWords: ["step", "through"]
  },
  {
    en: "let one's guard down",
    type: "Expressão Idiomática",
    contextMeaning: "Sentir-se à vontade em uma mesa de café para falar com honestidade e sem desconfiança.",
    generalMeaning: "baixar a guarda, desarmar-se emocionalmente",
    ipa: "/let wʌnz ɡɑːd daʊn/",
    note: "Usado em negociações para descrever o momento em que a formalidade rígida dá lugar à sinceridade.",
    triggerWords: ["guard", "down"]
  },
  {
    en: "genuine candour",
    type: "Colocação de Relações Corporativas",
    contextMeaning: "Franqueza sincera e transparente ao debater cláusulas contratuais difíceis sem agressividade.",
    generalMeaning: "sinceridade genuína, franqueza nobre",
    ipa: "/ˈdʒen.ju.ɪn ˈkæn.dər/",
    note: "'Candour' é uma virtude altamente prezada nas salas de conselho britânicas.",
    triggerWords: ["genuine", "candour"]
  },
  {
    en: "understated politeness",
    type: "Conceito Cultural Britânico",
    contextMeaning: "A cortesia contida e discreta que trata todos com respeito sem necessidade de bajulação.",
    generalMeaning: "polidez sutil e discreta",
    ipa: "/ˌʌn.dəˈsteɪ.tɪd pəˈlaɪt.nəs/",
    note: "Oposto de elogios exagerados e sorrisos artificiais.",
    triggerWords: ["understated", "politeness"]
  },

  // Phrasal Verbs e Expressões Comuns
  {
    en: "get out",
    type: "Phrasal Verb",
    contextMeaning: "Sair do ambiente fechado (escritório ou casa) para respirar ar puro ao ar livre.",
    generalMeaning: "sair de dentro, escapar, afastar-se de um local",
    ipa: "/ɡet aʊt/",
    note: "Dependendo do contexto, pode significar desde 'fazer uma caminhada' até 'sair de uma situação'.",
    triggerWords: ["get", "out"]
  },
  {
    en: "hold up",
    type: "Phrasal Verb",
    contextMeaning: "Ficar retido ou atrasado por uma reunião urgente ou trânsito intenso.",
    generalMeaning: "reter, atrasar, sustentar",
    ipa: "/həʊld ʌp/",
    note: "Na voz passiva ('held up'), é a desculpa britânica mais elegante para atrasos imprevisíveis.",
    triggerWords: ["held", "up", "hold"]
  },
  {
    en: "steer clear of",
    type: "Expressão Idiomática",
    contextMeaning: "Evitar propositalmente as rodovias movimentadas ou assuntos polêmicos.",
    generalMeaning: "manter-se longe de, desviar cuidadosamente",
    ipa: "/stɪə klɪər əv/",
    note: "Origem náutica (manter o leme longe dos recifes); usado na vida diária.",
    triggerWords: ["steer", "clear"]
  },
  {
    en: "spot on",
    type: "Expressão Idiomática / Coloquialismo de Prestígio",
    contextMeaning: "Concordar de forma precisa e imediata com o que a outra pessoa acabou de argumentar.",
    generalMeaning: "na mosca, exato, perfeitamente correto",
    ipa: "/spɒt ɒn/",
    note: "Pronuncia-se conectado com som de T limpo: /spɒtɒn/.",
    triggerWords: ["spot", "on"]
  },
  {
    en: "fair enough",
    type: "Expressão de Diplomacia Cotidiana",
    contextMeaning: "Aceitar a explicação ou recusa de alguém com serenidade e respeito mútuo.",
    generalMeaning: "compreensível, justo, faz sentido",
    ipa: "/feər ɪˈnʌf/",
    note: "Encerra pequenas divergências com polidez sem prolongar o debate.",
    triggerWords: ["fair", "enough"]
  },
  {
    en: "touch wood",
    type: "Expressão Popular / Superstição Social",
    contextMeaning: "Expressar gratidão por um plano estar correndo bem sem atrair mau agouro.",
    generalMeaning: "bater na madeira (para afastar o azar)",
    ipa: "/tʌtʃ wʊd/",
    note: "Equivalente britânico do americano 'knock on wood'.",
    triggerWords: ["touch", "wood"]
  }
];

// 2. Comprehensive Vocabulary Dictionary with "In this context..."
const VOCABULARY_RICH = {
  // G
  "grounding": {
    type: "Adjetivo / Conceito de Bem-Estar",
    contextMeaning: "Descreve a sensação psicológica de calma, serenidade e equilíbrio de 'pôr os pés no chão' que Londres traz nas primeiras horas da manhã.",
    generalMeaning: "reconfortante, que traz firmeza mental e serenidade",
    ipa: "/ˈɡraʊn.dɪŋ/",
    note: "Diferente de 'aterramento elétrico' ou 'castigo', em linguagem refinada é a capacidade de manter-se centrado."
  },
  "gravitas": {
    type: "Substantivo / Vocabulário de Prestígio",
    contextMeaning: "Presença de espírito, serenidade e autoridade moral natural na voz e na postura sem precisar gritar ou forçar.",
    generalMeaning: "peso moral, autoridade serena, dignidade profunda",
    ipa: "/ˈɡræv.ɪ.tæs/",
    note: "Palavra de origem latina fundamental na cultura corporativa e diplomática do Reino Unido."
  },
  "gears": {
    type: "Substantivo Plural",
    contextMeaning: "As marchas da transmissão mecânica do ônibus vermelho ao acelerar pelas ruas.",
    generalMeaning: "marchas de veículos, engrenagens",
    ipa: "/ɡɪəz/",
    note: "Reforça a cadência rítmica e sonora do trânsito londrino."
  },

  // B
  "bathed": {
    type: "Verbo (Particípio Passado)",
    contextMeaning: "No sentido figurado, coberto delicadamente por uma luminosidade suave que acolhe a cidade.",
    generalMeaning: "banhado, imerso em líquido ou claridade",
    ipa: "/beɪðd/",
    note: "Quando acompanhado de 'in', forma a locução 'bathed in' (envolto por)."
  },
  "brisk": {
    type: "Adjetivo",
    contextMeaning: "Um passo rápido, vivo e enérgico que aquece o corpo contra o frio da manhã.",
    generalMeaning: "rápido, enérgico, revigorante, vivaz",
    ipa: "/brɪsk/",
    note: "Usado com frequência para caminhadas ('brisk walk') e ar fresco ('brisk breeze')."
  },
  "breath": {
    type: "Substantivo",
    contextMeaning: "O fluxo de ar consciente e ritmado que permite modular a voz com calma no sotaque britânico.",
    generalMeaning: "respiração, fôlego, ar dos pulmões",
    ipa: "/breθ/",
    note: "Não confunda com o verbo 'breathe' /briːð/."
  },
  "buffer": {
    type: "Substantivo",
    contextMeaning: "Um espaço de proteção e tranquilidade que amortece o choque entre acordar e trabalhar.",
    generalMeaning: "amortecedor, isolador, margem de segurança",
    ipa: "/ˈbʌf.ə/",
    note: "Forma o termo 'buffer zone' (zona de respiro mental)."
  },
  "bakery": {
    type: "Substantivo",
    contextMeaning: "A padaria ou confeitaria de esquina em Marylebone onde se compra café artesanal e croissant.",
    generalMeaning: "padaria, confeitaria",
    ipa: "/ˈbeɪ.kər.i/",
    note: "Lugares tradicionais em Londres que preservam produção artesanal matinal."
  },

  // C
  "cadence": {
    type: "Substantivo",
    contextMeaning: "O ritmo melódico, pausado e musical da fala de prestígio ou da vida nas ruas tranquilas.",
    generalMeaning: "cadência, ritmo melódico da fala ou da música",
    ipa: "/ˈkeɪ.dəns/",
    note: "Uma das características mais marcantes do Modern RP britânico: a ausência de afobação."
  },
  "chill": {
    type: "Substantivo",
    contextMeaning: "O friozinho fresco e revigorante do ar matinal londrino antes de o sol esquentar.",
    generalMeaning: "frescor agradável, sensação de frio leve",
    ipa: "/tʃɪl/",
    note: "Não se refere a frio congelante, mas àquele frescor que desperta os sentidos."
  },
  "clarity": {
    type: "Substantivo",
    contextMeaning: "Estado de lucidez profunda e serenidade mental obtido após uma caminhada sem telas.",
    generalMeaning: "clareza, nitidez, transparência",
    ipa: "/ˈklær.ə.ti/",
    note: "'Mental clarity' é o objetivo primordial da rotina matinal descrita."
  },
  "composed": {
    type: "Adjetivo",
    contextMeaning: "Sentir-se calmo, com as emoções equilibradas e a postura firme ao sentar-se à mesa.",
    generalMeaning: "sereno, centrado, no controle de si mesmo",
    ipa: "/kəmˈpəʊzd/",
    note: "Derivado do verbo 'compose' (colocar em ordem, acalmar)."
  },
  "composure": {
    type: "Substantivo",
    contextMeaning: "A habilidade de permanecer impassível, calmo e refinado sob qualquer circunstância.",
    generalMeaning: "compostura, serenidade emocional e física",
    ipa: "/kəmˈpəʊ.ʒə/",
    note: "Virtude cardeal na cultura executiva e diplomática britânica."
  },
  "candour": {
    type: "Substantivo",
    contextMeaning: "A franqueza elegante e honesta de expressar o que realmente se pensa sem hipocrisia.",
    generalMeaning: "franqueza sincera, transparência nobre",
    ipa: "/ˈkæn.dər/",
    note: "Grafia britânica com 'our' (americano: 'candor')."
  },
  "croissant": {
    type: "Substantivo",
    contextMeaning: "Folhado amanteigado francês servido quente para acompanhar o café da manhã.",
    generalMeaning: "croissant folhado",
    ipa: "/ˈkwæs.ɒ̃/",
    note: "Pronuncia-se com cadência francesa adaptada ao inglês culto."
  },

  // D
  "deliberate": {
    type: "Adjetivo",
    contextMeaning: "Uma atitude pensada, calma e intencional, sem precipitação ou impulsividade.",
    generalMeaning: "deliberado, planejado, intencional e pausado",
    ipa: "/dɪˈlɪb.ər.ət/",
    note: "Quando adjetivo, a última sílaba soa curta: /-ət/."
  },
  "discreet": {
    type: "Adjetivo",
    contextMeaning: "Uma padariazinha aconchegante e sem letreiros espalhafatosos na esquina de Marylebone.",
    generalMeaning: "discreto, sutil, reservado",
    ipa: "/dɪˈskriːt/",
    note: "A estética britânica valoriza locais discretos em vez de cadeias barulhentas."
  },

  // E
  "earnest": {
    type: "Substantivo / Adjetivo",
    contextMeaning: "O estado de dedicação séria e foco total nas atividades profissionais do dia.",
    generalMeaning: "seriedade genuína, fervor sincero",
    ipa: "/ˈɜː.nɪst/",
    note: "Geralmente encontrado na locução 'in earnest' (para valer)."
  },

  // H
  "hum": {
    type: "Substantivo",
    contextMeaning: "O zumbido mecânico suave e distante do motor dos ônibus pelas avenidas.",
    generalMeaning: "zumbido contínuo, murmúrio distante e suave",
    ipa: "/hʌm/",
    note: "Descreve sons de fundo que não agridem a tranquilidade da manhã."
  },

  // I
  "invariably": {
    type: "Advérbio de Frequência Nobre",
    contextMeaning: "Fazer uma parada na padaria todos os dias sem exceção, como um ritual sagrado.",
    generalMeaning: "invariavelmente, sempre, sem falta",
    ipa: "/ɪnˈveə.ri.ə.bli/",
    note: "Substitui 'always' com muito mais refinamento e gravidade."
  },

  // M
  "marylebone": {
    type: "Nome Próprio / Geografia Londrina",
    contextMeaning: "Bairro histórico e aristocrático no West End de Londres, famoso por livrarias, cafés e tranquilidade.",
    generalMeaning: "Marylebone (distrito nobre de Londres)",
    ipa: "/ˈmɑː.lɪ.bən/",
    note: "Pronúncia clássica: 'már-li-buhn', sem pronunciar o 'y' como 'mari'."
  },
  "merely": {
    type: "Advérbio de Atenuação",
    contextMeaning: "Não apenas para tomar cafeína, mas com um propósito muito maior de equilíbrio mental.",
    generalMeaning: "meramente, apenas, simplesmente",
    ipa: "/ˈmɪə.li/",
    note: "Usado para contrastar algo banal com algo nobre."
  },

  // P
  "pacing": {
    type: "Substantivo / Gerúndio",
    contextMeaning: "O ato consciente de cadenciar os próprios passos e respiração para não se afobar.",
    generalMeaning: "compassando, ritmando, dosando o tempo",
    ipa: "/ˈpeɪ.sɪŋ/",
    note: "Parte essencial da compostura executiva britânica."
  },

  // R
  "rustle": {
    type: "Substantivo",
    contextMeaning: "O farfalhar suave das folhas das árvores do Regent's Park movidas pelo vento calmo.",
    generalMeaning: "farfalhar, sussurro de folhas ou tecidos",
    ipa: "/ˈrʌs.l̩/",
    note: "O 't' é mudo em inglês britânico: pronuncia-se 'râs-ôul'."
  },
  "rather": {
    type: "Advérbio de Atenuação / Intensificador Sutil",
    contextMeaning: "Bastante, notavelmente, ou preferencialmente, moderando o tom da frase com classe.",
    generalMeaning: "bastante, deveras, preferivelmente",
    ipa: "/ˈrɑː.ðə/",
    note: "A palavra mais emblemática do Modern RP britânico para evitar hipérboles americanas como 'super' ou 'awesome'."
  },

  // S
  "silvery": {
    type: "Adjetivo",
    contextMeaning: "O brilho suave, prateado e orvalhado da luminosidade da manhã em Londres antes de o sol abrir totalmente.",
    generalMeaning: "prateado, suave, de luminosidade clara",
    ipa: "/ˈsɪl.vər.i/",
    note: "Transmite a tonalidade visual fresca típica do clima temperado britânico."
  },
  "stroll": {
    type: "Substantivo",
    contextMeaning: "Um passeio a passos tranquilos, sem a afobação de quem está correndo para compromissos.",
    generalMeaning: "caminhada despretensiosa, passeio calmo",
    ipa: "/strəʊl/",
    note: "Ritual cultural londrino em parques como Regent's Park e Hyde Park."
  },

  // T
  "tackle": {
    type: "Verbo de Ação Executiva",
    contextMeaning: "Encarar com determinação e resolver estrategicamente os assuntos e problemas mais complexos da mesa de trabalho.",
    generalMeaning: "enfrentar, encarar de frente e resolver",
    ipa: "/ˈtæk.l̩/",
    note: "Em ambiente corporativo britânico, 'to tackle an issue' é agir com energia e método."
  },
  "tucked": {
    type: "Verbo (Particípio Passado)",
    contextMeaning: "O aparelho celular posicionado bem dentro do bolso para não perturbar a caminhada.",
    generalMeaning: "guardado, encaixado com segurança, acomodado",
    ipa: "/tʌkt/",
    note: "Evoca a sensação de algo protegido e deliberadamente fora de vista."
  },

  // U
  "understated": {
    type: "Adjetivo / Ideal Estético Britânico",
    contextMeaning: "Algo que possui imensa qualidade e valor, mas se apresenta de forma sutil, sem ostentação.",
    generalMeaning: "discreto, sutil, sóbrio, sem exibicionismo",
    ipa: "/ˌʌn.dəˈsteɪ.tɪd/",
    note: "A própria alma do estilo Savile Row: luxo silencioso que não precisa chamar atenção."
  },
  "undivided": {
    type: "Adjetivo",
    contextMeaning: "Atenção mental completa, sem ser fragmentada por notificações ou interrupções.",
    generalMeaning: "total, indiviso, exclusivo",
    ipa: "/ˌʌn.dɪˈvaɪ.dɪd/",
    note: "'Undivided attention' é a maior deferência profissional que se pode conceder a alguém."
  },

  // Common Verbs & Key Particles with Context
  "get": {
    type: "Verbo Irregular",
    contextMeaning: "Deslocar-se ou sair; ao lado de 'out', forma o phrasal verb 'get out' (sair ao ar livre para caminhar).",
    generalMeaning: "obter, conseguir, tornar-se, deslocar-se",
    ipa: "/ɡet/",
    note: "Um dos verbos mais comuns da língua inglesa; o segredo britânico é pronunciar o 't' nítido e seco."
  },
  "out": {
    type: "Preposição / Advérbio de Movimento",
    contextMeaning: "Para fora, ao ar livre, nas ruas frescas de Londres; compõe a locução 'get out'.",
    generalMeaning: "fora, para fora, ao ar livre",
    ipa: "/aʊt/",
    note: "No RP, o ditongo /aʊ/ é amplo e redondo, sem anasalamento."
  },
  "take": {
    type: "Verbo Irregular",
    contextMeaning: "Absorver ou assimilar deliberadamente os estímulos; ao lado de 'in', forma 'take in' (contemplar).",
    generalMeaning: "pegar, tomar, levar, absorver",
    ipa: "/teɪk/",
    note: "Ditongo fechado elegante /eɪ/ com o 'k' suave."
  },
  "in": {
    type: "Preposição",
    contextMeaning: "Indica imersão profunda na luminosidade matinal ('bathed in') ou foco total ('in earnest').",
    generalMeaning: "em, dentro de, no/na",
    ipa: "/ɪn/",
    note: "Serve de partícula estruturante em expressões de prestígio."
  },
  "foot": {
    type: "Substantivo",
    contextMeaning: "Na locução 'setting foot on', representa o primeiro contato físico com as calçadas frias ao sair de casa.",
    generalMeaning: "pé, base, medida de comprimento",
    ipa: "/fʊt/",
    note: "Plural irregular: 'feet' /fiːt/."
  },
  "feet": {
    type: "Substantivo Plural",
    contextMeaning: "Estar caminhando ativamente ('on my feet') pelas calçadas de Londres por meia hora.",
    generalMeaning: "pés",
    ipa: "/fiːt/",
    note: "Vogal longa esticada /iː/."
  },
  "cold": {
    type: "Adjetivo",
    contextMeaning: "A temperatura fresca e revigorante das calçadas de pedra de Londres pela manhã.",
    generalMeaning: "frio, gelado, fresco",
    ipa: "/kəʊld/",
    note: "No RP britânico, inicia com o ditongo /əʊ/ (schwa para 'u'), muito diferente do 'ou' americano."
  },
  "pavements": {
    type: "Substantivo Plural",
    contextMeaning: "As calçadas de pedra e lajes cinzentas tradicionais das ruas de Londres.",
    generalMeaning: "calçadas (inglês britânico cultuado; no inglês americano usa-se 'sidewalks')",
    ipa: "/ˈpeɪv.mənts/",
    note: "Vocábulo clássico britânico: no Reino Unido, sempre se diz 'pavement', nunca 'sidewalk'."
  },
  "pavement": {
    type: "Substantivo",
    contextMeaning: "A calçada londrina de pedra ou lajota.",
    generalMeaning: "calçada (termo genuinamente britânico)",
    ipa: "/ˈpeɪv.mənt/",
    note: "Sufixo '-ment' é átono com som schwa /-mənt/."
  },
  "light": {
    type: "Substantivo",
    contextMeaning: "A luminosidade natural, suave e difusa do amanhecer na capital britânica.",
    generalMeaning: "luz, claridade, iluminação",
    ipa: "/laɪt/",
    note: "'L' inicial claro e 'T' aspirado limpo."
  },
  "morning": {
    type: "Substantivo",
    contextMeaning: "O período antes das oito horas em Londres, marcado pelo silêncio aristocrático das ruas.",
    generalMeaning: "manhã, período matutino",
    ipa: "/ˈmɔː.nɪŋ/",
    note: "Pronúncia britânica não-rótica: o 'r' não é pronunciado, apenas alonga a vogal /ˈmɔː.nɪŋ/."
  },
  "streets": {
    type: "Substantivo Plural",
    contextMeaning: "As ruas históricas de Marylebone ladeadas por edifícios georgianos de tijolos vermelhos.",
    generalMeaning: "ruas, vias públicas urbanas",
    ipa: "/striːts/",
    note: "Vogal /iː/ bem sustentada."
  },
  "street": {
    type: "Substantivo",
    contextMeaning: "A rua histórica londrina.",
    generalMeaning: "rua, via pública",
    ipa: "/striːt/",
    note: "Articulação frontal do 'str'."
  },
  "city": {
    type: "Substantivo",
    contextMeaning: "A metrópole de Londres antes de seu despertar frenético.",
    generalMeaning: "cidade grande, metrópole",
    ipa: "/ˈsɪt.i/",
    note: "O 't' britânico deve ser articulado com a ponta da língua nos alvéolos superiores, sem virar som de 'r'."
  },
  "mindset": {
    type: "Substantivo",
    contextMeaning: "A postura mental de calma, presença e dignidade para encarar o dia de trabalho.",
    generalMeaning: "mentalidade, atitude mental, modelo cognitivo",
    ipa: "/ˈmaɪnd.set/",
    note: "Enfatiza a intenção psicológica de compostura."
  },
  "awakens": {
    type: "Verbo (3ª pessoa)",
    contextMeaning: "O momento em que a cidade de Londres desperta para o movimento comercial e tráfego.",
    generalMeaning: "desperta, acorda",
    ipa: "/əˈweɪ.kənz/",
    note: "Tom poético mais nobre que o comum 'wakes up'."
  },
  "calm": {
    type: "Adjetivo / Substantivo",
    contextMeaning: "A serenidade matinal sem buzinas ou correria nas ruas de Westminster e Marylebone.",
    generalMeaning: "calmo, tranquilo, serenidade",
    ipa: "/kɑːm/",
    note: "O 'l' é completamente mudo no inglês britânico culto: pronuncia-se 'cahm' com o /ɑː/ longo."
  },
  "firmly": {
    type: "Advérbio",
    contextMeaning: "Com segurança, firmeza e determinação inabalável.",
    generalMeaning: "firmemente, com solidez",
    ipa: "/ˈfɜːm.li/",
    note: "Vogal central longa /ɜː/, sem pronunciar o 'r'."
  },
  "setting": {
    type: "Verbo (Gerúndio)",
    contextMeaning: "Pousar os pés no chão ('setting foot') ao iniciar a caminhada matinal.",
    generalMeaning: "colocando, posicionando, ajustando",
    ipa: "/ˈset.ɪŋ/",
    note: "'Double t' articulado com clareza sem transformar em tepe."
  }
};

// Merge all 30 days of glossaries from challenge-data.js dynamically
try {
  global.window = global;
  require('../challenge-data.js');
  if (global.window && Array.isArray(global.window.CHALLENGE_30_DAYS)) {
    global.window.CHALLENGE_30_DAYS.forEach(dayItem => {
      if (Array.isArray(dayItem.glossary)) {
        dayItem.glossary.forEach(g => {
          const rawTerm = g.term.trim();
          const lowerTerm = rawTerm.toLowerCase();
          if (rawTerm.includes(' ')) {
            // It's a multi-word expression/collocation
            const exists = COLLOCATIONS_RICH.some(c => c.en.toLowerCase() === lowerTerm);
            if (!exists) {
              COLLOCATIONS_RICH.push({
                en: rawTerm,
                type: "Expressão / Colocação da Lição",
                contextMeaning: g.meaning,
                generalMeaning: g.meaning,
                ipa: "",
                note: "Expressão destacada no Dia " + dayItem.day + " (" + dayItem.title + ").",
                triggerWords: lowerTerm.split(/\\s+/)
              });
            }
          } else {
            // It's a single word
            if (!VOCABULARY_RICH[lowerTerm]) {
              VOCABULARY_RICH[lowerTerm] = {
                type: "Vocabulário da Lição",
                contextMeaning: g.meaning,
                generalMeaning: g.meaning,
                ipa: "",
                note: "Vocábulo do Dia " + dayItem.day + " (" + dayItem.title + ")."
              };
            }
          }
        });
      }
    });
  }
} catch (e) {
  console.warn('Could not auto-merge challenge-data.js:', e.message);
}

// 3. Generate dictionary.js with Smart Dual Lookup (Expression & Word)
const fileContent = `/**
 * The Posh Lab — British Immersion Instant Dictionary & Contextual Inspector Engine
 * Supports:
 * 1. Multi-word collocations & phrasal verbs (chunks)
 * 2. Isolated individual words
 * 3. Seamless switching between Expression and Isolated Word
 * 4. Explicit "In this context, it means..." (Neste contexto, significa:) explanations
 */

window.BRITISH_COLLOCATIONS = ${JSON.stringify(COLLOCATIONS_RICH, null, 2)};

window.BRITISH_DICTIONARY = ${JSON.stringify(VOCABULARY_RICH, null, 2)};

/**
 * Smart Dual Lookup: Resolves both the Expression and the Isolated Word
 * so the user can see:
 * - The whole chunk/idiom (e.g. "bathed in", "get out", "pacing oneself")
 * - The single word (e.g. "bathed", "get", "pacing")
 * - What it specifically means in this sentence context!
 */
window.lookupWord = function(rawText, sentenceContext) {
  if (!rawText) return null;
  const clean = rawText.toLowerCase().replace(/[^a-z0-9'\\s-]/g, '').trim();
  if (!clean) return null;

  let expressionMatch = null;
  let wordMatch = null;

  // 1. Look for matching Collocations / Phrasal Verbs in sentence context
  if (sentenceContext) {
    const sLower = sentenceContext.toLowerCase();
    for (const c of window.BRITISH_COLLOCATIONS) {
      if (sLower.includes(c.en.toLowerCase())) {
        const triggers = c.triggerWords || c.en.toLowerCase().split(/\\s+/);
        if (triggers.includes(clean) || c.en.toLowerCase().includes(clean)) {
          expressionMatch = {
            en: c.en,
            type: c.type || "Expressão Idiomática / Colocação",
            contextMeaning: c.contextMeaning || c.pt,
            generalMeaning: c.generalMeaning || c.pt,
            ipa: c.ipa || '',
            note: c.note || 'Colocação de prestígio no inglês britânico culto.'
          };
          break;
        }
      }
    }
  }

  // Check direct collocation match without sentence context
  if (!expressionMatch) {
    const direct = window.BRITISH_COLLOCATIONS.find(c => c.en.toLowerCase() === clean);
    if (direct) {
      expressionMatch = {
        en: direct.en,
        type: direct.type || "Expressão Idiomática",
        contextMeaning: direct.contextMeaning || direct.pt,
        generalMeaning: direct.generalMeaning || direct.pt,
        ipa: direct.ipa || '',
        note: direct.note || ''
      };
    }
  }

  // 2. Resolve Single Word match
  if (window.BRITISH_DICTIONARY[clean]) {
    const d = window.BRITISH_DICTIONARY[clean];
    wordMatch = {
      en: clean,
      type: d.type || (d.pos ? "Classe: " + d.pos : "Palavra Isolada"),
      contextMeaning: d.contextMeaning || d.pt,
      generalMeaning: d.generalMeaning || d.pt,
      ipa: d.ipa || '',
      note: d.note || ''
    };
  } else {
    // Check stems for single word
    const stems = [
      clean.replace(/ing$/, ''),
      clean.replace(/ed$/, ''),
      clean.replace(/es$/, ''),
      clean.replace(/s$/, ''),
      clean.replace(/ly$/, '')
    ];
    for (const st of stems) {
      if (st && st.length >= 3 && window.BRITISH_DICTIONARY[st]) {
        const d = window.BRITISH_DICTIONARY[st];
        wordMatch = {
          en: clean,
          type: d.type || "Palavra (Forma Derivada)",
          contextMeaning: d.contextMeaning || d.pt,
          generalMeaning: d.generalMeaning || d.pt,
          ipa: d.ipa || '',
          note: "Forma derivada do vocábulo '" + st + "'."
        };
        break;
      }
    }
  }

  // Fallback check on window.MASTER_LEXICON
  if (!wordMatch && typeof window !== 'undefined' && window.MASTER_LEXICON) {
    const lex = window.MASTER_LEXICON.find(l => l.term.toLowerCase() === clean);
    if (lex) {
      wordMatch = {
        en: lex.term,
        type: "Vocabulário da Trilha",
        contextMeaning: lex.meaning,
        generalMeaning: lex.meaning,
        ipa: '',
        note: "Dia " + lex.day + ": " + lex.lessonTitle
      };
    }
  }

  // Fallback single word if not in dictionary
  if (!wordMatch) {
    wordMatch = {
      en: clean,
      type: "Palavra Isolada",
      contextMeaning: "Termo do roteiro da lição.",
      generalMeaning: "Consulte o modo Frase a Frase para a tradução paralela.",
      ipa: '',
      note: ''
    };
  }

  // Return dual payload so UI can provide instant tabs
  return {
    hasExpression: Boolean(expressionMatch),
    expression: expressionMatch,
    word: wordMatch,
    // Active default view: prioritize expression if available!
    active: expressionMatch || wordMatch
  };
};
`;

const targetFile = path.resolve(__dirname, '..', 'dictionary.js');
fs.writeFileSync(targetFile, fileContent, 'utf-8');
console.log('Successfully updated dictionary.js with rich contextual expressions and dual lookup!');
