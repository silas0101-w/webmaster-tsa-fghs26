const { test, describe, before, after } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

// Isolated ephemeral database and test configuration
const tempDir = path.join(os.tmpdir(), `adversarial-stress-${process.pid}-${Date.now()}`);
process.env.DATABASE_PATH = path.join(tempDir, 'test-adversarial.sqlite');
process.env.JWT_SECRET = 'adversarial-stress-testing-jwt-secret-key-32chars';
process.env.CORS_ORIGINS = 'http://localhost:3000,http://127.0.0.1:3000';

const { app } = require('../index');
const { initDb, getDb } = require('../db');

let server;
let baseUrl;

async function request(endpoint, options = {}) {
  const url = `${baseUrl}${endpoint}`;
  return fetch(url, options);
}

function jsonHeaders(token = null) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

async function signup(username, password, name = null) {
  const body = { username, password };
  if (name !== null) body.name = name;
  const res = await request('/api/auth/signup', {
    method: 'POST',
    headers: jsonHeaders(),
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  return { status: res.status, data };
}

async function login(username, password) {
  const res = await request('/api/auth/login', {
    method: 'POST',
    headers: jsonHeaders(),
    body: JSON.stringify({ username, password }),
  });
  const data = await res.json().catch(() => ({}));
  return { status: res.status, data, token: data.token };
}

describe('Tier 5 Adversarial Stress & Coverage Hardening Suite', () => {
  before(async () => {
    await fs.mkdir(tempDir, { recursive: true });
    await initDb();
    server = app.listen(0);
    await new Promise((resolve) => server.once('listening', resolve));
    baseUrl = `http://127.0.0.1:${server.address().port}`;
  });

  after(async () => {
    if (server) {
      await new Promise((resolve) => server.close(resolve));
    }
    try {
      await fs.rm(tempDir, { recursive: true, force: true });
    } catch {
      // Ignore cleanup error on Windows lock
    }
  });

  // =========================================================================
  // Challenge Area 1: High-Concurrency & Race Conditions
  // =========================================================================
  describe('Challenge 1: High-Concurrency & Race Condition Attacks', () => {
    test('Parallel conflicting username acquisition under simultaneous execution', async () => {
      // Setup 2 separate users
      const user1 = `racer1_${Date.now()}`;
      const user2 = `racer2_${Date.now()}`;
      const targetUser = `target_${Date.now()}`;
      const pass = 'Password123!';

      await signup(user1, pass, 'Racer One');
      await signup(user2, pass, 'Racer Two');

      const login1 = await login(user1, pass);
      const login2 = await login(user2, pass);

      assert.equal(login1.status, 200);
      assert.equal(login2.status, 200);

      // Launch simultaneous PUT requests claiming targetUser
      const req1 = request('/api/user/profile', {
        method: 'PUT',
        headers: jsonHeaders(login1.token),
        body: JSON.stringify({ username: targetUser, currentPassword: pass }),
      });
      const req2 = request('/api/user/profile', {
        method: 'PUT',
        headers: jsonHeaders(login2.token),
        body: JSON.stringify({ username: targetUser, currentPassword: pass }),
      });

      const [res1, res2] = await Promise.all([req1, req2]);
      const status1 = res1.status;
      const status2 = res2.status;

      // In SQLite, exactly one must win (200) and the other must be cleanly rejected with 409
      // Neither should crash with 500 or leave the DB locked
      const statuses = [status1, status2].sort();
      assert.deepEqual(statuses, [200, 409], `Expected exactly one 200 and one 409, got ${status1} and ${status2}`);

      // Confirm DB is consistent
      const dbUser = await getDb().get('SELECT id, username FROM users WHERE username = ?', [targetUser]);
      assert.ok(dbUser);
    });

    test('Rapid burst of 10 concurrent profile updates from single user maintains consistency without lock crash', async () => {
      const user = `burst_${Date.now()}`;
      const pass = 'BurstPassword123!';
      await signup(user, pass, 'Initial Name');
      const auth = await login(user, pass);

      // Fire 10 parallel updates updating name to sequential values
      const promises = Array.from({ length: 10 }, (_, i) =>
        request('/api/user/profile', {
          method: 'PUT',
          headers: jsonHeaders(auth.token),
          body: JSON.stringify({ username: user, name: `Name Update ${i}`, currentPassword: pass }),
        })
      );

      const responses = await Promise.all(promises);
      for (const res of responses) {
        assert.equal(res.status, 200, `Expected 200 for each concurrent update, got ${res.status}`);
      }

      // Check final state in DB
      const finalRow = await getDb().get('SELECT username, name FROM users WHERE username = ?', [user]);
      assert.equal(finalRow.username, user);
      assert.match(finalRow.name, /^Name Update \d$/);
    });

    test('Simultaneous profile update and password change collision test', async () => {
      const user = `collision_${Date.now()}`;
      const oldPass = 'OldPass123!';
      const newPass = 'NewPass123!';
      await signup(user, oldPass, 'Collision Tester');
      const auth = await login(user, oldPass);

      // Simultaneously update profile and change password
      const profilePromise = request('/api/user/profile', {
        method: 'PUT',
        headers: jsonHeaders(auth.token),
        body: JSON.stringify({ username: `${user}_mod`, name: 'Updated Collision', currentPassword: oldPass }),
      });

      const pwdPromise = request('/api/user/change-password', {
        method: 'POST',
        headers: jsonHeaders(auth.token),
        body: JSON.stringify({ currentPassword: oldPass, newPassword: newPass }),
      });

      const [profRes, pwdRes] = await Promise.all([profilePromise, pwdPromise]);
      // Both should succeed because both verified against oldPass
      assert.equal(profRes.status, 200);
      assert.equal(pwdRes.status, 200);

      // Re-verifying credentials: new password must now be required
      const postCheck1 = await login(`${user}_mod`, newPass);
      assert.equal(postCheck1.status, 200);

      const postCheckOld = await login(`${user}_mod`, oldPass);
      assert.equal(postCheckOld.status, 401);
    });
  });

  // =========================================================================
  // Challenge Area 2: Type Confusion & Malicious Payload Hardening
  // =========================================================================
  describe('Challenge 2: Type Confusion, Prototype Pollution & Malicious Body Hardening', () => {
    let testToken;
    const standardPass = 'ValidSecret123!';
    const standardUser = 'type_target_user';

    before(async () => {
      await signup(standardUser, standardPass, 'Target');
      const auth = await login(standardUser, standardPass);
      testToken = auth.token;
    });

    test('Prototype pollution attempt in JSON body does not pollute Object prototype or bypass validation', async () => {
      const payload = {
        __proto__: { isAdmin: true, bypass: true },
        constructor: { prototype: { admin: true } },
        username: standardUser,
        currentPassword: standardPass,
        name: 'Normal Name',
      };

      const res = await request('/api/user/profile', {
        method: 'PUT',
        headers: jsonHeaders(testToken),
        body: JSON.stringify(payload),
      });

      assert.equal(res.status, 200);
      // Ensure Object prototype was NOT polluted
      const cleanObj = {};
      assert.equal(cleanObj.isAdmin, undefined);
      assert.equal(cleanObj.bypass, undefined);
      assert.equal(cleanObj.admin, undefined);
    });

    test('Non-primitive / invalid data types for currentPassword return 401 instead of crashing with 500', async () => {
      const weirdPasswordTypes = [
        12345678,
        ['array', 'password'],
        { pass: 'nested' },
        true,
        null,
      ];

      for (const weird of weirdPasswordTypes) {
        const res = await request('/api/user/profile', {
          method: 'PUT',
          headers: jsonHeaders(testToken),
          body: JSON.stringify({
            username: standardUser,
            currentPassword: weird,
          }),
        });
        assert.equal(
          res.status,
          401,
          `Expected 401 for password type ${typeof weird}, got ${res.status}`
        );
      }
    });

    test('Non-primitive / invalid data types for username return 400 instead of crashing with 500', async () => {
      const weirdUsernames = [
        123456,
        ['user'],
        { name: 'user' },
        null,
        false,
      ];

      for (const weird of weirdUsernames) {
        const res = await request('/api/user/profile', {
          method: 'PUT',
          headers: jsonHeaders(testToken),
          body: JSON.stringify({
            username: weird,
            currentPassword: standardPass,
          }),
        });
        assert.equal(
          res.status,
          400,
          `Expected 400 for username type ${typeof weird}, got ${res.status}`
        );
      }
    });

    test('Non-primitive / invalid data types in password reset body return 400 or 401', async () => {
      // 1. Array in newPassword
      const res1 = await request('/api/user/change-password', {
        method: 'POST',
        headers: jsonHeaders(testToken),
        body: JSON.stringify({
          currentPassword: standardPass,
          newPassword: ['invalid', 'array'],
        }),
      });
      assert.equal(res1.status, 400);

      // 2. Object in currentPassword
      const res2 = await request('/api/user/change-password', {
        method: 'POST',
        headers: jsonHeaders(testToken),
        body: JSON.stringify({
          currentPassword: { pass: standardPass },
          newPassword: 'ValidNewPass123!',
        }),
      });
      assert.equal(res2.status, 400);
    });

    test('Handling of non-JSON and malformed body payloads without server death', async () => {
      // 1. Empty body with JSON header
      const resEmpty = await request('/api/user/profile', {
        method: 'PUT',
        headers: jsonHeaders(testToken),
        body: '',
      });
      assert.equal(resEmpty.status, 401); // Express json parser defaults empty body to {}, so missing password correctly triggers 401

      // 2. Malformed JSON syntax
      const resMalformed = await request('/api/user/profile', {
        method: 'PUT',
        headers: jsonHeaders(testToken),
        body: '{"username": "broken", currentPassword: ',
      });
      assert.equal(resMalformed.status, 400);
    });
  });

  // =========================================================================
  // Challenge Area 3: Exotic Unicode & Boundary Edge Cases
  // =========================================================================
  describe('Challenge 3: Unicode Edge Cases, Null Bytes & Surrogates', () => {
    let token;
    const unicodePass = 'P@ssw0rd_🔑_2026';
    const unicodeUser = 'uni_challenger';

    before(async () => {
      await signup(unicodeUser, unicodePass, 'Unicode Star ⭐');
      const auth = await login(unicodeUser, unicodePass);
      token = auth.token;
    });

    test('Multi-byte emoji grapheme clusters in user name', async () => {
      // Grapheme cluster: family emoji (multiple codepoints joined with ZWJ)
      const familyEmojiName = 'Dr. 👨‍👩‍👧‍👦 Researcher';
      const res = await request('/api/user/profile', {
        method: 'PUT',
        headers: jsonHeaders(token),
        body: JSON.stringify({
          username: unicodeUser,
          name: familyEmojiName,
          currentPassword: unicodePass,
        }),
      });
      assert.equal(res.status, 200);
      const data = await res.json();
      assert.equal(data.user.name, familyEmojiName);

      // Verify DB persistence
      const profileRes = await request('/api/user/profile', {
        headers: jsonHeaders(token),
      });
      assert.equal((await profileRes.json()).user.name, familyEmojiName);
    });

    test('Right-to-Left (RTL) Arabic & Hebrew script with bidirectional markers in name', async () => {
      const bidiName = 'مرحبا بالعالم \u200F(Hello World)';
      const res = await request('/api/user/profile', {
        method: 'PUT',
        headers: jsonHeaders(token),
        body: JSON.stringify({
          username: unicodeUser,
          name: bidiName,
          currentPassword: unicodePass,
        }),
      });
      assert.equal(res.status, 200);
      assert.equal((await res.json()).user.name, bidiName);
    });

    test('Zero-width space and control character handling in name and username', async () => {
      // Name with zero-width space
      const zwspName = 'Hidden\u200BSpace';
      const res = await request('/api/user/profile', {
        method: 'PUT',
        headers: jsonHeaders(token),
        body: JSON.stringify({
          username: unicodeUser,
          name: zwspName,
          currentPassword: unicodePass,
        }),
      });
      assert.equal(res.status, 200);
      assert.equal((await res.json()).user.name, zwspName);
    });

    test('Password containing exotic symbols, spaces, and emojis hashes and verifies strictly', async () => {
      const complexPass = '🔒 Secure🔑 Key With Spaces & Accents éàç! 2026';
      // Change password to complex Unicode string
      const changeRes = await request('/api/user/change-password', {
        method: 'POST',
        headers: jsonHeaders(token),
        body: JSON.stringify({
          currentPassword: unicodePass,
          newPassword: complexPass,
        }),
      });
      assert.equal(changeRes.status, 200);

      // Verify that login works with the exact complex password
      const loginSuccess = await login(unicodeUser, complexPass);
      assert.equal(loginSuccess.status, 200);

      // Verify that slightly altered password fails
      const loginFail = await login(unicodeUser, complexPass.replace('🔒', '🔓'));
      assert.equal(loginFail.status, 401);

      // Restore password
      await request('/api/user/change-password', {
        method: 'POST',
        headers: jsonHeaders(loginSuccess.token),
        body: JSON.stringify({
          currentPassword: complexPass,
          newPassword: unicodePass,
        }),
      });
    });
  });

  // =========================================================================
  // Challenge Area 4: Token Spoofing, Expired Tokens & Orphaned Sessions
  // =========================================================================
  describe('Challenge 4: Token Manipulation, Secret Mismatch & Orphaned User Invariants', () => {
    test('Token signed with different secret key rejected with 403', async () => {
      const rogueToken = jwt.sign({ userId: 'some-user-id' }, 'attacker-controlled-secret-key-1234');
      const res = await request('/api/user/profile', {
        headers: jsonHeaders(rogueToken),
      });
      assert.equal(res.status, 403);
      assert.equal((await res.json()).error, 'Invalid or expired token');
    });

    test('Token with expired lifetime rejected with 403', async () => {
      const expiredToken = jwt.sign(
        { userId: 'expired-user' },
        process.env.JWT_SECRET,
        { expiresIn: '-10s' }
      );
      const res = await request('/api/user/profile', {
        headers: jsonHeaders(expiredToken),
      });
      assert.equal(res.status, 403);
    });

    test('Algorithm none token rejected with 403', async () => {
      // Header: {"alg":"none","typ":"JWT"}
      const noneHeader = Buffer.from(JSON.stringify({ alg: 'none', typ: 'JWT' })).toString('base64url');
      const nonePayload = Buffer.from(JSON.stringify({ userId: 'fake-admin' })).toString('base64url');
      const noneToken = `${noneHeader}.${nonePayload}.`;

      const res = await request('/api/user/profile', {
        headers: jsonHeaders(noneToken),
      });
      assert.equal(res.status, 403);
    });

    test('Valid JWT for non-existent/deleted user returns 404 in profile and password endpoints', async () => {
      // Synthesize a valid token for a non-existent UUID
      const ghostId = crypto.randomUUID();
      const ghostToken = jwt.sign({ userId: ghostId }, process.env.JWT_SECRET, { expiresIn: '1h' });

      // 1. GET profile
      const getRes = await request('/api/user/profile', {
        headers: jsonHeaders(ghostToken),
      });
      assert.equal(getRes.status, 404);
      assert.equal((await getRes.json()).error, 'User not found');

      // 2. PUT profile
      const putRes = await request('/api/user/profile', {
        method: 'PUT',
        headers: jsonHeaders(ghostToken),
        body: JSON.stringify({
          username: 'ghost_user',
          currentPassword: 'anyPassword123!',
        }),
      });
      assert.equal(putRes.status, 404);
      assert.equal((await putRes.json()).error, 'User not found');

      // 3. POST change-password
      const pwdRes = await request('/api/user/change-password', {
        method: 'POST',
        headers: jsonHeaders(ghostToken),
        body: JSON.stringify({
          currentPassword: 'anyPassword123!',
          newPassword: 'newPassword123!',
        }),
      });
      assert.equal(pwdRes.status, 404);
      assert.equal((await pwdRes.json()).error, 'User not found');
    });

    test('Database cascade integrity: deleting user cascades to progress table', async () => {
      const user = `cascade_${Date.now()}`;
      const pass = 'CascadePass123!';
      const s = await signup(user, pass);
      const auth = await login(user, pass);

      // Save progress
      const progRes = await request('/api/progress', {
        method: 'POST',
        headers: jsonHeaders(auth.token),
        body: JSON.stringify({ progress: { xp: 50, lessons: ['l1'], badges: ['b1'] } }),
      });
      assert.equal(progRes.status, 200);

      // Directly delete the user from SQLite
      await getDb().run('DELETE FROM users WHERE id = ?', [s.data.userId]);

      // Check that progress row was cascaded
      const progRow = await getDb().get('SELECT * FROM progress WHERE userId = ?', [s.data.userId]);
      assert.equal(progRow, undefined, 'Progress row must be cascaded on user deletion');
    });
  });

  // =========================================================================
  // Challenge Area 5: HTTP Method & Header Edge Cases
  // =========================================================================
  describe('Challenge 5: HTTP Method, Header & CORS Boundary Hardening', () => {
    test('Unsupported HTTP methods on /api/user/profile return 404 or method not allowed', async () => {
      const unsupported = ['DELETE', 'PATCH'];
      for (const method of unsupported) {
        const res = await request('/api/user/profile', { method });
        assert.equal(res.status, 404, `Expected 404 for ${method} /api/user/profile`);
      }
    });

    test('Origin header with whitespace or subdomain trick is denied by CORS', async () => {
      // Attempting to spoof localhost:3000
      const evilOrigins = [
        'http://localhost:3000.evil.com',
        'http://evil.com/localhost:3000',
        'http://localhost:3001',
        'https://localhost:3000', // https vs http
      ];

      for (const origin of evilOrigins) {
        const res = await request('/api/user/profile', {
          method: 'OPTIONS',
          headers: {
            Origin: origin,
            'Access-Control-Request-Method': 'GET',
          },
        });
        const allowOrigin = res.headers.get('access-control-allow-origin');
        assert.equal(
          allowOrigin,
          null,
          `Origin ${origin} must NOT be allowed by CORS, but got ${allowOrigin}`
        );
      }
    });
  });
});
