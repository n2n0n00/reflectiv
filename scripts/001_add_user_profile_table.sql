-- Add user profile table for storing user descriptions and preferences
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  interests TEXT[],
  goals TEXT[],
  journaling_experience TEXT CHECK (journaling_experience IN ('beginner', 'intermediate', 'experienced')),
  preferred_question_style TEXT CHECK (preferred_question_style IN ('reflective', 'goal-oriented', 'creative', 'analytical')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Add profile_completed column to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_completed BOOLEAN DEFAULT FALSE;
