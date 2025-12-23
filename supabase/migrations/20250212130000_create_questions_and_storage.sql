/*
  # Create Questions, Notifications and Storage

  ## Query Description:
  1. Creates 'questions' table for user Q&A.
  2. Creates 'notifications' table for system alerts.
  3. Sets up Storage bucket for images.
  4. Adds RLS policies.

  ## Metadata:
  - Schema-Category: "Structural"
  - Impact-Level: "Medium"
  - Requires-Backup: false
  - Reversible: true

  ## Structure Details:
  - public.questions (id, user_id, content, image_url, tag, likes_count, comments_count, created_at)
  - public.notifications (id, user_id, title, message, type, is_read, created_at)
*/

-- Create Questions Table
CREATE TABLE IF NOT EXISTS public.questions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  tag TEXT NOT NULL,
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create Notifications Table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id), -- Nullable for global notifications if needed, but usually specific
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT CHECK (type IN ('admin', 'info', 'success', 'warning')) DEFAULT 'info',
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Policies for Questions
CREATE POLICY "Anyone can view questions" ON public.questions
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert questions" ON public.questions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policies for Notifications
CREATE POLICY "Users can view their own notifications" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);

-- Storage Setup (Note: SQL creation of buckets is sometimes restricted, usually done via API/Dashboard, but we try here)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('question-images', 'question-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'question-images');
CREATE POLICY "Auth Upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'question-images' AND auth.role() = 'authenticated');
