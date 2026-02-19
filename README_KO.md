# Cortexia

[English README](./README.md)

**AI에게 인간형 두뇌를 달아주세요.**

SNN(스파이킹 신경망) 기반의 영구 기억 엔진. 데이터베이스가 아닙니다. 두뇌입니다.

```bash
npm install -g cortexia
```

## 무엇을 하나요?

AI는 세션이 끝나면 모든 걸 잊습니다. Cortexia가 해결합니다.

- **망각 곡선** — 반복하면 강화, 안 쓰면 자연 소멸 (에빙하우스)
- **신경전달물질** — 도파민, 세로토닌, 노르에피네프린, 아세틸콜린
- **성격 형성** — 대화 패턴으로 AI만의 성격이 만들어짐
- **문서 도서관** — 파일을 넣으면 두뇌가 검색해서 찾아줌
- **토큰 절약 추적** — 얼마나 절약했는지 정확히 표시

## 기존 RAG와 다릅니다

RAG는 매번 벡터 데이터베이스를 검색합니다. 차갑고, 기계적이고, 정적입니다.

Cortexia는 인간처럼 기억합니다. 중요한 건 남고, 사소한 건 사라집니다. 같은 질문을 두 번 하면 — 두 번째는 검색 없이 기억에서 바로 답합니다.

## 빠른 시작

### Claude Code와 사용 (권장)

```bash
npm install -g cortexia
cd your-project
cortexia init
claude
```

### 인터랙티브 쉘

```bash
cortexia
```

### JavaScript API

```javascript
const { Cortexia } = require('cortexia');

const brain = new Cortexia({ userId: 'my-user' });

// 기억 저장
brain.remember({
    input: '사용자는 TypeScript strict mode를 선호함',
    type: 'preference',
    importance: 0.8,
});

// 기억 검색
const result = await brain.recall('TypeScript 선호도');
console.log(result.memories);
```

## 작동 원리

```
세션 1: "저는 TypeScript, React, Zustand 씁니다"  → brain.remember()
세션 2: brain.recall() → 이미 알고 있음!            → 토큰 낭비 0
세션 3: brain.recall() → 여전히 기억!               → 토큰 낭비 0
```

Cortexia 없이: 50세션 동안 **25,000 토큰 낭비**
Cortexia 사용: 한 번 설명하면 영원히 기억합니다.

## MCP 연동 (Claude Code)

`cortexia init` 한 번이면 자동 설정됩니다:

| 도구 | 설명 |
|------|------|
| `cortexia_remember` | 기억을 두뇌에 저장 |
| `cortexia_recall` | 기억 + 문서 도서관 검색 |
| `cortexia_state` | 두뇌 상태, 감정, 성격 |
| `cortexia_ingest` | 문서를 도서관에 추가 |
| `cortexia_docs` | 도서관 통계 |

## CLI 명령어

```bash
cortexia              # 인터랙티브 쉘
cortexia init         # Claude Code용 프로젝트 설정
cortexia status       # 두뇌 상태 및 감정
cortexia ingest FILE  # 문서를 도서관에 추가
cortexia docs         # 도서관 상태
cortexia pricing      # 요금제 보기
cortexia activate KEY # 라이선스 활성화
cortexia --help       # 전체 도움말
```

## 요금제

|                | Free       | Pro         | Business     | Enterprise    |
|----------------|------------|-------------|--------------|---------------|
| **기억**       | 100개      | 1,000개     | 5,000개      | 무제한        |
| **문서**       | 5개        | 50개        | 300개        | 무제한        |
| **감정**       | O          | O           | O            | O             |
| **성격**       | -          | O           | O            | O             |
| **수면 통합**  | -          | O           | O            | O             |
| **하이브리드** | -          | -           | O            | O             |
| **가격**       | 무료       | ₩29,900/월  | ₩49,900/월   | ₩149,900/월   |

## 링크

- **사용설명서**: https://zccdedig.gensparkspace.com/
- **Patreon (해외)**: https://www.patreon.com/cw/deark/membership
- **카카오톡 오픈채팅**: https://open.kakao.com/o/gJVrRahi
- **이메일**: hangil9910@gmail.com

## 라이선스

Proprietary. 자세한 내용은 LICENSE 파일을 참조하세요.
