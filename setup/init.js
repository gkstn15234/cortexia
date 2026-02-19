#!/usr/bin/env node
/**
 * cortexia init — Set up Cortexia for a project
 * Creates: .mcp.json, CLAUDE.md, .claude/hooks/
 */

const fs = require('fs');
const path = require('path');

const c = {
    brand:   (t) => `\x1b[38;2;99;102;241m${t}\x1b[0m`,
    success: (t) => `\x1b[38;2;52;211;153m${t}\x1b[0m`,
    dim:     (t) => `\x1b[38;2;107;114;128m${t}\x1b[0m`,
    text:    (t) => `\x1b[38;2;229;231;235m${t}\x1b[0m`,
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

const cwd = process.cwd();
const cortexiaPath = path.dirname(path.dirname(__dirname));

console.log();
console.log(c.brand('  ◉ Cortexia Init'));
console.log(c.dim('  ─────────────────────────────────────────'));

// 1. .mcp.json
const mcpConfig = {
    mcpServers: {
        cortexia: {
            command: 'node',
            args: [path.join('node_modules', 'cortexia', 'mcp', 'server.js')],
            env: {
                CORTEXIA_DATA_DIR: '.cortexia',
                CORTEXIA_DOCS_DIR: '.cortexia_docs',
                CORTEXIA_USER_ID: 'cortexia_user',
            },
        },
    },
};

const mcpPath = path.join(cwd, '.mcp.json');
if (fs.existsSync(mcpPath)) {
    // Merge with existing
    const existing = JSON.parse(fs.readFileSync(mcpPath, 'utf-8'));
    existing.mcpServers = existing.mcpServers || {};
    existing.mcpServers.cortexia = mcpConfig.mcpServers.cortexia;
    fs.writeFileSync(mcpPath, JSON.stringify(existing, null, 2));
    console.log(`  ${c.success('✓')} .mcp.json ${c.dim('updated')}`);
} else {
    fs.writeFileSync(mcpPath, JSON.stringify(mcpConfig, null, 2));
    console.log(`  ${c.success('✓')} .mcp.json ${c.dim('created')}`);
}

// 2. CLAUDE.md
const claudeMd = `# CLAUDE.md — Cortexia Brain Integration

## Rules: Always Use the Brain

### On Session Start
- **Always** call \`cortexia_recall\` to restore previous context
- Queries: "recent work", "project structure", "decisions"

### During Work
- Save important decisions with \`cortexia_remember\`
  - type: \`decision\` — architecture, tech choices
  - type: \`code\` — major code changes, bug fixes
  - type: \`preference\` — user preferences, coding style
  - type: \`error\` — errors and solutions
- importance: 1.0 (critical) → 0.4 (minor)

### Auto-Save (Every 5-10 Tool Calls)
- Save a work summary with cortexia_remember
- Include: what was done, what's next, changed files

### After Compression
- If context seems compressed, immediately:
  1. \`cortexia_recall("recent work")\`
  2. \`cortexia_recall("project structure")\`
  3. Continue working

### What to Save
- File structure changes
- Installed packages and reasons
- API design decisions
- User's preferred coding style
- Resolved errors and root causes
- TODOs and next steps

## Library (Document Store)
- Use \`cortexia_ingest\` when user asks to add documents
- \`cortexia_recall\` searches both brain AND library automatically

## Brain Info
- Brain data: \`.cortexia/\`
- Library data: \`.cortexia_docs/\`
`;

const claudeMdPath = path.join(cwd, 'CLAUDE.md');
if (!fs.existsSync(claudeMdPath)) {
    fs.writeFileSync(claudeMdPath, claudeMd);
    console.log(`  ${c.success('✓')} CLAUDE.md ${c.dim('created')}`);
} else {
    console.log(`  ${c.dim('  ─')} CLAUDE.md ${c.dim('already exists, skipped')}`);
}

// 3. Hooks directory
const hooksDir = path.join(cwd, '.claude', 'hooks');
if (!fs.existsSync(hooksDir)) {
    fs.mkdirSync(hooksDir, { recursive: true });
}

// Session start hook
const sessionStartHook = `#!/usr/bin/env node
const path = require('path');
try {
    const { Cortexia } = require(path.join(process.cwd(), 'node_modules', 'cortexia'));
    const brain = new Cortexia({ userId: 'cortexia_user', dataDir: '.cortexia', docsDir: '.cortexia_docs' });
    const s = brain.stats();
    const d = brain.docs();
    const r = brain.engine.recall('recent work', { maxResults: 3 });
    let ctx = '';
    if (r.results && r.results.length > 0) {
        ctx = '\\n\\nRecent memories:\\n' + r.results.map(m => '- [' + m.type + '] ' + m.input.substring(0, 200)).join('\\n');
    }
    console.log(JSON.stringify({
        systemMessage: '🧠 Cortexia connected. ' + s.totalMemories + ' memories, ' + d.totalChunks + ' doc chunks.' + ctx + '\\n\\nCall cortexia_recall to restore full context.'
    }));
} catch(e) { console.log(JSON.stringify({})); }
`;

const preCompactHook = `#!/usr/bin/env node
console.log(JSON.stringify({
    continue: true,
    systemMessage: "⚠️ Context compression starting! Immediately save with cortexia_remember: current task, completed items, remaining items, changed files, key decisions. importance: 1.0"
}));
`;

const autoSaveHook = `#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const f = path.join(process.cwd(), '.cortexia', '.counter');
let n = 0;
try { n = parseInt(fs.readFileSync(f, 'utf-8')); } catch {}
n++;
const dir = path.dirname(f);
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
fs.writeFileSync(f, n.toString());
if (n % 10 === 0) {
    console.log(JSON.stringify({ continue: true, systemMessage: '🧠 Auto-save checkpoint (' + n + ' responses). Save important context with cortexia_remember if needed.' }));
} else {
    console.log(JSON.stringify({}));
}
`;

fs.writeFileSync(path.join(hooksDir, 'session-start.js'), sessionStartHook);
fs.writeFileSync(path.join(hooksDir, 'pre-compact.js'), preCompactHook);
fs.writeFileSync(path.join(hooksDir, 'auto-save.js'), autoSaveHook);
console.log(`  ${c.success('✓')} .claude/hooks/ ${c.dim('created (3 hooks)')}`);

// 4. Settings.json
const settingsPath = path.join(cwd, '.claude', 'settings.json');
const settings = {
    hooks: {
        SessionStart: [{ hooks: [{ type: 'command', command: 'node .claude/hooks/session-start.js', timeout: 10 }] }],
        PreCompact: [{ hooks: [{ type: 'command', command: 'node .claude/hooks/pre-compact.js', timeout: 5 }] }],
        Stop: [{ hooks: [{ type: 'command', command: 'node .claude/hooks/auto-save.js', timeout: 5 }] }],
    },
};

fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
console.log(`  ${c.success('✓')} .claude/settings.json ${c.dim('created')}`);

// 5. Data directories
const dataDir = path.join(cwd, '.cortexia');
const docsDir = path.join(cwd, '.cortexia_docs');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
if (!fs.existsSync(docsDir)) fs.mkdirSync(docsDir, { recursive: true });
console.log(`  ${c.success('✓')} .cortexia/ ${c.dim('data directory ready')}`);

// Done
console.log(c.dim('  ─────────────────────────────────────────'));
console.log();
console.log(c.gradient('  ✓ Cortexia is ready.'));
console.log();
console.log(`  ${c.dim('Run')} ${c.text('claude')} ${c.dim('to start with persistent memory.')}`);
console.log(`  ${c.dim('Run')} ${c.text('cortexia status')} ${c.dim('to check brain state.')}`);
console.log();
