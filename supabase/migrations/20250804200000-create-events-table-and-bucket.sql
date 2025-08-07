-- Create events-images storage bucket for event images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'events-images',
  'events-images',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
);

-- Set up RLS policies for events-images bucket
CREATE POLICY "Public Access" ON storage.objects
  FOR SELECT USING (bucket_id = 'events-images');

CREATE POLICY "Authenticated users can upload event images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'events-images' 
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Authenticated users can update event images" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'events-images' 
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Authenticated users can delete event images" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'events-images' 
    AND auth.role() = 'authenticated'
  );

-- Create events table
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
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample events data
INSERT INTO public.events (title, type, date, time, location, is_virtual, description, speakers, registration_url, capacity, registered, image, status)
VALUES
  ('Inaugural Lecture', 'conference', '2024-03-15', '09:00 AM - 05:00 PM', 'University Auditorium', false, 'The Centre for International Law and Governance (CILG), previously International Economic Law and International Relations Cell (IEL&IRC), marked its inception with a landmark event on 4th November 2022, successfully conducting its inaugural lecture featuring Prof. (Retd.) Abhijit Das—renowned trade expert and former Head of the Centre for WTO Studies—as the Guest of Honour and Keynote Speaker. Held as part of the webinar themed "The Changing Paradigms of International Law in the New Global Order", the lecture offered a thought-provoking examination of how shifts in global economic and political dynamics are reshaping the landscape of international trade and law.', ARRAY['Prof. Sarah Johnson', 'Dr. Michael Chen', 'Hon. Justice Williams'], '#', 200, 145, NULL, 'upcoming'),
  
  ('GUEST LECTURE & WORKSHOP', 'workshop', '2024-02-28', '02:00 PM - 04:00 PM', 'Online', true, 'The USLLS Centre for International Law Governance (previously) International Economic Law & International Relations Cell (IEL&IRC) was pleased to host a prestigious Guest Lecture cum Workshop on May 3, 2024, centred around the theme "WTO and Dispute Settlement". The session was led by Ms. Vishakha Srivastava, Senior Research Fellow (Legal) at the Centre for WTO Studies, Ministry of Commerce, Government of India. With her extensive experience in the field of international trade law, Ms. Srivastava provided an in-depth analysis of the institutional framework and functioning of the World Trade Organization (WTO), particularly focusing on its pivotal dispute settlement mechanism.', ARRAY['Dr. Emma Rodriguez', 'Prof. David Kim'], '#', 50, 32, NULL, 'upcoming'),
  
  ('PANEL DISCUSSION', 'lecture', '2024-02-20', '03:30 PM - 05:00 PM', 'Law Faculty Building, Room 301', false, 'Continuing its endeavour to engage students in contemporary global issues, the USLLS CILG organized an impactful Panel Discussion on the topic "Impact of the Russia-Ukraine War on International Trade & Policy" on Thursday, 21st September 2023. The event featured two eminent experts in the field of international trade and law—Mr. Gautam Shahi, Partner at Dua Associates, and Mr. Ajinkya Gunjan Mishra, Partner at S&R Associates—who brought to the table their vast knowledge and professional insights. Held at the Moot Court Hall, USLLS, the discussion aimed to unravel the multifaceted implications of the ongoing geopolitical conflict on international trade dynamics, economic sanctions, global supply chains, and policy-making processes.', ARRAY['Hon. Fatou Bensouda'], '#', NULL, NULL, NULL, 'upcoming'),
  
  ('DECLAMATION COMPETITION', 'seminar', '2024-01-30', '11:00 AM - 12:30 PM', 'Conference Room A', false, 'In its continued mission to promote scholarly dialogue and student engagement in emerging areas of international economic law and diplomacy, the USLLS Centre for International Law and Governance was thrilled to launch the first on-campus event of the September season: a Declamation Competition on the compelling theme India and its Bargaining Power under the Free Trade Agreement: Understanding the Influence of Non-Tariff Barriers in International Trade', ARRAY['Prof. Michael Chen', 'Dr. Sarah Johnson'], NULL, NULL, NULL, NULL, 'past');