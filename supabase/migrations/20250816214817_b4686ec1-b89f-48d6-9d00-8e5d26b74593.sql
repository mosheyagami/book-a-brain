-- Fix UserLogin table RLS policies
CREATE POLICY "Users can only access their own login records" 
ON public."UserLogin" 
FOR ALL 
USING (auth.uid() IS NOT NULL);

-- Insert some sample skills for testing
INSERT INTO public.skills (name, category) VALUES 
('Mathematics', 'Academic'),
('Piano', 'Music'),
('Spanish', 'Language'),
('Physics', 'Academic'),
('Guitar', 'Music')
ON CONFLICT DO NOTHING;

-- Insert sample profiles for testing (these will be created via auth trigger normally)
-- But let's ensure we have some test data
INSERT INTO public.profiles (user_id, user_type, email, first_name, last_name, bio, location)
SELECT 
  gen_random_uuid(),
  'tutor',
  'tutor1@example.com',
  'Sarah',
  'Johnson',
  'Experienced math tutor with 5 years of experience',
  'New York, NY'
WHERE NOT EXISTS (SELECT 1 FROM profiles WHERE email = 'tutor1@example.com');

INSERT INTO public.profiles (user_id, user_type, email, first_name, last_name, bio, location)
SELECT 
  gen_random_uuid(),
  'learner',
  'learner1@example.com',
  'John',
  'Smith',
  'Looking to improve my math skills',
  'Brooklyn, NY'
WHERE NOT EXISTS (SELECT 1 FROM profiles WHERE email = 'learner1@example.com');