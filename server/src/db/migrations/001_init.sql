CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  oauth_provider TEXT NOT NULL DEFAULT 'google',
  oauth_provider_user_id TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  display_name TEXT,
  avatar_url TEXT,
  password_hash TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(oauth_provider, oauth_provider_user_id)
);

CREATE TABLE IF NOT EXISTS scoring_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  version TEXT NOT NULL DEFAULT 'v1',
  base_minutes_unit INT NOT NULL DEFAULT 20,
  min_session_minutes INT NOT NULL DEFAULT 10,
  daily_minutes_cap INT NOT NULL DEFAULT 360,
  quality_multipliers JSONB NOT NULL DEFAULT '{"1":0.7,"2":0.85,"3":1.0,"4":1.15,"5":1.3}',
  difficulty_multipliers JSONB NOT NULL DEFAULT '{"easy":0.95,"medium":1.0,"hard":1.1}',
  planned_bonus NUMERIC NOT NULL DEFAULT 0.5,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, version)
);

CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  duration_minutes INT NOT NULL CHECK (duration_minutes > 0),
  quality_rating INT NOT NULL CHECK (quality_rating BETWEEN 1 AND 5),
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  is_planned BOOLEAN NOT NULL DEFAULT FALSE,
  is_micro_session BOOLEAN NOT NULL DEFAULT FALSE,
  notes TEXT,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS daily_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  score_date DATE NOT NULL,
  total_minutes INT NOT NULL DEFAULT 0,
  total_score INT NOT NULL DEFAULT 0,
  contribution_level INT NOT NULL DEFAULT 0 CHECK (contribution_level BETWEEN 0 AND 4),
  scoring_version TEXT NOT NULL DEFAULT 'v1',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, score_date)
);

ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash TEXT;

CREATE INDEX IF NOT EXISTS idx_sessions_user_started_at ON sessions(user_id, started_at DESC);
CREATE INDEX IF NOT EXISTS idx_daily_scores_user_date ON daily_scores(user_id, score_date DESC);

