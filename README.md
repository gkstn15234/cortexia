# Cortexia

**Give any AI a human-like brain.**

Persistent memory powered by Spiking Neural Networks (SNN). Not a database. A brain.

```bash
npm install -g cortexia
```

## What it does

Your AI forgets everything between sessions. Cortexia fixes that.

- **Forgetting curves** — memories strengthen with repetition, fade with time (Ebbinghaus)
- **Neurotransmitters** — dopamine, serotonin, norepinephrine, acetylcholine
- **Personality formation** — AI develops character traits through interaction
- **Document library** — ingest files, brain searches like a library
- **Token savings tracker** — see exactly how much you save

## This is NOT RAG

RAG searches a vector database every time. Cold. Mechanical. Static.

Cortexia remembers like a human. Important things stick. Trivial things fade. Ask the same question twice — the second time, it answers from memory, not by searching again.

## Quick Start

### With Claude Code (recommended)

```bash
npm install -g cortexia
cd your-project
cortexia init
claude
```

### Interactive Shell

```bash
cortexia
```

### JavaScript API

```javascript
const { Cortexia } = require('cortexia');

const brain = new Cortexia({ userId: 'my-user' });

// Remember
brain.remember({
    input: 'User prefers TypeScript with strict mode',
    type: 'preference',
    importance: 0.8,
});

// Recall
const result = await brain.recall('TypeScript preferences');
console.log(result.memories);
```

## How it works

```
Session 1: "I use TypeScript, React, Zustand..."  → brain.remember()
Session 2: brain.recall() → Already knows!         → 0 wasted tokens
Session 3: brain.recall() → Still remembers!        → 0 wasted tokens
```

Without Cortexia: **25,000 wasted tokens** over 50 sessions.
With Cortexia: Explain once. Brain remembers forever.

## MCP Integration (Claude Code)

`cortexia init` sets up everything automatically:

| Tool | Description |
|------|-------------|
| `cortexia_remember` | Store a memory in the brain |
| `cortexia_recall` | Search memories + document library |
| `cortexia_state` | Brain status, emotions, personality |
| `cortexia_ingest` | Add documents to the library |
| `cortexia_docs` | Library statistics |

## CLI Commands

```bash
cortexia              # Interactive shell
cortexia init         # Setup project for Claude Code
cortexia status       # Brain status & emotions
cortexia ingest FILE  # Add document to library
cortexia docs         # Library status
cortexia pricing      # Plans & pricing
cortexia activate KEY # Activate license
cortexia --help       # Full help
```

## Plans

|                | Free       | Pro         | Business     | Enterprise    |
|----------------|------------|-------------|--------------|---------------|
| **Memories**   | 100        | 1,000       | 5,000        | Unlimited     |
| **Documents**  | 5          | 50          | 300          | Unlimited     |
| **Emotions**   | Yes        | Yes         | Yes          | Yes           |
| **Personality**| -          | Yes         | Yes          | Yes           |
| **Sleep**      | -          | Yes         | Yes          | Yes           |
| **Hybrid**     | -          | -           | Yes          | Yes           |
| **Price**      | Free       | $20/mo      | $39.99/mo    | $119.99/mo    |

## Links

- **User Guide**: https://zccdedig.gensparkspace.com/
- **Patreon**: https://www.patreon.com/cw/deark/membership
- **KakaoTalk**: https://open.kakao.com/o/gJVrRahi
- **Email**: hangil9910@gmail.com

## License

Proprietary. See LICENSE for details.
