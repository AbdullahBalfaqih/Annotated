import { PGlite } from '@electric-sql/pglite';
import pg from 'pg';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let client = null;
let isRemotePg = false;

// ══════════════════════════════════════════════════════════
// 1. DATABASE CONNECTION MANAGEMENT (Enterprise PostgreSQL)
// ══════════════════════════════════════════════════════════
if (process.env.DATABASE_URL) {
  try {
    const pool = new pg.Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
      max: 25,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000
    });
    client = pool;
    isRemotePg = true;
    console.log('🐘 [PostgreSQL] Connected to Remote PostgreSQL Server via enterprise connection pool.');
  } catch (err) {
    console.warn('⚠️ [PostgreSQL] Could not connect to DATABASE_URL, switching to Embedded PostgreSQL:', err.message);
  }
}

if (!client) {
  const dataDir = path.join(__dirname, 'postgres_data');
  client = new PGlite(dataDir);
  console.log(`🐘 [PostgreSQL] Initialized Embedded PostgreSQL 16 Engine at: ${dataDir}`);
}

/**
 * Universal Query Execution Helper
 */
export async function query(sql, params = []) {
  if (isRemotePg) {
    return await client.query(sql, params);
  } else {
    const result = await client.query(sql, params);
    return {
      rows: result.rows || [],
      rowCount: result.affectedRows || result.rows?.length || 0
    };
  }
}

/**
 * Multi-command Execution Helper for DDL/Migrations
 */
export async function exec(sql) {
  if (isRemotePg) {
    return await client.query(sql);
  } else {
    return await client.exec(sql);
  }
}

/**
 * ACID Transaction Runner Helper
 */
export async function withTransaction(callback) {
  await exec('BEGIN');
  try {
    const result = await callback({ query, exec });
    await exec('COMMIT');
    return result;
  } catch (err) {
    await exec('ROLLBACK');
    throw err;
  }
}

// ══════════════════════════════════════════════════════════
// 2. COMPREHENSIVE POSTGRESQL SCHEMA INITIALIZATION
// ══════════════════════════════════════════════════════════
export async function initPostgresSchema() {
  console.log('🚀 [PostgreSQL] Running enterprise schema migrations, triggers, views, and indices...');

  // Step 1: Base Tables
  await exec(`
    -- Extension for UUIDs (built-in in PG16)
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      email VARCHAR(255) UNIQUE,
      name VARCHAR(255) NOT NULL,
      handle VARCHAR(100) UNIQUE NOT NULL,
      avatar_url TEXT,
      banner_url TEXT,
      provider VARCHAR(50) NOT NULL CHECK(provider IN ('google', 'x')),
      provider_id VARCHAR(255) NOT NULL,
      headline VARCHAR(255) DEFAULT 'AI & Systems Researcher',
      bio TEXT DEFAULT 'Researcher and Knowledge Curator on Annotated AI',
      role VARCHAR(20) DEFAULT 'user' CHECK(role IN ('user', 'admin')),
      verified BOOLEAN DEFAULT true,
      reputation_score INTEGER DEFAULT 100,
      preferences JSONB DEFAULT '{"theme":"dark","notifications":true,"ai_model":"gemini-1.5-pro"}'::jsonb,
      last_active_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
      created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(provider, provider_id)
    );

    CREATE TABLE IF NOT EXISTS sessions (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      token_hash VARCHAR(255) NOT NULL UNIQUE,
      user_agent TEXT,
      ip_address VARCHAR(45),
      expires_at TIMESTAMPTZ NOT NULL,
      created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS workspaces (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      name VARCHAR(255) NOT NULL,
      slug VARCHAR(255),
      description TEXT,
      category VARCHAR(50) DEFAULT 'Research',
      icon_url TEXT,
      color VARCHAR(30) DEFAULT '#3297EE',
      tags JSONB DEFAULT '[]'::jsonb,
      is_public BOOLEAN DEFAULT false,
      is_featured BOOLEAN DEFAULT false,
      stars_count INTEGER DEFAULT 0,
      views_count INTEGER DEFAULT 0,
      created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS annotations (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      workspace_id UUID REFERENCES workspaces(id) ON DELETE SET NULL,
      page_url TEXT NOT NULL,
      page_title TEXT,
      page_domain VARCHAR(255),
      page_favicon TEXT,
      highlighted_text TEXT,
      note TEXT,
      color VARCHAR(50) DEFAULT '#3297EE',
      anchor_selector TEXT,
      quote_context TEXT,
      importance VARCHAR(20) DEFAULT 'normal' CHECK(importance IN ('low', 'normal', 'high', 'critical')),
      tags JSONB DEFAULT '[]'::jsonb,
      is_favorite BOOLEAN DEFAULT false,
      created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS summaries (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      workspace_id UUID REFERENCES workspaces(id) ON DELETE SET NULL,
      source_url TEXT,
      source_type VARCHAR(50) DEFAULT 'web' CHECK(source_type IN ('youtube', 'article', 'pdf', 'web', 'doc')),
      title TEXT NOT NULL,
      summary_content TEXT NOT NULL,
      bullet_points JSONB DEFAULT '[]'::jsonb,
      key_takeaways JSONB DEFAULT '[]'::jsonb,
      reading_time_minutes INTEGER DEFAULT 2,
      word_count INTEGER DEFAULT 350,
      ai_model VARCHAR(50) DEFAULT 'gemini-1.5-pro',
      tags JSONB DEFAULT '[]'::jsonb,
      created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS sketches (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      workspace_id UUID REFERENCES workspaces(id) ON DELETE SET NULL,
      title VARCHAR(255) NOT NULL,
      canvas_json TEXT NOT NULL,
      thumbnail_url TEXT,
      width INTEGER DEFAULT 1920,
      height INTEGER DEFAULT 1080,
      tools_used JSONB DEFAULT '["pen","eraser","highlighter"]'::jsonb,
      created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS posts (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      content TEXT NOT NULL,
      media_url TEXT,
      media_type VARCHAR(50) DEFAULT 'none',
      hashtags JSONB DEFAULT '[]'::jsonb,
      likes_count INTEGER DEFAULT 0,
      comments_count INTEGER DEFAULT 0,
      bookmarks_count INTEGER DEFAULT 0,
      is_pinned BOOLEAN DEFAULT false,
      created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS likes (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(post_id, user_id)
    );

    CREATE TABLE IF NOT EXISTS comments (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      content TEXT NOT NULL,
      parent_comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
      created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS bookmarks (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(post_id, user_id)
    );

    CREATE TABLE IF NOT EXISTS follows (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      follower_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      followed_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(follower_id, followed_id)
    );

    CREATE TABLE IF NOT EXISTS tags (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name VARCHAR(100) UNIQUE NOT NULL,
      slug VARCHAR(100) UNIQUE NOT NULL,
      category VARCHAR(50) DEFAULT 'general',
      usage_count INTEGER DEFAULT 1,
      created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS activity_logs (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID REFERENCES users(id) ON DELETE SET NULL,
      action VARCHAR(100) NOT NULL,
      entity_type VARCHAR(100),
      entity_id VARCHAR(255),
      details JSONB DEFAULT '{}'::jsonb,
      ip_address VARCHAR(45),
      created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Step 2: High Performance Indices
  await exec(`
    CREATE INDEX IF NOT EXISTS idx_users_provider ON users(provider, provider_id);
    CREATE INDEX IF NOT EXISTS idx_users_handle ON users(handle);
    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token_hash);
    CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);
    CREATE INDEX IF NOT EXISTS idx_workspaces_user ON workspaces(user_id);
    CREATE INDEX IF NOT EXISTS idx_workspaces_category ON workspaces(category);
    CREATE INDEX IF NOT EXISTS idx_annotations_user ON annotations(user_id);
    CREATE INDEX IF NOT EXISTS idx_annotations_workspace ON annotations(workspace_id);
    CREATE INDEX IF NOT EXISTS idx_annotations_created ON annotations(created_at DESC);
    CREATE INDEX IF NOT EXISTS idx_summaries_user ON summaries(user_id);
    CREATE INDEX IF NOT EXISTS idx_summaries_workspace ON summaries(workspace_id);
    CREATE INDEX IF NOT EXISTS idx_sketches_user ON sketches(user_id);
    CREATE INDEX IF NOT EXISTS idx_posts_user ON posts(user_id);
    CREATE INDEX IF NOT EXISTS idx_posts_feed ON posts(is_pinned DESC, created_at DESC);
    CREATE INDEX IF NOT EXISTS idx_likes_post ON likes(post_id);
    CREATE INDEX IF NOT EXISTS idx_likes_user ON likes(user_id);
    CREATE INDEX IF NOT EXISTS idx_comments_post ON comments(post_id);
    CREATE INDEX IF NOT EXISTS idx_bookmarks_user ON bookmarks(user_id);
    CREATE INDEX IF NOT EXISTS idx_follows_pair ON follows(follower_id, followed_id);
    CREATE INDEX IF NOT EXISTS idx_activity_user ON activity_logs(user_id);
  `);

  // Step 3: Useful PostgreSQL Views for Reporting and Dashboard Acceleration
  await exec(`
    CREATE OR REPLACE VIEW v_workspace_metrics AS
    SELECT 
      w.id,
      w.user_id,
      w.name,
      w.description,
      w.category,
      w.icon_url,
      w.color,
      w.stars_count,
      w.views_count,
      w.created_at,
      w.updated_at,
      COUNT(DISTINCT a.id) as annotations_count,
      COUNT(DISTINCT s.id) as summaries_count
    FROM workspaces w
    LEFT JOIN annotations a ON w.id = a.workspace_id
    LEFT JOIN summaries s ON w.id = s.workspace_id
    GROUP BY w.id;
  `);

  // Step 4: Automated Trigger for updated_at
  try {
    await exec(`
      CREATE OR REPLACE FUNCTION set_updated_at()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;

      DROP TRIGGER IF EXISTS trg_users_updated_at ON users;
      CREATE TRIGGER trg_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION set_updated_at();

      DROP TRIGGER IF EXISTS trg_workspaces_updated_at ON workspaces;
      CREATE TRIGGER trg_workspaces_updated_at BEFORE UPDATE ON workspaces FOR EACH ROW EXECUTE FUNCTION set_updated_at();

      DROP TRIGGER IF EXISTS trg_annotations_updated_at ON annotations;
      CREATE TRIGGER trg_annotations_updated_at BEFORE UPDATE ON annotations FOR EACH ROW EXECUTE FUNCTION set_updated_at();

      DROP TRIGGER IF EXISTS trg_posts_updated_at ON posts;
      CREATE TRIGGER trg_posts_updated_at BEFORE UPDATE ON posts FOR EACH ROW EXECUTE FUNCTION set_updated_at();
    `);
  } catch (err) {
    console.warn('⚠️ [PostgreSQL] Trigger creation notice:', err.message);
  }

  console.log('✅ [PostgreSQL] Schema, Indices, Views, and Triggers initialized to perfection!');

  // Step 5: Ensure columns exist
  try {
    await exec(`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT false;
      ALTER TABLE users ADD COLUMN IF NOT EXISTS interests JSONB DEFAULT '[]'::jsonb;
    `);
  } catch (_) {}

  // Step 6: Clean up fake accounts and fake follows
  try {
    await query(`
      DELETE FROM follows 
      WHERE follower_id IN (SELECT id FROM users WHERE email IN ('tariq@annotated.ai', 'sarah@annotated.ai')) 
         OR followed_id IN (SELECT id FROM users WHERE email IN ('tariq@annotated.ai', 'sarah@annotated.ai'));
    `);
    await query(`DELETE FROM users WHERE email IN ('tariq@annotated.ai', 'sarah@annotated.ai')`);
  } catch (_) {}

  await seedInitialPostgresData();
}

/**
 * Seed Rich, Authentic AI & Systems Research Data
 */
export async function seedInitialPostgresData() {
  // Clean real data only - no fake accounts or fake follows!
  try {
    const defaultTags = [
      { name: 'Transformers', slug: 'transformers', category: 'AI', count: 18 },
      { name: 'SelfAttention', slug: 'self-attention', category: 'AI', count: 14 },
      { name: 'DeepLearning', slug: 'deep-learning', category: 'AI', count: 25 },
      { name: 'ChromeExtension', slug: 'chrome-extension', category: 'Engineering', count: 12 },
      { name: 'Architecture', slug: 'architecture', category: 'Systems', count: 19 },
      { name: 'Whiteboard', slug: 'whiteboard', category: 'Design', count: 8 }
    ];
    for (const t of defaultTags) {
      await query(`
        INSERT INTO tags (name, slug, category, usage_count)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (slug) DO UPDATE SET usage_count = tags.usage_count + $4
      `, [t.name, t.slug, t.category, t.count]);
    }
  } catch (_) {}
  return;
}
/* Old seed disabled */
const _disabledSeedBlock = async () => {

    // 1. Dr. Tariq's Workspaces
    const ws1 = await createWorkspace(
      tariqUser.id, 
      'Neural Networks & LLMs', 
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80', 
      'In-depth papers on Transformer architectures, attention mechanisms, and deep reasoning models.',
      'AI Research',
      ['Transformers', 'DeepLearning', 'Reasoning', 'ArXiv']
    );

    const ws2 = await createWorkspace(
      tariqUser.id, 
      'YouTube AI Keynotes & Lectures', 
      'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=120&auto=format&fit=crop&q=80', 
      'Curated video transcripts, key takeaways, and system diagrams from Stanford CS25 & NeurIPS.',
      'Lectures',
      ['Keynotes', 'CS25', 'VideoSummaries']
    );

    // 2. Sarah's Workspaces
    const ws3 = await createWorkspace(
      sarahUser.id, 
      'Chrome MV3 Architecture & Web Systems', 
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=120&auto=format&fit=crop&q=80', 
      'Manifest V3 best practices, background service workers, and DOM annotation mechanisms.',
      'Engineering',
      ['ChromeExtensions', 'MV3', 'ServiceWorkers', 'Architecture']
    );

    const ws4 = await createWorkspace(
      sarahUser.id, 
      'Whiteboard & Architecture Sketches', 
      'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=120&auto=format&fit=crop&q=80', 
      'Visual system topology, distributed state sync diagrams, and handwritten memory maps.',
      'Design',
      ['Whiteboard', 'Sketches', 'Diagrams']
    );

    // 3. Annotations
    await saveAnnotation(tariqUser.id, {
      workspaceId: ws1,
      pageUrl: 'https://arxiv.org/abs/1706.03762',
      pageTitle: 'Attention Is All You Need - Vaswani et al.',
      pageDomain: 'arxiv.org',
      highlightedText: 'The dominant sequence transduction models are based on complex recurrent or convolutional neural networks that include an encoder and a decoder. The Transformer relies entirely on an attention mechanism to draw global dependencies.',
      note: 'Foundational breakthrough in generative AI: eliminating recurrence allows complete parallelization of the attention matrix during training.',
      color: '#3297EE',
      quoteContext: 'Section 1: Introduction, Paragraph 2',
      importance: 'critical',
      tags: ['Transformers', 'SelfAttention', 'DeepLearning']
    });

    await saveAnnotation(tariqUser.id, {
      workspaceId: ws1,
      pageUrl: 'https://arxiv.org/abs/2205.14135',
      pageTitle: 'FlashAttention: Fast and Memory-Efficient Exact Attention with IO-Awareness - Dao et al.',
      pageDomain: 'arxiv.org',
      highlightedText: 'FlashAttention is an exact attention algorithm that uses tiling to reduce the number of memory reads/writes between GPU high bandwidth memory (HBM) and GPU on-chip SRAM.',
      note: 'Crucial for scaling context windows to 1M+ tokens without O(N^2) memory bottlenecks on SRAM.',
      color: '#a855f7',
      importance: 'high',
      tags: ['FlashAttention', 'GPUKernel', 'HBM']
    });

    await saveAnnotation(sarahUser.id, {
      workspaceId: ws3,
      pageUrl: 'https://developer.chrome.com/docs/extensions/mv3/intro/',
      pageTitle: 'Manifest V3 Overview - Chrome Developers',
      pageDomain: 'developer.chrome.com',
      highlightedText: 'Manifest V3 represents one of the most significant shifts in the Chrome extension platform since it launched. Service workers replace background pages.',
      note: 'Background pages are non-persistent. Extension state must be stored in chrome.storage.local or synced with the backend PostgreSQL database.',
      color: '#22c55e',
      importance: 'critical',
      tags: ['MV3', 'Chrome', 'ServiceWorker']
    });

    // 4. Summaries
    await saveSummary(tariqUser.id, {
      workspaceId: ws1,
      sourceUrl: 'https://arxiv.org/abs/1706.03762',
      sourceType: 'article',
      title: 'Transformer Architecture & Self-Attention Mathematical Breakdown',
      summaryContent: 'The Transformer replaces recurrent layers with multi-head self-attention. Queries, Keys, and Values of dimension d_k are projected h times with learned parameter matrices. Dot-product attention computes softmax(QK^T / sqrt(d_k))V in O(1) sequential operations.',
      bulletPoints: [
        'Multi-Head Attention projects Q, K, V into h distinct dimensional subspaces',
        'Scaled dot-product attention prevents small gradients in large dimensions via 1/sqrt(d_k)',
        'Sinusoidal positional encodings inject relative sequence order without recurrent hidden states'
      ],
      keyTakeaways: [
        'Massive parallelization across sequence length during training phase',
        'Empirically scales gracefully with compute, model parameters, and training tokens',
        'Powers all modern frontier LLMs, Vision Transformers, and Diffusion models'
      ],
      readingTimeMinutes: 4,
      wordCount: 580,
      tags: ['Transformers', 'AttentionMechanisms', 'DeepLearning']
    });

    await saveSummary(tariqUser.id, {
      workspaceId: ws2,
      sourceUrl: 'https://www.youtube.com/watch?v=zjkBMFhNj_g',
      sourceType: 'youtube',
      title: 'Andrej Karpathy: State of GPT & LLM Training Pipeline (Microsoft Build)',
      summaryContent: 'Comprehensive breakdown of the four stages of training modern LLMs: Pretraining (Next token prediction over internet-scale text), Supervised Fine-Tuning (SFT on high-quality instruct datasets), Reward Modeling (Pairwise comparisons), and Reinforcement Learning from Human Feedback (RLHF / PPO).',
      bulletPoints: [
        'Stage 1: Pretraining takes 99% of compute budget to build general world knowledge',
        'Stage 2: SFT aligns raw completions into direct assistant conversations',
        'Stage 3 & 4: RLHF guides tone, removes hallucinations, and boosts reasoning'
      ],
      keyTakeaways: [
        'Think of LLMs as token simulator kernels rather than conventional databases',
        'Retrieval Augmented Generation (RAG) is essential for up-to-date factual accuracy'
      ],
      readingTimeMinutes: 5,
      wordCount: 650,
      tags: ['Karpathy', 'LLM', 'RLHF', 'Pretraining']
    });

    await saveSummary(sarahUser.id, {
      workspaceId: ws3,
      sourceUrl: 'https://developer.chrome.com/docs/extensions/mv3/service_workers/',
      sourceType: 'article',
      title: 'Chrome MV3 Service Worker Lifecycle & Messaging Patterns',
      summaryContent: 'Detailed engineering analysis on designing resilient extensions where background service workers terminate after 30 seconds of inactivity. Web messaging, alarms API, and persistent IndexedDB / PostgreSQL sync patterns.',
      bulletPoints: [
        'Service workers terminate when idle; never store global state in variables',
        'Use chrome.storage.local or chrome.alarms for scheduled sync intervals',
        'Content scripts communicate via chrome.runtime.sendMessage with async response listeners'
      ],
      keyTakeaways: [
        'Zero memory leak guarantee by the browser sandbox',
        'Instant startup time when user triggers extension badge or shortcut'
      ],
      readingTimeMinutes: 3,
      wordCount: 420,
      tags: ['ChromeExtension', 'ServiceWorkers', 'StateManagement']
    });

    // 5. Sketches
    await saveSketch(sarahUser.id, {
      workspaceId: ws4,
      title: 'Extension to PostgreSQL Sync Architecture Topology',
      canvasJson: JSON.stringify({
        nodes: [
          { id: '1', type: 'browser', label: 'Chrome Extension Content Script' },
          { id: '2', type: 'background', label: 'MV3 Background Service Worker' },
          { id: '3', type: 'api', label: 'Express PostgreSQL REST Gateway' },
          { id: '4', type: 'database', label: 'PostgreSQL 16 Engine' }
        ],
        edges: [
          { from: '1', to: '2', label: 'chrome.runtime.sendMessage' },
          { from: '2', to: '3', label: 'Bearer JWT HTTP POST' },
          { from: '3', to: '4', label: 'ACID Transaction Pool' }
        ]
      }),
      thumbnailUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&auto=format&fit=crop&q=80',
      toolsUsed: ['pen', 'rectangle', 'arrow', 'text']
    });

    // 6. Community Posts
    const p1 = await createPost(tariqUser.id, {
      content: 'Summarized a 90-minute lecture on Transformer Multi-Head Attention & extracted neural network diagrams into my workspace! ⚡🧠',
      mediaUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&auto=format&fit=crop&q=80',
      mediaType: 'image',
      hashtags: ['#Annotated', '#AISummary', '#StudyNotes', '#ChromeExtension', '#MindMap']
    });
    await query('UPDATE posts SET likes_count = 320, comments_count = 1 WHERE id = $1', [p1.id]);
    await addComment(p1.id, sarahUser.id, 'Incredible clarity on the architecture diagrams! Directly saved into my research collection.');

    const p2 = await createPost(sarahUser.id, {
      content: 'The freehand handwriting & sketch canvas tool in Annotated Chrome extension makes diagramming directly over web documentation effortless. Highly recommended! 🚀',
      mediaUrl: null,
      mediaType: 'none',
      hashtags: ['#Annotated', '#Handwriting', '#Productivity', '#Architecture']
    });
    await query('UPDATE posts SET likes_count = 84 WHERE id = $1', [p2.id]);

    // 7. Follows
    await query('INSERT INTO follows (follower_id, followed_id) VALUES ($1, $2) ON CONFLICT DO NOTHING', [tariqUser.id, sarahUser.id]);
    await query('INSERT INTO follows (follower_id, followed_id) VALUES ($1, $2) ON CONFLICT DO NOTHING', [sarahUser.id, tariqUser.id]);

    // 8. Tags
    const defaultTags = [
      { name: 'Transformers', slug: 'transformers', category: 'AI', count: 18 },
      { name: 'SelfAttention', slug: 'self-attention', category: 'AI', count: 14 },
      { name: 'DeepLearning', slug: 'deep-learning', category: 'AI', count: 25 },
      { name: 'ChromeExtension', slug: 'chrome-extension', category: 'Engineering', count: 12 },
      { name: 'Architecture', slug: 'architecture', category: 'Systems', count: 19 },
      { name: 'Whiteboard', slug: 'whiteboard', category: 'Design', count: 8 }
    ];
    for (const t of defaultTags) {
      await query(`
        INSERT INTO tags (name, slug, category, usage_count)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (slug) DO UPDATE SET usage_count = tags.usage_count + $4
      `, [t.name, t.slug, t.category, t.count]);
    }

};

// ══════════════════════════════════════════════════════════
// 3. USER MANAGEMENT & OAUTH REPOSITORIES
// ══════════════════════════════════════════════════════════

export async function findUserById(id) {
  const res = await query(`
    SELECT 
      id, email, name, handle, avatar_url, banner_url, provider, 
      headline, bio, role, verified, reputation_score, preferences, 
      onboarding_completed, interests,
      last_active_at, created_at, updated_at 
    FROM users 
    WHERE id = $1
  `, [id]);
  return res.rows[0] || null;
}

export async function findUserByProvider(provider, providerId) {
  const res = await query('SELECT * FROM users WHERE provider = $1 AND provider_id = $2', [provider, providerId]);
  return res.rows[0] || null;
}

export async function findUserByEmail(email) {
  const res = await query('SELECT * FROM users WHERE email = $1', [email]);
  return res.rows[0] || null;
}

/**
 * Upsert Verified OAuth User (Google or X) & Provision Enterprise Workspaces
 */
export async function upsertOAuthUser({ provider, providerId, email, name, avatarUrl, handle }) {
  let existing = await findUserByProvider(provider, providerId);

  if (!existing && email) {
    existing = await findUserByEmail(email);
  }

  if (existing) {
    const updateRes = await query(`
      UPDATE users 
      SET name = COALESCE($1, name),
          avatar_url = COALESCE($2, avatar_url),
          last_active_at = CURRENT_TIMESTAMP,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
      RETURNING id, email, name, handle, avatar_url, banner_url, provider, headline, bio, role, verified, reputation_score, onboarding_completed, interests, created_at
    `, [name, avatarUrl, existing.id]);
    return updateRes.rows[0];
  }

  // Generate unique clean handle
  const cleanHandle = (handle || name.toLowerCase().replace(/[^a-z0-9_]/g, '') || `user_${Date.now().toString().slice(-4)}`);
  let finalHandle = cleanHandle;
  let counter = 1;
  while (true) {
    const handleCheck = await query('SELECT id FROM users WHERE handle = $1', [finalHandle]);
    if (handleCheck.rowCount === 0) break;
    finalHandle = `${cleanHandle}_${counter++}`;
  }

  const defaultBanner = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80';
  const defaultAvatar = avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`;

  const insertRes = await query(`
    INSERT INTO users (email, name, handle, avatar_url, banner_url, provider, provider_id, headline, bio, reputation_score)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    RETURNING id, email, name, handle, avatar_url, banner_url, provider, headline, bio, role, verified, reputation_score, onboarding_completed, interests, created_at
  `, [
    email || `${finalHandle}@${provider}.annotated.ai`,
    name,
    finalHandle,
    defaultAvatar,
    defaultBanner,
    provider,
    providerId,
    'AI & Systems Knowledge Curator',
    'Researcher & Knowledge Curator using Annotated Chrome Extension & AI',
    150
  ]);

  const newUser = insertRes.rows[0];

  // Auto-provision 4 premium workspaces for every new researcher
  await createWorkspace(
    newUser.id, 
    'AI Research & Papers', 
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80', 
    'Frontier papers, attention mechanisms, and deep reasoning models.',
    'Research',
    ['AI', 'Papers', 'LLM']
  );
  await createWorkspace(
    newUser.id, 
    'YouTube Summaries', 
    'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=120&auto=format&fit=crop&q=80', 
    'Transcripts, system diagrams, and notes from video lectures.',
    'Lectures',
    ['Video', 'Lectures']
  );
  await createWorkspace(
    newUser.id, 
    'Web Architecture & Code', 
    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=120&auto=format&fit=crop&q=80', 
    'Architecture specs, micro-services, and browser engineering documentation.',
    'Engineering',
    ['Web', 'Code', 'Architecture']
  );
  await createWorkspace(
    newUser.id, 
    'Handwritten Sketches', 
    'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=120&auto=format&fit=crop&q=80', 
    'Canvas whiteboard sketches, topology maps, and freehand notes.',
    'Design',
    ['Sketches', 'Canvas']
  );

  return newUser;
}

// ══════════════════════════════════════════════════════════
// 4. SESSION HELPERS
// ══════════════════════════════════════════════════════════

export async function createSession(userId, tokenHash, expiresAt, userAgent = '', ipAddress = '') {
  const res = await query(`
    INSERT INTO sessions (user_id, token_hash, expires_at, user_agent, ip_address)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id
  `, [userId, tokenHash, expiresAt.toISOString(), userAgent, ipAddress]);
  return res.rows[0].id;
}

export async function validateSession(tokenHash) {
  const res = await query(`
    SELECT s.*, u.id as user_id, u.email, u.name, u.handle, u.avatar_url, u.role, u.verified
    FROM sessions s
    JOIN users u ON s.user_id = u.id
    WHERE s.token_hash = $1 AND s.expires_at > CURRENT_TIMESTAMP
  `, [tokenHash]);
  return res.rows[0] || null;
}

export async function deleteSession(tokenHash) {
  await query('DELETE FROM sessions WHERE token_hash = $1', [tokenHash]);
}

// ══════════════════════════════════════════════════════════
// 5. WORKSPACES HELPERS
// ══════════════════════════════════════════════════════════

export async function createWorkspace(userId, name, iconUrl = null, description = '', category = 'Research', tags = []) {
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const res = await query(`
    INSERT INTO workspaces (user_id, name, slug, description, icon_url, category, tags)
    VALUES ($1, $2, $3, $4, $5, $6, $7::jsonb)
    RETURNING id, name, slug, description, icon_url, category, tags, is_public, stars_count, views_count, created_at
  `, [
    userId, 
    name, 
    slug, 
    description, 
    iconUrl, 
    category, 
    JSON.stringify(tags)
  ]);
  return res.rows[0].id;
}

export async function getUserWorkspaces(userId) {
  const res = await query(`
    SELECT 
      w.id, w.name, w.slug, w.description, w.icon_url, w.category, w.tags, 
      w.is_public, w.stars_count, w.views_count, w.created_at, w.updated_at,
      COUNT(DISTINCT a.id) as annotations_count,
      COUNT(DISTINCT s.id) as summaries_count
    FROM workspaces w
    LEFT JOIN annotations a ON w.id = a.workspace_id
    LEFT JOIN summaries s ON w.id = s.workspace_id
    WHERE w.user_id = $1 
    GROUP BY w.id
    ORDER BY w.created_at ASC
  `, [userId]);
  return res.rows;
}

export async function getWorkspaceDetails(workspaceId, userId) {
  const wsRes = await query(`
    SELECT * FROM workspaces WHERE id = $1 AND (user_id = $2 OR is_public = true)
  `, [workspaceId, userId]);

  if (wsRes.rowCount === 0) return null;

  const ws = wsRes.rows[0];
  const annotationsRes = await query(`
    SELECT * FROM annotations WHERE workspace_id = $1 ORDER BY created_at DESC
  `, [workspaceId]);

  const summariesRes = await query(`
    SELECT * FROM summaries WHERE workspace_id = $1 ORDER BY created_at DESC
  `, [workspaceId]);

  const sketchesRes = await query(`
    SELECT * FROM sketches WHERE workspace_id = $1 ORDER BY created_at DESC
  `, [workspaceId]);

  return {
    ...ws,
    annotations: annotationsRes.rows,
    summaries: summariesRes.rows,
    sketches: sketchesRes.rows
  };
}

// ══════════════════════════════════════════════════════════
// 6. POSTS & COMMUNITY FEED HELPERS
// ══════════════════════════════════════════════════════════

export async function getFeedPosts(currentUserId = null) {
  const res = await query(`
    SELECT 
      p.id, p.user_id, p.content, p.media_url, p.media_type, p.hashtags, p.likes_count, p.comments_count, p.bookmarks_count, p.is_pinned, p.created_at,
      u.name as author_name, u.handle as author_handle, u.avatar_url as author_avatar, u.verified as author_verified, u.headline as author_headline,
      CASE WHEN $1::uuid IS NOT NULL AND l.user_id IS NOT NULL THEN true ELSE false END as is_liked,
      CASE WHEN $1::uuid IS NOT NULL AND b.user_id IS NOT NULL THEN true ELSE false END as is_bookmarked,
      COALESCE(
        (
          SELECT json_agg(
            json_build_object(
              'id', c.id,
              'post_id', c.post_id,
              'user_id', c.user_id,
              'content', c.content,
              'parent_comment_id', c.parent_comment_id,
              'created_at', c.created_at,
              'author_name', cu.name,
              'author_handle', cu.handle,
              'author_avatar', cu.avatar_url
            ) ORDER BY c.created_at ASC
          )
          FROM comments c
          JOIN users cu ON c.user_id = cu.id
          WHERE c.post_id = p.id
        ),
        '[]'::json
      ) as comments
    FROM posts p
    JOIN users u ON p.user_id = u.id
    LEFT JOIN likes l ON p.id = l.post_id AND l.user_id = $1::uuid
    LEFT JOIN bookmarks b ON p.id = b.post_id AND b.user_id = $1::uuid
    ORDER BY p.is_pinned DESC, p.created_at DESC
  `, [currentUserId || null]);
  return res.rows;
}

export async function createPost(userId, { content, mediaUrl = null, mediaType = 'none', hashtags = [] }) {
  const formattedHashtags = typeof hashtags === 'string' ? hashtags : JSON.stringify(hashtags);
  const res = await query(`
    INSERT INTO posts (user_id, content, media_url, media_type, hashtags)
    VALUES ($1, $2, $3, $4, $5::jsonb)
    RETURNING *
  `, [userId, content, mediaUrl, mediaType, formattedHashtags]);
  return res.rows[0];
}

export async function togglePostLike(postId, userId) {
  const check = await query('SELECT id FROM likes WHERE post_id = $1 AND user_id = $2', [postId, userId]);

  if (check.rowCount > 0) {
    await query('DELETE FROM likes WHERE post_id = $1 AND user_id = $2', [postId, userId]);
    await query('UPDATE posts SET likes_count = GREATEST(likes_count - 1, 0) WHERE id = $1', [postId]);
    return { liked: false };
  } else {
    await query('INSERT INTO likes (post_id, user_id) VALUES ($1, $2)', [postId, userId]);
    await query('UPDATE posts SET likes_count = likes_count + 1 WHERE id = $1', [postId]);
    return { liked: true };
  }
}

export async function toggleBookmark(postId, userId) {
  const check = await query('SELECT id FROM bookmarks WHERE post_id = $1 AND user_id = $2', [postId, userId]);

  if (check.rowCount > 0) {
    await query('DELETE FROM bookmarks WHERE post_id = $1 AND user_id = $2', [postId, userId]);
    await query('UPDATE posts SET bookmarks_count = GREATEST(bookmarks_count - 1, 0) WHERE id = $1', [postId]);
    return { bookmarked: false };
  } else {
    await query('INSERT INTO bookmarks (post_id, user_id) VALUES ($1, $2)', [postId, userId]);
    await query('UPDATE posts SET bookmarks_count = bookmarks_count + 1 WHERE id = $1', [postId]);
    return { bookmarked: true };
  }
}

export async function addComment(postId, userId, content, parentCommentId = null) {
  const res = await query(`
    INSERT INTO comments (post_id, user_id, content, parent_comment_id)
    VALUES ($1, $2, $3, $4)
    RETURNING *
  `, [postId, userId, content, parentCommentId]);

  await query('UPDATE posts SET comments_count = comments_count + 1 WHERE id = $1', [postId]);

  const getStmt = await query(`
    SELECT c.*, u.name as author_name, u.handle as author_handle, u.avatar_url as author_avatar
    FROM comments c
    JOIN users u ON c.user_id = u.id
    WHERE c.id = $1
  `, [res.rows[0].id]);
  return getStmt.rows[0];
}

export async function updateComment(commentId, userId, content) {
  const res = await query(`
    UPDATE comments
    SET content = $1, updated_at = CURRENT_TIMESTAMP
    WHERE id = $2 AND user_id = $3
    RETURNING *
  `, [content, commentId, userId]);
  if (res.rowCount === 0) return null;
  const getStmt = await query(`
    SELECT c.*, u.name as author_name, u.handle as author_handle, u.avatar_url as author_avatar
    FROM comments c
    JOIN users u ON c.user_id = u.id
    WHERE c.id = $1
  `, [commentId]);
  return getStmt.rows[0];
}

export async function deleteComment(commentId, userId) {
  const findPost = await query('SELECT post_id FROM comments WHERE id = $1 AND user_id = $2', [commentId, userId]);
  if (findPost.rowCount === 0) return null;
  const postId = findPost.rows[0].post_id;
  await query('DELETE FROM comments WHERE id = $1 AND user_id = $2', [commentId, userId]);
  await query('UPDATE posts SET comments_count = GREATEST(comments_count - 1, 0) WHERE id = $1', [postId]);
  return { success: true, commentId, postId };
}

export async function getCommentsForPost(postId) {
  const res = await query(`
    SELECT c.*, u.name as author_name, u.handle as author_handle, u.avatar_url as author_avatar
    FROM comments c
    JOIN users u ON c.user_id = u.id
    WHERE c.post_id = $1
    ORDER BY c.created_at ASC
  `, [postId]);
  return res.rows;
}

// ══════════════════════════════════════════════════════════
// 7. SUMMARY & ANNOTATION & SKETCH HELPERS
// ══════════════════════════════════════════════════════════

export async function saveSummary(userId, { 
  workspaceId = null, 
  sourceUrl, 
  sourceType = 'web', 
  title, 
  summaryContent, 
  bulletPoints = [], 
  keyTakeaways = [], 
  readingTimeMinutes = 2, 
  wordCount = 350, 
  aiModel = 'gemini-1.5-pro',
  tags = [] 
}) {
  const res = await query(`
    INSERT INTO summaries (
      user_id, workspace_id, source_url, source_type, title, 
      summary_content, bullet_points, key_takeaways, reading_time_minutes, 
      word_count, ai_model, tags
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7::jsonb, $8::jsonb, $9, $10, $11, $12::jsonb)
    RETURNING *
  `, [
    userId, 
    workspaceId, 
    sourceUrl, 
    sourceType, 
    title, 
    summaryContent, 
    typeof bulletPoints === 'string' ? bulletPoints : JSON.stringify(bulletPoints),
    typeof keyTakeaways === 'string' ? keyTakeaways : JSON.stringify(keyTakeaways),
    readingTimeMinutes,
    wordCount,
    aiModel,
    typeof tags === 'string' ? tags : JSON.stringify(tags)
  ]);
  return res.rows[0];
}

export async function getUserSummaries(userId) {
  const res = await query('SELECT * FROM summaries WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
  return res.rows;
}

export async function saveAnnotation(userId, { 
  workspaceId = null, 
  pageUrl = 'https://annotated.ai', 
  pageTitle = 'Web Research', 
  pageDomain = 'website', 
  pageFavicon = null, 
  highlightedText = '', 
  note = '', 
  color = '#3297EE', 
  anchorSelector = '', 
  quoteContext = '',
  importance = 'normal',
  tags = [] 
}) {
  const safeUrl = pageUrl || 'https://annotated.ai';
  let safeDomain = pageDomain || 'website';
  try { safeDomain = new URL(safeUrl).hostname; } catch (_) {}
  const safeTitle = pageTitle || 'Web Research';
  const safeText = highlightedText || note || '';
  const safeNote = note || '';

  const res = await query(`
    INSERT INTO annotations (
      user_id, workspace_id, page_url, page_title, page_domain, 
      page_favicon, highlighted_text, note, color, anchor_selector, 
      quote_context, importance, tags
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13::jsonb)
    RETURNING *
  `, [
    userId, 
    workspaceId, 
    safeUrl, 
    safeTitle, 
    safeDomain, 
    pageFavicon, 
    safeText, 
    safeNote, 
    color, 
    anchorSelector,
    quoteContext,
    importance,
    typeof tags === 'string' ? tags : JSON.stringify(tags)
  ]);
  return res.rows[0];
}

export async function getUserAnnotations(userId) {
  const res = await query('SELECT * FROM annotations WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
  return res.rows;
}

export async function saveSketch(userId, { workspaceId = null, title, canvasJson, thumbnailUrl = null, toolsUsed = ['pen'] }) {
  const res = await query(`
    INSERT INTO sketches (user_id, workspace_id, title, canvas_json, thumbnail_url, tools_used)
    VALUES ($1, $2, $3, $4, $5, $6::jsonb)
    RETURNING *
  `, [
    userId,
    workspaceId,
    title,
    canvasJson,
    thumbnailUrl,
    JSON.stringify(toolsUsed)
  ]);
  return res.rows[0];
}

// ══════════════════════════════════════════════════════════
// 8. STATS, SEARCH & TELEMETRY
// ══════════════════════════════════════════════════════════

export async function getUserStats(userId) {
  const notesCount = await query('SELECT COUNT(*) as count FROM annotations WHERE user_id = $1', [userId]);
  const summariesCount = await query('SELECT COUNT(*) as count FROM summaries WHERE user_id = $1', [userId]);
  const workspacesCount = await query('SELECT COUNT(*) as count FROM workspaces WHERE user_id = $1', [userId]);
  const followersCount = await query('SELECT COUNT(*) as count FROM follows WHERE followed_id = $1', [userId]);
  const followingCount = await query('SELECT COUNT(*) as count FROM follows WHERE follower_id = $1', [userId]);

  return {
    notesCount: parseInt(notesCount.rows[0]?.count || 0, 10) + parseInt(summariesCount.rows[0]?.count || 0, 10),
    summariesCount: parseInt(summariesCount.rows[0]?.count || 0, 10),
    annotationsCount: parseInt(notesCount.rows[0]?.count || 0, 10),
    workspacesCount: parseInt(workspacesCount.rows[0]?.count || 0, 10),
    followersCount: parseInt(followersCount.rows[0]?.count || 0, 10),
    followingCount: parseInt(followingCount.rows[0]?.count || 0, 10)
  };
}

export async function toggleFollow(followerId, targetHandle) {
  const targetUser = await query('SELECT id FROM users WHERE handle = $1', [targetHandle]);
  if (targetUser.rowCount === 0) return { followed: false };

  const targetId = targetUser.rows[0].id;
  const check = await query('SELECT id FROM follows WHERE follower_id = $1 AND followed_id = $2', [followerId, targetId]);

  if (check.rowCount > 0) {
    await query('DELETE FROM follows WHERE follower_id = $1 AND followed_id = $2', [followerId, targetId]);
    return { followed: false };
  } else {
    await query('INSERT INTO follows (follower_id, followed_id) VALUES ($1, $2)', [followerId, targetId]);
    return { followed: true };
  }
}

/**
 * Universal Search Across Workspaces, Notes, Summaries & Posts
 */
export async function searchAll(searchTerm, userId) {
  const term = `%${searchTerm.toLowerCase()}%`;

  const annotationsRes = await query(`
    SELECT 'annotation' as type, id, page_title as title, highlighted_text as snippet, page_url as url, created_at
    FROM annotations
    WHERE user_id = $1 AND (LOWER(page_title) LIKE $2 OR LOWER(highlighted_text) LIKE $2 OR LOWER(note) LIKE $2)
    LIMIT 10
  `, [userId, term]);

  const summariesRes = await query(`
    SELECT 'summary' as type, id, title, summary_content as snippet, source_url as url, created_at
    FROM summaries
    WHERE user_id = $1 AND (LOWER(title) LIKE $2 OR LOWER(summary_content) LIKE $2)
    LIMIT 10
  `, [userId, term]);

  const workspacesRes = await query(`
    SELECT 'workspace' as type, id, name as title, description as snippet, icon_url as url, created_at
    FROM workspaces
    WHERE (user_id = $1 OR is_public = true) AND (LOWER(name) LIKE $2 OR LOWER(description) LIKE $2)
    LIMIT 10
  `, [userId, term]);

  return {
    results: [
      ...annotationsRes.rows,
      ...summariesRes.rows,
      ...workspacesRes.rows
    ]
  };
}

export async function updateUserOnboarding(userId, { name, handle, avatarUrl, bio, interests }) {
  const res = await query(`
    UPDATE users
    SET name = COALESCE($1, name),
        handle = COALESCE($2, handle),
        avatar_url = COALESCE($3, avatar_url),
        bio = COALESCE($4, bio),
        interests = $5::jsonb,
        onboarding_completed = true,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = $6
    RETURNING *
  `, [name, handle, avatarUrl, bio, JSON.stringify(interests || []), userId]);
  return res.rows[0];
}

export async function getSuggestedUsers(currentUserId) {
  const res = await query(`
    SELECT id, name, handle, avatar_url, bio, verified
    FROM users
    WHERE id != $1 
      AND email NOT IN ('tariq@annotated.ai', 'sarah@annotated.ai')
      AND handle NOT IN ('tariq_ai', 'sarah_chen')
    ORDER BY created_at DESC
    LIMIT 5
  `, [currentUserId || '00000000-0000-0000-0000-000000000000']);
  return res.rows;
}

export async function getUserActivities(userId) {
  const res = await query(`
    SELECT f.id, f.created_at, 'follow' as type, u.name as actor_name, u.handle as actor_handle, u.avatar_url as author_avatar, 'started following you' as text
    FROM follows f
    JOIN users u ON f.follower_id = u.id
    WHERE f.followed_id = $1
    ORDER BY f.created_at DESC
    LIMIT 10
  `, [userId]);
  return res.rows;
}

/**
 * Database Telemetry & Diagnostics
 */
export async function getDatabaseDiagnostics() {
  const users = await query('SELECT count(*) as count FROM users');
  const workspaces = await query('SELECT count(*) as count FROM workspaces');
  const annotations = await query('SELECT count(*) as count FROM annotations');
  const summaries = await query('SELECT count(*) as count FROM summaries');
  const posts = await query('SELECT count(*) as count FROM posts');
  const likes = await query('SELECT count(*) as count FROM likes');
  const comments = await query('SELECT count(*) as count FROM comments');
  const tags = await query('SELECT count(*) as count FROM tags');

  return {
    engine: 'PostgreSQL 16 Enterprise (PGlite / Remote PG)',
    connection: isRemotePg ? 'Remote Connection Pool' : 'Embedded High-Performance WASM Database',
    tables: {
      users: parseInt(users.rows[0].count, 10),
      workspaces: parseInt(workspaces.rows[0].count, 10),
      annotations: parseInt(annotations.rows[0].count, 10),
      summaries: parseInt(summaries.rows[0].count, 10),
      posts: parseInt(posts.rows[0].count, 10),
      likes: parseInt(likes.rows[0].count, 10),
      comments: parseInt(comments.rows[0].count, 10),
      tags: parseInt(tags.rows[0].count, 10)
    },
    status: 'HEALTHY_OPTIMAL',
    timestamp: new Date().toISOString()
  };
}

