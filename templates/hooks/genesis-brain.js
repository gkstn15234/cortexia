#!/usr/bin/env node
/**
 * Genesis Brain — Hook 전용 (서버 불필요)
 * ========================================
 * 사용법:
 *   node genesis-brain.js init          — 뇌 초기화 + 상태 출력
 *   node genesis-brain.js state         — 현재 뇌 상태 출력
 *   node genesis-brain.js process "메시지" — 뇌 자극 + 상태 출력
 *   node genesis-brain.js feedback "입력" "응답" — 피드백 학습
 */

const fs = require('fs');
const path = require('path');

const PROJECT = path.resolve(__dirname, '..', '..');
const DNA_PATH = path.join(PROJECT, 'digital-dna-js - d');
const STATE_FILE = path.join(PROJECT, '.genesis_brain_state.json');

const { GenesisBrainDNA } = require(path.join(DNA_PATH, 'genesis_brain_dna.js'));
const { applyPersona } = require(path.join(DNA_PATH, 'persona.js'));

// Cortexia 기억 시스템
let Cortexia;
try {
  ({ Cortexia } = require('cortexia'));
} catch {
  try {
    ({ Cortexia } = require(path.join(process.env.APPDATA, 'npm/node_modules/cortexia')));
  } catch { Cortexia = null; }
}

function getCortexia() {
  if (!Cortexia) return null;
  try {
    return new Cortexia({
      userId: 'search_brain',
      dataDir: path.join(PROJECT, '.cortexia_search'),
      docsDir: path.join(PROJECT, '.cortexia_search_docs'),
    });
  } catch { return null; }
}

async function recallMemories(query, max = 5) {
  const cx = getCortexia();
  if (!cx) return [];
  try {
    const r = await cx.recall(query, { maxResults: max });
    return r.memories || [];
  } catch { return []; }
}

async function saveMemory(text, type = 'preference') {
  const cx = getCortexia();
  if (!cx) return false;
  try {
    await cx.remember({ input: text, type, emotion: 'neutral', importance: 0.95, timezone: 'Asia/Seoul' });
    return true;
  } catch { return false; }
}

function loadBrain() {
  const brain = new GenesisBrainDNA();
  brain.applyPersona('GENESIS_DEFAULT');

  // 저장된 상태가 있으면 복원
  if (fs.existsSync(STATE_FILE)) {
    try {
      const saved = JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
      brain.loadFromJSON(saved);
    } catch (e) {
      // 복원 실패하면 새 뇌로 시작
    }
  }

  return brain;
}

function saveBrain(brain) {
  const data = brain.exportJSON();
  fs.writeFileSync(STATE_FILE, JSON.stringify(data), 'utf8');
}

function getState(brain) {
  const state = brain.getFullState();
  const inner = brain.consciousness ? brain.consciousness.getInnerState() : null;
  return {
    mood: state.mood,
    innerThought: inner ? inner.innerThought : '',
    personality: state.personality,
    neuromodulators: state.neuromodulators,
    growthStage: state.growthStage,
    stability: state.stability,
    interactionCount: state.interactionCount,
    episodicMemories: state.episodicMemories,
    identity: brain._persona ? brain._persona.identity : '',
    values: brain._persona ? brain._persona.values : [],
  };
}

// stdout에서 JSON만 추출 (consciousness 로그 제거)
const _origLog = console.log;
const _origErr = console.error;
let _captured = [];
function silenceLogs() {
  console.log = (...args) => { _captured.push(args.join(' ')); };
  console.error = (...args) => {};
}
function restoreLogs() {
  console.log = _origLog;
  console.error = _origErr;
}
function output(obj) {
  restoreLogs();
  _origLog(JSON.stringify(obj));
}

// ═══════════════════════════════════════
const cmd = process.argv[2];

silenceLogs();

if (cmd === 'init') {
  const brain = loadBrain();
  if (brain.consciousness) {
    brain.consciousness.tick();
  } else {
    brain.startConsciousness(999999);
    brain.consciousness.tick();
    brain.consciousness.stop();
  }
  saveBrain(brain);
  output(getState(brain));

} else if (cmd === 'state') {
  const brain = loadBrain();
  output(getState(brain));

} else if (cmd === 'process') {
  const message = process.argv[3] || '';
  if (!message) { output({}); process.exit(0); }
  const brain = loadBrain();
  const result = brain.processForLLM(message);
  if (brain.consciousness) {
    brain.consciousness.tick();
  } else {
    brain.startConsciousness(999999);
    brain.consciousness.tick();
    brain.consciousness.stop();
  }
  saveBrain(brain);
  // 기억 회상 포함
  recallMemories(message, 5).then(memories => {
    output({
      ...getState(brain),
      emotion: result.emotion,
      brainResponse: result.brainGeneration,
      memories: memories.map(m => ({ text: m.text, response: (m.response||'').substring(0,100), type: m.type, emotion: m.emotion, daysAgo: m.daysAgo })),
    });
  }).catch(() => {
    output({
      ...getState(brain),
      emotion: result.emotion,
      brainResponse: result.brainGeneration,
      memories: [],
    });
  });

} else if (cmd === 'feedback') {
  const input = process.argv[3] || '';
  const response = process.argv[4] || '';
  if (!input) { process.exit(0); }
  const brain = loadBrain();
  brain.feedbackLearn(input, response);
  saveBrain(brain);
  // Cortexia 장기 기억에도 저장
  saveMemory(input + (response ? ' → ' + response : ''), 'conversation')
    .then(() => output('OK'))
    .catch(() => output('OK'));

} else {
  output('Usage: genesis-brain.js [init|state|process|feedback]');
}
