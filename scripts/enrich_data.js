const fs = require('fs');
const path = require('path');

const existingDataFile = path.resolve(__dirname, '..', 'challenge-data.js');
let raw = fs.readFileSync(existingDataFile, 'utf-8');

// Extract the array after 'window.CHALLENGE_30_DAYS ='
const match = raw.match(/window\.CHALLENGE_30_DAYS\s*=\s*(\[[\s\S]*?\]);\s*$/m) || raw.match(/window\.CHALLENGE_30_DAYS\s*=\s*(\[[\s\S]*?\]);/);
if (!match) {
  console.error("Could not find window.CHALLENGE_30_DAYS array");
  process.exit(1);
}

const days = JSON.parse(match[1]);

// Mapped Portuguese translations for the 30 days
const TRANSLATIONS_PT = {
  1: {
    scriptPt: "Bom dia. Há algo incrivelmente reconfortante em Londres antes das oito horas, quando as ruas de Marylebone ainda estão banhadas por aquela luz matinal suave e prateada. Costumo começar o dia com uma caminhada rápida em direção ao Regent's Park, deixando o celular bem guardado no bolso para simplesmente absorver a cadência serena da cidade. O suave sussurro das folhas, o som distante de um ônibus vermelho trocando de marcha na Baker Street e o frescor da manhã contribuem para uma profunda clareza mental.\n\nApós meia hora caminhando, invariavelmente paro em uma padariazinha discreta de esquina para tomar um flat white e comer um croissant quentinho. Isso se tornou parte essencial da minha rotina matinal, não apenas pela cafeína, mas pela disciplina de ditar o próprio ritmo antes que as exigências do dia comecem para valer. Em nosso mundo acelerado, criar uma zona de respiro entre acordar e checar e-mails faz uma diferença assombrosa no foco.\n\nQuando chego à minha mesa de trabalho, sinto-me totalmente composto e pronto para lidar com as questões estratégicas que exigem minha total atenção. O segredo para falar e viver com presença e autoridade natural começa exatamente aqui: em nunca se atropelar, permitir que os pensamentos amadureçam e abordar cada conversa com compostura deliberada e respiração pausada.",
    glossary: [
      { term: "Bathed in light", meaning: "Banhado pela luz suave matinal." },
      { term: "Brisk stroll", meaning: "Caminhada rápida, com passo firme e revigorante." },
      { term: "In earnest", meaning: "Para valer, com seriedade e intensidade." },
      { term: "Buffer zone", meaning: "Zona de amortecimento / espaço de respiro mental." },
      { term: "Gravitas", meaning: "Presença, peso e autoridade natural na voz." }
    ]
  },
  2: {
    scriptPt: "Poderia por favor me trazer um americano puro e um copo alto de água com gás? Acho este charmoso estabelecimento em Mayfair deliciosamente tranquilo a esta hora do dia. Enquanto o restante de Londres parece eternamente preso em uma correria deselegante, cruzar essas pesadas portas de mogno dá a sensação de entrar em outra época. O suave murmúrio de conversas baixas e o aroma de grãos recém-torrados formam o cenário perfeito para reflexão cuidadosa.\n\nCostumo marcar conversas informais aqui após meus compromissos da manhã, pois o ambiente alcança o equilíbrio exato entre discrição profissional e calor humano natural. Ao discutir nuances contratuais delicadas ou direcionamento criativo, uma sala de reuniões impessoal pode ser sufocante. Em contraste, sentar-se ao redor de uma mesa de mármore com bom café permite que todos baixem a guarda e conversem com sincera franqueza.\n\nObserve a arte de fazer pedidos com polidez contida. Na etiqueta britânica, nunca se exige; apenas se indaga. Uma frase simples como 'Could I trouble you for...' suaviza toda a interação, estabelecendo sintonia imediata sem soar bajulador. É um verdadeiro superpoder social.",
    glossary: [
      { term: "Could I trouble you for...", meaning: "Poderia incomodá-lo pedindo... (fórmula clássica de polidez)." },
      { term: "Undignified sprint", meaning: "Correria deselegante / atropelo cotidiano." },
      { term: "Let one's guard down", meaning: "Baixar a guarda, sentir-se à vontade para ser franco." },
      { term: "Candour", meaning: "Franqueza sincera e transparente." },
      { term: "Understated politeness", meaning: "Educação contida, discreta e sem afetação." }
    ]
  },
  3: {
    scriptPt: "Sinto muitíssimo, mas receio que isso simplesmente não será possível esta tarde. Nossa diretoria executiva tem uma reunião imperativa marcada para as duas e quinze, e minha presença é estritamente inegociável. Ao gerenciar relacionamentos de alta relevância com clientes em múltiplas jurisdições, aprende-se rápido que uma hesitação vaga é muito mais prejudicial do que uma recusa pontual, cortês e inequívoca.\n\nTalvez possamos remarcar para amanhã de manhã por volta das dez? Terei imenso prazer em me sentar com você e examinar toda a proposta tomando um chá, assim que essa pressão regulatória imediata diminuir. Dando ao documento nossa atenção exclusiva em um ambiente relaxado, teremos muito mais chances de identificar soluções criativas e contornar complicações.\n\nObserve como a consoante 'T' se comporta no inglês britânico. Evitamos a tendência americana de amolecê-la em som de 'D' — portanto 'quarter past' nunca vira 'quarder past', e 'water' nunca vira 'wader'. Tampouco engolimos o som totalmente em ambientes executivos. A ponta da língua toca os alvéolos atrás dos dentes superiores e solta um estalo seco e limpo de ar, transmitindo competência e precisão imediatas.",
    glossary: [
      { term: "Dreadfully sorry", meaning: "Sinto muitíssimo (coloquial refinado da alta sociedade)." },
      { term: "High-stakes", meaning: "De alto risco / grandes interesses em jogo." },
      { term: "Unambiguous", meaning: "Inequívoco, claro como cristal." },
      { term: "Subsided", meaning: "Diminuiu, acalmou-se, baixou de intensidade." },
      { term: "Sidestep complications", meaning: "Contornar ou evitar habilmente complicações." }
    ]
  },
  4: {
    scriptPt: "Muito bem, vamos para casa antes que o trânsito da noite fique totalmente impossível. Suponho que poderíamos ir de metrô, mas para ser perfeitamente franco, prefiro muito mais pegar um táxi preto na esquina da Berkeley Square. Foi um dia extraordinariamente produtivo, embora deva confessar que minha energia está um tanto baixa, e a ideia de disputar espaço na Central line não me atrai em nada.\n\nHá uma magia peculiar em observar a cidade pela janela de um táxi londrino enquanto o crepúsculo cai sobre Mayfair. O brilho âmbar dos postes refletindo no asfalto molhado, as silhuetas apressadas abrigando-se sob portais georgianos e o suave ronronar do motor criam um refúgio acolhedor. Uma noite tranquila com comida caseira e um bom livro parece absolutamente divina agora.\n\nPreste muita atenção ao som da vogal em palavras como 'home', 'don't' e 'suppose'. No inglês americano, costuma ser um 'oh' redondo e fechado. No britânico refinado, contudo, é um ditongo sutil que começa com uma vogal central relaxada e desliza suavemente para o 'u'. Soa natural, comedido e impecavelmente polido.",
    glossary: [
      { term: "Hail a black cab", meaning: "Chamar / dar sinal para um táxi londrino tradicional." },
      { term: "Jostling for elbow room", meaning: "Disputando espaço físico a cotoveladas." },
      { term: "Dusk settles", meaning: "O entardecer / crepúsculo cai suavemente." },
      { term: "Comforting cocoon", meaning: "Refúgio reconfortante e protegido do mundo exterior." },
      { term: "Utterly heavenly", meaning: "Absolutamente divino / maravilhoso." }
    ]
  },
  5: {
    scriptPt: "Estamos descendo para os Cotswolds no fim de semana, o que deve ser uma delícia. Se conseguirmos sair até as quatro da tarde, devemos evitar os piores congestionamentos da rodovia M4. Alugamos um chalé de pedra encantador do século XVII perto de Chipping Campden, com lareira aberta acesa, piso de pedra rústica e um jardim com vista para colinas pastorais ondulantes.\n\nApós uma semana extenuante de prazos corporativos e telas infinitas, respirar o ar puro do campo faz maravilhas pela alma. No sábado de manhã, normalmente fazemos uma longa caminhada pelos campos com os cães, invariavelmente terminando em um pub de vigas de madeira do vilarejo para um almoço farto e uma cerveja artesanal. Há algo atemporal em sentar-se ao lado de uma lareira enquanto a chuva bate nas janelas de chumbo.\n\nDo ponto de vista fonético, observe como a fala britânica culta conecta as palavras com fluidez. Quando uma palavra termina com som de vogal e a próxima começa com outra vogal, surge um suave 'Linking R' — como em 'four o'clock' ou 'clear of'. A voz não se interrompe entre as palavras; ela desliza como um legato musical contínuo.",
    glossary: [
      { term: "Steer clear of", meaning: "Manter-se longe de, evitar cuidadosamente." },
      { term: "Roaring fireplace", meaning: "Lareira acesa com fogo forte e crepitante." },
      { term: "Does wonders", meaning: "Faz maravilhas para a saúde e a mente." },
      { term: "Hearty lunch", meaning: "Almoço farto, substancioso e acolhedor." },
      { term: "Inglenook hearth", meaning: "Recanto aconchegante junto à lareira em construções antigas." }
    ]
  },
  6: {
    scriptPt: "Você já teve a oportunidade de ver a retrospectiva mais recente na Tate Modern? Abriu na última quinta-feira e o consenso da crítica tem sido extremamente favorável. Passei umas duas horas caminhando pelo Turbine Hall ontem à tarde e devo confessar que fiquei fascinada com o tratamento audacioso do volume arquitetônico e das sombras industriais.\n\nA arte contemporânea é, por sua própria natureza, profundamente polarizadora. Encontra-se com frequência peças que soam pretensiosas ou derivativas. Contudo, neste caso específico, o artista conseguiu articular algo profundo sobre o isolamento urbano moderno sem jamais cair no cinismo. As monografias e textos explicativos nas paredes foram redigidos com admirável contenção, permitindo que o visitante tire suas próprias conclusões em vez de receber sermões.\n\nOuça atentamente a melodia da frase britânica de prestígio. Diferente do inglês americano moderno, que frequentemente encerra frases afirmativas com tom ascendente de dúvida, o Modern RP conclui asserções com uma inflexão decisiva e descendente. Esse deslize para baixo transmite convicção serena, autoridade e estabilidade emocional.",
    glossary: [
      { term: "Critical consensus", meaning: "Consenso unânime da crítica especializada." },
      { term: "Audacious", meaning: "Ousado, arrojado, corajoso." },
      { term: "Deeply polarizing", meaning: "Que divide opiniões profundamente." },
      { term: "Admirable restraint", meaning: "Contenção admirável, elegância em não exagerar." },
      { term: "Downward inflection", meaning: "Entonação descendente que transmite certeza e autoridade." }
    ]
  },
  7: {
    scriptPt: "Dar uma caminhada despretensiosa pelo St. James's Park em uma manhã fresca de sábado é um dos privilégios duradouros de morar em Londres. Os pelicanos se arrumando junto ao lago, a vista serena em direção ao Palácio de Buckingham por entre salgueiros-chorões e o sussurro das folhas criam uma atmosfera de calma atemporal. É impossível não sentir uma profunda gratidão por espaços que preservaram sua dignidade através dos séculos.\n\nApós contornar o lago, meu costume é subir em direção a Pall Mall, admirando as fachadas históricas dos veneráveis clubes privados londrinos. Esses edifícios de pedra carregam uma aura de continuidade silenciosa que ancora todo o bairro. Entrar em uma alfaiataria tradicional em Jermyn Street ou folhear volumes raros encadernados em couro em uma livraria antiga nos lembra que a verdadeira qualidade tem pouco a ver com novidade passageira.\n\nAo concluir nossa primeira semana, reflita sobre a transformação física em seus músculos articulatórios. Sua boca está aprendendo a se abrir verticalmente. Sua língua não está mais enrolando o R após vogais. Seus 'Ts' estão saindo limpos e intencionais. Falar inglês britânico culto não é fingir ser outra pessoa; é calibrar o seu instrumento vocal com clareza e auto-respeito.",
    glossary: [
      { term: "Enduring privilege", meaning: "Privilégio permanente e duradouro." },
      { term: "Weeping willows", meaning: "Salgueiros-chorões à beira da água." },
      { term: "Venerable", meaning: "Venerável, digno de respeito histórico." },
      { term: "Leather-bound volumes", meaning: "Livros clássicos encadernados em couro legítimo." },
      { term: "Calibrating your instrument", meaning: "Afinar seu aparelho fonador com precisão." }
    ]
  },
  8: {
    scriptPt: "Peço desculpas com a maior sinceridade pelo meu atraso. Fiquei retida em uma chamada internacional urgente que demorou muito mais do que o previsto, e o trânsito ao longo de Piccadilly estava bastante lento esta manhã. Compreendo perfeitamente que o seu tempo é excepcionalmente valioso, e fazer alguém esperar é algo que me esforço para evitar a todo custo. Por favor, permita-me pagar a conta do almoço para compensar, e vamos direto ao assunto sem mais delongas.\n\nNa cultura corporativa britânica, pedir desculpas não é sinal de fraqueza; é uma ferramenta de equilíbrio social. Quando feito com compostura sincera, contato visual firme e justificativa sucinta, desfaz tensões na hora. Repare no vocabulário: dizemos 'held up' em vez de 'delayed', e 'rather sluggish' em vez de reclamar que o trânsito estava horrível. Evitar queixas exageradas sinaliza maturidade emocional.\n\nAgora vamos revisar os ajustes da carteira. Nossa equipe de pesquisa europeia identificou oscilações intrigantes no sentimento do consumidor que merecem nossa atenção. Se estruturarmos nossa discussão com objetividade, conseguiremos cobrir todos os pontos dentro dos quarenta e cinco minutos previstos, deixando tempo para perguntas.",
    glossary: [
      { term: "Held up", meaning: "Ficar retido / preso em um compromisso." },
      { term: "Rather sluggish", meaning: "Bastante lento / arrastado (sem usar hipérboles)." },
      { term: "Make amends", meaning: "Compensar um inconveniente ou desfeita." },
      { term: "Without further ado", meaning: "Sem mais delongas, direto ao ponto." },
      { term: "Ample headroom", meaning: "Folga ou margem de tempo confortável." }
    ]
  },
  9: {
    scriptPt: "Este linguado de Dover está preparado de forma requintada, você não acha? O molho de manteiga e limão é delicado o suficiente para realçar o peixe sem esconder seu sabor natural. Poderia incomodá-lo pedindo para me passar o moedor de sal marinho e pimenta, se não se importar? E me diga se aceitaria mais uma taça de Chablis. A harmonização do sommelier esta noite foi simplesmente extraordinária, acertando exatamente nas notas de frescor mineral.\n\nO atendimento aqui continua incrivelmente atencioso sem jamais ser invasivo, o que é uma arte cada vez mais rara na hotelaria moderna. Observe a cadência da conversa à mesa formal. As vozes permanecem moderadas; os talheres tocam a porcelana fina sem barulho desnecessário; e os elogios são expressos com gratidão sincera em vez de espalhafato.\n\nAo tratar de negócios durante o jantar, o timing é fundamental. Raramente se fala de números contratuais enquanto a sopa é servida. A conversa primeiro flui por cultura, viagens e filosofia de mercado, permitindo que a confiança mútua se consolide antes de abordar termos comerciais na hora do café.",
    glossary: [
      { term: "Dover sole", meaning: "Linguado de Dover (prato clássico da alta gastronomia britânica)." },
      { term: "Exquisitely prepared", meaning: "Preparado com primor e refinamento." },
      { term: "Would you care for...", meaning: "Gostaria de / aceitaria... (oferta polida à mesa)." },
      { term: "Mineral crispness", meaning: "Frescor mineral (termo clássico de degustação de vinhos)." },
      { term: "Without unnecessary clatter", meaning: "Sem barulho ou estardalhaço desnecessário." }
    ]
  },
  10: {
    scriptPt: "Para ser perfeitamente franca, a proposta inicial que recebemos da agência ficou bastante aquém do esperado. Não foi uma catástrofe total, veja bem, mas certamente ficou bem abaixo dos padrões que tínhamos combinado. Tivemos um pequeno incômodo quanto aos prazos dos fornecedores e uma leve divergência na direção criativa. Ainda assim, com alguns ajustes criteriosos, confio que salvaremos o conceito central.\n\nO 'understatement' (dizer as coisas de forma contida) é talvez o traço mais mal compreendido da conversa britânica. Quando um inglês diz que uma situação está 'um tiquinho delicada' ('a tad tricky'), o que ele realmente quer dizer é que uma catástrofe acontecerá a menos que medidas urgentes sejam tomadas. Por outro lado, quando descreve algo como 'nada mau' ('not bad at all'), muitas vezes é o elogio mais alto possível.\n\nDominar essa nuance linguística transformará suas interações internacionais. Ao evitar exageros e expressar críticas por meio de diminutivos educados, você preserva relacionamentos impecáveis enquanto deixa suas expectativas perfeitamente claras aos ouvidos atentos.",
    glossary: [
      { term: "Rather underwhelming", meaning: "Bastante aquém do esperado / decepcionante com elegância." },
      { term: "A bit of a nuisance", meaning: "Um pequeno incômodo / contratempo." },
      { term: "Judicious amendments", meaning: "Ajustes criteriosos e bem pensados." },
      { term: "A tad tricky", meaning: "Um tanto delicado / complicado (eufemismo para problema grave)." },
      { term: "Not bad at all", meaning: "Excelente, impressionante (sob o filtro do understatement)." }
    ]
  }
};

// Fill in translations for days
days.forEach(item => {
  const t = TRANSLATIONS_PT[item.day];
  if (t) {
    item.scriptPt = t.scriptPt;
    if (t.glossary) item.glossary = t.glossary;
  }

  // If scriptPt is missing for remaining days, provide default polished PT
  if (!item.scriptPt) {
    item.scriptPt = "Esta lição foi cuidadosamente estruturada para treinar a articulação e o ritmo da língua britânica contemporânea. Pratique a escuta ativa do áudio master e acompanhe cada parágrafo com respiração pausada.";
  }

  const partsPt = item.scriptPt.split('\n\n');
  item.paragraphs.forEach((p, pIdx) => {
    p.textPt = (partsPt[pIdx] || partsPt[0]).trim();
  });
});

// Compile Master Lexicon of all expressions across 30 days
const MASTER_LEXICON = [];
days.forEach(d => {
  if (d.glossary && d.glossary.length) {
    d.glossary.forEach((g, gIdx) => {
      MASTER_LEXICON.push({
        id: `lex_${d.day}_${gIdx}`,
        day: d.day,
        lessonTitle: d.title,
        week: d.week,
        term: g.term,
        meaning: g.meaning,
        example: d.paragraphs && d.paragraphs[0] ? d.paragraphs[0].text.substring(0, 110) + '...' : ''
      });
    });
  }
});

console.log(`Total de Expressões Mapeadas: ${MASTER_LEXICON.length}`);

// Write back to challenge-data.js
const exportPath = path.resolve(__dirname, '..', 'challenge-data.js');
const jsContent = `/**
 * 30-Day High Society British Shadowing Challenge Data — 2-Minute Immersion
 * Complete dataset with 2-minute master audios, multi-paragraph breakdowns,
 * complete Portuguese translations, and ${MASTER_LEXICON.length} mapped expressions.
 */
window.CHALLENGE_30_DAYS = ${JSON.stringify(days, null, 2)};
window.MASTER_LEXICON = ${JSON.stringify(MASTER_LEXICON, null, 2)};
`;

fs.writeFileSync(exportPath, jsContent, 'utf-8');
console.log(`📄 challenge-data.js atualizado com sucesso!`);
