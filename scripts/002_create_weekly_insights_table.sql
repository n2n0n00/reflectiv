CREATE TABLE IF NOT EXISTS weekly_insights (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES neon_auth.users_sync(id),
  week_start DATE NOT NULL,
  week_end DATE NOT NULL,
  summary TEXT NOT NULL,
  key_themes TEXT[],
  emotional_trends JSONB,
  growth_highlights TEXT[],
  recommendations TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_weekly_insights_user_id ON weekly_insights(user_id);
CREATE INDEX IF NOT EXISTS idx_weekly_insights_week ON weekly_insights(week_start, week_end);
CREATE UNIQUE INDEX IF NOT EXISTS idx_weekly_insights_user_week ON weekly_insights(user_id, week_start);
