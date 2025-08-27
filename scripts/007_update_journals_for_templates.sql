-- Add template support to journal_entries table
ALTER TABLE journal_entries ADD COLUMN IF NOT EXISTS journal_id UUID;
ALTER TABLE journal_entries ADD COLUMN IF NOT EXISTS template_id VARCHAR(50);

-- Create journals table for multiple journal support
CREATE TABLE IF NOT EXISTS journals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  template_id VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true,
  entry_count INTEGER DEFAULT 0,
  last_entry_date TIMESTAMP WITH TIME ZONE
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_journals_user_id ON journals(user_id);
CREATE INDEX IF NOT EXISTS idx_journals_template_id ON journals(template_id);
CREATE INDEX IF NOT EXISTS idx_journal_entries_journal_id ON journal_entries(journal_id);

-- Update existing journal entries to have a default journal
DO $$
DECLARE
  user_record RECORD;
  default_journal_id UUID;
BEGIN
  FOR user_record IN SELECT DISTINCT user_id FROM journal_entries WHERE journal_id IS NULL
  LOOP
    -- Create a default "General Journaling" journal for existing entries
    INSERT INTO journals (user_id, template_id, title, description)
    VALUES (user_record.user_id, 'general', 'General Journaling', 'Your general journaling entries')
    RETURNING id INTO default_journal_id;
    
    -- Update existing entries to belong to this journal
    UPDATE journal_entries 
    SET journal_id = default_journal_id, template_id = 'general'
    WHERE user_id = user_record.user_id AND journal_id IS NULL;
  END LOOP;
END $$;

-- Make journal_id NOT NULL after migration
ALTER TABLE journal_entries ALTER COLUMN journal_id SET NOT NULL;
