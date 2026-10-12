const fs = require('fs');
const path = require('path');

const targetFile = path.resolve(__dirname, '..', 'challenge-data.js');
let raw = fs.readFileSync(targetFile, 'utf-8');

global.window = global;
require(targetFile);

const days = window.CHALLENGE_30_DAYS;

function splitSentences(text) {
  if (!text) return [];
  const s = text.match(/[^.!?]+[.!?]+(\s|$)/g);
  return s ? s.map(t => t.trim()) : [text.trim()];
}

function alignParagraphSentences(enText, ptText) {
  const enArr = splitSentences(enText);
  const ptArr = splitSentences(ptText);
  const result = [];
  
  if (enArr.length === ptArr.length) {
    for (let i = 0; i < enArr.length; i++) {
      result.push({ en: enArr[i], pt: ptArr[i] });
    }
  } else if (enArr.length > ptArr.length) {
    for (let i = 0; i < ptArr.length; i++) {
      if (i === ptArr.length - 1) {
        result.push({ en: enArr.slice(i).join(' '), pt: ptArr[i] });
      } else {
        result.push({ en: enArr[i], pt: ptArr[i] });
      }
    }
  } else {
    for (let i = 0; i < enArr.length; i++) {
      if (i === enArr.length - 1) {
        result.push({ en: enArr[i], pt: ptArr.slice(i).join(' ') });
      } else {
        result.push({ en: enArr[i], pt: ptArr[i] });
      }
    }
  }
  return result;
}

// 1. Enrich paragraphs with sentences
days.forEach(d => {
  d.paragraphs.forEach(p => {
    p.sentences = alignParagraphSentences(p.text, p.textPt);
  });
});

// 2. Enrich Day 1 glossary specifically with user-requested words!
const DAY1_EXPANDED_GLOSSARY = [
  { term: "Grounding", meaning: "Reconfortante, que traz calma, equilíbrio mental e serenidade aos pensamentos." },
  { term: "Bathed in", meaning: "Banhado por, envolto suavemente pela luz matinal." },
  { term: "Silvery", meaning: "Prateado, suave, de luminosidade difusa." },
  { term: "Brisk stroll", meaning: "Caminhada rápida, com passo firme e revigorante." },
  { term: "Tucked firmly", meaning: "Bem guardado, firme no bolso sem distrações." },
  { term: "Take in", meaning: "Absorver, contemplar e apreciar o momento com calma." },
  { term: "Quiet cadence", meaning: "Cadência serena, ritmo melódico e fluxo pausado da fala ou da cidade." },
  { term: "Rustle", meaning: "Sussurro suave, farfalhar das folhas ao vento." },
  { term: "Hum", meaning: "Zumbido distante e contínuo, murmúrio sereno da cidade." },
  { term: "Shifting gears", meaning: "Trocando de marcha (condução suave sem solavancos)." },
  { term: "Chill", meaning: "Frescor matinal, friozinho revigorante." },
  { term: "Mental clarity", meaning: "Clareza mental, lucidez serena e foco." },
  { term: "Invariably", meaning: "Invariavelmente, sempre, sem exceção." },
  { term: "Discreet", meaning: "Discreto, sutil, reservado e sem afetação." },
  { term: "Pacing oneself", meaning: "Ditar o próprio ritmo com calma, sem se afobar." },
  { term: "In earnest", meaning: "Para valer, a sério, com foco e intensidade total." },
  { term: "Buffer zone", meaning: "Zona de amortecimento, espaço de respiro mental." },
  { term: "Astonishing difference", meaning: "Diferença assombrosa, impacto impressionante no foco." },
  { term: "Thoroughly composed", meaning: "Totalmente centrado, sereno e em paz consigo mesmo." },
  { term: "Tackle", meaning: "Encarar com firmeza e resolver estrategicamente." },
  { term: "Undivided attention", meaning: "Total atenção exclusiva, foco sem dispersão." },
  { term: "Natural gravitas", meaning: "Presença, autoridade moral e peso sereno na voz e postura." },
  { term: "Deliberate composure", meaning: "Compostura pausada, postura calma e intencional." },
  { term: "Steady breath", meaning: "Respiração firme e controlada para manter a cadência." }
];

days[0].glossary = DAY1_EXPANDED_GLOSSARY;

// 3. Re-build MASTER_LEXICON
const masterLexicon = [];
days.forEach(d => {
  if (d.glossary && d.glossary.length) {
    d.glossary.forEach((g, gIdx) => {
      masterLexicon.push({
        id: `lex_${d.day}_${gIdx}`,
        day: d.day,
        lessonTitle: d.title,
        week: d.week,
        term: g.term,
        meaning: g.meaning,
        example: d.script.slice(0, 120)
      });
    });
  }
});

const outputCode = `/**
 * 30-Day High Society British Shadowing Challenge Data — 2-Minute Immersion
 * Complete dataset with 2-minute master audios, multi-paragraph breakdowns,
 * complete Portuguese translations, aligned sentence pairs, and expanded lexicon.
 */
window.CHALLENGE_30_DAYS = ${JSON.stringify(days, null, 2)};

window.MASTER_LEXICON = ${JSON.stringify(masterLexicon, null, 2)};
`;

fs.writeFileSync(targetFile, outputCode, 'utf-8');
console.log('Successfully updated challenge-data.js!');
console.log('Total days:', days.length);
console.log('Master Lexicon total items:', masterLexicon.length);
