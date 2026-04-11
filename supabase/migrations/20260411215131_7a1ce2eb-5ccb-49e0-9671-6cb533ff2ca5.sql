
-- Tracking sessions table
CREATE TABLE public.tracking_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_code TEXT NOT NULL UNIQUE DEFAULT substring(md5(random()::text) from 1 for 8),
  name TEXT NOT NULL DEFAULT 'Unnamed Target',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Location pings table
CREATE TABLE public.location_pings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES public.tracking_sessions(id) ON DELETE CASCADE,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  accuracy DOUBLE PRECISION,
  speed DOUBLE PRECISION,
  heading DOUBLE PRECISION,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX idx_location_pings_session ON public.location_pings(session_id);
CREATE INDEX idx_location_pings_created ON public.location_pings(created_at DESC);
CREATE INDEX idx_tracking_sessions_code ON public.tracking_sessions(session_code);

-- Enable RLS
ALTER TABLE public.tracking_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.location_pings ENABLE ROW LEVEL SECURITY;

-- Public access policies (tracking links are public by design)
CREATE POLICY "Anyone can create tracking sessions" ON public.tracking_sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can view tracking sessions" ON public.tracking_sessions FOR SELECT USING (true);
CREATE POLICY "Anyone can update tracking sessions" ON public.tracking_sessions FOR UPDATE USING (true);

CREATE POLICY "Anyone can insert location pings" ON public.location_pings FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can view location pings" ON public.location_pings FOR SELECT USING (true);

-- Enable realtime for live tracking
ALTER PUBLICATION supabase_realtime ADD TABLE public.location_pings;
ALTER PUBLICATION supabase_realtime ADD TABLE public.tracking_sessions;
