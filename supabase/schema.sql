-- Mailwise Database Schema
-- Run this in your Supabase SQL editor

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  avatar_url TEXT,
  tier TEXT NOT NULL DEFAULT 'free' CHECK (tier IN ('free', 'basic', 'pro', 'elite')),
  google_access_token TEXT,
  google_refresh_token TEXT,
  paypal_subscription_id TEXT,
  subscription_status TEXT DEFAULT 'inactive',
  summary_enabled BOOLEAN DEFAULT true,
  summary_time TIME DEFAULT '08:00:00',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Watchers table
CREATE TABLE IF NOT EXISTS watchers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('price', 'appointment')),
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  target_price NUMERIC,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'error')),
  last_value TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Watcher runs table
CREATE TABLE IF NOT EXISTS watcher_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  watcher_id UUID NOT NULL REFERENCES watchers(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('ok', 'triggered', 'error')),
  result TEXT,
  ran_at TIMESTAMPTZ DEFAULT now()
);

-- Alerts table
CREATE TABLE IF NOT EXISTS alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  watcher_id UUID REFERENCES watchers(id) ON DELETE SET NULL,
  type TEXT NOT NULL,
  message TEXT NOT NULL,
  sent_at TIMESTAMPTZ DEFAULT now()
);

-- Email connections table
CREATE TABLE IF NOT EXISTS email_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  provider TEXT DEFAULT 'gmail',
  access_token TEXT,
  refresh_token TEXT,
  connected_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS watchers_user_id_idx ON watchers(user_id);
CREATE INDEX IF NOT EXISTS watchers_status_idx ON watchers(status);
CREATE INDEX IF NOT EXISTS watcher_runs_watcher_id_idx ON watcher_runs(watcher_id);
CREATE INDEX IF NOT EXISTS watcher_runs_ran_at_idx ON watcher_runs(ran_at);
CREATE INDEX IF NOT EXISTS alerts_user_id_idx ON alerts(user_id);
CREATE INDEX IF NOT EXISTS alerts_sent_at_idx ON alerts(sent_at);

-- Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE watchers ENABLE ROW LEVEL SECURITY;
ALTER TABLE watcher_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;

-- RLS Policies (service role bypasses these)
CREATE POLICY "Users can read own data" ON users
  FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid()::text = id::text);

CREATE POLICY "Users can read own watchers" ON watchers
  FOR ALL USING (user_id IN (SELECT id FROM users WHERE auth.uid()::text = id::text));

CREATE POLICY "Users can read own alerts" ON alerts
  FOR SELECT USING (user_id IN (SELECT id FROM users WHERE auth.uid()::text = id::text));

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER watchers_updated_at BEFORE UPDATE ON watchers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
