const { test, describe, before, after } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');

// Configure isolated ephemeral SQLite database and test environment variables
const tempDir = path.join(os.tmpdir(), `account-e2e-${process.pid}-${Date.now()}`);
process.env.DATABASE_PATH = path.join(tempDir, 'test-account-e2e.sqlite');
process.env.JWT_SECRET = 'e2e-isolated-jwt-secret-for-acceptance-tests-32-chars';
process.env.CORS_ORIGINS = 'http://localhost:3000,http://127.0.0.1:3000';

const { app } = require('../index');
const { initDb, getDb } = require('../db');

let server;
let baseUrl;

// Test HTTP Client Helper
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

async function getProfile(token) {
  const res = await request('/api/user/profile', {
    method: 'GET',
    headers: jsonHeaders(token),
  });
  const data = await res.json().catch(() => ({}));
  return { status: res.status, data };
}

async function updateProfile(token, { username, name, currentPassword }) {
  const body = {};
  if (username !== undefined) body.username = username;
  if (name !== undefined) body.name = name;
  if (currentPassword !== undefined) body.currentPassword = currentPassword;

  const res = await request('/api/user/profile', {
    method: 'PUT',
    headers: jsonHeaders(token),
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  return { status: res.status, data };
}

async function changePassword(token, { currentPassword, newPassword }) {
  const body = {};
  if (currentPassword !== undefined) body.currentPassword = currentPassword;
  if (newPassword !== undefined) body.newPassword = newPassword;

  const res = await request('/api/user/change-password', {
    method: 'POST',
    headers: jsonHeaders(token),
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  return { status: res.status, data };
}

// Client Session Simulator: Emulates useAuth context and localStorage behavior
class MockClientSession {
  constructor() {
    this.storage = new Map();
    this.user = null;
    this.token = null;
    this.currentRoute = '/';
  }

  setItem(key, value) {
    this.storage.set(key, String(value));
  }

  getItem(key) {
    return this.storage.has(key) ? this.storage.get(key) : null;
  }

  removeItem(key) {
    this.storage.delete(key);
  }

  clear() {
    this.storage.clear();
  }

  async login(username, password) {
    const res = await login(username, password);
    if (res.status === 200 && res.token) {
      this.setItem('auth_token', res.token);
      this.setItem('user_id', res.data.userId);
      this.setItem('username', username);
      if (res.data.name) {
        this.setItem('name', res.data.name);
      } else {
        this.removeItem('name');
      }
      this.token = res.token;
      this.user = {
        userId: res.data.userId,
        id: res.data.userId,
        username,
        name: res.data.name ?? null,
      };
    }
    return res;
  }

  logout() {
    this.removeItem('auth_token');
    this.removeItem('user_id');
    this.removeItem('username');
    this.removeItem('name');
    this.token = null;
    this.user = null;
  }

  updateUser(partial) {
    if (!this.user) return;
    this.user = { ...this.user, ...partial };
    if (partial.username !== undefined) this.setItem('username', partial.username);
    if (partial.name !== undefined) {
      if (partial.name) this.setItem('name', partial.name);
      else this.removeItem('name');
    }
  }

  navigate(to) {
    this.currentRoute = to;
  }
}

describe('Milestone 3 E2E Acceptance Verification Suite', () => {
  before(async () => {
    await fs.mkdir(tempDir, { recursive: true });
    await initDb();
    server = app.listen(0);
    await new Promise(resolve => server.once('listening', resolve));
    baseUrl = `http://127.0.0.1:${server.address().port}`;
  });

  after(async () => {
    if (server) {
      await new Promise((resolve, reject) => server.close(err => (err ? reject(err) : resolve())));
    }
    try {
      await getDb().close();
    } catch {}
    await fs.rm(tempDir, { recursive: true, force: true });
  });

  // =========================================================================
  // TIER 1: Feature Coverage (Happy Path for every requirement)
  // =========================================================================
  describe('Tier 1: Feature Coverage & Happy Paths', () => {
    test('T1.1 - R1: Sign-Out Menu Navigation & Session Invalidation Contract', async () => {
      const client = new MockClientSession();
      const userRes = await signup('t1_nav_user', 'password-12345', 'Nav Explorer');
      assert.equal(userRes.status, 201);

      // 1. Authenticate user and populate client session
      const loginRes = await client.login('t1_nav_user', 'password-12345');
      assert.equal(loginRes.status, 200);
      assert.ok(client.token);
      assert.equal(client.getItem('auth_token'), client.token);
      assert.equal(client.getItem('username'), 't1_nav_user');
      assert.equal(client.getItem('name'), 'Nav Explorer');

      // 2. Simulated navigation: Menu option "Account" navigates to /account
      client.navigate('/account');
      assert.equal(client.currentRoute, '/account');

      // 3. User accesses account endpoint with valid session
      const authedProfile = await getProfile(client.token);
      assert.equal(authedProfile.status, 200);
      assert.equal(authedProfile.data.user.username, 't1_nav_user');

      // 4. Simulated execution of menu option "Sign out"
      client.logout();
      assert.equal(client.token, null);
      assert.equal(client.user, null);
      assert.equal(client.getItem('auth_token'), null);
      assert.equal(client.getItem('user_id'), null);
      assert.equal(client.getItem('username'), null);
      assert.equal(client.getItem('name'), null);

      // 5. Subsequent request with invalidated/cleared session is strictly rejected
      const unauthedRes = await getProfile(client.token);
      assert.equal(unauthedRes.status, 401);
      assert.equal(unauthedRes.data.error, 'No token provided');
    });

    test('T1.2 - R2: Account Profile Details Inspection', async () => {
      // Create user with explicit name
      const signupRes = await signup('t1_profile_user', 'password-12345', 'Ada Augusta King');
      assert.equal(signupRes.status, 201);

      const loginRes = await login('t1_profile_user', 'password-12345');
      assert.equal(loginRes.status, 200);
      const token = loginRes.token;

      // GET /api/user/profile returns authenticated user's name and username
      const profileRes = await getProfile(token);
      assert.equal(profileRes.status, 200);
      assert.ok(profileRes.data.user);
      assert.ok(profileRes.data.user.id);
      assert.equal(profileRes.data.user.username, 't1_profile_user');
      assert.equal(profileRes.data.user.name, 'Ada Augusta King');

      // Security invariant: password hash must NEVER be present in profile response
      assert.equal(profileRes.data.user.password, undefined);
    });

    test('T1.3 - R2: Account Profile Updates with Password Confirmation', async () => {
      const signupRes = await signup('t1_edit_user', 'password-12345', 'Initial Name');
      assert.equal(signupRes.status, 201);
      const { token } = await login('t1_edit_user', 'password-12345');

      // Update name and username providing correct current password
      const updateRes = await updateProfile(token, {
        name: 'Updated Name',
        username: 't1_edit_user_new',
        currentPassword: 'password-12345',
      });
      assert.equal(updateRes.status, 200);
      assert.equal(updateRes.data.user.name, 'Updated Name');
      assert.equal(updateRes.data.user.username, 't1_edit_user_new');

      // Verify persistence via GET /api/user/profile
      const verifyRes = await getProfile(token);
      assert.equal(verifyRes.status, 200);
      assert.equal(verifyRes.data.user.name, 'Updated Name');
      assert.equal(verifyRes.data.user.username, 't1_edit_user_new');

      // Updating name while keeping same username succeeds without self-collision
      const nameOnlyRes = await updateProfile(token, {
        name: 'Final Name',
        username: 't1_edit_user_new',
        currentPassword: 'password-12345',
      });
      assert.equal(nameOnlyRes.status, 200);
      assert.equal(nameOnlyRes.data.user.name, 'Final Name');
      assert.equal(nameOnlyRes.data.user.username, 't1_edit_user_new');
    });

    test('T1.4 - R3: Password Reset Tab API Workflow & Immediate Credential Handshake', async () => {
      const signupRes = await signup('t1_pwd_user', 'old-password-123', 'Key Holder');
      assert.equal(signupRes.status, 201);
      const { token } = await login('t1_pwd_user', 'old-password-123');

      // Update password with valid current and new password (min 8 chars)
      const changeRes = await changePassword(token, {
        currentPassword: 'old-password-123',
        newPassword: 'brand-new-password-456',
      });
      assert.equal(changeRes.status, 200);
      assert.equal(changeRes.data.success, true);
      assert.equal(changeRes.data.message, 'Password updated successfully');

      // Old password fails immediately
      const oldLoginRes = await login('t1_pwd_user', 'old-password-123');
      assert.equal(oldLoginRes.status, 401);
      assert.equal(oldLoginRes.data.error, 'Invalid credentials');

      // New password succeeds immediately and returns fresh token
      const newLoginRes = await login('t1_pwd_user', 'brand-new-password-456');
      assert.equal(newLoginRes.status, 200);
      assert.ok(newLoginRes.token);

      // Verify new token has full access to user profile
      const newProfileRes = await getProfile(newLoginRes.token);
      assert.equal(newProfileRes.status, 200);
      assert.equal(newProfileRes.data.user.username, 't1_pwd_user');
      assert.equal(newProfileRes.data.user.name, 'Key Holder');
    });

    test('T1.5 - Frontend Source Contract Verification for R1, R2, R3', async () => {
      const appRoot = path.resolve(__dirname, '../../app/src');

      // Verify Home.tsx renders the dropdown menu for sign-out (R1)
      const homeContent = await fs.readFile(path.join(appRoot, 'pages/Home.tsx'), 'utf-8');
      assert.ok(homeContent.includes('<DropdownMenu>'), 'Home.tsx must use DropdownMenu component');
      assert.ok(homeContent.includes("navigate('/account')"), 'Home.tsx dropdown must navigate to /account');
      assert.ok(homeContent.includes('logout()'), 'Home.tsx dropdown must invoke logout()');

      // Verify Account.tsx renders user summary card, profile form, and password reset tab (R2, R3)
      const accountContent = await fs.readFile(path.join(appRoot, 'pages/Account.tsx'), 'utf-8');
      assert.ok(accountContent.includes('account-display-name'), 'Account.tsx must display name with test id');
      assert.ok(accountContent.includes('account-display-username'), 'Account.tsx must display username with test id');
      assert.ok(accountContent.includes('<Tabs'), 'Account.tsx must use Tabs component');
      assert.ok(accountContent.includes('value="profile"'), 'Account.tsx must have profile tab');
      assert.ok(accountContent.includes('value="password"'), 'Account.tsx must have password reset tab');
      assert.ok(accountContent.includes('updateProfile'), 'Account.tsx must call updateProfile');
      assert.ok(accountContent.includes('changePassword'), 'Account.tsx must call changePassword');

      // Verify App.tsx registers protected /account route
      const appRoutesContent = await fs.readFile(path.join(appRoot, 'App.tsx'), 'utf-8');
      assert.ok(appRoutesContent.includes('path="/account"'), 'App.tsx must register /account route');
      assert.ok(appRoutesContent.includes('<ProtectedRoute>'), 'App.tsx must protect /account route');

      // Verify api.ts exports profile & password change helpers
      const apiContent = await fs.readFile(path.join(appRoot, 'lib/api.ts'), 'utf-8');
      assert.ok(apiContent.includes('export async function getProfile'), 'api.ts must export getProfile');
      assert.ok(apiContent.includes('export async function updateProfile'), 'api.ts must export updateProfile');
      assert.ok(apiContent.includes('export async function changePassword'), 'api.ts must export changePassword');
    });
  });

  // =========================================================================
  // TIER 2: Boundary & Corner Cases (Validation, Rejections, Collisions)
  // =========================================================================
  describe('Tier 2: Boundary & Corner Cases', () => {
    let t2Token;
    const t2Password = 't2-super-password-123';

    before(async () => {
      const res = await signup('t2_boundary_user', t2Password, 'Boundary Tester');
      assert.equal(res.status, 201);
      const logRes = await login('t2_boundary_user', t2Password);
      t2Token = logRes.token;
    });

    test('T2.1 - Profile Update: Missing or Incorrect Password Rejection (R2)', async () => {
      // 1. Missing currentPassword field
      const missingPw = await updateProfile(t2Token, {
        username: 't2_boundary_user',
        name: 'Hacked Name',
      });
      assert.equal(missingPw.status, 401);
      assert.equal(missingPw.data.error, 'Current password is required and must be correct');

      // 2. Empty string currentPassword
      const emptyPw = await updateProfile(t2Token, {
        username: 't2_boundary_user',
        name: 'Hacked Name',
        currentPassword: '',
      });
      assert.equal(emptyPw.status, 401);
      assert.equal(emptyPw.data.error, 'Current password is required and must be correct');

      // 3. Incorrect currentPassword
      const wrongPw = await updateProfile(t2Token, {
        username: 't2_boundary_user',
        name: 'Hacked Name',
        currentPassword: 'completely-wrong-password',
      });
      assert.equal(wrongPw.status, 401);
      assert.equal(wrongPw.data.error, 'Current password is required and must be correct');

      // 4. Invariant: Profile in database is completely unchanged
      const verify = await getProfile(t2Token);
      assert.equal(verify.data.user.name, 'Boundary Tester');
      assert.equal(verify.data.user.username, 't2_boundary_user');
    });

    test('T2.2 - Profile Update: Username Boundaries (Length, Whitespace, Empty) (R2)', async () => {
      // 1. Missing username
      const missingUser = await updateProfile(t2Token, {
        name: 'Valid Name',
        currentPassword: t2Password,
      });
      assert.equal(missingUser.status, 400);
      assert.equal(missingUser.data.error, 'Username is required');

      // 2. Empty string username
      const emptyUser = await updateProfile(t2Token, {
        username: '',
        name: 'Valid Name',
        currentPassword: t2Password,
      });
      assert.equal(emptyUser.status, 400);
      assert.equal(emptyUser.data.error, 'Username is required');

      // 3. Whitespace-only username
      const wsUser = await updateProfile(t2Token, {
        username: '    ',
        name: 'Valid Name',
        currentPassword: t2Password,
      });
      assert.equal(wsUser.status, 400);
      assert.equal(wsUser.data.error, 'Username is required');

      // 4. Username at max boundary: 40 characters -> succeeds
      const maxUserStr = 'u'.repeat(40);
      const maxUser = await updateProfile(t2Token, {
        username: maxUserStr,
        name: 'Boundary Tester',
        currentPassword: t2Password,
      });
      assert.equal(maxUser.status, 200);
      assert.equal(maxUser.data.user.username, maxUserStr);

      // 5. Username exceeding max boundary: 41 characters -> rejects with 400
      const exceedUser = await updateProfile(t2Token, {
        username: 'u'.repeat(41),
        name: 'Boundary Tester',
        currentPassword: t2Password,
      });
      assert.equal(exceedUser.status, 400);
      assert.equal(exceedUser.data.error, 'Username must be 40 characters or fewer');

      // Revert username back to original
      const revert = await updateProfile(t2Token, {
        username: 't2_boundary_user',
        name: 'Boundary Tester',
        currentPassword: t2Password,
      });
      assert.equal(revert.status, 200);
    });

    test('T2.3 - Profile Update: Name Length Limits, Null Clearing & Unicode Characters (R2)', async () => {
      // 1. Name at max boundary: 100 characters -> succeeds
      const maxName = 'N'.repeat(100);
      const maxRes = await updateProfile(t2Token, {
        username: 't2_boundary_user',
        name: maxName,
        currentPassword: t2Password,
      });
      assert.equal(maxRes.status, 200);
      assert.equal(maxRes.data.user.name, maxName);

      // 2. Name exceeding max boundary: 101 characters -> rejects with 400
      const exceedName = await updateProfile(t2Token, {
        username: 't2_boundary_user',
        name: 'N'.repeat(101),
        currentPassword: t2Password,
      });
      assert.equal(exceedName.status, 400);
      assert.equal(exceedName.data.error, 'Name must be 100 characters or fewer');

      // 3. Name clearing: null updates name to null
      const clearRes = await updateProfile(t2Token, {
        username: 't2_boundary_user',
        name: null,
        currentPassword: t2Password,
      });
      assert.equal(clearRes.status, 200);
      assert.equal(clearRes.data.user.name, null);

      // 4. Unicode, special characters, and emojis preserved accurately
      const unicodeName = 'Dr. Éléonore O’Connor-Smith 🌸 李小龙';
      const unicodeRes = await updateProfile(t2Token, {
        username: 't2_boundary_user',
        name: unicodeName,
        currentPassword: t2Password,
      });
      assert.equal(unicodeRes.status, 200);
      assert.equal(unicodeRes.data.user.name, unicodeName);

      // Verify persistent round-trip fidelity
      const checkUnicode = await getProfile(t2Token);
      assert.equal(checkUnicode.data.user.name, unicodeName);
    });

    test('T2.4 - Profile Update: Duplicate Username Conflict (409) & Conflict Recovery (R2)', async () => {
      // Create user B
      const userB = await signup('t2_user_beta', 'password-beta-123', 'User Beta');
      assert.equal(userB.status, 201);

      // t2_boundary_user attempts to claim t2_user_beta's username -> 409
      const conflictRes = await updateProfile(t2Token, {
        username: 't2_user_beta',
        name: 'Conflict Attempt',
        currentPassword: t2Password,
      });
      assert.equal(conflictRes.status, 409);
      assert.equal(conflictRes.data.error, 'Username already taken');

      // Invariant: t2_boundary_user's username remained unchanged
      const verifyUnchanged = await getProfile(t2Token);
      assert.equal(verifyUnchanged.data.user.username, 't2_boundary_user');

      // user_beta changes username to t2_user_beta_renamed
      const betaLogin = await login('t2_user_beta', 'password-beta-123');
      const betaRename = await updateProfile(betaLogin.token, {
        username: 't2_user_beta_renamed',
        name: 'User Beta Renamed',
        currentPassword: 'password-beta-123',
      });
      assert.equal(betaRename.status, 200);

      // Now t2_user_beta is available: t2_boundary_user can claim it
      const claimFreed = await updateProfile(t2Token, {
        username: 't2_user_beta',
        name: 'New Owner',
        currentPassword: t2Password,
      });
      assert.equal(claimFreed.status, 200);
      assert.equal(claimFreed.data.user.username, 't2_user_beta');

      // Revert back
      await updateProfile(t2Token, {
        username: 't2_boundary_user',
        name: 'Boundary Tester',
        currentPassword: t2Password,
      });
    });

    test('T2.5 - Password Reset: Boundaries, Minimum Length & Validation Rules (R3)', async () => {
      // 1. Missing currentPassword or newPassword
      const missingFields = await changePassword(t2Token, {});
      assert.equal(missingFields.status, 400);
      assert.equal(missingFields.data.error, 'Current password and new password are required');

      const missingOnlyNew = await changePassword(t2Token, { currentPassword: t2Password });
      assert.equal(missingOnlyNew.status, 400);

      const missingOnlyCurrent = await changePassword(t2Token, { newPassword: 'new-valid-password-123' });
      assert.equal(missingOnlyCurrent.status, 400);

      // 2. New password too short: 7 characters (<8)
      const shortPw = await changePassword(t2Token, {
        currentPassword: t2Password,
        newPassword: 'short12',
      });
      assert.equal(shortPw.status, 400);
      assert.equal(shortPw.data.error, 'New password must be at least 8 characters');

      // 3. New password exceeding 200 characters (>200)
      const longPw = await changePassword(t2Token, {
        currentPassword: t2Password,
        newPassword: 'P'.repeat(201),
      });
      assert.equal(longPw.status, 400);
      assert.equal(longPw.data.error, 'New password must be 200 characters or fewer');

      // 4. Incorrect current password rejected with 401
      const badCurrent = await changePassword(t2Token, {
        currentPassword: 'wrong-current-password',
        newPassword: 'valid-new-password-123',
      });
      assert.equal(badCurrent.status, 401);
      assert.equal(badCurrent.data.error, 'Current password is incorrect');

      // Verify old password still works for login after failed attempts
      const verifyLoginOld = await login('t2_boundary_user', t2Password);
      assert.equal(verifyLoginOld.status, 200);

      // 5. Exactly 8 characters succeeds
      const minPwRes = await changePassword(t2Token, {
        currentPassword: t2Password,
        newPassword: 'eightch8',
      });
      assert.equal(minPwRes.status, 200);

      // Restore password
      const restoreLog = await login('t2_boundary_user', 'eightch8');
      assert.equal(restoreLog.status, 200);
      await changePassword(restoreLog.token, {
        currentPassword: 'eightch8',
        newPassword: t2Password,
      });
    });

    test('T2.6 - Authentication Boundaries: Missing, Malformed, and Tampered Tokens', async () => {
      // 1. Missing Authorization header returns 401
      const noAuth = await request('/api/user/profile');
      assert.equal(noAuth.status, 401);
      assert.equal((await noAuth.json()).error, 'No token provided');

      // 2. Empty token string after Bearer prefix returns 401
      const emptyToken = await request('/api/user/profile', {
        headers: { Authorization: 'Bearer ' },
      });
      assert.equal(emptyToken.status, 401);
      assert.equal((await emptyToken.json()).error, 'No token provided');

      // 3. Invalid / malformed token string returns 403
      const badToken = await request('/api/user/profile', {
        headers: { Authorization: 'Bearer invalid.token.payload' },
      });
      assert.equal(badToken.status, 403);
      assert.equal((await badToken.json()).error, 'Invalid or expired token');

      // 4. Tampered JWT signature returns 403
      const tampered = await request('/api/user/profile', {
        headers: { Authorization: `Bearer ${t2Token}tampered-signature` },
      });
      assert.equal(tampered.status, 403);
      assert.equal((await tampered.json()).error, 'Invalid or expired token');

      // 4. Profile update unauthenticated
      const putUnauth = await request('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'any', currentPassword: 'any' }),
      });
      assert.equal(putUnauth.status, 401);

      // 5. Password change unauthenticated
      const postUnauth = await request('/api/user/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: 'any', newPassword: 'any' }),
      });
      assert.equal(postUnauth.status, 401);
    });
  });

  // =========================================================================
  // TIER 3: Cross-Feature Combinations & Workflows
  // =========================================================================
  describe('Tier 3: Cross-Feature Workflows & Combinations', () => {
    test('T3.1 - Workflow: Profile Update -> Password Change -> Credential Re-verification', async () => {
      // 1. User signs up and logs in
      const signupRes = await signup('t3_combo_user', 'initial-pass-1', 'Initial Combination');
      assert.equal(signupRes.status, 201);
      const { token } = await login('t3_combo_user', 'initial-pass-1');

      // 2. Profile update (name and username) with initial-pass-1
      const updateRes = await updateProfile(token, {
        username: 't3_combo_updated',
        name: 'Combo Champion',
        currentPassword: 'initial-pass-1',
      });
      assert.equal(updateRes.status, 200);
      assert.equal(updateRes.data.user.username, 't3_combo_updated');

      // 3. Password change to new-pass-2
      const changeRes = await changePassword(token, {
        currentPassword: 'initial-pass-1',
        newPassword: 'new-pass-2-secret',
      });
      assert.equal(changeRes.status, 200);

      // 4. Attempting to update profile using OLD password fails
      const failProfileUpdate = await updateProfile(token, {
        username: 't3_combo_updated',
        name: 'Should Fail',
        currentPassword: 'initial-pass-1',
      });
      assert.equal(failProfileUpdate.status, 401);

      // 5. Profile update using NEW password succeeds
      const succeedProfileUpdate = await updateProfile(token, {
        username: 't3_combo_updated',
        name: 'Verified Champion',
        currentPassword: 'new-pass-2-secret',
      });
      assert.equal(succeedProfileUpdate.status, 200);
      assert.equal(succeedProfileUpdate.data.user.name, 'Verified Champion');

      // 6. Login strictly requires new password and returns updated profile
      const oldLogin = await login('t3_combo_updated', 'initial-pass-1');
      assert.equal(oldLogin.status, 401);

      const newLogin = await login('t3_combo_updated', 'new-pass-2-secret');
      assert.equal(newLogin.status, 200);
      assert.equal(newLogin.data.name, 'Verified Champion');
    });

    test('T3.2 - Workflow: Credential Rotation -> Session Termination -> Re-login Lifecycle', async () => {
      const client = new MockClientSession();
      await signup('t3_rot_user', 'rot-pass-alpha', 'Rotator User');

      // 1. Client logs in and saves session
      const loginAlpha = await client.login('t3_rot_user', 'rot-pass-alpha');
      assert.equal(loginAlpha.status, 200);
      assert.equal(client.user.username, 't3_rot_user');

      // 2. Client rotates password in password reset tab
      const rotRes = await changePassword(client.token, {
        currentPassword: 'rot-pass-alpha',
        newPassword: 'rot-pass-omega-99',
      });
      assert.equal(rotRes.status, 200);

      // 3. Client executes sign-out via menu
      client.logout();
      assert.equal(client.token, null);
      assert.equal(client.getItem('auth_token'), null);

      // 4. Old password rejected
      const failLogin = await client.login('t3_rot_user', 'rot-pass-alpha');
      assert.equal(failLogin.status, 401);
      assert.equal(client.token, null);

      // 5. New password re-authenticates and re-populates session
      const goodLogin = await client.login('t3_rot_user', 'rot-pass-omega-99');
      assert.equal(goodLogin.status, 200);
      assert.ok(client.token);
      assert.equal(client.getItem('auth_token'), client.token);

      // 6. Verify profile can be fetched with new session
      const profile = await getProfile(client.token);
      assert.equal(profile.status, 200);
      assert.equal(profile.data.user.name, 'Rotator User');
    });

    test('T3.3 - Workflow: Guest Session vs Authenticated Account Data Isolation', async () => {
      const GUEST_KEY = 'spark-ai-learning-progress';
      const client = new MockClientSession();

      // 1. Guest user completes lessons offline (stored in localStorage)
      const guestProgress = { xp: 150, lessons: ['intro-ai', 'ethics-1'], badges: ['badge-init'] };
      client.setItem(GUEST_KEY, JSON.stringify(guestProgress));

      // 2. User registers and logs in with account
      await signup('t3_guest_isolated', 'secure-pwd-1234', 'Account Owner');
      await client.login('t3_guest_isolated', 'secure-pwd-1234');

      // 3. Account user saves server progress
      const serverProgress = { xp: 300, lessons: ['module-1-complete'], badges: ['master-ai'] };
      const saveServer = await request('/api/progress', {
        method: 'POST',
        headers: jsonHeaders(client.token),
        body: JSON.stringify({ progress: serverProgress }),
      });
      assert.equal(saveServer.status, 200);

      // 4. User edits account profile
      const editRes = await updateProfile(client.token, {
        name: 'Account Owner Renamed',
        username: 't3_guest_isolated',
        currentPassword: 'secure-pwd-1234',
      });
      assert.equal(editRes.status, 200);

      // 5. User signs out via menu
      client.logout();

      // 6. Guest progress in localStorage was isolated and remained intact
      const preservedGuest = JSON.parse(client.getItem(GUEST_KEY));
      assert.deepEqual(preservedGuest, guestProgress);

      // 7. Signing back into account retrieves server progress
      const reLog = await client.login('t3_guest_isolated', 'secure-pwd-1234');
      assert.equal(reLog.status, 200);
      const loadedServer = await request('/api/progress', {
        headers: jsonHeaders(client.token),
      });
      assert.equal(loadedServer.status, 200);
      const loadedData = await loadedServer.json();
      assert.equal(loadedData.xp, 300);
      assert.deepEqual(loadedData.lessons, ['module-1-complete']);
    });
  });

  // =========================================================================
  // TIER 4: Real-World Lifecycles & Security Invariants
  // =========================================================================
  describe('Tier 4: Real-World Lifecycles & Security Invariants', () => {
    test('T4.1 - Scenario 1: Comprehensive End-to-End User Journey', async () => {
      const client = new MockClientSession();

      // Step 1: User registers on the platform
      const signupRes = await signup('mhamilton', 'apollo-11-guidance', 'Margaret Hamilton');
      assert.equal(signupRes.status, 201);

      // Step 2: User logs in from sign-in page
      const loginRes = await client.login('mhamilton', 'apollo-11-guidance');
      assert.equal(loginRes.status, 200);
      assert.equal(client.user.name, 'Margaret Hamilton');

      // Step 3: User saves learning progress
      const progressRes = await request('/api/progress', {
        method: 'POST',
        headers: jsonHeaders(client.token),
        body: JSON.stringify({
          progress: { xp: 500, lessons: ['flight-software', 'agc-core'], badges: ['apollo-pioneer'] },
        }),
      });
      assert.equal(progressRes.status, 200);

      // Step 4: User opens sign-out dropdown menu and selects "Account"
      client.navigate('/account');
      assert.equal(client.currentRoute, '/account');

      // Step 5: User verifies profile display details on Account page
      const initialProfile = await getProfile(client.token);
      assert.equal(initialProfile.status, 200);
      assert.equal(initialProfile.data.user.name, 'Margaret Hamilton');
      assert.equal(initialProfile.data.user.username, 'mhamilton');

      // Step 6: User updates profile details (Name & Username) requiring current password
      const profileEdit = await updateProfile(client.token, {
        name: 'Dr. Margaret Hamilton',
        username: 'margaret-hamilton',
        currentPassword: 'apollo-11-guidance',
      });
      assert.equal(profileEdit.status, 200);
      client.updateUser(profileEdit.data.user);
      assert.equal(client.user.name, 'Dr. Margaret Hamilton');
      assert.equal(client.user.username, 'margaret-hamilton');

      // Step 7: User switches to Password Reset tab and updates password
      const pwdChange = await changePassword(client.token, {
        currentPassword: 'apollo-11-guidance',
        newPassword: 'artemis-moon-2026',
      });
      assert.equal(pwdChange.status, 200);

      // Step 8: User opens dropdown and clicks "Sign out"
      client.logout();
      assert.equal(client.token, null);
      client.navigate('/');

      // Step 9: Attempting login with old password fails
      const failedOldLogin = await client.login('margaret-hamilton', 'apollo-11-guidance');
      assert.equal(failedOldLogin.status, 401);

      // Step 10: Logging in with new password succeeds and displays updated name
      const successNewLogin = await client.login('margaret-hamilton', 'artemis-moon-2026');
      assert.equal(successNewLogin.status, 200);
      assert.equal(client.user.name, 'Dr. Margaret Hamilton');

      // Step 11: User returns to courses/progress and verifies progress persisted across credential rotation
      const checkProgress = await request('/api/progress', {
        headers: jsonHeaders(client.token),
      });
      assert.equal(checkProgress.status, 200);
      const progressData = await checkProgress.json();
      assert.equal(progressData.xp, 500);
      assert.deepEqual(progressData.badges, ['apollo-pioneer']);
    });

    test('T4.2 - Scenario 2: Security & Adversarial Injection Resistance', async () => {
      const reg = await signup('sec_user_target', 'target-password-123', 'Sec Target');
      assert.equal(reg.status, 201);
      const { token } = await login('sec_user_target', 'target-password-123');

      // 1. SQL Injection payload in username
      const sqlInjectionUser = await updateProfile(token, {
        username: "target' OR '1'='1",
        name: 'SQL Attempt',
        currentPassword: 'target-password-123',
      });
      // Handled safely without executing SQL injection
      assert.ok([200, 400].includes(sqlInjectionUser.status));
      if (sqlInjectionUser.status === 200) {
        // Ensure literal storage without SQL corruption
        assert.equal(sqlInjectionUser.data.user.username, "target' OR '1'='1");
      }

      // 2. SQL Injection payload in currentPassword
      const sqlInjectionPw = await updateProfile(token, {
        username: 'sec_user_target',
        name: 'SQL Attempt',
        currentPassword: "' OR '1'='1' --",
      });
      assert.equal(sqlInjectionPw.status, 401);

      // 3. XSS injection payload in name
      const xssName = '<script>alert("XSS")</script>';
      const xssRes = await updateProfile(token, {
        username: 'sec_user_target',
        name: xssName,
        currentPassword: 'target-password-123',
      });
      assert.equal(xssRes.status, 200);
      assert.equal(xssRes.data.user.name, xssName);

      // 4. Privilege escalation: attempting to pass different user ID or unauthorized fields
      const privEsc = await request('/api/user/profile', {
        method: 'PUT',
        headers: jsonHeaders(token),
        body: JSON.stringify({
          id: '00000000-0000-0000-0000-000000000000',
          username: 'sec_user_target',
          name: 'Hacked',
          currentPassword: 'target-password-123',
        }),
      });
      assert.equal(privEsc.status, 200);
      const privData = await privEsc.json();
      // ID must remain the authenticated user's ID
      assert.notEqual(privData.user.id, '00000000-0000-0000-0000-000000000000');

      // 5. Password hash exposure check across all endpoints
      const profileCheck = await getProfile(token);
      assert.equal(profileCheck.data.user.password, undefined);
      assert.equal(privData.user.password, undefined);
    });

    test('T4.3 - Scenario 3: Multiple Sequential Credential Rotations', async () => {
      await signup('seq_rot_user', 'phase-1-pass', 'Sequential Rotator');
      const { token } = await login('seq_rot_user', 'phase-1-pass');

      // Phase 1 -> Phase 2
      const rot1 = await changePassword(token, {
        currentPassword: 'phase-1-pass',
        newPassword: 'phase-2-pass-long',
      });
      assert.equal(rot1.status, 200);

      // Phase 2 -> Phase 3
      const rot2 = await changePassword(token, {
        currentPassword: 'phase-2-pass-long',
        newPassword: 'phase-3-pass-final',
      });
      assert.equal(rot2.status, 200);

      // Phase 1 and Phase 2 credentials rejected
      assert.equal((await login('seq_rot_user', 'phase-1-pass')).status, 401);
      assert.equal((await login('seq_rot_user', 'phase-2-pass-long')).status, 401);

      // Phase 3 credentials accepted
      const finalLogin = await login('seq_rot_user', 'phase-3-pass-final');
      assert.equal(finalLogin.status, 200);
    });
  });
});
