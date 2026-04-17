-- Enable scheduler extensions
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Pinged projects table
CREATE TABLE public.pinged_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  interval_minutes INTEGER NOT NULL DEFAULT 60,
  enabled BOOLEAN NOT NULL DEFAULT true,
  last_pinged_at TIMESTAMPTZ,
  last_status_code INTEGER,
  last_error TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.pinged_projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view pinged projects"
  ON public.pinged_projects FOR SELECT
  TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert pinged projects"
  ON public.pinged_projects FOR INSERT
  TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update pinged projects"
  ON public.pinged_projects FOR UPDATE
  TO authenticated USING (true);

CREATE POLICY "Authenticated users can delete pinged projects"
  ON public.pinged_projects FOR DELETE
  TO authenticated USING (true);

-- Ping logs table
CREATE TABLE public.ping_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.pinged_projects(id) ON DELETE CASCADE,
  status_code INTEGER,
  success BOOLEAN NOT NULL DEFAULT false,
  response_time_ms INTEGER,
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.ping_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view ping logs"
  ON public.ping_logs FOR SELECT
  TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert ping logs"
  ON public.ping_logs FOR INSERT
  TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can delete ping logs"
  ON public.ping_logs FOR DELETE
  TO authenticated USING (true);

CREATE INDEX idx_ping_logs_project_id ON public.ping_logs(project_id, created_at DESC);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

CREATE TRIGGER pinged_projects_updated_at
  BEFORE UPDATE ON public.pinged_projects
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();