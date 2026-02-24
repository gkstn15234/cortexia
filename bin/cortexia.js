#!/usr/bin/env node
/**
 * C O R T E X I A
 * Premium CLI for AI Brain Management
 */

const path = require('path');
const fs = require('fs');

// ═══════════════════════════════════════════════════════════════
//  Locale Detection
// ═══════════════════════════════════════════════════════════════

const locale = (process.env.LANG || process.env.LANGUAGE || process.env.LC_ALL || '').toLowerCase();
const isKo = locale.includes('ko') || process.argv.includes('--ko');
const isEn = process.argv.includes('--en');
const lang = isEn ? 'en' : (isKo ? 'ko' : 'both');

// Bilingual text helper
function t(en, ko) {
    if (lang === 'en') return en;
    if (lang === 'ko') return ko;
    return `${en} ${'\x1b[38;2;107;114;128m'}(${ko})\x1b[0m`;
}

// ═══════════════════════════════════════════════════════════════
//  Color & Style System
// ═══════════════════════════════════════════════════════════════

const c = {
    brand:    (t) => `\x1b[38;2;99;102;241m${t}\x1b[0m`,
    accent:   (t) => `\x1b[38;2;139;92;246m${t}\x1b[0m`,
    glow:     (t) => `\x1b[38;2;168;85;247m${t}\x1b[0m`,
    success:  (t) => `\x1b[38;2;52;211;153m${t}\x1b[0m`,
    warn:     (t) => `\x1b[38;2;251;191;36m${t}\x1b[0m`,
    error:    (t) => `\x1b[38;2;248;113;113m${t}\x1b[0m`,
    dim:      (t) => `\x1b[38;2;107;114;128m${t}\x1b[0m`,
    text:     (t) => `\x1b[38;2;229;231;235m${t}\x1b[0m`,
    bold:     (t) => `\x1b[1m${t}\x1b[0m`,
    gradient: (text) => {
        let result = '';
        for (let i = 0; i < text.length; i++) {
            const ratio = i / Math.max(text.length - 1, 1);
            const r = Math.round(99 + (139 - 99) * ratio);
            const g = Math.round(102 + (92 - 102) * ratio);
            const b = Math.round(241 + (246 - 241) * ratio);
            result += `\x1b[38;2;${r};${g};${b}m${text[i]}`;
        }
        return result + '\x1b[0m';
    },
};

// ═══════════════════════════════════════════════════════════════
//  UI Components
// ═══════════════════════════════════════════════════════════════

const UI = {
    LOGO: [
        '',
        `  ${c.dim('                    ╭───────────╮')}`,
        `  ${c.dim('               ╭──╮│')} ${c.accent('◉ ─── ◉')} ${c.dim('│╭──╮')}`,
        `  ${c.dim('            ╭──╯')}  ${c.dim('╰┤')} ${c.glow('◉')}${c.dim('──')}${c.glow('◉')}${c.dim('──')}${c.glow('◉')} ${c.dim('├╯')}  ${c.dim('╰──╮')}`,
        `  ${c.dim('          ╭─╯')}  ${c.accent('◉')}${c.dim('──')}${c.accent('◉')} ${c.dim('│')} ${c.brand('◉')}${c.dim('╌╌')}${c.brand('◉')}${c.dim('╌╌')}${c.brand('◉')} ${c.dim('│')} ${c.accent('◉')}${c.dim('──')}${c.accent('◉')}  ${c.dim('╰─╮')}`,
        `  ${c.dim('         │')}  ${c.glow('◉')}${c.dim('─┤')} ${c.accent('◉')}${c.dim('├─')}${c.glow('◉')}${c.dim('─╯')}${c.brand('◉')}${c.dim('───')}${c.brand('◉')}${c.dim('───')}${c.brand('◉')}${c.dim('╰─')}${c.glow('◉')}${c.dim('─┤')} ${c.accent('◉')}${c.dim('├─')}${c.glow('◉')}  ${c.dim('│')}`,
        `  ${c.dim('        │')} ${c.accent('◉')}${c.dim('──')}${c.accent('◉')}${c.dim('──')}${c.accent('◉')}${c.dim('──')}${c.glow('◉')}${c.dim('──╮')} ${c.brand('▓▓▓▓▓')} ${c.dim('╭──')}${c.glow('◉')}${c.dim('──')}${c.accent('◉')}${c.dim('──')}${c.accent('◉')}${c.dim('──')}${c.accent('◉')} ${c.dim('│')}`,
        `  ${c.dim('        │')} ${c.glow('◉')}${c.dim('─╮')} ${c.success('◉')}${c.dim('──')}${c.success('◉')}${c.dim('──')}${c.success('◉')}${c.dim('──╯')} ${c.brand('▓▓▓▓▓')} ${c.dim('╰──')}${c.success('◉')}${c.dim('──')}${c.success('◉')}${c.dim('──')}${c.success('◉')} ${c.dim('╭─')}${c.glow('◉')} ${c.dim('│')}`,
        `  ${c.dim('         │')} ${c.dim('╰─')}${c.glow('◉')}${c.dim('──')}${c.success('◉')}${c.dim('──')}${c.success('◉')}${c.dim('─╮ ')}${c.brand('▓▓▓▓▓▓▓')}${c.dim(' ╭─')}${c.success('◉')}${c.dim('──')}${c.success('◉')}${c.dim('──')}${c.glow('◉')}${c.dim('─╯')}  ${c.dim('│')}`,
        `  ${c.dim('          ╰─╮')} ${c.glow('◉')}${c.dim('──')}${c.glow('◉')}${c.dim('──')}${c.glow('◉')}${c.dim('─╯ ')}${c.brand('▓▓▓▓▓')}${c.dim(' ╰─')}${c.glow('◉')}${c.dim('──')}${c.glow('◉')}${c.dim('──')}${c.glow('◉')} ${c.dim('╭─╯')}`,
        `  ${c.dim('            ╰──╮')}  ${c.dim('╰─')}${c.accent('◉')}${c.dim('──')}${c.accent('◉')}${c.dim('──')}${c.accent('◉')}${c.dim('──')}${c.accent('◉')}${c.dim('──')}${c.accent('◉')}${c.dim('─╯')}  ${c.dim('╭──╯')}`,
        `  ${c.dim('               ╰──╮')} ${c.dim('╰──')}${c.glow('◉')}${c.dim('──')}${c.glow('◉')}${c.dim('──')}${c.glow('◉')}${c.dim('──╯')} ${c.dim('╭──╯')}`,
        `  ${c.dim('                   ╰─────┬─────╯')}`,
        `  ${c.dim('                          │')}`,
        `  ${c.dim('                       ╭──┴──╮')}`,
        `  ${c.dim('                       │')} ${c.brand('▓▓▓')} ${c.dim('│')}`,
        `  ${c.dim('                       ╰─────╯')}`,
        '',
        `       ${c.bold(c.gradient('C  O  R  T  E  X  I  A'))}`,
        `       ${c.dim('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')}`,
        `       ${c.text('Human-Like Brain for AI')}`,
        `       ${c.text('AI를 위한 인간형 두뇌 — SNN 기반 장기기억')}`,
        '',
    ].join('\n'),

    separator: () => c.dim('  ' + '─'.repeat(76)),

    stat: (label, value, color = 'text') => {
        const padded = label.padEnd(18);
        return `  ${c.dim(padded)} ${c[color](value)}`;
    },

    bar: (value, max = 1, width = 20) => {
        const filled = Math.round((value / max) * width);
        const empty = width - filled;
        const bar = '█'.repeat(filled) + '░'.repeat(empty);
        return c.brand(bar);
    },

    neurotransmitter: (name, symbol, value) => {
        const pct = Math.round(value * 100);
        const bar = UI.bar(value, 1, 15);
        const label = `${symbol} ${name}`.padEnd(20);
        return `  ${c.dim(label)} ${bar} ${c.text(pct + '%')}`;
    },
};

// Visual width calculator — Korean/CJK = 2 cells, rest = 1
function visWidth(str) {
    const clean = str.replace(/\x1b\[[0-9;]*m/g, '');
    let w = 0;
    for (const ch of clean) {
        const cp = ch.codePointAt(0);
        if (cp === 0xFE0F) continue;
        w += ((cp >= 0xAC00 && cp <= 0xD7AF) || (cp >= 0x4E00 && cp <= 0x9FFF)) ? 2 : 1;
    }
    return w;
}

// Box line helper — pads content to W visible chars between │...│
function boxLine(content, W) {
    const vw = visWidth(content);
    return c.dim('  │') + content + ' '.repeat(Math.max(0, W - vw)) + c.dim('│');
}

// ═══════════════════════════════════════════════════════════════
//  Emotion Map (EN ↔ KO)
// ═══════════════════════════════════════════════════════════════

const EMOTION_LABEL = {
    happy: '행복', sad: '슬픔', anxious: '불안', angry: '분노',
    excited: '흥분', calm: '평온', focused: '집중', tired: '피곤', neutral: '평온',
};

const MOOD_LABEL = {
    '평온해요': 'Calm', '행복해요': 'Happy', '슬퍼요': 'Sad',
    '불안해요': 'Anxious', '화나요': 'Angry', '흥분돼요': 'Excited',
    '집중해요': 'Focused', '피곤해요': 'Tired', 'stable': 'Stable',
};

const TRAIT_LABEL = {
    openness: '개방성', conscientiousness: '성실성',
    extraversion: '외향성', agreeableness: '친화성', neuroticism: '신경성',
    curiosity: '호기심', empathy: '공감',
};

// ═══════════════════════════════════════════════════════════════
//  Brain Access
// ═══════════════════════════════════════════════════════════════

function getCortexia() {
    const { Cortexia } = require(path.join(__dirname, '..', 'index.js'));
    return new Cortexia({
        userId: 'cortexia_user',
        dataDir: path.join(process.cwd(), '.cortexia'),
        docsDir: path.join(process.cwd(), '.cortexia_docs'),
    });
}

// Backward compat
function getBrain() {
    return getCortexia().engine;
}

// ═══════════════════════════════════════════════════════════════
//  Commands
// ═══════════════════════════════════════════════════════════════

function showStatus() {
    const ctx = getCortexia();
    const brain = ctx.engine;
    const stats = brain.getStats();
    const emotion = brain.getEmotionState();
    const personality = brain.getPersonality();
    const docs = brain.getDocumentStats();
    const tier = ctx.tier;
    const limits = ctx.limits;

    console.log(UI.LOGO);
    console.log();

    // Tier Badge
    if (tier === 'enterprise') {
        console.log(c.brand(`  ✦✦✦ Enterprise ${c.dim(t('— Unlimited + Priority', '— 무제한 + 우선지원'))}`));
    } else if (tier === 'business') {
        console.log(c.warn(`  ✦✦ Business ${c.dim(t('— 5,000 memories, 300 docs', '— 5,000 기억, 300 문서'))}`));
    } else if (tier === 'pro') {
        console.log(c.success(`  ✦ Pro ${c.dim(t('— 1,000 memories, 50 docs', '— 1,000 기억, 50 문서'))}`));
    } else {
        console.log(c.dim(`  ○ Free ${c.dim(t('— 100 memories, 5 docs', '— 100 기억, 5 문서'))}`));
    }
    console.log();

    // Brain Status
    console.log(c.brand(`  ◉ ${t('Brain Status', '뇌 상태')}`));
    console.log(UI.separator());
    const memLimit = limits.maxMemories === Infinity ? '∞' : limits.maxMemories;
    const memColor = (tier === 'free' && stats.totalMemories >= limits.maxMemories * 0.8) ? 'warn' : 'text';
    console.log(UI.stat(t('Memories', '기억'), `${stats.totalMemories} / ${memLimit}`, memColor));
    console.log(UI.stat(t('Interactions', '상호작용'), `${stats.totalInteractions}`, 'text'));

    const health = stats.brainHealth;
    const healthPct = isNaN(health) ? '—' : `${(health * 100).toFixed(0)}%`;
    console.log(UI.stat(t('Stability', '안정성'), healthPct, health > 0.7 ? 'success' : 'warn'));

    const intimacy = stats.intimacy;
    const intimacyPct = isNaN(intimacy) ? '—' : `${(intimacy * 100).toFixed(0)}%`;
    console.log(UI.stat(t('Intimacy', '친밀도'), intimacyPct, 'accent'));
    console.log();

    // Neurotransmitters
    console.log(c.accent(`  ◉ ${t('Neurotransmitters', '신경전달물질')}`));
    console.log(UI.separator());
    const nt = emotion.neurotransmitters || {};
    console.log(UI.neurotransmitter(t('Dopamine', '도파민'), '⚡', nt.dopamine || 0.5));
    console.log(UI.neurotransmitter(t('Serotonin', '세로토닌'), '☀️', nt.serotonin || 0.5));
    console.log(UI.neurotransmitter(t('Norepinephrine', '노르에피네프린'), '🔥', nt.norepinephrine || 0.5));
    console.log(UI.neurotransmitter(t('Acetylcholine', '아세틸콜린'), '💎', nt.acetylcholine || 0.5));
    console.log();

    // Emotion & Personality
    console.log(c.glow(`  ◉ ${t('Mind', '마음')}`));
    console.log(UI.separator());
    const emo = emotion.currentEmotion || 'neutral';
    console.log(UI.stat(t('Emotion', '감정'), `${emo} (${EMOTION_LABEL[emo] || emo})`, 'text'));
    const mood = emotion.mood || 'stable';
    console.log(UI.stat(t('Mood', '기분'), `${MOOD_LABEL[mood] || mood} (${mood})`, 'text'));

    if (personality && personality.traits) {
        const traits = Object.entries(personality.traits)
            .filter(([_, v]) => v > 0.1)
            .sort(([_, a], [__, b]) => b - a)
            .slice(0, 3)
            .map(([k, v]) => `${TRAIT_LABEL[k] || k} ${(v * 100).toFixed(0)}%`)
            .join(', ');
        if (traits) console.log(UI.stat(t('Personality', '성격'), traits, 'accent'));
    }
    console.log();

    // Library
    const docLimit = limits.maxDocuments === Infinity ? '∞' : limits.maxDocuments;
    const sourceCount = docs.sources ? docs.sources.length : 0;

    console.log(c.success(`  ◉ ${t('Library', '도서관')}`));
    console.log(UI.separator());
    const docColor = (tier === 'free' && sourceCount >= limits.maxDocuments) ? 'warn' : 'text';
    console.log(UI.stat(t('Documents', '문서'), `${sourceCount} / ${docLimit}`, docColor));
    console.log(UI.stat(t('Chunks', '청크'), `${docs.totalChunks}`, 'text'));
    console.log(UI.stat(t('Indexed', '인덱싱'), `${docs.indexedWords} ${t('words', '단어')}`, 'text'));
    if (sourceCount > 0) {
        for (const source of docs.sources) {
            console.log(`  ${c.dim('  📄')} ${c.text(source)}`);
        }
    }
    console.log();

    // ── Token Savings ──
    const savings = ctx.tokenSavings();
    const fmt = (n) => n.toLocaleString();

    console.log(c.warn(`  ◉ ${t('Token Savings', '토큰 절약')}`));
    console.log(UI.separator());

    const BW = 74;
    const bdr = '─'.repeat(BW);
    const bl = (s) => boxLine(s, BW);

    console.log(c.dim(`  ┌${bdr}┐`));
    console.log(bl(''));

    // Knowledge base
    console.log(bl(c.text(`  🧠 ${t('Brain knowledge', '뇌 지식').padEnd(30)}`) + c.accent(`${fmt(savings.tokensStored)} tokens`)));
    console.log(bl(c.text(`  📄 ${t('Library knowledge', '도서관 지식').padEnd(30)}`) + c.accent(`${fmt(savings.docTokens)} tokens`)));
    console.log(bl(c.dim(`  ${'─'.repeat(50)}`)));
    console.log(bl(c.text(`  📊 ${t('Total knowledge base', '총 지식 베이스').padEnd(30)}`) + c.brand(`${fmt(savings.totalKnowledge)} tokens`)));
    console.log(bl(''));

    // Savings
    console.log(bl(c.text(`  🔁 ${t('Times recalled', '회상 횟수').padEnd(30)}`) + c.success(`${fmt(savings.recallCount)}x`)));
    console.log(bl(c.text(`  ✓  ${t('Tokens saved by recall', '회상으로 절약한 토큰').padEnd(30)}`) + c.success(`${fmt(savings.tokensRecalled)} tokens`)));

    if (parseFloat(savings.estimatedSavingsUSD) > 0) {
        console.log(bl(c.text(`  💰 ${t('Estimated cost saved', '예상 비용 절약').padEnd(30)}`) + c.success(`~$${savings.estimatedSavingsUSD}`)));
    }
    console.log(bl(''));

    // Without vs With comparison
    const withoutTokens = savings.totalKnowledge * Math.max(1, savings.recallCount);
    if (savings.recallCount > 0) {
        console.log(bl(c.dim(`  ${t('Without Cortexia', 'Cortexia 없이')}:  ${t('You would repeat', '반복 입력했을')} ~${fmt(withoutTokens)} tokens`)));
        console.log(bl(c.success(`  ${t('With Cortexia', 'Cortexia 사용')}:    ${t('Brain auto-recalled', '뇌가 자동 회상')} → ${fmt(savings.tokensRecalled)} ${t('tokens saved', '토큰 절약')}`)));
    } else {
        console.log(bl(c.dim(`  ${t('Start using Cortexia to track token savings!', 'Cortexia를 사용하면 토큰 절약량이 여기에 표시됩니다!')}`)));
    }
    console.log(bl(''));
    console.log(c.dim(`  └${bdr}┘`));
    console.log();

    // Upgrade prompt for non-Enterprise tiers
    if (tier !== 'enterprise') {
        showPricingBox(tier);
    }

    console.log(c.dim('  cortexia v1.0.0'));
    console.log();
}

function showInit() {
    const setupPath = path.join(__dirname, '..', 'setup', 'init.js');
    require(setupPath);
}

function showHelp() {
    console.log(UI.LOGO);

    const BW = 74;
    const bdr = '─'.repeat(BW);
    const bl = (s) => boxLine(s, BW);

    // ═══════════════════════════════════════════════
    //  THE PROBLEM — Why does this exist?
    // ═══════════════════════════════════════════════

    console.log(c.error('  ◉ The Problem / 문제'));
    console.log(UI.separator());
    console.log();
    console.log(c.text('  EN │ Every time you start a new Claude Code session, your AI'));
    console.log(c.text('     │ forgets everything. Your coding style, project decisions,'));
    console.log(c.text('     │ bugs you already fixed, architecture choices — all gone.'));
    console.log(c.text('     │ You repeat yourself. Every. Single. Session.'));
    console.log();
    console.log(c.text('  KO │ Claude Code 세션을 새로 시작할 때마다 AI는 모든 것을 잊습니다.'));
    console.log(c.text('     │ 코딩 스타일, 프로젝트 결정, 이미 고친 버그, 아키텍처 선택 —'));
    console.log(c.text('     │ 전부 사라집니다. 매 세션마다 같은 설명을 반복해야 합니다.'));
    console.log();

    console.log(c.dim(`  ┌${bdr}┐`));
    console.log(bl(''));
    console.log(bl(c.error('    Session 1: "Use TypeScript strict mode, tabs, no semicolons"  ~500 tokens')));
    console.log(bl(c.error('    Session 2: "Use TypeScript strict mode, tabs, no semicolons"  ~500 tokens')));
    console.log(bl(c.error('    Session 3: "Use TypeScript strict mode, tabs, no semicolons"  ~500 tokens')));
    console.log(bl(c.dim('    Session N: ... (still repeating the same thing)')));
    console.log(bl(''));
    console.log(bl(c.error('    → 10 sessions = ~5,000 wasted tokens = wasted money')));
    console.log(bl(c.dim('      10 세션 = ~5,000 토큰 낭비 = 돈 낭비')));
    console.log(bl(''));
    console.log(c.dim(`  └${bdr}┘`));
    console.log();

    // ═══════════════════════════════════════════════
    //  THE SOLUTION — What is Cortexia?
    // ═══════════════════════════════════════════════

    console.log(c.brand('  ◉ The Solution: Cortexia / 해결책: Cortexia'));
    console.log(UI.separator());
    console.log();
    console.log(c.text('  EN │ Cortexia gives your AI a real brain. Not a database — a brain.'));
    console.log(c.text('     │ Built on Spiking Neural Networks (SNN), the same model used'));
    console.log(c.text('     │ in computational neuroscience. Your AI remembers conversations,'));
    console.log(c.text('     │ learns preferences, forms personality, and even has emotions'));
    console.log(c.text('     │ driven by neurotransmitters (dopamine, serotonin, etc).'));
    console.log();
    console.log(c.text('  KO │ Cortexia는 AI에게 진짜 두뇌를 줍니다. 데이터베이스가 아닌 두뇌.'));
    console.log(c.text('     │ 계산신경과학에서 사용하는 스파이킹 신경망(SNN) 기반입니다.'));
    console.log(c.text('     │ 대화를 기억하고, 선호도를 학습하고, 성격을 형성하며,'));
    console.log(c.text('     │ 신경전달물질(도파민, 세로토닌 등)로 감정까지 시뮬레이션합니다.'));
    console.log();

    // ── Key Features ──
    console.log(c.accent('  ◉ Key Features / 핵심 기능'));
    console.log(UI.separator());
    console.log();

    console.log(c.dim(`  ┌${bdr}┐`));
    console.log(bl(''));
    console.log(bl(c.brand('  🧠 SNN Long-Term Memory          SNN 장기기억')));
    console.log(bl(c.dim('     Memories strengthen with repetition, fade with time.')));
    console.log(bl(c.dim('     반복하면 강화되고, 시간이 지나면 자연스럽게 약해집니다.')));
    console.log(bl(''));
    console.log(bl(c.brand('  📄 Smart Document Library        스마트 문서 도서관')));
    console.log(bl(c.dim('     Ingest .md/.txt files. Brain searches them like a library.')));
    console.log(bl(c.dim('     문서를 넣으면 뇌가 도서관처럼 필요할 때 찾아서 읽습니다.')));
    console.log(bl(''));
    console.log(bl(c.brand('  💊 Neurotransmitter System        신경전달물질 시스템')));
    console.log(bl(c.dim('     Dopamine, serotonin, norepinephrine, acetylcholine.')));
    console.log(bl(c.dim('     도파민, 세로토닌, 노르에피네프린, 아세틸콜린 시뮬레이션.')));
    console.log(bl(''));
    console.log(bl(c.brand('  🎭 Emotion & Personality          감정 & 성격')));
    console.log(bl(c.dim('     AI develops personality traits over time through interaction.')));
    console.log(bl(c.dim('     대화를 통해 시간이 지나면 AI만의 성격이 형성됩니다.')));
    console.log(bl(''));
    console.log(bl(c.brand('  🔁 Ebbinghaus Forgetting Curve    에빙하우스 망각곡선')));
    console.log(bl(c.dim('     Important things stick. Trivial things naturally fade.')));
    console.log(bl(c.dim('     중요한 건 남고, 사소한 건 자연스럽게 잊혀집니다.')));
    console.log(bl(''));
    console.log(bl(c.brand('  💰 Token Savings Tracker          토큰 절약 추적')));
    console.log(bl(c.dim('     See exactly how many tokens & dollars you save.')));
    console.log(bl(c.dim('     절약한 토큰과 비용을 정확히 확인할 수 있습니다.')));
    console.log(bl(''));
    console.log(c.dim(`  └${bdr}┘`));
    console.log();

    // ── Token Savings Example ──
    console.log(c.warn('  ◉ Token Savings / 토큰 절약 — Why this matters'));
    console.log(UI.separator());
    console.log();
    console.log(c.dim(`  ┌${bdr}┐`));
    console.log(bl(''));
    console.log(bl(c.error('  Without Cortexia / Cortexia 없이:')));
    console.log(bl(c.dim('    Every session, you re-explain your project context.')));
    console.log(bl(c.dim('    매 세션마다 프로젝트 컨텍스트를 다시 설명해야 합니다.')));
    console.log(bl(''));
    console.log(bl(c.dim('    50 sessions × 500 tokens = ') + c.error('25,000 wasted tokens')));
    console.log(bl(c.dim('    50 세션 × 500 토큰 = ') + c.error('25,000 토큰 낭비')));
    console.log(bl(''));
    console.log(bl(c.success('  With Cortexia / Cortexia 사용:')));
    console.log(bl(c.dim('    Explain once. Brain remembers forever.')));
    console.log(bl(c.dim('    한 번만 설명. 뇌가 영원히 기억합니다.')));
    console.log(bl(''));
    console.log(bl(c.dim('    1 session × 500 tokens = ') + c.success('500 tokens total')));
    console.log(bl(c.dim('    1 세션 × 500 토큰 = ') + c.success('500 토큰 끝')));
    console.log(bl(''));
    console.log(bl(c.brand('    → Saved: 24,500 tokens = ~$0.12')));
    console.log(bl(c.brand('    → 절약: 24,500 토큰 = ~$0.12')));
    console.log(bl(''));
    console.log(bl(c.dim('    Run ') + c.accent('cortexia status') + c.dim(' to see your actual savings.')));
    console.log(bl(c.dim('    실제 절약량은 ') + c.accent('cortexia status') + c.dim(' 에서 확인하세요.')));
    console.log(bl(''));
    console.log(c.dim(`  └${bdr}┘`));
    console.log();

    // ── How is this different? ──
    console.log(c.glow('  ◉ How is this different from RAG? / 기존 RAG와 뭐가 다른가요?'));
    console.log(UI.separator());
    console.log();
    console.log(c.dim(`  ┌${bdr}┐`));
    console.log(bl(''));
    console.log(bl(c.dim('     Traditional RAG              Cortexia')));
    console.log(bl(c.dim('     기존 RAG                     Cortexia')));
    console.log(bl(''));
    console.log(bl(c.error('     Vector DB lookup             ') + c.success('SNN biological memory')));
    console.log(bl(c.error('     Static retrieval             ') + c.success('Memories evolve over time')));
    console.log(bl(c.error('     No forgetting                ') + c.success('Ebbinghaus forgetting curve')));
    console.log(bl(c.error('     No emotion                   ') + c.success('Neurotransmitter simulation')));
    console.log(bl(c.error('     Searches everything          ') + c.success('Brain recalls what matters')));
    console.log(bl(c.error('     Cold, mechanical             ') + c.success('Personality & emotion')));
    console.log(bl(''));
    console.log(c.dim(`  └${bdr}┘`));
    console.log();

    // ── How it Works ──
    console.log(c.success('  ◉ How It Works / 작동 원리'));
    console.log(UI.separator());
    console.log();

    console.log(c.dim(`  ┌${bdr}┐`));
    console.log(bl(''));
    console.log(bl(c.text('    You talk to Claude                  ') + c.dim('Claude와 대화하면')));
    console.log(bl(c.accent('          ↓                                        ↓')));
    console.log(bl(c.text('    Brain stores memory                 ') + c.dim('뇌가 기억을 저장')));
    console.log(bl(c.brand('      ◉──◉──◉  (SNN)                         ◉──◉──◉  (SNN)')));
    console.log(bl(c.accent('          ↓                                        ↓')));
    console.log(bl(c.text('    Next session: recalls               ') + c.dim('다음 세션: 자동 회상')));
    console.log(bl(''));
    console.log(bl(c.success('    ✓ No more starting over             ') + c.dim('✓ 매번 처음부터 안 해도 됨')));
    console.log(bl(''));
    console.log(c.dim(`  └${bdr}┘`));
    console.log();

    // ── Quick Start ──
    console.log(c.brand('  ◉ Quick Start / 빠른 시작'));
    console.log(UI.separator());
    console.log();
    console.log(c.dim('  Step 1.') + c.text(' Install / 설치'));
    console.log(c.accent('     $ npm install -g cortexia'));
    console.log();
    console.log(c.dim('  Step 2.') + c.text(' Initialize project / 프로젝트 초기화'));
    console.log(c.accent('     $ cd your-project'));
    console.log(c.accent('     $ cortexia init'));
    console.log(c.dim('     → Creates .mcp.json, CLAUDE.md, auto-save hooks'));
    console.log(c.dim('     → .mcp.json, CLAUDE.md, 자동저장 훅 생성'));
    console.log();
    console.log(c.dim('  Step 3.') + c.text(' Start Claude Code / Claude Code 실행'));
    console.log(c.accent('     $ claude'));
    console.log(c.dim('     → Brain auto-connects! Claude now remembers everything.'));
    console.log(c.dim('     → 뇌가 자동 연결! Claude가 모든 것을 기억합니다.'));
    console.log();
    console.log(c.dim('  Step 4.') + c.text(' Add documents (optional) / 문서 추가 (선택)'));
    console.log(c.accent('     $ cortexia ingest ./docs/'));
    console.log(c.dim('     → Documents become searchable memory.'));
    console.log(c.dim('     → 문서가 검색 가능한 기억이 됩니다.'));
    console.log();

    // ── Commands ──
    console.log(c.accent('  ◉ Commands / 명령어'));
    console.log(UI.separator());
    console.log(`  ${c.accent('cortexia')}                  ${c.text('Interactive shell (arrow-key menu)')}`);
    console.log(`  ${c.dim('                            인터랙티브 쉘 (화살표 메뉴)')}`);
    console.log();
    console.log(`  ${c.accent('cortexia init')}             ${c.text('Set up brain for this project')}`);
    console.log(`  ${c.dim('                            프로젝트에 뇌 설정 (최초 1회)')}`);
    console.log();
    console.log(`  ${c.accent('cortexia status')}           ${c.text('Show brain status & emotions')}`);
    console.log(`  ${c.dim('                            뇌 상태, 감정, 신경전달물질 보기')}`);
    console.log();
    console.log(`  ${c.accent('cortexia ingest <path>')}    ${c.text('Add documents to library')}`);
    console.log(`  ${c.dim('                            문서를 도서관에 추가 (.md, .txt)')}`);
    console.log();
    console.log(`  ${c.accent('cortexia docs')}             ${c.text('Show library contents')}`);
    console.log(`  ${c.dim('                            도서관 상태 보기')}`);
    console.log();
    console.log(`  ${c.accent('cortexia pricing')}          ${c.text('View plans & pricing')}`);
    console.log(`  ${c.dim('                            요금제 보기 및 구매 안내')}`);
    console.log();
    console.log(`  ${c.accent('cortexia activate <key>')}  ${c.text('Activate license key')}`);
    console.log(`  ${c.dim('                            라이선스 키 활성화')}`);
    console.log();

    // ── Contact ──
    console.log(c.dim('  ◉ Contact / 문의'));
    console.log(UI.separator());
    console.log(`  ${c.text('📧')}  ${c.accent('hangil9910@gmail.com')}`);
    console.log(`  ${c.text('💬')}  ${c.accent('https://open.kakao.com/o/gJVrRahi')}`);
    console.log();

    // ── Options ──
    console.log(c.dim('  Options / 옵션: --ko (한국어만) | --en (English only)'));
    console.log(c.dim('  cortexia v1.0.0'));
    console.log();
}

// ═══════════════════════════════════════════════════════════════
//  Pricing Display
// ═══════════════════════════════════════════════════════════════

function showPricingBox(currentTier) {
    const cur = currentTier || 'free';
    const W = 74;
    const border = '─'.repeat(W);

    // Table row helper — all ASCII, simple padEnd works
    // Inner width: 2 + 12 + 15*4 = 74 = W
    function trow(label, v1, v2, v3, v4) {
        return '  ' + label.padEnd(12) + v1.padEnd(15) + v2.padEnd(15) + v3.padEnd(15) + v4.padEnd(15);
    }

    const tierNames = { free: 'Free', pro: '✦ Pro', business: '✦✦ Business', enterprise: '✦✦✦ Enterprise' };

    console.log();
    console.log(c.brand('  ◉ Plans & Pricing / 요금제'));
    console.log(UI.separator());
    console.log();

    // Current plan badge
    console.log(c.text(`  Current plan / 현재 플랜:  `) + c.success(tierNames[cur] || cur));
    console.log();

    // ── Comparison Table ──
    console.log(c.dim(`  ┌${border}┐`));

    // Header
    const hdr = trow('', 'Free', '✦ Pro', '✦✦ Business', '✦✦✦ Enterprise');
    console.log(c.dim('  │') + c.bold(c.text(hdr)) + c.dim('│'));
    console.log(c.dim(`  ├${border}┤`));

    // Feature rows
    const features = [
        ['Memories',    '100', '1,000', '5,000',     'Unlimited'],
        ['Documents',   '5',   '50',   '300',       'Unlimited'],
        ['Emotions',    '✓',   '✓',    '✓',         '✓'],
        ['Personality', '─',   '✓',    '✓',         '✓'],
        ['Sleep',       '─',   '✓',    '✓',         '✓'],
        ['Hybrid',      '─',   '─',    '✓',         '✓'],
        ['Priority',    '─',   '─',    '─',         '✓'],
    ];

    for (const [label, ...vals] of features) {
        const line = trow(label, ...vals);
        console.log(c.dim('  │') + c.text(line) + c.dim('│'));
    }

    console.log(c.dim(`  ├${border}┤`));

    // Price rows
    const p1 = trow('Monthly', '₩0', '₩29,900', '₩49,900', '₩149,900');
    const p2 = trow('', '$0', '$20', '$39.99', '$119.99');
    console.log(c.dim('  │') + c.success(p1) + c.dim('│'));
    console.log(c.dim('  │') + c.dim(p2) + c.dim('│'));

    console.log(c.dim(`  └${border}┘`));
    console.log();

    // ── Purchase Info ──
    console.log(c.success('  ◉ How to Purchase / 구매 방법'));
    console.log(UI.separator());
    console.log();
    console.log(c.text('  💬 KakaoTalk Open Chat / 카카오톡 오픈채팅'));
    console.log(c.accent('     https://open.kakao.com/o/gJVrRahi'));
    console.log();
    console.log(c.dim('     EN │ Click the link above to join our KakaoTalk open chat.'));
    console.log(c.dim('        │ Tell us which plan you want, and we will send your license key.'));
    console.log();
    console.log(c.dim('     KO │ 위 링크를 클릭하여 카카오톡 오픈채팅방에 입장하세요.'));
    console.log(c.dim('        │ 원하시는 플랜을 말씀해주시면 라이선스 키를 즉시 발급해드립니다.'));
    console.log();
    console.log(c.text('  🌐 Patreon (International / 해외 결제)'));
    console.log(c.accent('     https://www.patreon.com/cw/deark/membership'));
    console.log();
    console.log(c.text('  📧 Email / 이메일'));
    console.log(c.accent('     hangil9910@gmail.com'));
    console.log();
    console.log(UI.separator());
    console.log(c.dim('  After purchase / 구매 후 활성화:'));
    console.log(c.accent('  $ cortexia activate <your-license-key>'));
    console.log();
}

function showPricing() {
    console.log(UI.LOGO);
    try {
        const ctx = getCortexia();
        showPricingBox(ctx.tier);
    } catch {
        showPricingBox('free');
    }
}

function runActivate(key) {
    if (!key) {
        console.log();
        console.log(c.error(`  ${t('License key required', '라이선스 키가 필요합니다')}`));
        console.log(c.dim(`  ${t('Usage', '사용법')}: cortexia activate <license-key>`));
        console.log();
        console.log(c.dim(`  ${t('Get a key', '키 구매')}: https://open.kakao.com/o/gJVrRahi`));
        console.log();
        return;
    }

    const ctx = getCortexia();

    // Key prefix determines tier
    let tier = 'pro';
    const upper = key.toUpperCase();
    if (upper.startsWith('ENT-') || upper.startsWith('ENTERPRISE-')) {
        tier = 'enterprise';
    } else if (upper.startsWith('BIZ-') || upper.startsWith('BUSINESS-')) {
        tier = 'business';
    } else if (upper.startsWith('PRO-')) {
        tier = 'pro';
    }

    const result = ctx.activate(key, tier);

    console.log();
    if (result.success) {
        const tierNames = { pro: 'Pro', business: 'Business', enterprise: 'Enterprise' };
        const tierName = tierNames[result.tier] || result.tier;
        console.log(c.success(`  ✓ ${t('License activated!', '라이선스 활성화 완료!')}`));
        console.log(c.accent(`  ✦ ${t(`Plan: ${tierName}`, `플랜: ${tierName}`)}`));
        console.log();
        console.log(c.dim(`  ${t('Restart claude to apply changes.', 'claude를 재시작하면 적용됩니다.')}`));
    } else {
        console.log(c.error(`  ✗ ${t('Activation failed', '활성화 실패')}: ${result.error}`));
    }
    console.log();
}

function runIngest(targets) {
    if (targets.length === 0) {
        console.log();
        console.log(c.brand(`  ◉ ${t('Ingest — Add documents to library', '문서 추가 — 도서관에 문서 넣기')}`));
        console.log(UI.separator());
        console.log(`  ${c.text('cortexia ingest ./file.md')}          ${c.dim(t('Single file', '파일 하나'))}`);
        console.log(`  ${c.text('cortexia ingest ./a.md ./b.txt')}     ${c.dim(t('Multiple files', '여러 파일'))}`);
        console.log(`  ${c.text('cortexia ingest ./docs/')}            ${c.dim(t('Entire folder', '폴더 통째로'))}`);
        console.log();
        console.log(c.dim(`  ${t('Supported', '지원 형식')}: .md, .txt, .text, .markdown`));
        console.log();
        return;
    }

    const brain = getBrain();
    let totalAdded = 0;
    let fileCount = 0;

    console.log();
    console.log(c.brand(`  ◉ ${t('Ingesting documents...', '문서 추가 중...')}`));
    console.log(UI.separator());

    for (const target of targets) {
        const absPath = path.resolve(target);

        if (!fs.existsSync(absPath)) {
            console.log(`  ${c.error('✗')} ${target} ${c.dim(t('— not found', '— 파일 없음'))}`);
            continue;
        }

        const stat = fs.statSync(absPath);

        if (stat.isDirectory()) {
            const files = findDocFiles(absPath);
            if (files.length === 0) {
                console.log(`  ${c.warn('⚠')} ${target} ${c.dim(t('— no .md/.txt files', '— .md/.txt 파일 없음'))}`);
                continue;
            }
            for (const file of files) {
                const result = brain.ingest(file);
                if (result.success) {
                    const rel = path.relative(process.cwd(), file);
                    console.log(`  ${c.success('✓')} ${c.text(rel)} ${c.dim('→')} ${c.accent(result.chunksAdded + ` ${t('chunks', '청크')}`)}`);
                    totalAdded += result.chunksAdded;
                    fileCount++;
                } else {
                    console.log(`  ${c.error('✗')} ${file} ${c.dim('—')} ${c.error(result.error)}`);
                }
            }
        } else {
            const result = brain.ingest(absPath);
            if (result.success) {
                console.log(`  ${c.success('✓')} ${c.text(result.source)} ${c.dim('→')} ${c.accent(result.chunksAdded + ` ${t('chunks', '청크')}`)}`);
                totalAdded += result.chunksAdded;
                fileCount++;
            } else {
                console.log(`  ${c.error('✗')} ${target} ${c.dim('—')} ${c.error(result.error)}`);
            }
        }
    }

    const docs = brain.getDocumentStats();
    console.log(UI.separator());
    console.log(`  ${c.success(t('Done:', '완료:'))} ${fileCount} ${t('files', '파일')} → ${totalAdded} ${t('chunks added', '청크 추가')}`);
    console.log(`  ${c.dim(`${t('Library', '도서관')}: ${docs.totalChunks} ${t('chunks', '청크')} | ${docs.indexedWords} ${t('words', '단어')} | ${docs.sources.length} ${t('sources', '소스')}`)}`);
    console.log();
}

function showDocs() {
    const brain = getBrain();
    const docs = brain.getDocumentStats();

    console.log();

    if (docs.totalChunks === 0) {
        console.log(c.dim(`  ${t('Library is empty.', '도서관이 비어있습니다.')} ${t('Run', '실행:')} \`cortexia ingest <file>\` ${t('to add documents.', '')}`));
        console.log();
        return;
    }

    console.log(c.brand(`  ◉ ${t('Library', '도서관')}`));
    console.log(UI.separator());
    console.log(UI.stat(t('Chunks', '청크'), `${docs.totalChunks}`, 'text'));
    console.log(UI.stat(t('Indexed', '인덱싱'), `${docs.indexedWords} ${t('words', '단어')}`, 'text'));
    console.log(UI.stat(t('Sources', '소스'), `${docs.sources.length} ${t('files', '파일')}`, 'text'));
    console.log();

    for (const source of docs.sources) {
        console.log(`  ${c.dim('  📄')} ${c.text(source)}`);
    }
    console.log();
}

function findDocFiles(dir) {
    const results = [];
    const validExts = new Set(['.md', '.txt', '.text', '.markdown']);

    function walk(currentDir) {
        const entries = fs.readdirSync(currentDir);
        for (const entry of entries) {
            if (entry.startsWith('.') || entry === 'node_modules') continue;
            const fullPath = path.join(currentDir, entry);
            const stat = fs.statSync(fullPath);
            if (stat.isDirectory()) {
                walk(fullPath);
            } else if (validExts.has(path.extname(entry).toLowerCase())) {
                results.push(fullPath);
            }
        }
    }

    walk(dir);
    return results.sort();
}

// ═══════════════════════════════════════════════════════════════
//  Interactive Shell
// ═══════════════════════════════════════════════════════════════

function startShell() {
    const readline = require('readline');

    // ── Slash menu items ──
    const MENU_ITEMS = [
        { cmd: 'status',   en: 'Brain status & emotions',  ko: '뇌 상태 및 감정',      icon: '🧠' },
        { cmd: 'recall',   en: 'Search memories',           ko: '기억 검색',            icon: '🔍' },
        { cmd: 'remember', en: 'Store a memory',            ko: '기억 저장',            icon: '💾' },
        { cmd: 'ingest',   en: 'Add document to library',   ko: '문서를 도서관에 추가',  icon: '📄' },
        { cmd: 'docs',     en: 'Library status',            ko: '도서관 상태',          icon: '📚' },
        { cmd: 'pricing',  en: 'Plans & pricing',           ko: '요금제 보기',          icon: '💰' },
        { cmd: 'activate', en: 'Activate license key',      ko: '라이선스 키 활성화',   icon: '🔑' },
        { cmd: 'init',     en: 'Setup project',             ko: '프로젝트 설정',        icon: '🔧' },
        { cmd: 'help',     en: 'Full help guide',           ko: '전체 도움말',          icon: '❓' },
        { cmd: 'q',        en: 'Quit',                      ko: '종료',                icon: '👋' },
    ];

    // ── Full brain graphic + guide ──
    console.log(UI.LOGO);

    console.log(c.success('  ◉ Quick Commands / 빠른 명령어'));
    console.log(UI.separator());
    console.log(`  ${c.accent('/status')}    ${c.text(t('Brain status', '뇌 상태'))}        ${c.accent('/recall')}   ${c.text(t('Search memories', '기억 검색'))}`);
    console.log(`  ${c.accent('/remember')}  ${c.text(t('Store memory', '기억 저장'))}      ${c.accent('/ingest')}   ${c.text(t('Add document', '문서 추가'))}`);
    console.log(`  ${c.accent('/docs')}      ${c.text(t('Library', '도서관'))}            ${c.accent('/pricing')}  ${c.text(t('Plans & pricing', '요금제'))}`);
    console.log(`  ${c.accent('/help')}      ${c.text(t('Full guide', '전체 가이드'))}       ${c.accent('/q')}        ${c.text(t('Quit', '종료'))}`);
    console.log();
    console.log(c.dim(`  ${t('Type / to open command menu. Arrow keys to select.', '/ 입력하면 명령 메뉴. 화살표로 선택.')}`));
    console.log();
    console.log(`  ${c.text('📖')} ${t('User Guide / 사용설명서', '사용설명서')}: ${c.accent('https://zccdedig.gensparkspace.com/')}`);
    console.log();

    // ── State ──
    const PROMPT_RAW = `  ${c.brand('cortexia')}${c.dim(' ❯ ')}`;
    let inputBuffer = '';
    let menuOpen = false;
    let menuIndex = 0;
    let menuFiltered = [];

    // ── Draw helpers ──
    function clearMenu(count) {
        for (let i = 0; i < count; i++) {
            process.stdout.write('\x1b[1A\x1b[2K');
        }
    }

    function drawPrompt() {
        process.stdout.write('\x1b[2K\r');
        process.stdout.write(PROMPT_RAW + inputBuffer);
    }

    function getFiltered() {
        const typed = inputBuffer.slice(1).toLowerCase();
        if (!typed) return [...MENU_ITEMS];
        return MENU_ITEMS.filter(m => m.cmd.startsWith(typed));
    }

    function drawMenu() {
        menuFiltered = getFiltered();
        if (menuFiltered.length === 0) return;
        if (menuIndex >= menuFiltered.length) menuIndex = menuFiltered.length - 1;
        if (menuIndex < 0) menuIndex = 0;

        const W = 74;
        const border = '─'.repeat(W);

        console.log();
        console.log(c.dim(`  ┌${border}┐`));
        for (let i = 0; i < menuFiltered.length; i++) {
            const item = menuFiltered[i];
            const sel = i === menuIndex;
            const arrow = sel ? '▸' : ' ';
            const cmd = `/${item.cmd}`.padEnd(12);
            const enText = item.en.padEnd(28);
            const koText = item.ko;

            // Calculate padding: 51 fixed ASCII + Korean visual width
            const contentW = 51 + visWidth(koText);
            const pad = ' '.repeat(Math.max(1, W - contentW));

            if (sel) {
                console.log(
                    c.accent(`  │  ${arrow}  `) + `${item.icon}  ` +
                    c.accent(cmd) + `  ` +
                    c.text(enText) + c.accent(koText) +
                    pad + c.dim('│')
                );
            } else {
                console.log(
                    c.dim(`  │  ${arrow}  `) + `${item.icon}  ` +
                    c.dim(cmd) + `  ` +
                    c.dim(enText) + c.dim(koText) +
                    pad + c.dim('│')
                );
            }
        }
        console.log(c.dim(`  └${border}┘`));
        console.log(c.dim(`  ↑↓ ${t('Navigate', '이동')}  Enter ${t('Select', '선택')}  Esc ${t('Cancel', '취소')}`));
    }

    function closeMenu() {
        if (menuOpen && menuFiltered.length > 0) {
            // +4 = top border + bottom border + hint line + blank line
            clearMenu(menuFiltered.length + 4);
        }
        menuOpen = false;
        menuIndex = 0;
        menuFiltered = [];
    }

    function openMenu() {
        menuOpen = true;
        menuIndex = 0;
        drawMenu();
        drawPrompt();
    }

    function redrawMenu() {
        if (!menuOpen) return;
        const prevCount = menuFiltered.length;
        // +4 = top border + bottom border + hint line + blank line
        if (prevCount > 0) clearMenu(prevCount + 4);
        drawMenu();
        drawPrompt();
    }

    // ── Execute command ──
    function executeCommand(input) {
        const parts = input.slice(1).split(/\s+/);
        const cmd = parts[0].toLowerCase();
        const cmdArgs = parts.slice(1);

        switch (cmd) {
            case 'status':
            case 's':
                showStatus();
                break;

            case 'recall':
            case 'r': {
                const query = cmdArgs.join(' ');
                if (!query) {
                    console.log(c.dim(`  ${t('Usage', '사용법')}: /recall <query>`));
                    console.log(c.dim(`  ${t('Example', '예시')}: /recall ${t('recent work', '최근 작업')}`));
                    break;
                }
                try {
                    const ctx = getCortexia();
                    const results = ctx.engine.recall(query, { maxResults: 5 });
                    if (!results || (Array.isArray(results) && results.length === 0) ||
                        (results.memories && results.memories.length === 0 && (!results.documents || results.documents.length === 0))) {
                        console.log(c.dim(`  ${t('No memories found.', '기억을 찾지 못했습니다.')}`));
                    } else {
                        console.log();
                        console.log(c.brand(`  ◉ ${t('Recall Results', '기억 검색 결과')}`));
                        console.log(UI.separator());
                        const memories = results.memories || results;
                        if (Array.isArray(memories)) {
                            memories.forEach((m, i) => {
                                const txt = m.input || m.text || JSON.stringify(m);
                                const score = m.relevance || m.score || '';
                                const scoreStr = score ? c.dim(` (${(score * 100).toFixed(0)}%)`) : '';
                                console.log(`  ${c.accent(`${i + 1}.`)} ${c.text(txt.substring(0, 120))}${scoreStr}`);
                            });
                        }
                        if (results.documents && results.documents.length > 0) {
                            console.log();
                            console.log(c.success(`  ◉ ${t('From Library', '도서관에서')}`));
                            results.documents.forEach((d, i) => {
                                const txt = d.text || JSON.stringify(d);
                                console.log(`  ${c.success(`${i + 1}.`)} ${c.dim(`[${d.source || '?'}]`)} ${c.text(txt.substring(0, 100))}`);
                            });
                        }
                    }
                } catch (err) {
                    console.log(c.error(`  Error: ${err.message}`));
                }
                console.log();
                break;
            }

            case 'remember':
            case 'rem': {
                const text = cmdArgs.join(' ');
                if (!text) {
                    console.log(c.dim(`  ${t('Usage', '사용법')}: /remember <text>`));
                    console.log(c.dim(`  ${t('Example', '예시')}: /remember ${t('user likes TypeScript', '사용자는 TypeScript를 좋아함')}`));
                    break;
                }
                try {
                    const ctx = getCortexia();
                    const result = ctx.remember({ input: text, type: 'conversation', importance: 0.7 });
                    if (result.success !== false) {
                        console.log(c.success(`  ✓ ${t('Remembered!', '기억했습니다!')}`));
                    } else {
                        console.log(c.error(`  ✗ ${result.error}`));
                    }
                } catch (err) {
                    console.log(c.error(`  Error: ${err.message}`));
                }
                console.log();
                break;
            }

            case 'ingest':
            case 'i':
                if (cmdArgs.length === 0) {
                    console.log(c.dim(`  ${t('Usage', '사용법')}: /ingest <file-or-folder>`));
                } else {
                    runIngest(cmdArgs);
                }
                break;

            case 'docs':
            case 'd':
                showDocs();
                break;

            case 'pricing':
            case 'plans':
            case 'upgrade':
            case 'p':
                showPricing();
                break;

            case 'activate':
                runActivate(cmdArgs[0]);
                break;

            case 'init':
                showInit();
                break;

            case 'help':
            case 'h':
                showHelp();
                break;

            case 'q':
            case 'quit':
            case 'exit':
                console.log(c.dim(`  ${t('Goodbye!', '안녕히 가세요!')}`));
                console.log();
                process.exit(0);
                break;

            default:
                console.log(c.dim(`  ${t('Unknown command', '알 수 없는 명령')}: /${cmd}`));
                console.log();
        }
    }

    // ── Raw mode input handler ──
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.setEncoding('utf8');

    drawPrompt();

    process.stdin.on('data', (key) => {
        // Ctrl+C
        if (key === '\x03') {
            if (menuOpen) {
                closeMenu();
                inputBuffer = '';
                drawPrompt();
            } else {
                console.log();
                process.exit(0);
            }
            return;
        }

        // Escape
        if (key === '\x1b' || key === '\x1b\x1b') {
            if (menuOpen) {
                closeMenu();
                inputBuffer = '';
                drawPrompt();
            }
            return;
        }

        // Arrow up
        if (key === '\x1b[A') {
            if (menuOpen && menuFiltered.length > 0) {
                menuIndex = (menuIndex - 1 + menuFiltered.length) % menuFiltered.length;
                redrawMenu();
            }
            return;
        }

        // Arrow down
        if (key === '\x1b[B') {
            if (menuOpen && menuFiltered.length > 0) {
                menuIndex = (menuIndex + 1) % menuFiltered.length;
                redrawMenu();
            }
            return;
        }

        // Enter
        if (key === '\r' || key === '\n') {
            if (menuOpen && menuFiltered.length > 0) {
                // Select from menu
                const selected = menuFiltered[menuIndex];
                closeMenu();
                const needsArg = ['recall', 'remember', 'ingest', 'activate'].includes(selected.cmd);
                if (needsArg) {
                    inputBuffer = `/${selected.cmd} `;
                    drawPrompt();
                    return;
                } else {
                    inputBuffer = `/${selected.cmd}`;
                    process.stdout.write('\n');
                    executeCommand(inputBuffer);
                    inputBuffer = '';
                    drawPrompt();
                    return;
                }
            }
            if (inputBuffer.trim()) {
                process.stdout.write('\n');
                if (inputBuffer.trim().startsWith('/')) {
                    executeCommand(inputBuffer.trim());
                } else {
                    console.log(c.dim(`  ${t('Tip: type / to open commands', 'Tip: / 를 입력하면 명령어 메뉴')}`));
                    console.log();
                }
                inputBuffer = '';
            }
            drawPrompt();
            return;
        }

        // Backspace
        if (key === '\x7f' || key === '\b') {
            if (inputBuffer.length > 0) {
                inputBuffer = inputBuffer.slice(0, -1);
                if (menuOpen) {
                    if (inputBuffer === '' || !inputBuffer.startsWith('/')) {
                        closeMenu();
                        drawPrompt();
                    } else {
                        menuIndex = 0;
                        redrawMenu();
                    }
                } else {
                    drawPrompt();
                }
            }
            return;
        }

        // Ignore other special sequences
        if (key.startsWith('\x1b')) return;

        // Normal character
        inputBuffer += key;

        // Trigger menu on /
        if (inputBuffer === '/') {
            openMenu();
            return;
        }

        // Filter menu while typing
        if (menuOpen && inputBuffer.startsWith('/')) {
            menuIndex = 0;
            const filtered = getFiltered();
            if (filtered.length === 0) {
                closeMenu();
                drawPrompt();
            } else {
                redrawMenu();
            }
            return;
        }

        // Close menu if not a slash command anymore
        if (menuOpen && !inputBuffer.startsWith('/')) {
            closeMenu();
        }

        drawPrompt();
    });
}

// ═══════════════════════════════════════════════════════════════
//  Main
// ═══════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════
//  Auto Update Check
// ═══════════════════════════════════════════════════════════════

const CURRENT_VERSION = require(path.join(__dirname, '..', 'package.json')).version;

function checkForUpdate() {
    try {
        const https = require('https');
        const req = https.get('https://registry.npmjs.org/cortexia/latest', { timeout: 3000 }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const latest = JSON.parse(data).version;
                    if (latest && latest !== CURRENT_VERSION) {
                        console.log();
                        console.log(c.warn(`  ⬆ ${t('Update available!', '업데이트 가능!')} ${c.dim(CURRENT_VERSION)} → ${c.success(latest)}`));
                        console.log(c.dim(`    npm update -g cortexia`));
                        console.log();
                    }
                } catch {}
            });
        });
        req.on('error', () => {});
        req.on('timeout', () => req.destroy());
    } catch {}
}

// 백그라운드로 체크 (CLI 시작을 늦추지 않음)
checkForUpdate();

const args = process.argv.slice(2).filter(a => a !== '--ko' && a !== '--en');
const command = args[0];

switch (command) {
    case 'init':
        showInit();
        break;
    case 'status':
        showStatus();
        break;
    case 'ingest':
        runIngest(args.slice(1));
        break;
    case 'docs':
        showDocs();
        break;
    case 'pricing':
    case 'plans':
    case 'upgrade':
        showPricing();
        break;
    case 'activate':
        runActivate(args[1]);
        break;
    case 'shell':
        startShell();
        break;
    case '--help':
    case '-h':
        showHelp();
        break;
    case undefined:
        // No argument = interactive shell
        startShell();
        break;
    default:
        console.log();
        console.log(c.error(`  ${t('Unknown command', '알 수 없는 명령')}: ${command}`));
        console.log(c.dim(`  ${t('Run', '실행:')} cortexia --help`));
        console.log();
}
