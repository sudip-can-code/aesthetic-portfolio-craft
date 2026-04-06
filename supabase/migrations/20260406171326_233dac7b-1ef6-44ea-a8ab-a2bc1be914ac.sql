
-- Create projects table
CREATE TABLE public.projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT,
  video_url TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Projects are viewable by everyone" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert projects" ON public.projects FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update projects" ON public.projects FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete projects" ON public.projects FOR DELETE TO authenticated USING (true);

-- Create testimonials table
CREATE TABLE public.testimonials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  position TEXT NOT NULL,
  company TEXT NOT NULL,
  text TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Testimonials are viewable by everyone" ON public.testimonials FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert testimonials" ON public.testimonials FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update testimonials" ON public.testimonials FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete testimonials" ON public.testimonials FOR DELETE TO authenticated USING (true);

-- Create client_logos table
CREATE TABLE public.client_logos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  logo_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.client_logos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Client logos are viewable by everyone" ON public.client_logos FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert client logos" ON public.client_logos FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update client logos" ON public.client_logos FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete client logos" ON public.client_logos FOR DELETE TO authenticated USING (true);

-- Create software_logos table
CREATE TABLE public.software_logos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  logo_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.software_logos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Software logos are viewable by everyone" ON public.software_logos FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert software logos" ON public.software_logos FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update software logos" ON public.software_logos FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete software logos" ON public.software_logos FOR DELETE TO authenticated USING (true);

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  avatar_url TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

-- Create site_settings table
CREATE TABLE public.site_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value JSONB,
  section TEXT NOT NULL DEFAULT 'general',
  description TEXT NOT NULL DEFAULT ''
);
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Site settings are viewable by everyone" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Authenticated users can update site settings" ON public.site_settings FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert site settings" ON public.site_settings FOR INSERT TO authenticated WITH CHECK (true);

-- Create trigger for profile creation on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create storage bucket for portfolio assets
INSERT INTO storage.buckets (id, name, public) VALUES ('portfolio', 'portfolio', true);
CREATE POLICY "Portfolio files are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'portfolio');
CREATE POLICY "Authenticated users can upload portfolio files" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'portfolio');
CREATE POLICY "Authenticated users can update portfolio files" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'portfolio');
CREATE POLICY "Authenticated users can delete portfolio files" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'portfolio');

-- Insert default site settings
INSERT INTO public.site_settings (key, value, section, description) VALUES
  ('hero_name', '"Sudip"', 'hero', 'Your display name'),
  ('hero_title', '"Video Editor & Designer"', 'hero', 'Your title/role'),
  ('hero_description', '"Creative professional with 5+ years of experience"', 'hero', 'Hero section description'),
  ('cv_url', '"https://docs.google.com/document/d/17aOFpW7eFdSU3GDhAZWe7W8tXNBOu5pCytp0ZYM5Rro/edit?usp=sharing"', 'hero', 'CV download URL'),
  ('contact_email', '"sudeepsnwr8@gmail.com"', 'contact', 'Contact email address'),
  ('contact_phone', '"9840401157"', 'contact', 'Contact phone number'),
  ('contact_location', '"Kathmandu, Nepal"', 'contact', 'Your location'),
  ('social_links', '{"github":"https://github.com/sudip-can-code","linkedin":"https://www.linkedin.com/feed/","instagram":"https://www.instagram.com/mr_jijicha"}', 'social', 'Social media links'),
  ('about_description', '"Have a project in mind or want to discuss a collaboration? Feel free to reach out."', 'contact', 'Contact section description');
