/**
 * C O R T E X I A
 * ================
 * Give any LLM a human-like brain.
 *
 * Free:       50 memories, 3 documents
 * Pro:        500 memories, 20 documents, personality, sleep
 * Business:   2,000 memories, 100 documents, hybrid mode
 * Enterprise: Unlimited, priority support, dedicated onboarding
 *
 * Purchase / 구매: https://open.kakao.com/o/gJVrRahi
 * Contact  / 문의: hangil9910@gmail.com
 */

const path = require('path');
const fs = require('fs');
const { SynapseMemory } = require(path.join(__dirname, 'core', 'engine.js'));
const { DocumentStore } = require(path.join(__dirname, 'core', 'document_store.js'));

// ═══════════════════════════════════════════════════════════════
//  License / Tier System
// ═══════════════════════════════════════════════════════════════

const TIERS = {
    free: {
        name: 'Free',
        maxMemories: 100,
        maxDocuments: 5,
        emotionSystem: true,
        personality: false,
        sleepConsolidation: false,
        hybridMode: false,
    },
    pro: {
        name: 'Pro',
        maxMemories: 1000,
        maxDocuments: 50,
        emotionSystem: true,
        personality: true,
        sleepConsolidation: true,
        hybridMode: false,
    },
    business: {
        name: 'Business',
        maxMemories: 5000,
        maxDocuments: 300,
        emotionSystem: true,
        personality: true,
        sleepConsolidation: true,
        hybridMode: true,
    },
    enterprise: {
        name: 'Enterprise',
        maxMemories: Infinity,
        maxDocuments: Infinity,
        emotionSystem: true,
        personality: true,
        sleepConsolidation: true,
        hybridMode: true,
        prioritySupport: true,
        dedicatedOnboarding: true,
    },
};

const KAKAO_LINK = 'https://open.kakao.com/o/gJVrRahi';

const UPGRADE_MSG = `
┌─────────────────────────────────────────────────────────────────────┐
│  ⚡ Cortexia — Usage limit reached (사용량 초과)                     │
│                                                                      │
│  Free        Pro           Business       Enterprise                 │
│  100 mem     1,000 mem     5,000 mem      Unlimited                  │
│  5 docs      50 docs       300 docs       Unlimited                  │
│  Emotions    +Personality   +Hybrid        +Priority Support         │
│              +Sleep                        +Dedicated Onboarding     │
│  ₩0          ₩29,900/mo    ₩49,900/mo     ₩149,900/mo               │
│                                                                      │
│  💬 Purchase / 구매: https://open.kakao.com/o/gJVrRahi               │
│     카카오톡 오픈채팅에서 구매하실 수 있습니다.                         │
│  📧 hangil9910@gmail.com                                               │
└─────────────────────────────────────────────────────────────────────┘`;

function loadLicense(dataDir) {
    try {
        const licensePath = path.join(dataDir, '.cortexia_license');
        if (fs.existsSync(licensePath)) {
            const data = JSON.parse(fs.readFileSync(licensePath, 'utf-8'));
            if (data.key && TIERS[data.tier]) {
                // TODO: Online validation
                return data.tier;
            }
        }
    } catch {}
    return 'free';
}

// ═══════════════════════════════════════════════════════════════
//  Cortexia Class
// ═══════════════════════════════════════════════════════════════

class Cortexia {
    /**
     * @param {Object} options
     * @param {string} options.userId       — Unique user identifier
     * @param {string} [options.dataDir]    — Brain data directory (default: .cortexia)
     * @param {string} [options.docsDir]    — Document store directory (default: .cortexia_docs)
     * @param {Function} [options.llm]      — LLM function: async (prompt) => string
     * @param {boolean} [options.hybrid]    — Enable hybrid mode (Pro only)
     * @param {string} [options.licenseKey] — Pro license key
     */
    constructor(options = {}) {
        const dataDir = options.dataDir || '.cortexia';

        // Determine tier
        this._tier = options.licenseKey
            ? (options.tier && TIERS[options.tier] ? options.tier : 'pro')
            : loadLicense(dataDir);
        this._limits = TIERS[this._tier];

        const opts = {
            userId: options.userId || 'default',
            dataDir: dataDir,
            documentsDir: options.docsDir || '.cortexia_docs',
        };

        if (options.llm) opts.llm = options.llm;

        // Hybrid mode — Business / Enterprise only
        if (options.hybrid) {
            if (this._tier !== 'business' && this._tier !== 'enterprise') {
                console.warn('[Cortexia] Hybrid mode requires Business or Enterprise.');
            } else {
                opts.hybrid = true;
            }
        }

        this._engine = new SynapseMemory(opts);

        // Token savings tracker
        this._dataDir = dataDir;
        this._tokenStatsPath = path.join(dataDir, '.cortexia_tokens');
        this._ts = this._loadTokenStats();
    }

    /** Current tier: 'free' or 'pro' */
    get tier() { return this._tier; }

    /** Current limits */
    get limits() { return { ...this._limits }; }

    /** Store a memory (free: max 50) */
    remember(data) {
        const stats = this._engine.getStats();
        if (stats.totalMemories >= this._limits.maxMemories) {
            console.warn(UPGRADE_MSG);
            return {
                success: false,
                error: `Memory limit reached (${this._limits.maxMemories}). Upgrade to Pro.`,
                upgrade: KAKAO_LINK,
            };
        }
        const result = this._engine.remember(data);

        // Track tokens stored
        if (result && result.success !== false) {
            const text = typeof data === 'string' ? data : (data.input || data.text || '');
            this._ts.tokensStored += this._estimateTokens(text);
            this._ts.memoriesCount++;
            this._saveTokenStats();
        }

        return result;
    }

    /** Recall memories (brain + documents) */
    recall(query, options) {
        const result = this._engine.recall(query, options);

        // Engine may return sync or async (Promise) depending on documentStore
        if (result && typeof result.then === 'function') {
            return result.then(r => {
                this._trackRecalledTokens(r);
                return r;
            });
        }

        this._trackRecalledTokens(result);
        return Promise.resolve(result);
    }

    /** Track tokens recalled = tokens user didn't have to re-type */
    _trackRecalledTokens(result) {
        try {
            const memories = (result && result.memories) || (Array.isArray(result) ? result : []);
            const docs = (result && result.documents) || [];
            let recalled = 0;
            for (const m of memories) {
                recalled += this._estimateTokens(m.input || m.text || '');
            }
            for (const d of docs) {
                recalled += this._estimateTokens(d.text || '');
            }
            if (recalled > 0) {
                this._ts.tokensRecalled += recalled;
                this._ts.recallCount++;
                this._saveTokenStats();
            }
        } catch {}
    }

    /** Ingest a document (free: max 3 files) */
    ingest(filePath, metadata) {
        const docs = this._engine.getDocumentStats();
        const sourceCount = docs.sources ? docs.sources.length : 0;
        if (sourceCount >= this._limits.maxDocuments) {
            console.warn(UPGRADE_MSG);
            return {
                success: false,
                error: `Document limit reached (${this._limits.maxDocuments} files). Upgrade to Pro.`,
                upgrade: KAKAO_LINK,
            };
        }
        const result = this._engine.ingest(filePath, metadata);

        // Track document tokens
        if (result && result.success) {
            this._ts.docsIngested++;
            this._ts.docChunksAdded += (result.chunksAdded || 0);
            this._saveTokenStats();
        }

        return result;
    }

    /** Get brain statistics */
    stats() {
        const s = this._engine.getStats();
        s.tier = this._tier;
        s.memoryLimit = this._limits.maxMemories;
        s.memoryUsage = `${s.totalMemories}/${this._limits.maxMemories === Infinity ? '∞' : this._limits.maxMemories}`;
        return s;
    }

    /** Token savings report */
    tokenSavings() {
        const docs = this._engine.getDocumentStats();
        // ~500 chars per chunk / 3 chars per token ≈ 170 tokens per chunk
        const docTokens = (docs.totalChunks || 0) * 170;
        const totalKnowledge = this._ts.tokensStored + docTokens;

        // Cost estimate: avg ~$5/M input tokens across models
        const costPerToken = 5 / 1000000;
        const estimatedSavings = this._ts.tokensRecalled * costPerToken;

        return {
            tokensStored: this._ts.tokensStored,
            tokensRecalled: this._ts.tokensRecalled,
            memoriesCount: this._ts.memoriesCount,
            recallCount: this._ts.recallCount,
            docsIngested: this._ts.docsIngested,
            docTokens,
            totalKnowledge,
            estimatedSavingsUSD: estimatedSavings.toFixed(4),
        };
    }

    // ── Token estimation ──

    _estimateTokens(text) {
        if (!text) return 0;
        // ~1 token per 3 chars (blended EN/KO estimate)
        return Math.ceil(text.length / 3);
    }

    _loadTokenStats() {
        try {
            if (fs.existsSync(this._tokenStatsPath)) {
                return JSON.parse(fs.readFileSync(this._tokenStatsPath, 'utf-8'));
            }
        } catch {}
        return { tokensStored: 0, tokensRecalled: 0, memoriesCount: 0, recallCount: 0, docsIngested: 0, docChunksAdded: 0 };
    }

    _saveTokenStats() {
        try {
            fs.writeFileSync(this._tokenStatsPath, JSON.stringify(this._ts));
        } catch {}
    }

    /** Get emotional state */
    emotion() {
        return this._engine.getEmotionState();
    }

    /** Get personality profile (Pro+) */
    personality() {
        if (this._tier === 'free') {
            return {
                available: false,
                message: 'Personality requires Pro or Business. / 성격 형성은 Pro 이상 플랜이 필요합니다.',
                upgrade: KAKAO_LINK,
            };
        }
        return this._engine.getPersonality();
    }

    /** Get document store statistics */
    docs() {
        const d = this._engine.getDocumentStats();
        d.tier = this._tier;
        d.documentLimit = this._limits.maxDocuments;
        d.documentUsage = `${d.sources ? d.sources.length : 0}/${this._limits.maxDocuments === Infinity ? '∞' : this._limits.maxDocuments}`;
        return d;
    }

    /** Sleep consolidation (Pro+) */
    sleep() {
        if (this._tier === 'free') {
            console.warn('[Cortexia] Sleep consolidation requires Pro or Business.');
            return {
                available: false,
                message: 'Sleep requires Pro or Business. / 수면 통합은 Pro 이상 플랜이 필요합니다.',
                upgrade: KAKAO_LINK,
            };
        }
        return this._engine.sleep();
    }

    /** Activate license (pro or business) */
    activate(licenseKey, tier = 'pro') {
        const validTier = TIERS[tier] ? tier : 'pro';
        const dataDir = this._engine.dataDir || '.cortexia';
        try {
            // TODO: Online validation
            const licensePath = path.join(dataDir, '.cortexia_license');
            fs.writeFileSync(licensePath, JSON.stringify({
                key: licenseKey,
                tier: validTier,
                activatedAt: new Date().toISOString(),
            }));
            this._tier = validTier;
            this._limits = TIERS[validTier];
            return { success: true, tier: validTier };
        } catch (err) {
            return { success: false, error: err.message };
        }
    }

    /** Access the raw engine (advanced) */
    get engine() {
        return this._engine;
    }
}

module.exports = { Cortexia, TIERS };
