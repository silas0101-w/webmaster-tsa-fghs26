const { test, after } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');

const dataDir = path.join(os.tmpdir(), `field-guide-api-${process.pid}`);
process.env.DATABASE_PATH = path.join(dataDir, 'test.sqlite');
process.env.JWT_SECRET = 'test-only-secret-with-sufficient-length';
process.env.CORS_ORIGINS = 'http://localhost:3000, http://127.0.0.1:3000/';

const { app } = require('../index');
const { initDb, getDb } = require('../db');

let server;
let baseUrl;
let token;

test('API supports account and user-owned progress workflows', async t => {
  await fs.mkdir(dataDir, { recursive: true });
  await initDb();
  server = app.listen(0);
  await new Promise(resolve => server.once('listening', resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;

  const request = async (url, options) => fetch(`${baseUrl}${url}`, options);
  const json = body => ({ method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });

  await t.test('health route responds', async () => {
    const response = await request('/api/health');
    assert.equal(response.status, 200);
    assert.equal((await response.json()).status, 'ok');
  });

  await t.test('CORS allows configured development origins and omits headers for others', async () => {
    const preflight = origin => request('/api/progress', {
      method: 'OPTIONS',
      headers: { Origin: origin, 'Access-Control-Request-Method': 'POST', 'Access-Control-Request-Headers': 'authorization,content-type' },
    });
    const allowed = await preflight('http://localhost:3000');
    assert.equal(allowed.headers.get('access-control-allow-origin'), 'http://localhost:3000');
    const denied = await preflight('https://untrusted.example');
    assert.equal(denied.headers.get('access-control-allow-origin'), null);
  });

  await t.test('signup validates input and handles duplicate usernames', async () => {
    assert.equal((await request('/api/auth/signup', json({ username: 'learner', password: 'short' }))).status, 400);
    const created = await request('/api/auth/signup', json({ username: 'learner', password: 'correct-horse-42' }));
    assert.equal(created.status, 201);
    assert.equal((await request('/api/auth/signup', json({ username: 'learner', password: 'correct-horse-42' }))).status, 409);
  });

  await t.test('login rejects invalid credentials and issues a token for valid credentials', async () => {
    assert.equal((await request('/api/auth/login', json({ username: 'learner', password: 'wrong-password' }))).status, 401);
    const response = await request('/api/auth/login', json({ username: 'learner', password: 'correct-horse-42' }));
    assert.equal(response.status, 200);
    token = (await response.json()).token;
    assert.ok(token);
  });

  await t.test('progress requires authentication, validates payloads, and persists per token user', async () => {
    assert.equal((await request('/api/progress')).status, 401);
    const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
    assert.equal((await request('/api/progress', { method: 'POST', headers, body: JSON.stringify({ progress: { xp: -1, lessons: [], badges: [] } }) })).status, 400);
    const saved = await request('/api/progress', { method: 'POST', headers, body: JSON.stringify({ progress: { xp: 110, lessons: ['intro'], badges: ['basics'] } }) });
    assert.equal(saved.status, 200);
    const loaded = await request('/api/progress', { headers: { Authorization: `Bearer ${token}` } });
    assert.deepEqual(await loaded.json(), { xp: 110, lessons: ['intro'], badges: ['basics'] });
  });
});

after(async () => {
  if (server) await new Promise((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
  try { await getDb().close(); } catch {}
  await fs.rm(dataDir, { recursive: true, force: true });
});
