-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,           -- Zalo user ID
  name TEXT NOT NULL,
  avatar TEXT DEFAULT '',
  total_points INTEGER DEFAULT 0,
  last_login_date DATE,          -- Track daily check-in
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_points ON users(total_points DESC);

-- 2. Point Logs Table
CREATE TABLE IF NOT EXISTS point_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT REFERENCES users(id),
  action TEXT NOT NULL,           -- 'daily_login' | 'trivia_correct' | 'prediction_correct'
  points INTEGER NOT NULL,        -- 10, 10, or 20
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Helper for immutable date extraction (required for unique indexes on timestamptz)
CREATE OR REPLACE FUNCTION date_utc(ts TIMESTAMPTZ) RETURNS DATE AS $$
  BEGIN
    RETURN (ts AT TIME ZONE 'UTC')::DATE;
  END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Dedup Constraints
CREATE UNIQUE INDEX IF NOT EXISTS idx_point_logs_daily ON point_logs(user_id, action, (date_utc(created_at)))
  WHERE action = 'daily_login';

CREATE UNIQUE INDEX IF NOT EXISTS idx_point_logs_trivia ON point_logs(user_id, action, (metadata->>'questionDate'))
  WHERE action = 'trivia_correct';

CREATE UNIQUE INDEX IF NOT EXISTS idx_point_logs_prediction ON point_logs(user_id, action, (metadata->>'matchId'))
  WHERE action = 'prediction_correct';

-- 3. Notification Settings Table
CREATE TABLE IF NOT EXISTS notification_settings (
  user_id TEXT PRIMARY KEY REFERENCES users(id),
  alert_match_today BOOLEAN DEFAULT true,
  alert_match_1h_before BOOLEAN DEFAULT true,
  alert_match_result BOOLEAN DEFAULT true,
  alert_goals BOOLEAN DEFAULT false,
  alert_group_stage_complete BOOLEAN DEFAULT false,
  alert_your_prediction_result BOOLEAN DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Atomic increment function
CREATE OR REPLACE FUNCTION increment_points(row_id TEXT, amount INT)
RETURNS void AS $$
BEGIN
  UPDATE users
  SET total_points = total_points + amount,
      updated_at = NOW()
  WHERE id = row_id;
END;
$$ LANGUAGE plpgsql;

-- 5. Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE point_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_settings ENABLE ROW LEVEL SECURITY;

-- 6. Policies
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Anyone can read users') THEN
        CREATE POLICY "Anyone can read users" ON users FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can upsert own') THEN
        CREATE POLICY "Users can upsert own" ON users FOR ALL USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Anyone can read point_logs') THEN
        CREATE POLICY "Anyone can read point_logs" ON point_logs FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Anyone can insert point_logs') THEN
        CREATE POLICY "Anyone can insert point_logs" ON point_logs FOR INSERT WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Read own notifications') THEN
        CREATE POLICY "Read own notifications" ON notification_settings FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Upsert own notifications') THEN
        CREATE POLICY "Upsert own notifications" ON notification_settings FOR ALL USING (true);
    END IF;
END $$;
