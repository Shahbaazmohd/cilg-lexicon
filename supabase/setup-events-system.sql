-- =====================================================
-- EVENTS SYSTEM SETUP - RUN THIS IN SUPABASE SQL EDITOR
-- =====================================================

-- 1. Create events-images storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'events-images',
  'events-images',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
) ON CONFLICT (id) DO NOTHING;

-- 2. Set up RLS policies for events-images bucket
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' 
        AND policyname = 'Public Access for events-images' 
        AND schemaname = 'storage'
    ) THEN
        CREATE POLICY "Public Access for events-images" ON storage.objects
          FOR SELECT USING (bucket_id = 'events-images');
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' 
        AND policyname = 'Authenticated users can upload event images' 
        AND schemaname = 'storage'
    ) THEN
        CREATE POLICY "Authenticated users can upload event images" ON storage.objects
          FOR INSERT WITH CHECK (
            bucket_id = 'events-images' 
            AND auth.role() = 'authenticated'
          );
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' 
        AND policyname = 'Authenticated users can update event images' 
        AND schemaname = 'storage'
    ) THEN
        CREATE POLICY "Authenticated users can update event images" ON storage.objects
          FOR UPDATE USING (
            bucket_id = 'events-images' 
            AND auth.role() = 'authenticated'
          );
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' 
        AND policyname = 'Authenticated users can delete event images' 
        AND schemaname = 'storage'
    ) THEN
        CREATE POLICY "Authenticated users can delete event images" ON storage.objects
          FOR DELETE USING (
            bucket_id = 'events-images' 
            AND auth.role() = 'authenticated'
          );
    END IF;
END $$;

-- 3. Create events table
CREATE TABLE IF NOT EXISTS public.events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('conference', 'workshop', 'lecture', 'seminar', 'webinar')),
  date DATE NOT NULL,
  time VARCHAR(100) NOT NULL,
  location VARCHAR(255) NOT NULL,
  is_virtual BOOLEAN DEFAULT false,
  description TEXT NOT NULL,
  speakers TEXT[] NOT NULL,
  registration_url TEXT,
  capacity INTEGER,
  registered INTEGER DEFAULT 0,
  image TEXT,
  status VARCHAR(20) NOT NULL CHECK (status IN ('upcoming', 'ongoing', 'past')),
  featured BOOLEAN NOT NULL DEFAULT false,
  featured_order INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create index for better performance on featured queries
CREATE INDEX IF NOT EXISTS idx_events_featured ON public.events (featured, featured_order);

-- 5. Enable Row Level Security for events table
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- 6. Create RLS policies for events table
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

-- 7. Create trigger for automatic timestamp updates
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
NEW.updated_at = now();
RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_events_updated_at
BEFORE UPDATE ON public.events
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- 8. Insert sample events data
INSERT INTO public.events (title, type, date, time, location, is_virtual, description, speakers, registration_url, capacity, registered, image, status, featured)
VALUES
  ('Inaugural Lecture', 'conference', '2024-03-15', '09:00 AM - 05:00 PM', 'University Auditorium', false, 'The Centre for International Law and Governance (CILG), previously International Economic Law and International Relations Cell (IEL&IRC), marked its inception with a landmark event on 4th November 2022, successfully conducting its inaugural lecture featuring Prof. (Retd.) Abhijit Das—renowned trade expert and former Head of the Centre for WTO Studies—as the Guest of Honour and Keynote Speaker. Held as part of the webinar themed "The Changing Paradigms of International Law in the New Global Order", the lecture offered a thought-provoking examination of how shifts in global economic and political dynamics are reshaping the landscape of international trade and law.', ARRAY['Prof. Sarah Johnson', 'Dr. Michael Chen', 'Hon. Justice Williams'], '#', 200, 145, NULL, 'upcoming', true),
  
  ('GUEST LECTURE & WORKSHOP', 'workshop', '2024-02-28', '02:00 PM - 04:00 PM', 'Online', true, 'The USLLS Centre for International Law Governance (previously) International Economic Law & International Relations Cell (IEL&IRC) was pleased to host a prestigious Guest Lecture cum Workshop on May 3, 2024, centred around the theme "WTO and Dispute Settlement". The session was led by Ms. Vishakha Srivastava, Senior Research Fellow (Legal) at the Centre for WTO Studies, Ministry of Commerce, Government of India. With her extensive experience in the field of international trade law, Ms. Srivastava provided an in-depth analysis of the institutional framework and functioning of the World Trade Organization (WTO), particularly focusing on its pivotal dispute settlement mechanism.', ARRAY['Dr. Emma Rodriguez', 'Prof. David Kim'], '#', 50, 32, NULL, 'upcoming', true),
  
  ('PANEL DISCUSSION', 'lecture', '2024-02-20', '03:30 PM - 05:00 PM', 'Law Faculty Building, Room 301', false, 'Continuing its endeavour to engage students in contemporary global issues, the USLLS CILG organized an impactful Panel Discussion on the topic "Impact of the Russia-Ukraine War on International Trade & Policy" on Thursday, 21st September 2023. The event featured two eminent experts in the field of international trade and law—Mr. Gautam Shahi, Partner at Dua Associates, and Mr. Ajinkya Gunjan Mishra, Partner at S&R Associates—who brought to the table their vast knowledge and professional insights. Held at the Moot Court Hall, USLLS, the discussion aimed to unravel the multifaceted implications of the ongoing geopolitical conflict on international trade dynamics, economic sanctions, global supply chains, and policy-making processes.', ARRAY['Hon. Fatou Bensouda'], '#', NULL, NULL, NULL, 'upcoming', false),
  
  ('DECLAMATION COMPETITION', 'seminar', '2024-01-30', '11:00 AM - 12:30 PM', 'Conference Room A', false, 'In its continued mission to promote scholarly dialogue and student engagement in emerging areas of international economic law and diplomacy, the USLLS Centre for International Law and Governance was thrilled to launch the first on-campus event of the September season: a Declamation Competition on the compelling theme India and its Bargaining Power under the Free Trade Agreement: Understanding the Influence of Non-Tariff Barriers in International Trade', ARRAY['Prof. Michael Chen', 'Dr. Sarah Johnson'], NULL, NULL, NULL, NULL, 'past', false);

-- 9. Create notices table
CREATE TABLE IF NOT EXISTS public.notices (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  link_url TEXT NOT NULL,
  link_text VARCHAR(255) NOT NULL,
  category VARCHAR(50) DEFAULT 'general',
  priority INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. Create index for better performance on notices
CREATE INDEX IF NOT EXISTS idx_notices_active ON public.notices (is_active, priority DESC);
CREATE INDEX IF NOT EXISTS idx_notices_featured ON public.notices (featured, created_at DESC);

-- 11. Enable Row Level Security for notices table
ALTER TABLE public.notices ENABLE ROW LEVEL SECURITY;

-- 12. Create RLS policies for notices table
CREATE POLICY "Anyone can view active notices" 
ON public.notices 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Anyone can submit notices" 
ON public.notices 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Admins can view all notices" 
ON public.notices 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can update notices" 
ON public.notices 
FOR UPDATE 
USING (true);

CREATE POLICY "Admins can delete notices" 
ON public.notices 
FOR DELETE 
USING (true);

-- 13. Create trigger for automatic timestamp updates for notices
CREATE TRIGGER update_notices_updated_at
BEFORE UPDATE ON public.notices
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- 14. Insert sample notices data
INSERT INTO public.notices (title, description, link_url, link_text, category, priority, is_active, featured)
VALUES
  ('Important Academic Calendar Update', 'Updated academic calendar for the current semester with revised dates for examinations and events.', 'https://example.com/academic-calendar', 'View Academic Calendar', 'academic', 1, true, true),
  
  ('Research Grant Opportunities', 'New research grant opportunities available for faculty and students in international law and governance.', 'https://example.com/research-grants', 'Apply for Grants', 'research', 2, true, true),
  
  ('Student Registration Portal', 'Online registration portal for new and returning students. Complete your registration before the deadline.', 'https://example.com/registration', 'Register Now', 'student', 3, true, false),
  
  ('Faculty Development Workshop', 'Upcoming workshop on innovative teaching methodologies and research techniques.', 'https://example.com/faculty-workshop', 'Register for Workshop', 'faculty', 2, true, false);

-- 15. Verify the setup
SELECT 
    'Events table created' as status,
    CASE WHEN EXISTS(SELECT 1 FROM information_schema.tables WHERE table_name = 'events' AND table_schema = 'public') 
         THEN 'true' ELSE 'false' END as table_exists
UNION ALL
SELECT 
    'Events-images bucket created' as status,
    CASE WHEN EXISTS(SELECT 1 FROM storage.buckets WHERE id = 'events-images') 
         THEN 'true' ELSE 'false' END as bucket_exists
UNION ALL
SELECT 
    'Events RLS policies created' as status,
    CAST(COUNT(*) AS TEXT) as policy_count
FROM pg_policies 
WHERE tablename = 'events' 
AND schemaname = 'public'
UNION ALL
SELECT 
    'Notices table created' as status,
    CASE WHEN EXISTS(SELECT 1 FROM information_schema.tables WHERE table_name = 'notices' AND table_schema = 'public') 
         THEN 'true' ELSE 'false' END as table_exists
UNION ALL
SELECT 
    'Notices RLS policies created' as status,
    CAST(COUNT(*) AS TEXT) as policy_count
FROM pg_policies 
WHERE tablename = 'notices' 
AND schemaname = 'public';
