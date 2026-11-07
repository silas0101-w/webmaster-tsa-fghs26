# Code Flaws Found (Read-Only Audit)

No code was changed during this audit. This file records the flaws found, why they matter, and possible fixes.

## 1. Server trusts client-authored progress

**Location:** `backend/index.js`, `POST /api/progress`

**Issue:** The server stores XP, completed lessons, badges, and video progress essentially as submitted. It only validates basic types and non-negative XP. A user can submit arbitrary XP, lesson IDs, or badges and have them persisted.

**Why it matters:** Progress and badges are integrity-sensitive. Client-trusted values allow spoofing and undermine the learning/grading model.

**Fix options:**
1. **Recommended:** Move an allowlist of valid lesson IDs and badge IDs into backend validation. Reject unknown lesson/badge IDs.
2. Recompute XP on the backend from completed lessons plus earned badge rewards instead of trusting `progress.xp`.
3. Keep client-calculated XP but bound it tightly and verify that completed lessons match XP.
4. Store a server-side "source of truth" profile state and derive all displayed progress from it.

---

## 2. Unbounded XP

**Location:** `backend/index.js`, `progress.xp < 0` check

**Issue:** XP cannot be negative, but there is no upper bound or sanity limit.

**Fix options:**
1. Calculate XP server-side from completed lessons and badges.
2. Add a maximum per user (for example, sum of all lesson XP + badge XP).
3. Reject payloads where `xp` is greater than the known maximum.
4. Clamp, rather than reject, only if you want to avoid client failures.

---

## 3. Non-string array elements

**Location:** `backend/index.js`, `Array.isArray(progress.lessons)` / `Array.isArray(progress.badges)`

**Issue:** Array contents are not validated. They may contain numbers, objects, or arbitrary values and are later stringified/stored.

**Fix options:**
1. Require every element to be a string.
2. Require element length limits (for example, max 64 characters).
3. Validate against known lesson IDs/badge IDs.
4. Reject the payload if any element is invalid.

---

## 4. Empty `videoProgress` overwrites saved progress

**Location:** `backend/index.js`, `sanitizedVideoProgress` / `COALESCE` SQL

**Issue:** If a client sends `videoProgress: {}`, it is treated as a real value and overwrites previously saved video progress with an empty object. An empty object is not treated as "missing."

**Fix options:**
1. **Recommended:** Merge incoming `videoProgress` into the existing row instead of replacing it.
2. Only update `videoProgress` when the incoming object contains at least one key.
3. Introduce an explicit `null` meaning "do not change," and reserve `{}` for "reset all."
4. Modify the SQL `ON CONFLICT` logic so `{}` or empty values preserve existing progress.

---

## 5. CORS allows requests without an Origin

**Location:** `backend/index.js`, CORS `origin` callback

**Issue:** Requests without an `Origin` header are accepted from any client. That is typical for curl/local/server traffic, but it can be stricter.

**Fix options:**
1. Keep current behavior for local development.
2. In production, require an exact configured origin for browser-facing calls.
3. Use a separate internal API path/API key for non-browser clients instead of broad silent acceptance.
4. Add explicit logging/monitoring for Origin-less requests.

---

## 6. JWT and user data stored in `localStorage`

**Location:** `app/src/hooks/useAuth.tsx`

**Issue:** JWT, user ID, and username are stored in `localStorage`, exposing them to XSS. The displayed username is also client-controlled and not derived from the token.

**Fix options:**
1. **Recommended:** Use an `httpOnly`, `SameSite`, secure cookie for the JWT and add CSRF protection.
2. If staying with `localStorage`, add a strong Content Security Policy and avoid injecting untrusted HTML.
3. Store only the token in memory where possible.
4. Have the backend return/verify user identity on each protected request instead of trusting local stored values.

---

## 7. No auth rate limiting

**Location:** `backend/index.js`, auth routes

**Issue:** Signup and login have no rate limiting, making brute-force and spam signup easier.

**Fix options:**
1. Add `express-rate-limit` to auth routes.
2. Add per-IP and per-username attempt tracking.
3. Add CAPTCHA or proof-of-work for signup if abuse appears.
4. Use a gateway/proxy-level rate limit in production.

---

## 8. Account switching state churn in `Home`

**Location:** `app/src/pages/Home.tsx`, `sessiondslUserId`/render-time reset block

**Issue:** Multiple state values are updated during render when auth state changes. This is controlled but fragile and can cause mixed-state edge cases.

**Fix options:**
1. Move account-change reset logic into a `useEffect`.
2. Reset progress by remounting the relevant component tree with `key={userId ?? 'guest'}`.
3. Split guest and account progress into separate state variables.
4. Add automated tests covering sign-in, sign-out, and user-switch flows.

---

## 9. No local fallback while signed in during server outage

**Location:** `app/src/pages/Home.tsx`

**Issue:** If progress download fails, the signed-in user gets a warning but their in-session work is not saved locally. A server outage can therefore lose progress.

**Fix options:**
1. Cache the latest signed-in progress locally and reconcile with the server later.
2. Enable an offline queue for progress POSTs.
3. Keep showing the warning but also preserve a fallback backup key.
4. Make cloud sync opt-in with strong offline behavior.

---

## 10. Video timer interval recreates on every progress update

**Location:** `app/src/components/LessonModal.tsx`, video-playing `useEffect`

**Issue:** Because `videoProgress` is in the effect dependency array, each 5% progress update resets the timer. This makes updates irregular and can slow apparent progress.

**Fix options:**
1. Store the current progress in a ref and keep the interval dependency stable.
2. Update progress less often (for example, at segment boundaries).
3. Use a single interval that reads current state from a ref.
4. Use a functional state update without adding `videoProgress` as a dependency.

---

## 11. Inspect plugin enabled in Vite config

**Location:** `app/vite.config.ts`

**Issue:** `inspectAttr()` is added unconditionally and may ship source metadata in production if not tree-shaken.

**Fix options:**
1. Gate it behind `import.meta.env.DEV` or `process.env.NODE_ENV !== 'production'`.
2. Move it to a `.env`-driven debug flag.
3. Leave as-is and verify Vite removes it from the production build.
4. Use a dedicated debug build separate from release.

---

## 12. Case-sensitive usernames

**Location:** `backend/index.js`, signup/login SQL comparisons

**Issue:** SQLite string comparison is case-sensitive by default, so `Alice` and `alice` may be distinct accounts.

**Fix options:**
1. Normalize usernames to lowercase before storing and querying.
2. Use `COLLATE NOCASE` in the unique constraint and queries.
3. Keep case sensitivity if desired, but document it.
4. Add a case-insensitive duplicate check at signup.

---

## 13. Internal error detail exposure

**Location:** `backend/index.js`, `/api/health` catch block

**Issue:** Some error paths can return internal `err.message` to the client.

**Fix options:**
1. Return generic messages in production.
2. Keep detailed errors only when `NODE_ENV !== 'production'`.
3. Add structured server logging instead of exposing details.
4. Avoid catch blocks where no exception is possible.

---

## 14. Potential CSS injection if chart config becomes dynamic

**Location:** `app/src/components/ui/chart.tsx`

**Issue:** Config values are interpolated into generated CSS. This is usually safe for static configs, but becomes a CSS injection point if config data is ever user-controlled.

**Fix options:**
1. Keep chart configs static and hardcoded.
2. Strictly validate colors against a hex/rgb regex.
3. Split dynamic values from CSS generation.
4. Sanitize config values before rendering.

---

## 15. No token revocation

**Location:** `backend/index.js`, JWT issuance/verification

**Issue:** Logout only removes the client-side token. Stolen tokens remain valid until expiry.

**Fix options:**
1. Shorten token lifetime and add refresh tokens.
2. Add a token denylist for logout.
3. Rotate the JWT secret only as a nuclear option.
4. Add an optional session table with explicit logout support.

---

## Recommended Priority

1. Stop trusting client-authored progress and recompute/bound it server side.
2. Validate `lessons`, `badges`, and `videoProgress`.
3. Fix the empty `videoProgress` overwrite.
4. Bound XP and add auth rate limiting.
5. Improve token storage and account-state resilience.

---

## Additional Findings From Newly Added Account/API Code

### A1. Profile update allows empty-string names

**Location:** `backend/index.js`, `PUT /api/user/profile`

**Issue:** `name` is only validated when it is a string longer than 100 characters. An empty string can be stored directly if the API is called outside the frontend, while the frontend normalizes empty input to `null`.

**Fix options:**
1. Normalize empty/whitespace strings to `null` in the backend as well.
2. Return a validation message if `name` is an empty string.
3. Keep backend behavior loose but make frontend and direct API behavior documented.

### A2. Username uniqueness check is not transactional

**Location:** `backend/index.js`, `PUT /api/user/profile`

**Issue:** The code checks for an existing username and then updates in a separate query. Concurrent requests can pass the check and then collide, depending on the constraint or response timing.

**Fix options:**
1. Rely on the database unique constraint as the primary authority.
2. Wrap both operations in a transaction.
3. Use an upsert/update pattern that fails atomically.
4. Add better retry/error handling for constraint failures.

### A3. Password change does not invalidate old tokens

**Location:** `backend/index.js`, `POST /api/user/change-password`

**Issue:** After a successful password change, previously issued JWTs remain valid until expiry. This was noted globally but is especially relevant because account security features now exist.

**Fix options:**
1. Store a token/session version and reject older tokens.
2. Shorten JWT lifetime and add refresh tokens.
3. Maintain a password-change timestamp and reject tokens issued before it.
4. Keep current behavior but inform users that device/session invalidation is eventual.

### A4. Username uniqueness remains case-sensitive

**Location:** `backend/index.js`, signup and profile update queries

**Issue:** New account/profile features do not resolve the earlier case-sensitivity question. `Alice` and `alice` can still be treated as different users.

**Fix options:**
1. Normalize usernames to lowercase before storing/querying.
2. Add `COLLATE NOCASE` to the unique constraint or queries.
3. Add an explicit case-insensitive lookup.
4. Document case sensitivity as intended behavior.

### A5. Account page can overwrite in-progress edits with late profile fetch

**Location:** `app/src/pages/Account.tsx`

**Issue:** The profile fetch updates form state after mount. If the user starts editing before the fetch resolves, those edits can be overwritten.

**Fix options:**
1. Mark the initial fetch as "initial load complete" and only seed state once.
2. Disable or debounce form input until initial profile load completes.
3. Cache profile in context and treat it as the initial value only.
4. Add loading and error states that block editing until initial load completes.

Generated by read-only audit only; no application code was modified.
