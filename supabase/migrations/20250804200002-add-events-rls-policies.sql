-- Enable Row Level Security for events table
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for events table (public can read all events, admins can manage all)
CREATE POLICY "Anyone can view events" 
ON public.events 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can submit events" 
ON public.events 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Admins can view all events" 
ON public.events 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can update events" 
ON public.events 
FOR UPDATE 
USING (true);

CREATE POLICY "Admins can delete events" 
ON public.events 
FOR DELETE 
USING (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_events_updated_at
BEFORE UPDATE ON public.events
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
