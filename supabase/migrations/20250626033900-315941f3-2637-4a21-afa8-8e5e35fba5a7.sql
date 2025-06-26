
-- First, let's check if we have the basic seed data and add more comprehensive test data

-- Insert test companies (only if they don't already exist)
INSERT INTO public.companies (name, description, website, owner_id) 
SELECT 'TechEvents Inc', 'Leading technology event management company', 'https://techevents.com', 
       (SELECT id FROM public.profiles WHERE full_name = 'John Company' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM public.companies WHERE name = 'TechEvents Inc');

INSERT INTO public.companies (name, description, website, owner_id) 
SELECT 'PromoStars', 'Premium promotional and modeling services', 'https://promostars.com',
       (SELECT id FROM public.profiles WHERE full_name = 'John Company' LIMIT 1)  
WHERE NOT EXISTS (SELECT 1 FROM public.companies WHERE name = 'PromoStars');

-- Insert more diverse events for better testing
INSERT INTO public.events (title, description, company_id, location, start_date, end_date, status) 
SELECT 'AI Conference 2024', 'Annual artificial intelligence and machine learning conference', 
       c.id, 'San Francisco, CA', 
       '2024-07-15 09:00:00'::timestamp, '2024-07-17 18:00:00'::timestamp, 'published'
FROM public.companies c WHERE c.name = 'TechEvents Inc'
AND NOT EXISTS (SELECT 1 FROM public.events WHERE title = 'AI Conference 2024');

INSERT INTO public.events (title, description, company_id, location, start_date, end_date, status) 
SELECT 'Fashion Week Showcase', 'Premium fashion and lifestyle event', 
       c.id, 'New York, NY', 
       '2024-08-20 14:00:00'::timestamp, '2024-08-22 23:00:00'::timestamp, 'published'
FROM public.companies c WHERE c.name = 'PromoStars'
AND NOT EXISTS (SELECT 1 FROM public.events WHERE title = 'Fashion Week Showcase');

INSERT INTO public.events (title, description, company_id, location, start_date, end_date, status) 
SELECT 'Corporate Launch Event', 'New product launch and networking event', 
       c.id, 'Los Angeles, CA', 
       '2024-09-10 10:00:00'::timestamp, '2024-09-10 20:00:00'::timestamp, 'draft'
FROM public.companies c WHERE c.name = 'TechEvents Inc'
AND NOT EXISTS (SELECT 1 FROM public.events WHERE title = 'Corporate Launch Event');

-- Insert diverse job opportunities
INSERT INTO public.jobs (event_id, title, description, requirements, positions_available, hourly_rate, shift_start, shift_end, status) 
SELECT e.id, 'Registration & Welcome Desk', 'Manage attendee check-in and provide event information', 
       'Excellent communication skills, professional appearance, basic computer skills', 
       4, 28.00, '08:00'::time, '18:00'::time, 'open'
FROM public.events e WHERE e.title = 'AI Conference 2024'
AND NOT EXISTS (SELECT 1 FROM public.jobs j JOIN public.events e2 ON j.event_id = e2.id WHERE e2.title = 'AI Conference 2024' AND j.title = 'Registration & Welcome Desk');

INSERT INTO public.jobs (event_id, title, description, requirements, positions_available, hourly_rate, shift_start, shift_end, status) 
SELECT e.id, 'Tech Demo Assistant', 'Assist with technology demonstrations and answer technical questions', 
       'Technology background preferred, friendly personality, ability to explain complex concepts simply', 
       3, 35.00, '09:00'::time, '17:00'::time, 'open'
FROM public.events e WHERE e.title = 'AI Conference 2024'
AND NOT EXISTS (SELECT 1 FROM public.jobs j JOIN public.events e2 ON j.event_id = e2.id WHERE e2.title = 'AI Conference 2024' AND j.title = 'Tech Demo Assistant');

INSERT INTO public.jobs (event_id, title, description, requirements, positions_available, hourly_rate, shift_start, shift_end, status) 
SELECT e.id, 'Fashion Model', 'Showcase latest fashion collections on runway and in photo sessions', 
       'Professional modeling experience, height 5ft8in or taller, portfolio required', 
       8, 75.00, '13:00'::time, '22:00'::time, 'open'
FROM public.events e WHERE e.title = 'Fashion Week Showcase'
AND NOT EXISTS (SELECT 1 FROM public.jobs j JOIN public.events e2 ON j.event_id = e2.id WHERE e2.title = 'Fashion Week Showcase' AND j.title = 'Fashion Model');

INSERT INTO public.jobs (event_id, title, description, requirements, positions_available, hourly_rate, shift_start, shift_end, status) 
SELECT e.id, 'Brand Ambassador', 'Represent brands and engage with event attendees', 
       'Outgoing personality, sales experience preferred, professional appearance', 
       6, 32.00, '14:00'::time, '23:00'::time, 'open'
FROM public.events e WHERE e.title = 'Fashion Week Showcase'
AND NOT EXISTS (SELECT 1 FROM public.jobs j JOIN public.events e2 ON j.event_id = e2.id WHERE e2.title = 'Fashion Week Showcase' AND j.title = 'Brand Ambassador');

INSERT INTO public.jobs (event_id, title, description, requirements, positions_available, hourly_rate, shift_start, shift_end, status) 
SELECT e.id, 'Product Specialist', 'Demonstrate new products and collect customer feedback', 
       'Sales experience, product knowledge training provided, enthusiastic personality', 
       5, 30.00, '09:00'::time, '19:00'::time, 'open'
FROM public.events e WHERE e.title = 'Corporate Launch Event'
AND NOT EXISTS (SELECT 1 FROM public.jobs j JOIN public.events e2 ON j.event_id = e2.id WHERE e2.title = 'Corporate Launch Event' AND j.title = 'Product Specialist');

-- Add some sample job applications to test the workflow
INSERT INTO public.job_applications (job_id, promoter_id, status, notes)
SELECT j.id, p.id, 'pending', 'Excited to work at this event! I have relevant experience.'
FROM public.jobs j 
JOIN public.events e ON j.event_id = e.id
JOIN public.profiles p ON p.full_name = 'Jane Promoter'
WHERE e.title = 'AI Conference 2024' AND j.title = 'Registration & Welcome Desk'
AND NOT EXISTS (
  SELECT 1 FROM public.job_applications ja 
  WHERE ja.job_id = j.id AND ja.promoter_id = p.id
);

INSERT INTO public.job_applications (job_id, promoter_id, status, notes)
SELECT j.id, p.id, 'approved', 'Great fit for this role!'
FROM public.jobs j 
JOIN public.events e ON j.event_id = e.id
JOIN public.profiles p ON p.full_name = 'Jane Promoter'
WHERE e.title = 'Fashion Week Showcase' AND j.title = 'Brand Ambassador'
AND NOT EXISTS (
  SELECT 1 FROM public.job_applications ja 
  WHERE ja.job_id = j.id AND ja.promoter_id = p.id
);

-- Add some sample messages for testing communication
INSERT INTO public.messages (sender_id, recipient_id, subject, content, job_id)
SELECT 
  company_profile.id,
  promoter_profile.id,
  'Welcome to AI Conference 2024!',
  'Thank you for applying to work at our AI Conference. We would like to schedule a brief interview. Please let us know your availability.',
  j.id
FROM public.profiles company_profile
JOIN public.profiles promoter_profile ON promoter_profile.full_name = 'Jane Promoter'
JOIN public.jobs j ON j.title = 'Registration & Welcome Desk'
JOIN public.events e ON j.event_id = e.id
WHERE company_profile.full_name = 'John Company' AND e.title = 'AI Conference 2024'
AND NOT EXISTS (
  SELECT 1 FROM public.messages m 
  WHERE m.sender_id = company_profile.id 
  AND m.recipient_id = promoter_profile.id 
  AND m.subject = 'Welcome to AI Conference 2024!'
);

-- Add notifications for testing
INSERT INTO public.notifications (user_id, title, message, type, related_type)
SELECT p.id, 'New Job Application', 'You have a new application for the AI Conference registration position.', 'info', 'job_application'
FROM public.profiles p 
WHERE p.full_name = 'John Company'
AND NOT EXISTS (
  SELECT 1 FROM public.notifications n 
  WHERE n.user_id = p.id AND n.title = 'New Job Application'
);

INSERT INTO public.notifications (user_id, title, message, type, related_type)
SELECT p.id, 'Application Approved!', 'Congratulations! Your application for Brand Ambassador at Fashion Week has been approved.', 'success', 'job_application'
FROM public.profiles p 
WHERE p.full_name = 'Jane Promoter'
AND NOT EXISTS (
  SELECT 1 FROM public.notifications n 
  WHERE n.user_id = p.id AND n.title = 'Application Approved!'
);
