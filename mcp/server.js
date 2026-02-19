#!/usr/bin/env node
/**
 * Cortexia MCP Server
 * ====================
 * 5 tools for Claude Code integration.
 */

const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const {
    CallToolRequestSchema,
    ListToolsRequestSchema,
} = require('@modelcontextprotocol/sdk/types.js');

const path = require('path');

// Load Cortexia with tier system
const { Cortexia } = require(path.join(__dirname, '..', 'index.js'));

const DATA_DIR = process.env.CORTEXIA_DATA_DIR || path.join(process.cwd(), '.cortexia');
const DOCS_DIR = process.env.CORTEXIA_DOCS_DIR || path.join(process.cwd(), '.cortexia_docs');
const USER_ID = process.env.CORTEXIA_USER_ID || 'cortexia_user';

const cortexia = new Cortexia({
    userId: USER_ID,
    dataDir: DATA_DIR,
    docsDir: DOCS_DIR,
});
const memory = cortexia.engine;

const server = new Server(
    { name: 'cortexia', version: '1.0.0' },
    { capabilities: { tools: {} } }
);

// ── Tool List ──

server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: [
        {
            name: 'cortexia_remember',
            description:
                'Store a memory in the brain. Memories strengthen with recall and fade over time (Ebbinghaus curve). ' +
                'Use for: decisions, code changes, user preferences, errors, important context.',
            inputSchema: {
                type: 'object',
                properties: {
                    input: { type: 'string', description: 'What to remember' },
                    response: { type: 'string', description: 'AI response (optional)' },
                    type: {
                        type: 'string',
                        description: 'Memory type',
                        enum: ['conversation', 'code', 'error', 'preference', 'decision'],
                    },
                    emotion: {
                        type: 'string',
                        description: 'Emotional state',
                        enum: ['happy', 'sad', 'anxious', 'angry', 'excited', 'calm', 'focused', 'tired', 'neutral'],
                    },
                    importance: { type: 'number', description: 'Importance 0-1 (higher = stronger memory)' },
                },
                required: ['input'],
            },
        },
        {
            name: 'cortexia_recall',
            description:
                'Search the brain for relevant memories. Also searches the document library automatically. ' +
                'Recalled memories get stronger. Always call this first to check previous context.',
            inputSchema: {
                type: 'object',
                properties: {
                    query: { type: 'string', description: 'Search query or topic' },
                    maxResults: { type: 'number', description: 'Max results (default: 5)' },
                },
                required: ['query'],
            },
        },
        {
            name: 'cortexia_state',
            description: 'Get brain status: emotions, personality, memory stats, library stats.',
            inputSchema: { type: 'object', properties: {} },
        },
        {
            name: 'cortexia_ingest',
            description: 'Add a document file to the library (.md, .txt). Documents are searchable via cortexia_recall.',
            inputSchema: {
                type: 'object',
                properties: {
                    filePath: { type: 'string', description: 'File path (.md, .txt)' },
                },
                required: ['filePath'],
            },
        },
        {
            name: 'cortexia_docs',
            description: 'Get library status: document count, sources, indexed words.',
            inputSchema: { type: 'object', properties: {} },
        },
    ],
}));

// ── Tool Execution ──

server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    try {
        switch (name) {
            case 'cortexia_remember': {
                const result = cortexia.remember({
                    input: args.input,
                    response: args.response || '',
                    type: args.type || 'conversation',
                    emotion: args.emotion || 'neutral',
                    importance: args.importance || 0.5,
                });
                return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
            }
            case 'cortexia_recall': {
                const result = await Promise.resolve(memory.recall(args.query, {
                    maxResults: args.maxResults || 5,
                }));
                return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
            }
            case 'cortexia_state': {
                const s = cortexia.stats();
                const d = cortexia.docs();
                const memLeft = s.memoryLimit === Infinity ? '∞' : (s.memoryLimit - s.totalMemories);
                const docSources = d.sources ? d.sources.length : 0;
                const docLeft = d.documentLimit === Infinity ? '∞' : (d.documentLimit - docSources);
                const result = {
                    tier: cortexia.tier,
                    limits: cortexia.limits,
                    remaining: {
                        memories: memLeft,
                        documents: docLeft,
                    },
                    usage: {
                        memories: s.memoryUsage,
                        documents: d.documentUsage,
                    },
                    emotion: memory.getEmotionState(),
                    personality: cortexia.personality(),
                    stats: s,
                    documents: d,
                };
                return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
            }
            case 'cortexia_ingest': {
                const result = cortexia.ingest(args.filePath);
                return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
            }
            case 'cortexia_docs': {
                const result = memory.getDocumentStats();
                return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
            }
            default:
                return { content: [{ type: 'text', text: `Unknown tool: ${name}` }], isError: true };
        }
    } catch (error) {
        return { content: [{ type: 'text', text: `Error: ${error.message}` }], isError: true };
    }
});

// ── Start ──

async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error('[Cortexia MCP] Server started v1.0.0');
    console.error(`[Cortexia MCP] Brain: ${DATA_DIR}`);
    console.error(`[Cortexia MCP] Library: ${DOCS_DIR}`);
}

main().catch(console.error);
