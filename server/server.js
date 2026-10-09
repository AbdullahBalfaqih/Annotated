import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { 
  initPostgresSchema,
  findUserById, 
  getUserStats, 
  getUserWorkspaces, 
  getWorkspaceDetails,
  getFeedPosts, 
  createPost, 
  togglePostLike, 
  toggleBookmark,
  addComment, 
  updateComment,
  deleteComment,
  getCommentsForPost, 
  saveAnnotation, 
  getUserAnnotations, 
  saveSummary, 
  getUserSummaries, 
  toggleFollow, 
  getDatabaseDiagnostics,
  searchAll,
  query,
  updateUserOnboarding,
  getSuggestedUsers,
  getUserActivities
} from './db_postgres.js';

import { 
  requireAuth,
  getSupabaseOAuthUrl,
  verifyAndGetUser
} from './auth_oauth.js';

import { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, supabaseAdmin } from './supabase_client.js';

const app = express();
const PORT = process.env.PORT || 5000;
const APP_BASE_URL = process.env.APP_BASE_URL || 'http://localhost:3000';

// Security & Parsing Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Permissive CORS
app.use(cors({
  origin: (origin, callback) => callback(null, true),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Auth-Token', 'X-Extension-Id', 'X-User-Id']
}));

// Basic Security Headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// ══════════════════════════════════════════════════════════
// AUTHENTICATION & CONFIG ENDPOINTS
// ══════════════════════════════════════════════════════════

app.get('/api/auth/config', (req, res) => {
  res.json({
    supabaseUrl: SUPABASE_URL,
    supabaseKey: SUPABASE_PUBLISHABLE_KEY,
    providers: ['google', 'twitter'],
    callbackUrl: `${req.protocol}://${req.get('host')}/api/auth/callback`
  });
});

app.get('/api/auth/me', requireAuth, async (req, res) => {
  try {
    const userId = req.user?.id || req.user?.user_id;
    const user = await findUserById(userId);
    const stats = await getUserStats(userId);
    const workspaces = await getUserWorkspaces(userId);

    res.json({ success: true, user, stats, workspaces });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/auth/logout', requireAuth, async (req, res) => {
  try {
    if (req.supabaseToken) {
      await supabaseAdmin.auth.admin.signOut(req.supabaseToken, 'global').catch(() => {});
    }
    const userId = req.user?.id || req.user?.user_id;
    if (userId) {
      await query('DELETE FROM sessions WHERE user_id = $1', [userId]).catch(() => {});
    }
    res.json({ success: true, message: 'All user sessions revoked successfully' });
  } catch (err) {
    res.json({ success: true, message: 'Logged out' });
  }
});

app.post('/api/user/onboarding', requireAuth, async (req, res) => {
  try {
    const { name, handle, avatarUrl, bio, interests } = req.body;
    if (!handle || handle.trim().length < 3) {
      return res.status(400).json({ success: false, error: 'Username must be at least 3 characters.' });
    }
    const cleanHandle = handle.trim().toLowerCase();
    const userId = req.user?.id || req.user?.user_id;
    const updatedUser = await updateUserOnboarding(userId, {
      name: name?.trim(),
      handle: cleanHandle,
      avatarUrl: avatarUrl?.trim(),
      bio: bio?.trim(),
      interests: Array.isArray(interests) ? interests : []
    });
    res.json({ success: true, user: updatedUser, message: 'Profile onboarding completed successfully' });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.get('/api/users/suggested', requireAuth, async (req, res) => {
  try {
    const userId = req.user?.id || req.user?.user_id;
    const users = await getSuggestedUsers(userId);
    res.json({ success: true, users });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/activities', requireAuth, async (req, res) => {
  try {
    const userId = req.user?.id || req.user?.user_id;
    const activities = await getUserActivities(userId);
    res.json({ success: true, activities });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ══════════════════════════════════════════════════════════
// POSTS & COMMUNITY FEED
// ══════════════════════════════════════════════════════════

app.get('/api/posts', async (req, res) => {
  try {
    let currentUserId = null;
    const authHeader = req.headers.authorization;
    const customUserId = req.headers['x-user-id'];
    if (customUserId) {
      currentUserId = customUserId;
    } else if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const token = authHeader.split(' ')[1];
        if (token && !token.includes('.')) {
          currentUserId = token;
        } else {
          const user = await verifyAndGetUser(token);
          if (user) currentUserId = user.id || user.user_id;
        }
      } catch (_) {}
    }
    const posts = await getFeedPosts(currentUserId);
    res.json({ success: true, posts });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/posts', requireAuth, async (req, res) => {
  try {
    const { content, mediaUrl, mediaType, hashtags } = req.body;
    if (!content || !content.trim()) {
      return res.status(400).json({ success: false, error: 'Post content cannot be empty' });
    }
    const userId = req.user?.id || req.user?.user_id;
    const post = await createPost(userId, { content, mediaUrl, mediaType, hashtags });
    res.status(201).json({ success: true, post });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/posts/:id/like', requireAuth, async (req, res) => {
  try {
    const userId = req.user?.id || req.user?.user_id;
    const result = await togglePostLike(req.params.id, userId);
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/posts/:id/bookmark', requireAuth, async (req, res) => {
  try {
    const userId = req.user?.id || req.user?.user_id;
    const result = await toggleBookmark(req.params.id, userId);
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ══════════════════════════════════════════════════════════
// COMMENTS ENDPOINTS
// ══════════════════════════════════════════════════════════

app.get('/api/posts/:id/comments', async (req, res) => {
  try {
    const comments = await getCommentsForPost(req.params.id);
    res.json({ success: true, comments });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/posts/:id/comments', requireAuth, async (req, res) => {
  try {
    const { content, parentCommentId } = req.body;
    if (!content?.trim()) {
      return res.status(400).json({ success: false, error: 'Comment cannot be empty' });
    }
    const userId = req.user?.id || req.user?.user_id;
    const comment = await addComment(req.params.id, userId, content.trim(), parentCommentId || null);
    res.status(201).json({ success: true, comment });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.put('/api/comments/:id', requireAuth, async (req, res) => {
  try {
    const { content } = req.body;
    if (!content?.trim()) {
      return res.status(400).json({ success: false, error: 'Comment cannot be empty' });
    }
    const userId = req.user?.id || req.user?.user_id;
    const comment = await updateComment(req.params.id, userId, content.trim());
    if (!comment) {
      return res.status(404).json({ success: false, error: 'Comment not found or unauthorized' });
    }
    res.json({ success: true, comment });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete('/api/comments/:id', requireAuth, async (req, res) => {
  try {
    const userId = req.user?.id || req.user?.user_id;
    const result = await deleteComment(req.params.id, userId);
    if (!result) {
      return res.status(404).json({ success: false, error: 'Comment not found or unauthorized' });
    }
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ══════════════════════════════════════════════════════════
// WORKSPACES, SUMMARIES & ANNOTATIONS
// ══════════════════════════════════════════════════════════

app.get('/api/workspaces', requireAuth, async (req, res) => {
  try {
    const userId = req.user?.id || req.user?.user_id;
    const workspaces = await getUserWorkspaces(userId);
    res.json({ success: true, workspaces });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/summaries', requireAuth, async (req, res) => {
  try {
    const { title, url, summary_text, type, tags, key_takeaways } = req.body;
    const userId = req.user?.id || req.user?.user_id;
    const summary = await saveSummary(userId, {
      sourceUrl: url,
      sourceType: type || 'web',
      title: title || 'Untitled Summary',
      summaryContent: summary_text,
      keyTakeaways: JSON.stringify(key_takeaways || []),
      tags: JSON.stringify(tags || [])
    });
    res.status(201).json({ success: true, summary });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/summaries', requireAuth, async (req, res) => {
  try {
    const userId = req.user?.id || req.user?.user_id;
    const summaries = await getUserSummaries(userId);
    res.json({ success: true, summaries });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/annotations', requireAuth, async (req, res) => {
  try {
    const { 
      page_url, url, pageUrl,
      page_title, title, pageTitle,
      page_domain, domain, pageDomain,
      highlighted_text, highlightedText, selected_text, selectedText,
      note, comment, content,
      color,
      anchor_selector, anchorSelector,
      workspace_id, workspaceId,
      media_type, mediaType,
      tags,
      attached_media, attachedMediaType, attached_media_type
    } = req.body;

    const userId = req.user?.id || req.user?.user_id;
    const finalUrl = page_url || url || pageUrl || 'https://annotated.ai';
    let finalDomain = page_domain || domain || pageDomain || 'website';
    try { finalDomain = new URL(finalUrl).hostname; } catch (_) {}
    const finalTitle = page_title || title || pageTitle || 'Web Research';
    const finalHighlighted = highlighted_text || highlightedText || selected_text || selectedText || note || comment || content || '';
    const finalNote = note || comment || content || '';
    const finalMediaType = media_type || mediaType || 'article';

    const annotation = await saveAnnotation(userId, {
      workspaceId: workspace_id || workspaceId || null,
      pageUrl: finalUrl,
      pageTitle: finalTitle,
      pageDomain: finalDomain,
      highlightedText: finalHighlighted,
      note: finalNote,
      color: color || '#3297EE',
      anchorSelector: anchor_selector || anchorSelector || 'text',
      tags: tags || []
    });

    // Also automatically publish to community feed so it immediately appears in the platform feed
    let postContent = finalNote || '';
    if (finalHighlighted && finalHighlighted.trim()) {
      const cleanNoteWithoutPrefix = (finalNote || '').replace(/^\[Translation\]\s*:\s*/i, '').trim();
      const cleanHighlighted = finalHighlighted.trim();
      if (cleanNoteWithoutPrefix && cleanNoteWithoutPrefix !== cleanHighlighted) {
        postContent = `"${cleanHighlighted}"\n\n${finalNote}`.trim();
      } else if (!postContent) {
        postContent = `"${cleanHighlighted}"`;
      }
    }
    // Use attached media if present, otherwise default to the page URL
    const finalPostMediaUrl = attached_media || finalUrl;
    const finalPostMediaType = attached_media_type || attachedMediaType || (attached_media ? 'image' : finalMediaType);

    const post = await createPost(userId, {
      content: postContent,
      mediaUrl: finalPostMediaUrl,
      mediaType: finalPostMediaType,
      hashtags: ['annotation', 'research']
    }).catch(err => {
      console.warn('Feed post creation warning:', err.message);
      return null;
    });

    res.status(201).json({ success: true, annotation, post });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/annotations', requireAuth, async (req, res) => {
  try {
    const userId = req.user?.id || req.user?.user_id;
    const annotations = await getUserAnnotations(userId);
    res.json({ success: true, annotations });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/follows/:handle', requireAuth, async (req, res) => {
  try {
    const userId = req.user?.id || req.user?.user_id;
    const result = await toggleFollow(userId, req.params.handle);
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/workspaces/:id', requireAuth, async (req, res) => {
  try {
    const userId = req.user?.id || req.user?.user_id;
    const details = await getWorkspaceDetails(req.params.id, userId);
    if (!details) return res.status(404).json({ success: false, error: 'Workspace not found' });
    res.json({ success: true, workspace: details });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/search', requireAuth, async (req, res) => {
  try {
    const { q } = req.query;
    if (!q?.trim()) return res.json({ success: true, results: [] });
    const userId = req.user?.id || req.user?.user_id;
    const searchResults = await searchAll(q.trim(), userId);
    res.json({ success: true, ...searchResults });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/tags/trending', async (req, res) => {
  try {
    const tagsRes = await query('SELECT name, slug, category, usage_count FROM tags ORDER BY usage_count DESC LIMIT 15');
    res.json({ success: true, tags: tagsRes.rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/db/stats', async (req, res) => {
  try {
    const diagnostics = await getDatabaseDiagnostics();
    res.json({ success: true, diagnostics });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Messages routes
app.get('/api/messages/:userId', requireAuth, async (req, res) => {
  try {
    const currentUserId = req.user?.id || req.user?.user_id;
    const { userId } = req.params;
    const result = await query(`
      SELECT m.*, u.name as sender_name, u.avatar_url as sender_avatar 
      FROM messages m
      JOIN users u ON m.sender_id = u.id
      WHERE (m.sender_id = $1 AND m.receiver_id = $2)
         OR (m.sender_id = $2 AND m.receiver_id = $1)
      ORDER BY m.created_at ASC
    `, [currentUserId, userId]);
    res.json(result.rows);
  } catch (error) {
    console.error('Fetch messages error:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

app.post('/api/messages', requireAuth, async (req, res) => {
  try {
    const currentUserId = req.user?.id || req.user?.user_id;
    const { receiver_id, content } = req.body;
    const result = await query(`
      INSERT INTO messages (sender_id, receiver_id, content)
      VALUES ($1, $2, $3)
      RETURNING *
    `, [currentUserId, receiver_id, content]);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    database: 'Supabase PostgreSQL',
    auth: 'Supabase Auth (Real OAuth)',
    authProviders: ['google', 'twitter/x'],
    supabaseUrl: SUPABASE_URL,
    timestamp: new Date().toISOString()
  });
});

// Initialize and start
async function startServer() {
  try {
    await initPostgresSchema();
    app.listen(PORT, () => {
      console.log(`🚀 Annotated Backend on http://localhost:${PORT}`);
      console.log(`🔐 Auth: Supabase Real OAuth (Google + X)`);
      console.log(`📦 Database: Supabase PostgreSQL`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

startServer();
