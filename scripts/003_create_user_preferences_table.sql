CREATE TABLE IF NOT EXISTS user_preferences (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES neon_auth.users_sync(id) UNIQUE,
  daily_reminders BOOLEAN DEFAULT true,
  reminder_time TIME DEFAULT '19:00:00',
  weekly_insights BOOLEAN DEFAULT true,
  theme_preference TEXT DEFAULT 'balanced',
  privacy_level TEXT DEFAULT 'private',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_user_preferences_user_id ON user_preferences(user_id);
