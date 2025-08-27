-- Create a view for user statistics to make queries easier
CREATE OR REPLACE VIEW user_stats AS
SELECT 
  u.id as user_id,
  u.name,
  u.email,
  COUNT(je.id) as total_entries,
  MIN(je.entry_date) as first_entry_date,
  MAX(je.entry_date) as last_entry_date,
  ROUND(AVG(LENGTH(je.generated_entry))) as avg_entry_length,
  COUNT(DISTINCT DATE_TRUNC('week', je.entry_date)) as total_weeks_active
FROM users u
LEFT JOIN journal_entries je ON u.id = je.user_id
GROUP BY u.id, u.name, u.email;
