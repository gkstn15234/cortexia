#!/usr/bin/env node
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
