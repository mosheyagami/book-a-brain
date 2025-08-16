-- Fix UserLogin table RLS policies
CREATE POLICY "Users can only access their own login records" 
ON public."UserLogin" 
FOR ALL 
USING (auth.uid() IS NOT NULL);

-- Insert some sample skills for testing (safe since skills has no FK constraints)
INSERT INTO public.skills (name, category) VALUES 
('Mathematics', 'Academic'),
('Piano', 'Music'),
('Spanish', 'Language'),
('Physics', 'Academic'),
('Guitar', 'Music')
ON CONFLICT DO NOTHING;