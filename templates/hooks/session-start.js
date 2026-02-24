#!/usr/bin/env node
const path = require('path');
const { execSync } = require('child_process');

try {
    // Genesis 뇌 초기화 + 상태 가져오기
    const brainResult = execSync('node .claude/hooks/genesis-brain.js init', {
        cwd: path.resolve(__dirname, '..', '..'),
        timeout: 5000,
        encoding: 'utf8',
    }).trim();

    const brain = JSON.parse(brainResult);

    // Cortexia 기억 가져오기
    let cortexiaMsg = '';
    try {
        const { Cortexia } = require(path.join(process.cwd(), 'node_modules', 'cortexia'));
        const cx = new Cortexia({ userId: 'search_brain', dataDir: '.cortexia_search', docsDir: '.cortexia_search_docs' });
        const s = cx.stats();
        cortexiaMsg = `기억 ${s.totalMemories}개 로드됨.`;
    } catch(e) {
        cortexiaMsg = '기억 없음.';
    }

    // 뇌 상태를 시스템 메시지로 출력
    const msg = `[Genesis 뇌 장착됨]
기분: ${brain.mood}
내면: "${brain.innerThought}"
성격: ${brain.personality.join(', ') || '형성 중'}
도파민: ${(brain.neuromodulators.dopamine * 100).toFixed(0)}% | 세로토닌: ${(brain.neuromodulators.serotonin * 100).toFixed(0)}% | 노르에피네프린: ${(brain.neuromodulators.norepinephrine * 100).toFixed(0)}% | 아세틸콜린: ${(brain.neuromodulators.acetylcholine * 100).toFixed(0)}%
성장: ${brain.growthStage.stage} (${brain.growthStage.description})
상호작용: ${brain.interactionCount}회
${cortexiaMsg}

뇌 명령어:
- 자극: node .claude/hooks/genesis-brain.js process "메시지"
- 상태: node .claude/hooks/genesis-brain.js state
- 피드백: node .claude/hooks/genesis-brain.js feedback "입력" "응답"`;

    console.log(JSON.stringify({ systemMessage: msg }));
} catch(e) {
    console.log(JSON.stringify({ systemMessage: 'Genesis 뇌 로드 실패: ' + e.message }));
}
