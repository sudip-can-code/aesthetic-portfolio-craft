
-- Create a table to store software logos that can be managed from admin panel
CREATE TABLE public.software_logos (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  logo_url text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS (though we'll make it public for display purposes)
ALTER TABLE public.software_logos ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to view software logos (for public display)
CREATE POLICY "Anyone can view software logos" 
  ON public.software_logos 
  FOR SELECT 
  TO public 
  USING (true);

-- Create policy to allow authenticated users to manage software logos (admin panel)
CREATE POLICY "Authenticated users can manage software logos" 
  ON public.software_logos 
  FOR ALL 
  TO authenticated 
  USING (true)
  WITH CHECK (true);

-- Add trigger to update the updated_at column
CREATE TRIGGER update_software_logos_updated_at
  BEFORE UPDATE ON public.software_logos
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some default software logos
INSERT INTO public.software_logos (name, logo_url) VALUES
  ('Adobe Premiere Pro', '/placeholder.svg'),
  ('Adobe After Effects', '/placeholder.svg'),
  ('Avid Media Composer', '/placeholder.svg'),
  ('Final Cut Pro', '/placeholder.svg'),
  ('DaVinci Resolve', '/placeholder.svg'),
  ('Adobe Photoshop', '/placeholder.svg'),
  ('Adobe Illustrator', '/placeholder.svg');
