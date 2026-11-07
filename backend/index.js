const express = require('express');
const cors = require('cors');
const { initDb, getDb } = require('./db');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const isProduction = process.env.NODE_ENV === 'production';

// CORS allowlist. CORS_ORIGINS is a comma-separated list of exact origins
// (scheme://host[:port]). In development it defaults to the Vite dev/preview
// servers; in production no cross-origin requests are allowed unless configured.
const DEV_ORIGINS = ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:4173', 'http://127.0.0.1:4173'];
const allowedOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(',').map(origin => origin.trim().replace(/\/+$/, '')).filter(Boolean)
  : (isProduction ? [] : DEV_ORIGINS);

const app = express();
app.use(cors({
  // Requests without an Origin header (curl, same-origin, server-to-server) are not CORS requests.
  // Disallowed origins get no CORS headers, so the browser blocks the response.
  origin: (origin, callback) => callback(null, !origin || allowedOrigins.includes(origin)),
}));
app.use(express.json());

const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || (isProduction ? '' : 'local-development-secret');
if (!JWT_SECRET) throw new Error('JWT_SECRET must be set in production');

app.get('/api/health', async (req, res) => {
  try {
    res.json({ status: 'ok', message: 'Backend is running' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/auth/signup', async (req, res) => {
  const username = typeof req.body?.username === 'string' ? req.body.username.trim() : '';
  const password = typeof req.body?.password === 'string' ? req.body.password : '';
  const name = typeof req.body?.name === 'string' && req.body.name.trim().length > 0
    ? req.body.name.trim()
    : null;
  if (!username || password.length < 8) {
    return res.status(400).json({ error: 'Username is required and password must be at least 8 characters' });
  }
  if (username.length > 40 || password.length > 200) {
    return res.status(400).json({ error: 'Username must be 40 characters or fewer and password must be 200 characters or fewer' });
  }
  if (name && name.length > 100) {
    return res.status(400).json({ error: 'Name must be 100 characters or fewer' });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 12);
    const id = crypto.randomUUID();
    await getDb().run('INSERT INTO users (id, username, password, name) VALUES (?, ?, ?, ?)', [id, username, hashedPassword, name]);
    res.status(201).json({ message: 'User created', userId: id });
  } catch (err) {
    if (err.code === 'SQLITE_CONSTRAINT' || err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return res.status(409).json({ error: 'Username is already taken' });
    }
    res.status(500).json({ error: 'Could not create account' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const username = typeof req.body?.username === 'string' ? req.body.username.trim() : '';
  const password = typeof req.body?.password === 'string' ? req.body.password : '';
  if (!username || !password) return res.status(400).json({ error: 'Username and password required' });
  try {
    const user = await getDb().get('SELECT id, password, name FROM users WHERE username = ?', [username]);
    if (user && await bcrypt.compare(password, user.password)) {
      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
      res.json({ message: 'Login successful', token, userId: user.id, name: user.name ?? null });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Could not sign in' });
  }
});

// Middleware to verify JWT
const authenticate = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'No token provided' });

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ error: 'Invalid or expired token' });
    req.userId = decoded.userId;
    req.user = { id: decoded.userId };
    next();
  });
};

app.get('/api/user/profile', authenticate, async (req, res) => {
  try {
    const userId = req.user?.id || req.userId;
    const user = await getDb().get('SELECT id, username, name FROM users WHERE id = ?', [userId]);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({
      user: {
        id: user.id,
        username: user.username,
        name: user.name ?? null,
      },
    });
  } catch (err) {
    res.status(500).json({ error: 'Could not load user profile' });
  }
});

app.put('/api/user/profile', authenticate, async (req, res) => {
  const userId = req.user?.id || req.userId;
  const username = typeof req.body?.username === 'string' ? req.body.username.trim() : '';
  const currentPassword = typeof req.body?.currentPassword === 'string' ? req.body.currentPassword : '';

  if (!currentPassword) {
    return res.status(401).json({ error: 'Current password is required and must be correct' });
  }

  if (!username) {
    return res.status(400).json({ error: 'Username is required' });
  }

  if (username.length > 40) {
    return res.status(400).json({ error: 'Username must be 40 characters or fewer' });
  }

  if (typeof req.body?.name === 'string' && req.body.name.trim().length > 100) {
    return res.status(400).json({ error: 'Name must be 100 characters or fewer' });
  }

  try {
    const user = await getDb().get('SELECT id, password, name FROM users WHERE id = ?', [userId]);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Current password is required and must be correct' });
    }

    const existingUser = await getDb().get(
      'SELECT id FROM users WHERE username = ? AND id != ?',
      [username, userId]
    );
    if (existingUser) {
      return res.status(409).json({ error: 'Username already taken' });
    }

    const name = typeof req.body?.name === 'string'
      ? req.body.name.trim()
      : (req.body?.name === null ? null : (user.name ?? null));

    await getDb().run(
      'UPDATE users SET name = ?, username = ? WHERE id = ?',
      [name, username, userId]
    );

    res.json({
      user: {
        id: userId,
        username,
        name,
      },
    });
  } catch (err) {
    if (err.code === 'SQLITE_CONSTRAINT' || err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return res.status(409).json({ error: 'Username already taken' });
    }
    res.status(500).json({ error: 'Could not update profile' });
  }
});

app.post('/api/user/change-password', authenticate, async (req, res) => {
  const userId = req.user?.id || req.userId;
  const currentPassword = typeof req.body?.currentPassword === 'string' ? req.body.currentPassword : '';
  const newPassword = typeof req.body?.newPassword === 'string' ? req.body.newPassword : '';

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'Current password and new password are required' });
  }

  if (newPassword.length < 8) {
    return res.status(400).json({ error: 'New password must be at least 8 characters' });
  }

  if (newPassword.length > 200) {
    return res.status(400).json({ error: 'New password must be 200 characters or fewer' });
  }

  try {
    const user = await getDb().get('SELECT id, password FROM users WHERE id = ?', [userId]);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await getDb().run('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, userId]);

    res.json({
      success: true,
      message: 'Password updated successfully',
    });
  } catch (err) {
    res.status(500).json({ error: 'Could not update password' });
  }
});

app.post('/api/progress', authenticate, async (req, res) => {
  const progress = req.body?.progress;
  if (!progress || !Number.isInteger(progress.xp) || progress.xp < 0 || !Array.isArray(progress.lessons) || !Array.isArray(progress.badges)) {
    return res.status(400).json({ error: 'Progress must include non-negative XP and lesson and badge lists' });
  }
  const hasVideoProgress = progress.videoProgress !== undefined && progress.videoProgress !== null;
  if (hasVideoProgress && (typeof progress.videoProgress !== 'object' || Array.isArray(progress.videoProgress))) {
    return res.status(400).json({ error: 'videoProgress must be an object mapping lesson IDs to percentages' });
  }
  const sanitizedVideoProgress = hasVideoProgress
    ? Object.fromEntries(
        Object.entries(progress.videoProgress)
          .filter(([key, val]) => typeof key === 'string' && typeof val === 'number' && Number.isFinite(val))
          .map(([key, val]) => [key, Math.max(0, Math.min(100, Math.round(val)))])
      )
    : null;
  try {
    await getDb().run(
      'INSERT INTO progress (userId, xp, lessons, badges, videoProgress) VALUES (?, ?, ?, ?, ?) ON CONFLICT(userId) DO UPDATE SET xp=excluded.xp, lessons=excluded.lessons, badges=excluded.badges, videoProgress=COALESCE(excluded.videoProgress, progress.videoProgress)',
      [
        req.userId,
        progress.xp,
        JSON.stringify(progress.lessons),
        JSON.stringify(progress.badges),
        sanitizedVideoProgress ? JSON.stringify(sanitizedVideoProgress) : null,
      ]
    );
    res.json({ message: 'Progress saved', progress });
  } catch (err) {
    res.status(500).json({ error: 'Could not save progress' });
  }
});

app.get('/api/progress', authenticate, async (req, res) => {
  try {
    const row = await getDb().get('SELECT xp, lessons, badges, videoProgress FROM progress WHERE userId = ?', [req.userId]);
    if (row) {
      const payload = {
        xp: row.xp,
        lessons: JSON.parse(row.lessons),
        badges: JSON.parse(row.badges),
      };
      if (row.videoProgress) {
        payload.videoProgress = JSON.parse(row.videoProgress);
      }
      res.json(payload);
    } else {
      res.json({ xp: 0, lessons: [], badges: [] });
    }
  } catch (err) {
    res.status(500).json({ error: 'Could not load progress' });
  }
});

async function startServer() {
  await initDb();
  return app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

if (require.main === module) {
  startServer().catch(error => {
    console.error('Backend startup failed:', error);
    process.exitCode = 1;
  });
}

module.exports = { app, startServer };
