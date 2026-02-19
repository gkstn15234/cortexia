# Cortexia User Guide / 사용설명서

## Table of Contents / 목차

1. [What is Cortexia? / Cortexia란?](#1-what-is-cortexia)
2. [Installation / 설치](#2-installation)
3. [Quick Start / 빠른 시작](#3-quick-start)
4. [CLI Commands / CLI 명령어](#4-cli-commands)
5. [Interactive Shell / 인터랙티브 쉘](#5-interactive-shell)
6. [MCP Integration (Claude Code) / MCP 연동](#6-mcp-integration)
7. [JavaScript API / JS API 사용법](#7-javascript-api)
8. [Memory System / 기억 시스템](#8-memory-system)
9. [Document Library / 문서 도서관](#9-document-library)
10. [Emotion & Personality / 감정과 성격](#10-emotion--personality)
11. [Token Savings / 토큰 절약](#11-token-savings)
12. [Plans & Activation / 요금제 및 활성화](#12-plans--activation)
13. [Project Structure / 프로젝트 구조](#13-project-structure)
14. [Troubleshooting / 문제 해결](#14-troubleshooting)
15. [FAQ](#15-faq)

---

## 1. What is Cortexia?

Cortexia is a **human-like memory engine** for AI. It gives any LLM a persistent brain powered by Spiking Neural Networks (SNN).

Cortexia는 AI를 위한 **인간형 기억 엔진**입니다. SNN(스파이킹 신경망)을 기반으로 모든 LLM에 영구적인 두뇌를 부여합니다.

### How it works / 작동 원리

```
[You talk to AI]
       │
       ▼
[Cortexia Brain]
  ├── remember() → SNN에 기억 저장 (뉴런 발화)
  ├── recall()   → 관련 기억 검색 (패턴 매칭)
  └── ingest()   → 문서를 도서관에 저장
       │
       ▼
[AI remembers your context across sessions]
```

### Key features / 핵심 기능

- **Forgetting Curves** — 반복하면 강화, 안 쓰면 자연 소멸 (에빙하우스 곡선)
- **Neurotransmitters** — 도파민, 세로토닌, 노르에피네프린, 아세틸콜린 시뮬레이션
- **Personality Formation** — 대화 패턴으로 AI만의 성격이 형성됨 (Pro+)
- **Document Library** — 파일을 역인덱스로 저장, 키워드 검색
- **Token Savings Tracker** — 절약한 토큰과 비용을 정확히 추적

---

## 2. Installation

### Requirements / 요구사항

- Node.js 18 이상
- npm

### Global Install / 전역 설치 (CLI 사용)

```bash
npm install -g cortexia
```

설치 후 어디서든 `cortexia` 명령어 사용 가능.

### Project Install / 프로젝트 설치 (API 사용)

```bash
cd your-project
npm install cortexia
```

### Verify / 설치 확인

```bash
cortexia --help
```

---

## 3. Quick Start

### Option A: Claude Code와 사용 (권장)

```bash
# 1. 프로젝트 초기화
cd your-project
cortexia init

# 2. Claude Code 실행 — Cortexia가 자동으로 연결됨
claude
```

`cortexia init`이 생성하는 파일:

| 파일 | 역할 |
|------|------|
| `.mcp.json` | Claude Code에 Cortexia MCP 서버 등록 |
| `CLAUDE.md` | Claude에게 "뇌를 사용하라"는 규칙 |
| `.claude/hooks/` | 세션 시작/압축/자동저장 훅 |
| `.claude/settings.json` | 훅 설정 |
| `.cortexia/` | 두뇌 데이터 디렉토리 |
| `.cortexia_docs/` | 문서 도서관 디렉토리 |

### Option B: 인터랙티브 쉘

```bash
cortexia
```

브레인 그래픽과 함께 인터랙티브 쉘이 실행됩니다.
`/` 를 입력하면 명령어 메뉴가 열립니다. 화살표 키로 선택.

### Option C: JavaScript API

```javascript
const { Cortexia } = require('cortexia');

const brain = new Cortexia({
    userId: 'my-user',
    dataDir: '.cortexia',
    docsDir: '.cortexia_docs',
});

// 기억 저장
brain.remember({
    input: 'User prefers TypeScript with strict mode',
    type: 'preference',
    importance: 0.8,
});

// 기억 검색
const result = await brain.recall('TypeScript preferences');
console.log(result.memories);
```

---

## 4. CLI Commands

터미널에서 직접 사용하는 명령어들입니다.

### `cortexia` (인자 없이)

인터랙티브 쉘을 실행합니다. (= `cortexia shell`)

### `cortexia init`

현재 프로젝트에 Cortexia를 설정합니다.
- `.mcp.json`, `CLAUDE.md`, hooks, 데이터 디렉토리 생성
- 이미 존재하는 파일은 스킵 또는 머지

### `cortexia status`

두뇌 상태를 확인합니다.
- 기억 수, 상호작용 횟수
- 신경전달물질 상태 (도파민, 세로토닌 등)
- 감정, 기분
- 도서관 상태 (문서 수, 청크 수, 인덱싱)
- 토큰 절약 현황

### `cortexia ingest <file-or-folder>`

문서를 도서관에 추가합니다.

```bash
# 단일 파일
cortexia ingest ./docs/architecture.md

# 폴더 전체 (하위 .md, .txt 파일 자동 탐색)
cortexia ingest ./docs/
```

지원 형식: `.md`, `.txt`, `.text`, `.markdown`

### `cortexia docs`

도서관 상태를 확인합니다.
- 저장된 문서 목록
- 총 청크 수, 인덱싱된 단어 수

### `cortexia pricing`

요금제 비교표를 표시합니다.

### `cortexia activate <license-key>`

라이선스 키를 활성화합니다.

```bash
cortexia activate PRO-XXXX-XXXX
cortexia activate BIZ-XXXX-XXXX
cortexia activate ENT-XXXX-XXXX
```

키 접두어로 자동 tier 감지:
- `PRO-` → Pro
- `BIZ-` → Business
- `ENT-` → Enterprise

### `cortexia --help`

전체 도움말을 표시합니다.

### Language Options / 언어 옵션

```bash
cortexia --ko    # 한국어 우선
cortexia --en    # 영어 우선
cortexia         # 둘 다 표시 (기본)
```

---

## 5. Interactive Shell

`cortexia` 또는 `cortexia shell`로 실행합니다.

### 명령어 메뉴

`/` 를 입력하면 자동완성 메뉴가 열립니다.

```
  ┌──────────────────────────────────────────────────────────────────────────┐
  │ ▸ 🧠 /status     Brain status & emotions                               │
  │   🔍 /recall     Search memories                                       │
  │   💾 /remember   Store a memory                                        │
  │   📄 /ingest     Add document to library                               │
  │   📚 /docs       Library status                                        │
  │   💰 /pricing    Plans & pricing                                       │
  │   🔑 /activate   Activate license key                                  │
  │   🔧 /init       Setup project                                         │
  │   ❓ /help       Full help guide                                       │
  │   👋 /q          Quit                                                  │
  └──────────────────────────────────────────────────────────────────────────┘
```

- **↑↓ 화살표**: 항목 선택
- **Enter**: 실행
- **타이핑**: 자동 필터링 (예: `/re` → recall, remember만 표시)
- **Esc**: 메뉴 닫기

### 쉘 명령어 상세

#### `/status` (= `/s`)

두뇌 전체 상태를 대시보드 형태로 표시합니다.

#### `/recall <query>` (= `/r <query>`)

기억을 검색합니다.

```
cortexia ❯ /recall recent work
```

결과에는 뇌 기억과 도서관 문서가 함께 표시됩니다.

#### `/remember <text>` (= `/rem <text>`)

기억을 저장합니다.

```
cortexia ❯ /remember user prefers dark mode and vim keybindings
```

#### `/ingest <file>` (= `/i <file>`)

문서를 도서관에 추가합니다.

```
cortexia ❯ /ingest ./README.md
cortexia ❯ /ingest ./docs/
```

#### `/docs` (= `/d`)

도서관에 저장된 문서 목록과 통계를 표시합니다.

#### `/pricing` (= `/p`)

요금제 비교표와 구매 방법을 표시합니다.

#### `/activate <key>`

라이선스 키를 활성화합니다.

```
cortexia ❯ /activate PRO-ABCD-1234
```

#### `/help` (= `/h`)

전체 도움말 가이드를 표시합니다.

#### `/q`

쉘을 종료합니다. (Ctrl+C 도 가능)

---

## 6. MCP Integration

MCP (Model Context Protocol)를 통해 Claude Code와 연동합니다.

### 설정 방법

```bash
cd your-project
cortexia init
```

또는 수동으로 `.mcp.json`을 생성:

```json
{
  "mcpServers": {
    "cortexia": {
      "command": "node",
      "args": ["node_modules/cortexia/mcp/server.js"],
      "env": {
        "CORTEXIA_DATA_DIR": ".cortexia",
        "CORTEXIA_DOCS_DIR": ".cortexia_docs",
        "CORTEXIA_USER_ID": "cortexia_user"
      }
    }
  }
}
```

### MCP Tools (5개)

Claude Code에서 자동으로 사용 가능한 도구들:

#### `cortexia_remember`

기억을 저장합니다.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `input` | string | Yes | 기억할 내용 |
| `response` | string | No | AI 응답 |
| `type` | string | No | `conversation`, `code`, `error`, `preference`, `decision` |
| `emotion` | string | No | `happy`, `sad`, `anxious`, `angry`, `excited`, `calm`, `focused`, `tired`, `neutral` |
| `importance` | number | No | 0~1 (높을수록 강한 기억, 기본 0.5) |

#### `cortexia_recall`

기억을 검색합니다. 뇌 + 도서관을 동시에 탐색합니다.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `query` | string | Yes | 검색어 |
| `maxResults` | number | No | 최대 결과 수 (기본 5) |

#### `cortexia_state`

두뇌 전체 상태를 반환합니다 (감정, 성격, 통계, 도서관).

#### `cortexia_ingest`

문서를 도서관에 추가합니다.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `filePath` | string | Yes | 파일 경로 (.md, .txt) |

#### `cortexia_docs`

도서관 통계를 반환합니다.

### Hooks / 훅

`cortexia init`이 자동으로 3개의 훅을 설정합니다:

| Hook | Trigger | 동작 |
|------|---------|------|
| `session-start.js` | Claude Code 세션 시작 | 기존 기억 수와 최근 기억을 불러와서 Claude에게 전달 |
| `pre-compact.js` | 컨텍스트 압축 직전 | "지금 중요한 내용을 cortexia_remember로 저장하라" 알림 |
| `auto-save.js` | 매 응답 후 | 10회마다 자동 저장 체크포인트 알림 |

### Environment Variables / 환경변수

| Variable | Default | Description |
|----------|---------|-------------|
| `CORTEXIA_DATA_DIR` | `.cortexia` | 두뇌 데이터 저장 경로 |
| `CORTEXIA_DOCS_DIR` | `.cortexia_docs` | 문서 도서관 저장 경로 |
| `CORTEXIA_USER_ID` | `cortexia_user` | 사용자 ID (다중 사용자 지원) |

---

## 7. JavaScript API

### Cortexia 클래스

```javascript
const { Cortexia } = require('cortexia');

const brain = new Cortexia({
    userId: 'user-123',          // 사용자 ID (필수 아님, 기본: 'default')
    dataDir: '.cortexia',        // 두뇌 데이터 디렉토리
    docsDir: '.cortexia_docs',   // 문서 도서관 디렉토리
    licenseKey: 'PRO-XXXX',      // 라이선스 키
    tier: 'pro',                 // 수동 tier 지정 (licenseKey와 함께)
    hybrid: true,                // 하이브리드 모드 (Business+)
    llm: async (prompt) => {     // LLM 함수 (선택)
        // OpenAI, Claude, Gemini 등 아무 LLM
        return await callYourLLM(prompt);
    },
});
```

### Methods / 메서드

#### `brain.remember(data)`

기억을 저장합니다.

```javascript
// 문자열로 간단히
brain.remember('user likes TypeScript');

// 객체로 상세하게
brain.remember({
    input: 'Changed auth from JWT to session-based',
    response: 'Migration completed successfully',
    type: 'decision',        // conversation | code | error | preference | decision
    emotion: 'focused',      // happy | sad | anxious | angry | excited | calm | focused | tired | neutral
    importance: 0.9,         // 0.0 ~ 1.0
});
```

**Returns:**
```javascript
{
    success: true,
    // ... engine internal result
}
// 또는 한도 초과 시:
{
    success: false,
    error: 'Memory limit reached (100). Upgrade to Pro.',
    upgrade: 'https://open.kakao.com/o/gJVrRahi'
}
```

#### `brain.recall(query, options)` → Promise

기억을 검색합니다. 뇌와 도서관을 동시에 탐색합니다.

```javascript
const result = await brain.recall('TypeScript configuration', { maxResults: 5 });

console.log(result.memories);   // 뇌에서 찾은 기억들
console.log(result.documents);  // 도서관에서 찾은 문서 청크들
```

**주의:** `recall()`은 항상 Promise를 반환합니다. `await`를 사용하세요.

#### `brain.ingest(filePath, metadata)`

문서를 도서관에 추가합니다.

```javascript
const result = brain.ingest('./docs/architecture.md');
console.log(result);
// { success: true, chunksAdded: 12, totalChunks: 45, source: 'architecture.md' }
```

#### `brain.stats()`

두뇌 통계를 반환합니다.

```javascript
const s = brain.stats();
// {
//     totalMemories: 42,
//     interactions: 150,
//     tier: 'pro',
//     memoryLimit: 1000,
//     memoryUsage: '42/1000',
//     ...
// }
```

#### `brain.docs()`

도서관 통계를 반환합니다.

```javascript
const d = brain.docs();
// {
//     totalChunks: 45,
//     totalSources: 3,
//     sources: ['architecture.md', 'api.md', 'readme.md'],
//     indexedWords: 1200,
//     tier: 'pro',
//     documentLimit: 50,
//     documentUsage: '3/50',
// }
```

#### `brain.emotion()`

현재 감정 상태를 반환합니다.

```javascript
const e = brain.emotion();
// {
//     currentEmotion: 'focused',
//     mood: 'Calm',
//     neurotransmitters: {
//         dopamine: 0.65,
//         serotonin: 0.55,
//         norepinephrine: 0.70,
//         acetylcholine: 0.60,
//     }
// }
```

#### `brain.personality()` (Pro+)

AI 성격 프로필을 반환합니다.

```javascript
const p = brain.personality();
// Free tier:
// { available: false, message: 'Personality requires Pro or Business.' }

// Pro+:
// { openness: 0.7, conscientiousness: 0.8, ... }
```

#### `brain.sleep()` (Pro+)

수면 통합을 실행합니다. 기억이 정리되고 강화됩니다.

```javascript
const result = brain.sleep();
// Free tier:
// { available: false, message: 'Sleep requires Pro or Business.' }
```

#### `brain.tokenSavings()`

토큰 절약 현황을 반환합니다.

```javascript
const ts = brain.tokenSavings();
// {
//     tokensStored: 15000,        // 저장한 총 토큰 수
//     tokensRecalled: 45000,      // 회상한 총 토큰 수 (= 절약한 토큰)
//     memoriesCount: 42,          // 저장된 기억 수
//     recallCount: 30,            // 회상 횟수
//     docsIngested: 3,            // 추가한 문서 수
//     docTokens: 7650,            // 문서 도서관 토큰 수
//     totalKnowledge: 22650,      // 총 지식 베이스 (뇌 + 도서관)
//     estimatedSavingsUSD: '0.2250' // 예상 절약 비용 (USD)
// }
```

#### `brain.activate(licenseKey, tier)`

라이선스를 활성화합니다.

```javascript
const result = brain.activate('PRO-XXXX-XXXX', 'pro');
// { success: true, tier: 'pro' }
```

#### `brain.tier` (getter)

현재 tier를 반환합니다: `'free'`, `'pro'`, `'business'`, `'enterprise'`

#### `brain.limits` (getter)

현재 tier의 제한을 반환합니다.

```javascript
brain.limits;
// { maxMemories: 1000, maxDocuments: 50, emotionSystem: true, personality: true, ... }
```

#### `brain.engine` (getter)

내부 SynapseMemory 엔진에 직접 접근합니다. (고급 사용자용)

---

## 8. Memory System

### SNN (Spiking Neural Network) 기반

Cortexia의 기억은 데이터베이스가 아니라 뉴런 네트워크에 저장됩니다.

```
[기억 저장]
  └── 뉴런 그룹이 발화 (spike)
      └── SDR (Sparse Distributed Representation)로 인코딩
          └── 시냅스 강도로 기억 유지

[기억 검색]
  └── 쿼리를 SDR로 변환
      └── 패턴 매칭으로 유사 기억 검색
          └── 시냅스 강화 (검색할수록 강해짐)
```

### Forgetting Curve / 망각 곡선

에빙하우스 망각곡선을 따릅니다:

- **새 기억**: 빠르게 약해짐
- **반복 회상**: 강도가 복원 + 강화됨
- **오래된 미사용 기억**: 자연스럽게 소멸
- **중요도 높은 기억**: 더 오래 유지됨

```
강도
  │ ████
  │ ███████
  │ ████████████
  │ ██████████████████  ← 반복 회상으로 강화
  │ █████████████████████████████████████
  └────────────────────────────────────── 시간
```

### Memory Types / 기억 유형

| Type | 용도 | 예시 |
|------|------|------|
| `conversation` | 일반 대화 | "사용자가 React 프로젝트를 만들고 있음" |
| `code` | 코드 변경 | "auth.js에서 JWT를 세션으로 교체" |
| `error` | 오류와 해결 | "CORS 에러 → proxy 설정으로 해결" |
| `preference` | 사용자 선호 | "TypeScript strict mode 선호" |
| `decision` | 아키텍처 결정 | "상태관리는 Zustand를 사용하기로 결정" |

### Importance / 중요도

| 값 | 의미 | 사용 시점 |
|------|------|----------|
| 1.0 | Critical | 프로젝트 핵심 결정, 치명적 버그 수정 |
| 0.8 | High | 주요 기능 변경, 중요 선호도 |
| 0.5 | Normal | 일반 대화, 작업 로그 (기본값) |
| 0.3 | Low | 사소한 메모 |

---

## 9. Document Library

### 역인덱스 검색

기존 RAG처럼 전체 벡터를 비교하지 않습니다.
인간이 교보문고에서 키워드를 치는 것처럼, 역인덱스로 관련 문서만 빠르게 찾습니다.

```
[문서 추가]
  └── 파일 읽기
      └── 문단/500자 단위로 청크 분할
          └── 각 청크의 키워드를 역인덱스에 등록
              └── 디스크에 저장

[검색]
  └── 쿼리를 키워드로 분해
      └── 역인덱스에서 해당 키워드를 포함하는 청크 조회
          └── 점수 순 정렬 후 상위 N개 반환
```

### 지원 파일 형식

- `.md` (Markdown)
- `.txt` (Plain text)
- `.text`
- `.markdown`

### 청크 분할 규칙

1. **1차**: 빈 줄(문단) 기준 분할
2. **2차**: 문단이 500자 초과 시 문장 경계에서 재분할
3. 청크 간 50자 겹침(overlap)으로 문맥 유지
4. 10자 미만 청크는 스킵

### 검색 특징

- **정확 매칭**: 키워드가 완전히 일치하는 청크
- **부분 매칭**: 키워드가 다른 단어의 일부인 경우 (0.5점 가중)
- **한국어 + 영어** 동시 지원
- **불용어 자동 제거** (the, is, 그리고, 하지만 등)

### 뇌와 도서관의 관계

```
brain.recall("양자역학이 뭐야?")
  │
  ├── 1단계: 뇌(episodic memory)에서 검색
  │    └── 이전에 기억한 적 있으면 바로 반환
  │
  └── 2단계: 도서관(document store)에서 검색
       └── 역인덱스로 관련 청크 반환
       └── 결과를 memories + documents로 함께 반환
```

---

## 10. Emotion & Personality

### Neurotransmitters / 신경전달물질

4가지 신경전달물질이 실시간으로 변화합니다:

| 물질 | 역할 | 높을 때 | 낮을 때 |
|------|------|---------|---------|
| **Dopamine** (도파민) | 보상, 동기 | 새로운 것에 관심 ↑ | 무기력 |
| **Serotonin** (세로토닌) | 안정, 행복 | 안정적 응답 | 불안정 |
| **Norepinephrine** (노르에피네프린) | 각성, 집중 | 빠르고 날카로운 응답 | 느긋 |
| **Acetylcholine** (아세틸콜린) | 학습, 기억 | 기억 강화 ↑ | 기억 약화 |

### Emotions / 감정

대화의 감정 태그에 따라 뇌의 감정 상태가 변합니다:

`happy` · `sad` · `anxious` · `angry` · `excited` · `calm` · `focused` · `tired` · `neutral`

### Personality / 성격 (Pro+)

대화 패턴이 축적되면 AI만의 성격이 형성됩니다. Big Five 모델 기반:

- **Openness** (개방성) — 새로운 아이디어에 대한 수용도
- **Conscientiousness** (성실성) — 체계적이고 꼼꼼한 정도
- **Extraversion** (외향성) — 활발하고 에너지 넘치는 정도
- **Agreeableness** (친화성) — 협조적이고 친절한 정도
- **Neuroticism** (신경성) — 스트레스에 대한 민감도

### Sleep Consolidation / 수면 통합 (Pro+)

`brain.sleep()`을 호출하면:
- 약한 기억이 정리됨
- 반복된 기억이 강화됨
- 신경전달물질이 기본값으로 회복

권장: 하루 작업 종료 후 또는 주기적으로 실행.

---

## 11. Token Savings

### 원리

```
[Without Cortexia]
  Session 1: "I use TypeScript, React, Zustand..."     → 500 tokens
  Session 2: "I use TypeScript, React, Zustand..."     → 500 tokens (반복!)
  Session 3: "I use TypeScript, React, Zustand..."     → 500 tokens (또 반복!)
  = 1,500 tokens spent

[With Cortexia]
  Session 1: "I use TypeScript, React, Zustand..."     → 500 tokens → remember()
  Session 2: recall() → 이미 알고 있음                   → ~10 tokens
  Session 3: recall() → 이미 알고 있음                   → ~10 tokens
  = 520 tokens spent → 980 tokens saved!
```

### 추적 항목

| 항목 | 설명 |
|------|------|
| `tokensStored` | remember()로 저장한 총 토큰 수 |
| `tokensRecalled` | recall()로 회상한 총 토큰 수 (= 절약한 토큰) |
| `memoriesCount` | 저장된 기억 수 |
| `recallCount` | 회상 횟수 |
| `docsIngested` | 추가한 문서 수 |
| `docTokens` | 문서 도서관의 총 토큰 수 |
| `totalKnowledge` | 총 지식 베이스 (뇌 + 도서관) |
| `estimatedSavingsUSD` | 예상 절약 비용 (USD, ~$5/M tokens 기준) |

### 확인 방법

```bash
cortexia status    # Token Savings 섹션에 표시
```

```javascript
const savings = brain.tokenSavings();
console.log(`Saved ${savings.tokensRecalled} tokens ($${savings.estimatedSavingsUSD})`);
```

---

## 12. Plans & Activation

### 요금제 비교

|                | Free | ✦ Pro | ✦✦ Business | ✦✦✦ Enterprise |
|----------------|------|-------|-------------|----------------|
| **가격**       | ₩0 / $0 | ₩29,900 / $20 | ₩49,900 / $39.99 | ₩149,900 / $119.99 |
| **기억**       | 100 | 1,000 | 5,000 | Unlimited |
| **문서**       | 5 | 50 | 300 | Unlimited |
| **감정**       | ✓ | ✓ | ✓ | ✓ |
| **성격**       | — | ✓ | ✓ | ✓ |
| **수면 통합**   | — | ✓ | ✓ | ✓ |
| **하이브리드**  | — | — | ✓ | ✓ |
| **우선 지원**   | — | — | — | ✓ |
| **전담 온보딩** | — | — | — | ✓ |

### 구매 방법

**한국:**
- 💬 카카오톡 오픈채팅: https://open.kakao.com/o/gJVrRahi

**해외:**
- Patreon 멤버십 결제

**공통:**
- 📧 Email: hangil9910@gmail.com

### 활성화

구매 후 이메일로 라이선스 키를 받습니다.

```bash
cortexia activate PRO-XXXX-XXXX
```

또는 코드에서:

```javascript
brain.activate('PRO-XXXX-XXXX', 'pro');
```

라이선스 정보는 `.cortexia/.cortexia_license`에 저장됩니다.

---

## 13. Project Structure

```
your-project/
├── .mcp.json                  ← Claude Code MCP 설정
├── CLAUDE.md                  ← Claude에게 뇌 사용 규칙
├── .claude/
│   ├── settings.json          ← 훅 설정
│   └── hooks/
│       ├── session-start.js   ← 세션 시작 시 기억 로드
│       ├── pre-compact.js     ← 컨텍스트 압축 전 저장 알림
│       └── auto-save.js       ← 10회마다 자동 저장 체크포인트
├── .cortexia/                 ← 두뇌 데이터
│   ├── cortexia_user.json     ← 기억 데이터
│   ├── .cortexia_license      ← 라이선스 정보
│   └── .cortexia_tokens       ← 토큰 절약 통계
├── .cortexia_docs/            ← 문서 도서관
│   └── cortexia_user_docs.json ← 문서 청크 + 역인덱스
└── node_modules/
    └── cortexia/              ← 패키지
        ├── index.js           ← Cortexia 클래스 (진입점)
        ├── bin/cortexia.js    ← CLI
        ├── core/              ← SNN 엔진
        │   ├── engine.js      ← SynapseMemory 메인 엔진
        │   ├── document_store.js ← 문서 도서관
        │   ├── genesis_brain.js  ← SNN 뇌
        │   ├── neuron_engine.js  ← 뉴런 시뮬레이션
        │   ├── episodic_memory.js ← 일화 기억
        │   ├── brain_dna.js      ← 뇌 DNA/유전자
        │   ├── temperament.js    ← 성격 시스템
        │   ├── self_observer.js  ← 자기 관찰
        │   └── train.js          ← 학습 모듈
        ├── mcp/server.js      ← MCP 서버
        └── setup/
            ├── init.js        ← cortexia init 로직
            └── postinstall.js ← npm 설치 후 스크립트
```

---

## 14. Troubleshooting

### "Memory limit reached"

Free tier 한도 (100개)에 도달했습니다. Pro로 업그레이드하거나, 불필요한 기억이 자연 소멸될 때까지 기다리세요.

### MCP 서버가 연결 안 됨

1. `.mcp.json`이 프로젝트 루트에 있는지 확인
2. `node_modules/cortexia`가 설치되어 있는지 확인
3. `cortexia init`을 다시 실행

```bash
cortexia init
```

### "Module not found" 에러

```bash
npm install cortexia
```

### recall()이 빈 결과를 반환

- 기억을 먼저 저장했는지 확인: `brain.stats()`
- 검색어가 저장된 기억의 키워드와 관련 있는지 확인
- 기억이 시간 경과로 소멸했을 수 있음 → 다시 저장

### 문서 ingest가 실패

- 지원 형식 확인: `.md`, `.txt`, `.text`, `.markdown`
- 파일 경로가 정확한지 확인
- 문서 한도를 초과하지 않았는지 확인: `brain.docs()`

### Windows에서 hooks가 작동 안 됨

`.claude/settings.json`에서 명령어 확인:

```json
{
  "hooks": {
    "SessionStart": [{
      "hooks": [{
        "type": "command",
        "command": "node .claude/hooks/session-start.js",
        "timeout": 10
      }]
    }]
  }
}
```

### 데이터 초기화 (주의)

모든 기억과 문서를 삭제하려면:

```bash
rm -rf .cortexia/ .cortexia_docs/
```

---

## 15. FAQ

**Q: 어떤 LLM과 호환되나요?**
A: 모든 LLM과 호환됩니다. Claude Code는 MCP로, 다른 LLM은 JavaScript API로 연동합니다.

**Q: 데이터는 어디에 저장되나요?**
A: 로컬 디스크 (`.cortexia/`, `.cortexia_docs/`)에만 저장됩니다. 클라우드로 전송되지 않습니다.

**Q: 여러 프로젝트에서 사용할 수 있나요?**
A: 네. 각 프로젝트에서 `cortexia init`을 실행하면 프로젝트별로 독립적인 뇌가 생성됩니다.

**Q: 여러 사용자가 같은 프로젝트에서 사용할 수 있나요?**
A: 네. `userId`를 다르게 설정하면 사용자별로 별도의 뇌가 생성됩니다.

**Q: Free에서 Pro로 업그레이드하면 기존 기억은?**
A: 그대로 유지됩니다. 한도만 늘어납니다.

**Q: 라이선스 키를 분실했어요.**
A: hangil9910@gmail.com으로 연락하시면 재발급해드립니다.

**Q: 기존 RAG와 뭐가 다른가요?**
A: RAG는 매번 벡터 DB를 검색합니다. Cortexia는 한 번 기억하면 뇌에서 바로 꺼냅니다. 같은 질문을 다시 하면 도서관을 다시 뒤지지 않고 기억에서 바로 답합니다.

**Q: 오프라인에서 작동하나요?**
A: 네. 모든 데이터가 로컬에 저장되므로 인터넷 없이도 작동합니다.

---

## Contact / 문의

- 📧 Email: hangil9910@gmail.com
- 💬 KakaoTalk: https://open.kakao.com/o/gJVrRahi
