#!/usr/bin/env node
/**
 * Post-install message
 */

const c = {
    brand:   (t) => `\x1b[38;2;99;102;241m${t}\x1b[0m`,
    dim:     (t) => `\x1b[38;2;107;114;128m${t}\x1b[0m`,
    text:    (t) => `\x1b[38;2;229;231;235m${t}\x1b[0m`,
};

console.log();
console.log(c.brand('  ◉ Cortexia installed'));
console.log(c.dim('  Run `npx cortexia init` to set up persistent memory for Claude Code.'));
console.log();
