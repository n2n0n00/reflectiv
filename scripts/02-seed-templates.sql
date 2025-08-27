-- Insert default journal templates
INSERT INTO public.journal_templates (name, description, focus_area, color, icon) VALUES
('People Pleasing', 'Explore patterns of putting others'' needs before your own and develop healthy boundaries', 'boundaries', 'bg-rose-500', 'Heart'),
('Overthinking', 'Break free from mental loops and develop clarity in decision-making', 'mindfulness', 'bg-blue-500', 'Brain'),
('Perfectionism', 'Challenge unrealistic standards and embrace progress over perfection', 'self-compassion', 'bg-purple-500', 'Target'),
('Anxiety & Worry', 'Process anxious thoughts and develop coping strategies for uncertainty', 'emotional-regulation', 'bg-yellow-500', 'Shield'),
('Self-Worth', 'Build confidence and develop a healthier relationship with yourself', 'self-esteem', 'bg-green-500', 'Star'),
('Relationships', 'Navigate interpersonal dynamics and improve communication skills', 'connection', 'bg-pink-500', 'Users'),
('Life Transitions', 'Process change and uncertainty while finding your path forward', 'growth', 'bg-indigo-500', 'ArrowRight'),
('Daily Reflection', 'General journaling for daily thoughts, gratitude, and self-discovery', 'mindfulness', 'bg-cyan-500', 'BookOpen')
ON CONFLICT DO NOTHING;
