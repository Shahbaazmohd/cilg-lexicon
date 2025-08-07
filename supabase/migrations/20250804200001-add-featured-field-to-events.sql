-- Add featured field to events table
ALTER TABLE public.events 
ADD COLUMN featured BOOLEAN NOT NULL DEFAULT false;

-- Add featured_order field for ordering featured events
ALTER TABLE public.events 
ADD COLUMN featured_order INTEGER;

-- Create index for better performance on featured queries
CREATE INDEX idx_events_featured ON public.events (featured, featured_order);

-- Update existing events to have featured = false
UPDATE public.events SET featured = false WHERE featured IS NULL;
