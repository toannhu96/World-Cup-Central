# Supabase Leaderboard + App Enhancements

## Goal
Add Supabase-powered global leaderboard with combined points (daily login +10, trivia +10, match prediction +20), merge Trivia into Leaderboard tab, add GA4 tracking, Dockerfile, and notification settings page.

---

## Project Type
**WEB** — Zalo Mini App (React + Vite + ZMP-UI)

## Success Criteria
- [ ] Global leaderboard shows top 10 users with real Supabase data
- [ ] Points auto-accumulate: daily login (+10), trivia correct (+10), correct prediction (+20)
- [ ] Trivia card is embedded inside the Leaderboard tab
- [ ] GA4 tracks page views and key events (prediction, trivia, check-in)
- [ ] Dockerfile builds and serves the app
- [ ] Settings page with notification toggles works
- [ ] All data persists across sessions via Supabase

---

## Tech Stack

| Technology | Purpose | Rationale |
|------------|---------|-----------|
| `@supabase/supabase-js` | DB client | User already has Supabase project. JS client is lightweight (~45kb) |
| `gtag.js` (GA4) | Analytics | Standard GA4 via script tag — no npm dependency needed |
| Docker (multi-stage) | Containerization | `node:alpine` build → `nginx:alpine` serve. Minimal image |
| Zalo SDK `getUserInfo` | User identity | Already in use. Zalo user ID = unique identifier in Supabase |

---

## Supabase Schema

### Table: `users`
```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,           -- Zalo user ID
  name TEXT NOT NULL,
  avatar TEXT DEFAULT '',
  total_points INTEGER DEFAULT 0,
  last_login_date DATE,          -- track daily check-in
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Leaderboard query index
CREATE INDEX idx_users_points ON users(total_points DESC);
```

### Table: `point_logs`
```sql
CREATE TABLE point_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT REFERENCES users(id),
  action TEXT NOT NULL,           -- 'daily_login' | 'trivia_correct' | 'prediction_correct'
  points INTEGER NOT NULL,        -- 10, 10, or 20
  metadata JSONB DEFAULT '{}',   -- { matchId, questionDate, etc. }
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Prevent duplicate daily login
CREATE UNIQUE INDEX idx_point_logs_daily ON point_logs(user_id, action, (created_at::date))
  WHERE action = 'daily_login';

-- Prevent duplicate trivia per day  
CREATE UNIQUE INDEX idx_point_logs_trivia ON point_logs(user_id, action, (metadata->>'questionDate'))
  WHERE action = 'trivia_correct';

-- Prevent duplicate prediction per match
CREATE UNIQUE INDEX idx_point_logs_prediction ON point_logs(user_id, action, (metadata->>'matchId'))
  WHERE action = 'prediction_correct';
```

### Table: `notification_settings`
```sql
CREATE TABLE notification_settings (
  user_id TEXT PRIMARY KEY REFERENCES users(id),
  alert_match_today BOOLEAN DEFAULT true,
  alert_match_1h_before BOOLEAN DEFAULT true,
  alert_match_result BOOLEAN DEFAULT true,
  alert_goals BOOLEAN DEFAULT false,
  alert_group_stage_complete BOOLEAN DEFAULT false,
  alert_your_prediction_result BOOLEAN DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Row Level Security (RLS)
```sql
-- Users can read all (for leaderboard), but only update their own
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read users" ON users FOR SELECT USING (true);
CREATE POLICY "Users can upsert own" ON users FOR ALL USING (true);

-- Point logs: user can read own, insert own
ALTER TABLE point_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read point_logs" ON point_logs FOR SELECT USING (true);
CREATE POLICY "Anyone can insert point_logs" ON point_logs FOR INSERT WITH CHECK (true);

-- Notification settings: user CRUD own
ALTER TABLE notification_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Read own notifications" ON notification_settings FOR SELECT USING (true);
CREATE POLICY "Upsert own notifications" ON notification_settings FOR ALL USING (true);
```

> **Note:** Using `anon` key with permissive RLS since auth is handled by Zalo SDK (not Supabase Auth). User identity is verified client-side via `getUserInfo()`. For production hardening, consider a Supabase Edge Function to validate Zalo tokens.

---

## Point System Rules

| Action | Points | Trigger | Dedup Rule |
|--------|--------|---------|------------|
| Daily Login | +10 | App opens, auto check-in | 1x per calendar day |
| Trivia Correct | +10 | Answer daily trivia correctly | 1x per question (date-based) |
| Prediction Correct | +20 | Match finishes, prediction was right (winner or exact) | 1x per match |

**Edge Cases:**
- Wrong trivia answer → +0, no retry
- Wrong prediction → +0
- Multiple app opens same day → only first counts
- Points are **append-only** (insert to `point_logs`), `users.total_points` updated via client-side increment

---

## File Structure (New/Modified)

```
src/
├── lib/
│   └── supabase.ts              ← NEW: Supabase client init
├── hooks/
│   ├── useLeaderboard.ts        ← NEW: Fetch top 10 + user rank
│   ├── useDailyCheckIn.ts       ← NEW: Auto check-in on mount
│   ├── useTrivia.ts             ← MODIFY: Award +10 to Supabase on correct
│   ├── usePredictions.ts        ← MODIFY: Award +20 to Supabase on correct
│   └── useNotificationSettings.ts ← NEW: CRUD notification prefs
├── components/
│   ├── Leaderboard.tsx          ← MODIFY: Real data + embedded Trivia
│   ├── TriviaCard.tsx           ← MODIFY: Sync with Supabase points
│   ├── MatchCard.tsx            ← MODIFY: Prediction result → Supabase
│   └── SettingsPage.tsx         ← NEW: Notification toggles
├── pages/
│   └── index.tsx                ← MODIFY: Add Settings tab, update filters
├── utils/
│   └── analytics.ts             ← NEW: GA4 helper functions
├── context/
│   └── AppContext.tsx           ← MODIFY: Add user Supabase sync
.env                             ← MODIFY: Add VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, VITE_GA4_ID
index.html                       ← MODIFY: Add GA4 script tag
Dockerfile                       ← NEW
.dockerignore                    ← NEW
```

---

## Notification Alert Options

| Alert | Description | Default |
|-------|-------------|---------|
| 🏟️ Match Today | Daily digest of today's matches | ✅ ON |
| ⏰ 1 Hour Before Kickoff | Reminder before match starts | ✅ ON |
| 📊 Match Result | Score notification when match ends | ✅ ON |
| ⚽ Goal Alerts | Real-time goal notifications | ❌ OFF |
| 🏆 Group Stage Complete | When a group stage finishes | ❌ OFF |
| 🎯 Your Prediction Result | How your prediction did | ✅ ON |

---

## Tasks

### Phase 1: Foundation (P0)

- [ ] **T1: Supabase Client Setup**
  - Install `@supabase/supabase-js`
  - Create `src/lib/supabase.ts` with client init from env vars
  - Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to `.env`
  - → Verify: `import { supabase } from '@/lib/supabase'` compiles, client connects
  - **Agent:** `backend-specialist` | **Skill:** `api-patterns`

- [ ] **T2: Database Schema**
  - Run SQL above in Supabase Dashboard (manual) or via migration
  - Create `users`, `point_logs`, `notification_settings` tables
  - Enable RLS policies
  - → Verify: Tables visible in Supabase Dashboard, RLS active
  - **Agent:** `backend-specialist` | **Skill:** `database-design`

### Phase 2: Core Logic (P1)

- [ ] **T3: Daily Check-In Hook**
  - Create `src/hooks/useDailyCheckIn.ts`
  - On mount: upsert user → check `last_login_date` → if today ≠ last, insert `point_logs` (+10) and update `users.total_points`
  - Use Zalo `getUserInfo` for user identity
  - Wire into `Layout.tsx` so it fires on every app open
  - → Verify: Open app → Supabase `point_logs` has entry → `users.total_points` incremented
  - **Agent:** `frontend-specialist` | **Skill:** `react-best-practices`

- [ ] **T4: Points Engine + Supabase Sync**
  - Modify `useTrivia.ts`: On correct answer → insert to `point_logs` (action: `trivia_correct`, +10)
  - Modify `usePredictions.ts`: On match result evaluated → insert to `point_logs` (action: `prediction_correct`, +20)
  - Keep local storage as cache, Supabase as source of truth for points
  - → Verify: Answer trivia correctly → +10 in Supabase. Correct prediction → +20 in Supabase
  - **Agent:** `frontend-specialist` | **Skill:** `react-best-practices`

- [ ] **T5: Leaderboard + Trivia Merge**
  - Create `src/hooks/useLeaderboard.ts`: Query `users` ORDER BY `total_points DESC LIMIT 10` + current user rank
  - Modify `Leaderboard.tsx`: Replace mock data with Supabase query. Show top 10 + current user position if not in top 10
  - Embed `TriviaCard` inside Leaderboard view (Trivia section above/below the ranking table)
  - Remove "Trivia" from filter tabs (now inside Leaderboard)
  - → Verify: Leaderboard shows real users. Trivia card visible within Leaderboard tab
  - **Agent:** `frontend-specialist` | **Skill:** `frontend-design`

### Phase 3: Features (P2)

- [ ] **T6: GA4 Analytics**
  - Create `src/utils/analytics.ts` with `trackEvent()` and `trackPageView()` helpers
  - Add GA4 `gtag.js` script to `index.html` with `VITE_GA4_ID`
  - Track events: `daily_checkin`, `trivia_answer`, `prediction_submit`, `leaderboard_view`, `settings_change`
  - → Verify: Open GA4 Realtime → events appear
  - **Agent:** `frontend-specialist` | **Skill:** `seo-fundamentals`

- [ ] **T7: Dockerfile**
  - Create multi-stage `Dockerfile`: Stage 1 `node:20-alpine` build, Stage 2 `nginx:alpine` serve
  - Create `.dockerignore` (node_modules, .git, .env)
  - Add nginx config for SPA routing
  - → Verify: `docker build -t wc-central .` succeeds, `docker run -p 8080:80 wc-central` serves app
  - **Agent:** `backend-specialist` | **Skill:** `deployment-procedures`

- [ ] **T8: Settings Page with Notification Toggles**
  - Create `src/components/SettingsPage.tsx` with toggle switches for each notification type
  - Create `src/hooks/useNotificationSettings.ts` for Supabase CRUD
  - Add "Settings" tab to filter bar in `index.tsx`
  - Use ZMP-UI `Switch` components for toggles
  - Persist to `notification_settings` table in Supabase
  - → Verify: Toggle a setting → refresh app → setting persists
  - **Agent:** `frontend-specialist` | **Skill:** `frontend-design`

### Phase 4: Polish & Wire-up (P3)

- [ ] **T9: Integration & Points Display**
  - Update `index.tsx` hero section "Your Pts" to read from Supabase `users.total_points`
  - Ensure all point mutations sync to Supabase and update UI reactively
  - Add loading/error states for Supabase operations
  - → Verify: Points in hero match Supabase `total_points` value
  - **Agent:** `frontend-specialist` | **Skill:** `react-best-practices`

- [ ] **T10: Build & Runtime Verification**
  - `pnpm run build` passes
  - `docker build` passes
  - `zmp start` runs and all features work
  - GA4 events fire in Realtime
  - Leaderboard loads from Supabase
  - → Verify: All above checks pass
  - **Agent:** `frontend-specialist`

---

## Dependencies Graph

```
T1 (Supabase Client) ──→ T2 (Schema)
         │
         ├──→ T3 (Daily Check-In) ──┐
         ├──→ T4 (Points Engine) ───┼──→ T5 (Leaderboard + Trivia) ──→ T9 (Integration)
         └──→ T8 (Settings) ────────┘                                        │
                                                                              ↓
T6 (GA4) ─── independent ──────────────────────────────────────────→ T10 (Verify)
T7 (Dockerfile) ─── independent ───────────────────────────────────→ T10 (Verify)
```

**Parallelizable:** T3, T4, T6, T7, T8 can all start after T1+T2.
**Serial:** T5 depends on T3+T4. T9 depends on T5. T10 is last.

---

## Phase X: Verification Checklist

- [ ] `pnpm run build` — no errors
- [ ] `docker build -t wc-central .` — builds successfully
- [ ] Supabase tables have correct RLS policies
- [ ] Daily check-in awards +10 (only once/day)
- [ ] Trivia correct awards +10 (only once/question)
- [ ] Prediction correct awards +20 (only once/match)
- [ ] Leaderboard shows top 10 from Supabase
- [ ] Trivia card visible inside Leaderboard tab
- [ ] GA4 Realtime shows events
- [ ] Settings toggles persist to Supabase
- [ ] No console errors in production build

---

## Notes

- **Supabase credentials** needed in `.env` before T1 can be verified
- **GA4 Measurement ID** needed before T6
- Current local storage (predictions, trivia) kept as offline cache — Supabase is source of truth for points
- Notification toggles save preferences; actual push notification delivery depends on Zalo's `requestSendNotification` API and template configuration in Zalo Developer Dashboard
