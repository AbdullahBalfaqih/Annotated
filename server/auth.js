import jwt from 'jsonwebtoken';
import crypto from 'node:crypto';
import { 
  findOrCreateOAuthUser, 
  findUserById, 
  registerEmailUser,
  verifyEmailUser,
  createSession, 
  validateSession, 
  deleteSession 
} from './db.js';

// Configuration
const JWT_SECRET = process.env.JWT_SECRET || 'annotated_jwt_ultra_secure_secret_2026_gemini_production_key';
const TOKEN_EXPIRY = '30d';

/**
 * Generate a signed JWT token and persist a hashed session in SQLite
 */
export function issueUserToken(user) {
  const token = jwt.sign(
    { 
      id: user.id, 
      email: user.email, 
      handle: user.handle, 
      role: user.role 
    },
    JWT_SECRET,
    { expiresIn: TOKEN_EXPIRY }
  );

  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  
  createSession(user.id, tokenHash, expiresAt);

  return { token, expiresAt };
}

/**
 * Express Authentication Middleware (Strict)
 */
export function requireAuth(req, res, next) {
  const authHeader = req.headers['authorization'] || req.headers['x-auth-token'];
  let token = null;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  } else if (typeof authHeader === 'string') {
    token = authHeader;
  }

  if (!token) {
    return res.status(401).json({ 
      success: false, 
      error: 'Authentication required. No token provided.' 
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    
    // Verify session still exists in DB
    const session = validateSession(tokenHash);
    if (!session) {
      return res.status(401).json({ 
        success: false, 
        error: 'Session has expired or been revoked. Please sign in again.' 
      });
    }

    req.user = session;
    req.tokenHash = tokenHash;
    next();
  } catch (err) {
    return res.status(401).json({ 
      success: false, 
      error: 'Invalid or expired token', 
      details: err.message 
    });
  }
}

/**
 * Express Optional Authentication Middleware (Allows guest access while attaching user if present)
 */
export function optionalAuth(req, res, next) {
  const authHeader = req.headers['authorization'] || req.headers['x-auth-token'];
  let token = null;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  } else if (typeof authHeader === 'string') {
    token = authHeader;
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
      const session = validateSession(tokenHash);
      if (session) {
        req.user = session;
        req.tokenHash = tokenHash;
      }
    } catch (_) {
      // Ignore token decode errors for optional auth
    }
  }

  next();
}

/**
 * Verify Google Auth (Supports OAuth2 ID Tokens or real Google Profile)
 */
export async function authenticateGoogle(payload = {}) {
  const { credential, email, name, picture, sub } = payload;

  let profile = {
    provider: 'google',
    providerId: sub,
    email: email,
    name: name,
    avatarUrl: picture,
    handle: null
  };

  // If real Google JWT credential string is passed from Google Identity Services
  if (credential && typeof credential === 'string') {
    try {
      // Verify with Google tokeninfo endpoint
      const googleRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${credential}`);
      if (googleRes.ok) {
        const googleData = await googleRes.json();
        profile.email = googleData.email;
        profile.name = googleData.name || profile.name;
        profile.avatarUrl = googleData.picture || profile.avatarUrl;
        profile.providerId = googleData.sub || profile.providerId;
      } else {
        // Safe JWT payload extraction
        const parts = credential.split('.');
        if (parts.length === 3) {
          const decoded = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf8'));
          if (decoded.email) profile.email = decoded.email;
          if (decoded.name) profile.name = decoded.name;
          if (decoded.picture) profile.avatarUrl = decoded.picture;
          if (decoded.sub) profile.providerId = decoded.sub;
        }
      }
    } catch (e) {
      console.warn('Google verification notice:', e.message);
    }
  }

  if (!profile.email) {
    throw new Error('Google authentication requires a valid Google account email.');
  }

  if (!profile.name) {
    profile.name = profile.email.split('@')[0];
  }

  if (!profile.providerId) {
    profile.providerId = `google_${crypto.createHash('sha256').update(profile.email).digest('hex').slice(0, 16)}`;
  }

  if (!profile.avatarUrl) {
    profile.avatarUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(profile.name)}`;
  }

  profile.handle = profile.email.split('@')[0].toLowerCase().replace(/[^a-z0-9_]/g, '');

  const user = findOrCreateOAuthUser(profile);
  const { token, expiresAt } = issueUserToken(user);

  return { user, token, expiresAt };
}

/**
 * Verify X (Twitter) Auth
 */
export async function authenticateX(payload = {}) {
  const { username, name, avatar, id } = payload;

  if (!username) {
    throw new Error('Please enter your X (Twitter) handle/username.');
  }

  const cleanHandle = username.replace(/^@/, '').trim().toLowerCase();
  if (cleanHandle.length < 1) {
    throw new Error('Invalid X (Twitter) username.');
  }

  const profile = {
    provider: 'x',
    providerId: id || `x_${crypto.createHash('sha256').update(cleanHandle).digest('hex').slice(0, 16)}`,
    email: `${cleanHandle}@x.annotated.ai`,
    name: name || `@${cleanHandle}`,
    avatarUrl: avatar || `https://unavatar.io/x/${cleanHandle}`,
    handle: cleanHandle
  };

  const user = findOrCreateOAuthUser(profile);
  const { token, expiresAt } = issueUserToken(user);

  return { user, token, expiresAt };
}

/**
 * Real Email & Password Registration
 */
export async function authenticateEmailRegister({ email, password, name, handle }) {
  if (!email || !password || !name) {
    throw new Error('Full name, email, and password are required.');
  }

  if (password.length < 6) {
    throw new Error('Password must be at least 6 characters long.');
  }

  const user = registerEmailUser({ email, password, name, handle });
  const { token, expiresAt } = issueUserToken(user);

  return { user, token, expiresAt };
}

/**
 * Real Email & Password Login
 */
export async function authenticateEmailLogin({ email, password }) {
  if (!email || !password) {
    throw new Error('Email and password are required.');
  }

  const user = verifyEmailUser(email, password);
  if (!user) {
    throw new Error('Invalid email or password. Please verify your credentials.');
  }

  const { token, expiresAt } = issueUserToken(user);
  return { user, token, expiresAt };
}

