-- ════════════════════════════════════════════════════════════════
-- ANNOTATED AI - SUPABASE POSTGRESQL PRODUCTION SCHEMA & SEED DATA
-- Run this in Supabase Dashboard -> SQL Editor -> Click "Run"
-- ════════════════════════════════════════════════════════════════

-- 1. USERS TABLE
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
  interests JSONB DEFAULT '[]'::jsonb,
  onboarding_completed BOOLEAN DEFAULT false,
  role VARCHAR(20) DEFAULT 'user' CHECK(role IN ('user', 'admin')),
  verified BOOLEAN DEFAULT true,
  reputation_score INTEGER DEFAULT 100,
  preferences JSONB DEFAULT '{"theme":"dark","notifications":true,"ai_model":"gemini-1.5-pro"}'::jsonb,
  last_active_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(provider, provider_id)
);

-- 2. SESSIONS TABLE
CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash VARCHAR(255) NOT NULL UNIQUE,
  user_agent TEXT,
  ip_address VARCHAR(45),
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. WORKSPACES TABLE
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

-- 4. ANNOTATIONS TABLE
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

-- 5. SUMMARIES TABLE
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

-- 6. SKETCHES (CANVAS & DIAGRAMS) TABLE
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

-- 7. POSTS (COMMUNITY FEED) TABLE
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

-- 8. LIKES TABLE
CREATE TABLE IF NOT EXISTS likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(post_id, user_id)
);

-- 9. COMMENTS TABLE
CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  parent_comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 10. BOOKMARKS TABLE
CREATE TABLE IF NOT EXISTS bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(post_id, user_id)
);

-- 11. FOLLOWS TABLE
CREATE TABLE IF NOT EXISTS follows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  followed_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(follower_id, followed_id)
);

-- 12. TAGS TABLE
CREATE TABLE IF NOT EXISTS tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) UNIQUE NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  category VARCHAR(50) DEFAULT 'general',
  usage_count INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 13. ACTIVITY LOGS TABLE
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

-- INDICES
CREATE INDEX IF NOT EXISTS idx_users_provider ON users(provider, provider_id);
CREATE INDEX IF NOT EXISTS idx_users_handle ON users(handle);
CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token_hash);
CREATE INDEX IF NOT EXISTS idx_workspaces_user ON workspaces(user_id);
CREATE INDEX IF NOT EXISTS idx_annotations_user ON annotations(user_id);
CREATE INDEX IF NOT EXISTS idx_annotations_workspace ON annotations(workspace_id);
CREATE INDEX IF NOT EXISTS idx_summaries_user ON summaries(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_user ON posts(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_feed ON posts(is_pinned DESC, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_likes_post ON likes(post_id);
CREATE INDEX IF NOT EXISTS idx_comments_post ON comments(post_id);

-- VIEW FOR WORKSPACE METRICS
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

-- SEED AUTHENTIC RESEARCH DATA
INSERT INTO users (id, email, name, handle, avatar_url, banner_url, provider, provider_id, headline, bio, reputation_score)
VALUES 
  ('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', 'tariq@annotated.ai', 'Dr. Tariq Mansour', 'tariq_ai', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80', 'google', 'google_seed_tariq', 'Principal AI Architecture Researcher @ Annotated Labs', 'Researching Transformer acceleration, multi-modal knowledge distillation, and autonomous coding agents.', 840),
  ('b2c3d4e5-f6a7-4b6c-9d0e-1f2a3b4c5d6e', 'sarah@annotated.ai', 'Sarah Chen', 'sarah_chen', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80', 'x', 'x_seed_sarah', 'Staff Distributed Systems & Extension Architect', 'Specializing in Chrome MV3 sandboxed runtime, WebAssembly, and local vector indexing pipelines.', 920)
ON CONFLICT (provider, provider_id) DO NOTHING;

-- SEED WORKSPACES
INSERT INTO workspaces (id, user_id, name, slug, description, category, icon_url, tags)
VALUES
  ('c3d4e5f6-a7b8-4c7d-0e1f-2a3b4c5d6e7f', 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', 'Neural Networks & LLMs', 'neural-networks-llms', 'In-depth papers on Transformer architectures, attention mechanisms, and deep reasoning models.', 'AI Research', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80', '["Transformers","DeepLearning","ArXiv"]'::jsonb),
  ('d4e5f6a7-b8c9-4d8e-1f2a-3b4c5d6e7f8a', 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', 'YouTube AI Keynotes & Lectures', 'youtube-keynotes', 'Curated video transcripts, key takeaways, and system diagrams from Stanford CS25 & NeurIPS.', 'Lectures', 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=120&auto=format&fit=crop&q=80', '["Keynotes","VideoSummaries"]'::jsonb),
  ('e5f6a7b8-c9d0-4e9f-2a3b-4c5d6e7f8a9b', 'b2c3d4e5-f6a7-4b6c-9d0e-1f2a3b4c5d6e', 'Chrome MV3 Architecture & Web Systems', 'chrome-mv3', 'Manifest V3 best practices, background service workers, and DOM annotation mechanisms.', 'Engineering', 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=120&auto=format&fit=crop&q=80', '["ChromeExtensions","MV3","ServiceWorkers"]'::jsonb)
ON CONFLICT DO NOTHING;

-- SEED ANNOTATIONS
INSERT INTO annotations (user_id, workspace_id, page_url, page_title, page_domain, highlighted_text, note, color, importance, tags)
VALUES
  ('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', 'c3d4e5f6-a7b8-4c7d-0e1f-2a3b4c5d6e7f', 'https://arxiv.org/abs/1706.03762', 'Attention Is All You Need - Vaswani et al.', 'arxiv.org', 'The dominant sequence transduction models are based on complex recurrent or convolutional neural networks that include an encoder and a decoder.', 'Foundation of modern generative AI: replacing recurrent mechanisms with self-attention.', '#3297EE', 'critical', '["Transformers","Attention"]'::jsonb)
ON CONFLICT DO NOTHING;

-- SEED POSTS
INSERT INTO posts (user_id, content, media_url, media_type, hashtags, likes_count, comments_count)
VALUES
  ('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', 'Summarized a 90-minute lecture on Transformer Multi-Head Attention & extracted neural network diagrams into my workspace! ⚡🧠', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&auto=format&fit=crop&q=80', 'image', '["#Annotated","#AISummary","#StudyNotes","#ChromeExtension"]'::jsonb, 320, 1),
  ('b2c3d4e5-f6a7-4b6c-9d0e-1f2a3b4c5d6e', 'The freehand handwriting & sketch canvas tool in Annotated Chrome extension makes diagramming directly over web documentation effortless. Highly recommended! 🚀', null, 'none', '["#Annotated","#Handwriting","#Productivity"]'::jsonb, 84, 0)
ON CONFLICT DO NOTHING;

-- SEED TAGS
INSERT INTO tags (name, slug, category, usage_count)
VALUES
  ('PostgreSQL', 'postgresql', 'Database', 42),
  ('Transformers', 'transformers', 'AI', 28),
  ('DeepLearning', 'deep-learning', 'AI', 35),
  ('ChromeExtension', 'chrome-extension', 'Engineering', 22),
  ('Architecture', 'architecture', 'Systems', 26)
ON CONFLICT (slug) DO UPDATE SET usage_count = tags.usage_count + EXCLUDED.usage_count;
