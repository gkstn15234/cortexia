#!/usr/bin/env node
/**
 * Brain Auto — 매 턴 자동 Genesis 뇌 자극
 * ==========================================
 * PreToolUse 훅으로 등록.
 * 한 턴(60초 내)에 한 번만 뇌를 돌리고,
 * 뇌 상태를 stderr로 출력해서 자비스가 인식하게 함.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const PROJECT = path.resolve(__dirname, '..', '..');
const CACHE_FILE = path.join(__dirname, '.brain_cache.json');
const BRAIN_SCRIPT = path.join(__dirname, 'genesis-brain.js');
const DEBOUNCE_MS = 60000; // 60초 = 같은 턴

// stdin에서 도구 정보 읽기
let stdinData = '';
try {
  stdinData = fs.readFileSync(0, 'utf8');
} catch {}

let toolInfo = {};
try {
  toolInfo = JSON.parse(stdinData);
} catch {}

// 디바운스: 최근 60초 내 이미 실행했으면 스킵
let cached = null;
try {
  cached = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8'));
} catch {}

const now = Date.now();
if (cached && (now - cached.timestamp) < DEBOUNCE_MS) {
  // 이미 이번 턴에서 뇌 돌림 → 스킵
  process.exit(0);
}

// 도구 입력에서 컨텍스트 추출 (가능하면)
let context = '';
if (toolInfo.tool_input) {
  if (toolInfo.tool_input.command) context = toolInfo.tool_input.command;
  else if (toolInfo.tool_input.query) context = toolInfo.tool_input.query;
  else if (toolInfo.tool_input.pattern) context = toolInfo.tool_input.pattern;
  else context = JSON.stringify(toolInfo.tool_input).substring(0, 100);
}

// Genesis 뇌 실행
try {
  let result;
  if (context) {
    result = execSync(
      `node "${BRAIN_SCRIPT}" process "${context.replace(/"/g, '\\"').substring(0, 200)}"`,
      { encoding: 'utf8', timeout: 8000, cwd: PROJECT }
    );
  } else {
    result = execSync(
      `node "${BRAIN_SCRIPT}" state`,
      { encoding: 'utf8', timeout: 8000, cwd: PROJECT }
    );
  }

  const state = JSON.parse(result);

  // 캐시 저장
  fs.writeFileSync(CACHE_FILE, JSON.stringify({
    timestamp: now,
    state: state,
  }), 'utf8');

  // stderr로 뇌 상태 출력 → 자비스가 읽음
  const nm = state.neuromodulators || {};
  const parts = [
    `[Genesis Brain]`,
    state.mood || '',
    state.innerThought ? `내면: "${state.innerThought}"` : '',
    nm.dopamine !== undefined ? `DA:${nm.dopamine.toFixed(2)}` : '',
    nm.serotonin !== undefined ? `5HT:${nm.serotonin.toFixed(2)}` : '',
    nm.norepinephrine !== undefined ? `NE:${nm.norepinephrine.toFixed(2)}` : '',
    state.growthStage ? `성장:${state.growthStage.stage}` : '',
    state.personality ? state.personality.join(',') : '',
  ].filter(Boolean);

  console.error(parts.join(' | '));

} catch (e) {
  // 뇌 실행 실패해도 도구 사용은 차단하지 않음
  console.error('[Genesis Brain] ...머리가 잠깐 멈췄어.');
}

process.exit(0);
