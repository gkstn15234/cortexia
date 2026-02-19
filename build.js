#!/usr/bin/env node
/**
 * Cortexia Build Script
 * =====================
 * 배포 전 실행: node build.js
 *
 * 1. core/ 파일 원본 → .src.js로 백업
 * 2. 원본을 난독화하여 core/ 에 덮어쓰기
 * 3. 개인 데이터 포함 여부 검사
 *
 * 사전 준비:
 *   npm install -g javascript-obfuscator
 *   또는
 *   npm install --save-dev javascript-obfuscator
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const c = {
    brand:   (t) => `\x1b[38;2;99;102;241m${t}\x1b[0m`,
    success: (t) => `\x1b[38;2;52;211;153m${t}\x1b[0m`,
    error:   (t) => `\x1b[38;2;248;113;113m${t}\x1b[0m`,
    warn:    (t) => `\x1b[38;2;251;191;36m${t}\x1b[0m`,
    dim:     (t) => `\x1b[38;2;107;114;128m${t}\x1b[0m`,
};

console.log();
console.log(c.brand('  ◉ Cortexia Build'));
console.log(c.dim('  ─────────────────────────────────────────'));

// ── 1. 위험 파일 검사 ──

const DANGEROUS_PATTERNS = [
    /sk-[a-zA-Z0-9]{20,}/,          // OpenAI API key
    /sk-ant-[a-zA-Z0-9]{20,}/,      // Anthropic API key
    /AIza[a-zA-Z0-9_-]{35}/,        // Google API key
    /cortex_user\.json/,             // Brain data reference
    /C:\\\\Users\\\\/,               // Windows personal path
    /\/home\/[a-z]/,                 // Linux personal path
];

const filesToCheck = [
    'index.js',
    'core/engine.js',
    'core/document_store.js',
    'mcp/server.js',
    'bin/cortexia.js',
    'setup/init.js',
    'setup/postinstall.js',
];

let hasIssues = false;

for (const file of filesToCheck) {
    const fullPath = path.join(__dirname, file);
    if (!fs.existsSync(fullPath)) continue;

    const content = fs.readFileSync(fullPath, 'utf-8');
    for (const pattern of DANGEROUS_PATTERNS) {
        if (pattern.test(content)) {
            console.log(`  ${c.error('✗')} ${file} — 위험 패턴 발견: ${pattern.toString()}`);
            hasIssues = true;
        }
    }
}

if (hasIssues) {
    console.log();
    console.log(c.error('  ⚠ 위험 패턴이 발견되었습니다. 배포하지 마세요!'));
    console.log(c.dim('  개인 데이터, API 키 등을 제거한 후 다시 시도하세요.'));
    console.log();
    process.exit(1);
}

console.log(`  ${c.success('✓')} 보안 검사 통과`);

// ── 2. 코어 엔진 난독화 ──

const coreFiles = [
    'core/engine.js',
    'core/document_store.js',
    'core/genesis_brain.js',
    'core/neuron_engine.js',
    'core/episodic_memory.js',
    'core/brain_dna.js',
    'core/temperament.js',
    'core/self_observer.js',
    'core/train.js',
    'core/korean_data.js',
];

let obfuscatorAvailable = true;
try {
    execSync('npx javascript-obfuscator --version', { stdio: 'pipe' });
} catch {
    obfuscatorAvailable = false;
    console.log(c.warn('  ⚠ javascript-obfuscator not found.'));
    console.log(c.dim('    npm install --save-dev javascript-obfuscator'));
    console.log(c.dim('    그 후 다시 node build.js 실행'));
}

if (obfuscatorAvailable) {
    for (const file of coreFiles) {
        const fullPath = path.join(__dirname, file);
        if (!fs.existsSync(fullPath)) {
            console.log(`  ${c.warn('⚠')} ${file} — 파일 없음, 스킵`);
            continue;
        }

        // 원본 백업
        const srcPath = fullPath.replace('.js', '.src.js');
        fs.copyFileSync(fullPath, srcPath);

        // 난독화
        try {
            execSync(
                `npx javascript-obfuscator "${fullPath}" --output "${fullPath}" ` +
                '--compact true ' +
                '--control-flow-flattening true ' +
                '--control-flow-flattening-threshold 0.4 ' +
                '--dead-code-injection true ' +
                '--dead-code-injection-threshold 0.2 ' +
                '--string-array true ' +
                '--string-array-encoding base64 ' +
                '--string-array-threshold 0.75 ' +
                '--rename-globals false ' +
                '--self-defending false ' +
                '--identifier-names-generator hexadecimal ' +
                '--transform-object-keys false',
                { stdio: 'pipe' }
            );
            console.log(`  ${c.success('✓')} ${file} → 난독화 완료`);
        } catch (err) {
            // 원본 복원
            fs.copyFileSync(srcPath, fullPath);
            console.log(`  ${c.error('✗')} ${file} — 난독화 실패, 원본 유지`);
        }
    }
}

// ── 3. 디렉토리 확인 ──

const dangerousDirs = ['.cortex_brain', '.cortex_docs', '.cortexia', 'test-docs'];
for (const dir of dangerousDirs) {
    const fullPath = path.join(__dirname, dir);
    if (fs.existsSync(fullPath)) {
        console.log(`  ${c.error('✗')} ${dir}/ 폴더가 존재합니다 — 삭제하세요!`);
        hasIssues = true;
    }
}

// ── 완료 ──

console.log(c.dim('  ─────────────────────────────────────────'));
if (!hasIssues) {
    console.log();
    console.log(c.success('  ✓ 빌드 완료. 배포 준비됨.'));
    console.log();
    console.log(c.dim('  배포:'));
    console.log(c.dim('    npm login'));
    console.log(c.dim('    npm publish'));
    console.log();
} else {
    console.log();
    console.log(c.error('  ✗ 문제가 있습니다. 위 내용을 확인하세요.'));
    console.log();
}
