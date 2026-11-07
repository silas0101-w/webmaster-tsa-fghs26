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

  await t.test('profile endpoint requires authentication and returns user profile details', async () => {
    // 1. Unauthenticated request rejected with 401
    const unauth = await request('/api/user/profile');
    assert.equal(unauth.status, 401);
    assert.equal((await unauth.json()).error, 'No token provided');

    // 2. Invalid token rejected with 403
    const badToken = await request('/api/user/profile', {
      headers: { Authorization: 'Bearer invalid.token.payload' },
    });
    assert.equal(badToken.status, 403);
    assert.equal((await badToken.json()).error, 'Invalid or expired token');

    // 3. Authenticated request returns user profile (initially name is null)
    const authed = await request('/api/user/profile', {
      headers: { Authorization: `Bearer ${token}` },
    });
    assert.equal(authed.status, 200);
    const body = await authed.json();
    assert.ok(body.user);
    assert.ok(body.user.id);
    assert.equal(body.user.username, 'learner');
    assert.equal(body.user.name, null);
    // Security check: password hash must never be returned in profile
    assert.equal(body.user.password, undefined);
  });

  await t.test('profile update enforces authentication, current password confirmation, input validation, and unique username', async () => {
    const authHeaders = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };

    // 1. Unauthenticated request rejected
    const unauth = await request('/api/user/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'learner-renamed', name: 'Ada Lovelace', currentPassword: 'correct-horse-42' }),
    });
    assert.equal(unauth.status, 401);

    // 2. Missing currentPassword returns 401
    const missingPw = await request('/api/user/profile', {
      method: 'PUT',
      headers: authHeaders,
      body: JSON.stringify({ username: 'learner-renamed', name: 'Ada Lovelace' }),
    });
    assert.equal(missingPw.status, 401);
    assert.equal((await missingPw.json()).error, 'Current password is required and must be correct');

    // 3. Incorrect currentPassword returns 401 and does not update
    const wrongPw = await request('/api/user/profile', {
      method: 'PUT',
      headers: authHeaders,
      body: JSON.stringify({ username: 'learner-renamed', name: 'Ada Lovelace', currentPassword: 'wrong-password' }),
    });
    assert.equal(wrongPw.status, 401);
    assert.equal((await wrongPw.json()).error, 'Current password is required and must be correct');

    // Verify profile unchanged after failed attempt
    const verifyUnchanged = await request('/api/user/profile', {
      headers: { Authorization: `Bearer ${token}` },
    });
    assert.equal((await verifyUnchanged.json()).user.username, 'learner');

    // 4. Missing or empty username returns 400
    const emptyUsername = await request('/api/user/profile', {
      method: 'PUT',
      headers: authHeaders,
      body: JSON.stringify({ username: '', name: 'Ada Lovelace', currentPassword: 'correct-horse-42' }),
    });
    assert.equal(emptyUsername.status, 400);
    assert.equal((await emptyUsername.json()).error, 'Username is required');

    // 5. Excessive username length (>40 chars) returns 400
    const longUsername = await request('/api/user/profile', {
      method: 'PUT',
      headers: authHeaders,
      body: JSON.stringify({ username: 'a'.repeat(41), name: 'Ada Lovelace', currentPassword: 'correct-horse-42' }),
    });
    assert.equal(longUsername.status, 400);

    // 6. Username conflict handling: register another user and attempt collision
    const competitorSignup = await request('/api/auth/signup', json({ username: 'competitor', password: 'competitor-password' }));
    assert.equal(competitorSignup.status, 201);

    const conflict = await request('/api/user/profile', {
      method: 'PUT',
      headers: authHeaders,
      body: JSON.stringify({ username: 'competitor', name: 'Ada Lovelace', currentPassword: 'correct-horse-42' }),
    });
    assert.equal(conflict.status, 409);
    assert.equal((await conflict.json()).error, 'Username already taken');

    // 7. Successful update with valid current password
    const successUpdate = await request('/api/user/profile', {
      method: 'PUT',
      headers: authHeaders,
      body: JSON.stringify({ username: 'learner-renamed', name: 'Ada Lovelace', currentPassword: 'correct-horse-42' }),
    });
    assert.equal(successUpdate.status, 200);
    const updatedData = await successUpdate.json();
    assert.equal(updatedData.user.username, 'learner-renamed');
    assert.equal(updatedData.user.name, 'Ada Lovelace');
    assert.equal(updatedData.user.password, undefined);

    // 8. Verify persistence via GET /api/user/profile
    const persisted = await request('/api/user/profile', {
      headers: { Authorization: `Bearer ${token}` },
    });
    assert.equal(persisted.status, 200);
    const persistedData = await persisted.json();
    assert.equal(persistedData.user.username, 'learner-renamed');
    assert.equal(persistedData.user.name, 'Ada Lovelace');

    // 9. Keeping the same username while updating name succeeds (does not trigger self-conflict 409)
    const updateNameOnly = await request('/api/user/profile', {
      method: 'PUT',
      headers: authHeaders,
      body: JSON.stringify({ username: 'learner-renamed', name: 'Augusta Ada King', currentPassword: 'correct-horse-42' }),
    });
    assert.equal(updateNameOnly.status, 200);
    assert.equal((await updateNameOnly.json()).user.name, 'Augusta Ada King');
  });

  await t.test('password change validates input, enforces current password verification, and updates authentication credentials', async () => {
    const authHeaders = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };

    // 1. Unauthenticated request rejected with 401
    const unauth = await request('/api/user/change-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentPassword: 'correct-horse-42', newPassword: 'new-secure-password-42' }),
    });
    assert.equal(unauth.status, 401);

    // 2. Missing currentPassword or newPassword returns 400
    const missingBoth = await request('/api/user/change-password', {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({}),
    });
    assert.equal(missingBoth.status, 400);
    assert.equal((await missingBoth.json()).error, 'Current password and new password are required');

    const missingNew = await request('/api/user/change-password', {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({ currentPassword: 'correct-horse-42' }),
    });
    assert.equal(missingNew.status, 400);

    // 3. New password too short (<8 chars) returns 400
    const shortPw = await request('/api/user/change-password', {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({ currentPassword: 'correct-horse-42', newPassword: 'short' }),
    });
    assert.equal(shortPw.status, 400);
    assert.equal((await shortPw.json()).error, 'New password must be at least 8 characters');

    // 4. Incorrect current password returns 401 and does not change password
    const wrongCurrent = await request('/api/user/change-password', {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({ currentPassword: 'wrong-current-password', newPassword: 'new-secure-password-42' }),
    });
    assert.equal(wrongCurrent.status, 401);
    assert.equal((await wrongCurrent.json()).error, 'Current password is incorrect');

    // Verify old password still works for login
    const checkLoginOld = await request('/api/auth/login', json({ username: 'learner-renamed', password: 'correct-horse-42' }));
    assert.equal(checkLoginOld.status, 200);

    // 5. Successful password change with valid current and new password
    const successChange = await request('/api/user/change-password', {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({ currentPassword: 'correct-horse-42', newPassword: 'new-secure-password-42' }),
    });
    assert.equal(successChange.status, 200);
    const changeBody = await successChange.json();
    assert.equal(changeBody.success, true);
    assert.equal(changeBody.message, 'Password updated successfully');

    // 6. Login with old password now fails with 401
    const oldLoginFail = await request('/api/auth/login', json({ username: 'learner-renamed', password: 'correct-horse-42' }));
    assert.equal(oldLoginFail.status, 401);

    // 7. Login with new password succeeds and issues new token
    const newLoginSuccess = await request('/api/auth/login', json({ username: 'learner-renamed', password: 'new-secure-password-42' }));
    assert.equal(newLoginSuccess.status, 200);
    const newLoginBody = await newLoginSuccess.json();
    assert.ok(newLoginBody.token);

    // 8. Verify the new token can access authenticated profile endpoint
    const newProfileCheck = await request('/api/user/profile', {
      headers: { Authorization: `Bearer ${newLoginBody.token}` },
    });
    assert.equal(newProfileCheck.status, 200);
    assert.equal((await newProfileCheck.json()).user.username, 'learner-renamed');
  });

  await t.test('Milestone 2 Frontend Account System contracts (R1, R2, R3)', async () => {
    // R1: Sign-out Menu & Session contracts
    const loginRes = await request('/api/auth/login', json({ username: 'learner-renamed', password: 'new-secure-password-42' }));
    assert.equal(loginRes.status, 200);
    const session = await loginRes.json();
    assert.ok(session.token);
    assert.ok(session.userId);
    assert.equal(session.name, 'Augusta Ada King');

    // R2: Account Page Main View & Profile Details
    const profileRes = await request('/api/user/profile', {
      headers: { Authorization: `Bearer ${session.token}` },
    });
    assert.equal(profileRes.status, 200);
    const profile = await profileRes.json();
    assert.equal(profile.user.username, 'learner-renamed');
    assert.equal(profile.user.name, 'Augusta Ada King');

    // Editing without currentPassword fails with 401 and descriptive error
    const noPwRes = await request('/api/user/profile', {
      method: 'PUT',
      headers: { Authorization: `Bearer ${session.token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'learner-renamed', name: 'New Name' }),
    });
    assert.equal(noPwRes.status, 401);
    assert.equal((await noPwRes.json()).error, 'Current password is required and must be correct');

    // Editing with incorrect currentPassword fails with 401 and profile remains unchanged
    const badPwRes = await request('/api/user/profile', {
      method: 'PUT',
      headers: { Authorization: `Bearer ${session.token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'learner-renamed', name: 'New Name', currentPassword: 'wrong-password' }),
    });
    assert.equal(badPwRes.status, 401);
    assert.equal((await badPwRes.json()).error, 'Current password is required and must be correct');

    // Editing with correct currentPassword successfully updates and persists name and username
    const goodUpdateRes = await request('/api/user/profile', {
      method: 'PUT',
      headers: { Authorization: `Bearer ${session.token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'ada-lovelace', name: 'Countess of Lovelace', currentPassword: 'new-secure-password-42' }),
    });
    assert.equal(goodUpdateRes.status, 200);
    const updatedUser = (await goodUpdateRes.json()).user;
    assert.equal(updatedUser.username, 'ada-lovelace');
    assert.equal(updatedUser.name, 'Countess of Lovelace');

    // R3: Password Reset Tab
    // Missing required fields returns 400
    const missingFields = await request('/api/user/change-password', {
      method: 'POST',
      headers: { Authorization: `Bearer ${session.token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentPassword: 'new-secure-password-42' }),
    });
    assert.equal(missingFields.status, 400);

    // New password under 8 chars rejected with 400
    const shortNewPw = await request('/api/user/change-password', {
      method: 'POST',
      headers: { Authorization: `Bearer ${session.token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentPassword: 'new-secure-password-42', newPassword: 'short' }),
    });
    assert.equal(shortNewPw.status, 400);

    // Invalid current password rejected with 401
    const badCurrentPw = await request('/api/user/change-password', {
      method: 'POST',
      headers: { Authorization: `Bearer ${session.token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentPassword: 'incorrect-current-pw', newPassword: 'brand-new-password-123' }),
    });
    assert.equal(badCurrentPw.status, 401);

    // Valid current password + new password succeeds
    const goodPwdChange = await request('/api/user/change-password', {
      method: 'POST',
      headers: { Authorization: `Bearer ${session.token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentPassword: 'new-secure-password-42', newPassword: 'brand-new-password-123' }),
    });
    assert.equal(goodPwdChange.status, 200);
    assert.equal((await goodPwdChange.json()).success, true);
  });
});

after(async () => {
  if (server) await new Promise((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
  try { await getDb().close(); } catch {}
  await fs.rm(dataDir, { recursive: true, force: true });
});
