
-- First, let's add the missing columns to the existing profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT now();

-- Update the user_id column for existing records to match the id
UPDATE public.profiles SET user_id = id WHERE user_id IS NULL;

-- Create a comprehensive site settings table
CREATE TABLE IF NOT EXISTS public.site_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value JSONB,
  section TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on site_settings
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Create policy for site_settings - only admins can access
CREATE POLICY "Only admins can access site settings" ON public.site_settings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Insert default site settings
INSERT INTO public.site_settings (key, value, section, description) VALUES
('hero_title', '"Hi, I''m Sudip"', 'homepage', 'Main hero title'),
('hero_subtitle', '"Creative Video Editor & Graphics Designer"', 'homepage', 'Hero subtitle'),
('hero_image', '"/lovable-uploads/5ed59e3a-ec61-4fe2-a1d9-fae8e0b50c95.png"', 'homepage', 'Hero profile image'),
('about_title', '"ABOUT ME"', 'about', 'About section title'),
('about_name', '"HI, I''M SUDIP"', 'about', 'About name'),
('about_description', '"I''M A CREATIVE VIDEO EDITOR WITH A PASSION FOR VISUAL STORYTELLING. SPECIALIZED IN CREATING ENGAGING CONTENT ACROSS VARIOUS PLATFORMS, I BRING VISIONS TO LIFE THROUGH EFFECTS, EDITS, AND COMPELLING VISUAL STORIES."', 'about', 'About description'),
('about_image', '"/lovable-uploads/1021feb9-789c-49b6-8094-424f26c9afb3.png"', 'about', 'About section image'),
('contact_email', '"sudeepsnwr8@gmail.com"', 'contact', 'Contact email'),
('social_links', '{"linkedin": "", "twitter": "", "instagram": "", "github": ""}', 'social', 'Social media links'),
('seo_title', '"Creative Video Editor & Graphics Designer"', 'seo', 'SEO page title'),
('seo_description', '"Professional video editing and graphics design services"', 'seo', 'SEO meta description'),
('theme_colors', '{"primary": "#000000", "secondary": "#ffffff", "accent": "#gray"}', 'theme', 'Theme color scheme'),
('experience_years', '"Since 2020"', 'homepage', 'Years of experience'),
('projects_completed', '"COMPLETED 1000+ PROJECT"', 'homepage', 'Projects completed text')
ON CONFLICT (key) DO NOTHING;

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_site_settings_updated_at ON public.site_settings;
CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON public.site_settings 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
