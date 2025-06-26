
-- Temporarily make all tables publicly accessible for testing
-- Remove restrictive RLS policies and add permissive ones

-- Drop existing restrictive policies and add public access
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Public can access profiles" ON public.profiles FOR ALL USING (true);

DROP POLICY IF EXISTS "Everyone can view companies" ON public.companies;
DROP POLICY IF EXISTS "Company owners can manage their companies" ON public.companies;
CREATE POLICY "Public can access companies" ON public.companies FOR ALL USING (true);

DROP POLICY IF EXISTS "Everyone can view published events" ON public.events;
DROP POLICY IF EXISTS "Company owners can manage their events" ON public.events;
DROP POLICY IF EXISTS "Users can view all events" ON public.events;
DROP POLICY IF EXISTS "Companies can create their own events" ON public.events;
DROP POLICY IF EXISTS "Companies can update their own events" ON public.events;
DROP POLICY IF EXISTS "Companies can delete their own events" ON public.events;
CREATE POLICY "Public can access events" ON public.events FOR ALL USING (true);

DROP POLICY IF EXISTS "Everyone can view jobs" ON public.jobs;
DROP POLICY IF EXISTS "Company owners can manage jobs" ON public.jobs;
CREATE POLICY "Public can access jobs" ON public.jobs FOR ALL USING (true);

DROP POLICY IF EXISTS "Users can view their applications" ON public.job_applications;
DROP POLICY IF EXISTS "Company owners can view applications for their jobs" ON public.job_applications;
DROP POLICY IF EXISTS "Promoters can create applications" ON public.job_applications;
DROP POLICY IF EXISTS "Users can update their applications" ON public.job_applications;
CREATE POLICY "Public can access job_applications" ON public.job_applications FOR ALL USING (true);

DROP POLICY IF EXISTS "Everyone can view ratings" ON public.ratings;
DROP POLICY IF EXISTS "Users can create ratings" ON public.ratings;
CREATE POLICY "Public can access ratings" ON public.ratings FOR ALL USING (true);

DROP POLICY IF EXISTS "Users can view their own wallet" ON public.wallets;
DROP POLICY IF EXISTS "Users can update their own wallet" ON public.wallets;
CREATE POLICY "Public can access wallets" ON public.wallets FOR ALL USING (true);

DROP POLICY IF EXISTS "Users can view their wallet transactions" ON public.wallet_transactions;
CREATE POLICY "Public can access wallet_transactions" ON public.wallet_transactions FOR ALL USING (true);

DROP POLICY IF EXISTS "Companies can view their payments" ON public.payments;
DROP POLICY IF EXISTS "Promoters can view payments for their jobs" ON public.payments;
CREATE POLICY "Public can access payments" ON public.payments FOR ALL USING (true);

DROP POLICY IF EXISTS "Promoters can manage their payout requests" ON public.payout_requests;
CREATE POLICY "Public can access payout_requests" ON public.payout_requests FOR ALL USING (true);

DROP POLICY IF EXISTS "Users can view messages they sent or received" ON public.messages;
DROP POLICY IF EXISTS "Users can send messages" ON public.messages;
DROP POLICY IF EXISTS "Users can update messages they received" ON public.messages;
CREATE POLICY "Public can access messages" ON public.messages FOR ALL USING (true);

DROP POLICY IF EXISTS "Users can view their own notifications" ON public.notifications;
DROP POLICY IF EXISTS "System can create notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can update their own notifications" ON public.notifications;
CREATE POLICY "Public can access notifications" ON public.notifications FOR ALL USING (true);

DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can manage all roles" ON public.user_roles;
CREATE POLICY "Public can access user_roles" ON public.user_roles FOR ALL USING (true);

DROP POLICY IF EXISTS "Everyone can view permissions" ON public.permissions;
CREATE POLICY "Public can access permissions" ON public.permissions FOR ALL USING (true);

DROP POLICY IF EXISTS "Everyone can view role permissions" ON public.role_permissions;
CREATE POLICY "Public can access role_permissions" ON public.role_permissions FOR ALL USING (true);

DROP POLICY IF EXISTS "Users can view their own permissions" ON public.user_permissions;
DROP POLICY IF EXISTS "Admins can manage user permissions" ON public.user_permissions;
CREATE POLICY "Public can access user_permissions" ON public.user_permissions FOR ALL USING (true);

DROP POLICY IF EXISTS "Company owners can view their company members" ON public.company_members;
DROP POLICY IF EXISTS "Company owners can manage their company members" ON public.company_members;
CREATE POLICY "Public can access company_members" ON public.company_members FOR ALL USING (true);

-- Now seed the actual data directly into the database
-- Insert sample companies with real owner IDs (we'll link them after users are created)
INSERT INTO public.companies (id, name, description, website, owner_id) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'EventCorp Solutions', 'Leading event management and promotional services company', 'https://eventcorp.com', NULL),
('550e8400-e29b-41d4-a716-446655440002', 'PromoMax Events', 'Premium promotional services and brand activation', 'https://promomax.com', NULL),
('550e8400-e29b-41d4-a716-446655440003', 'EventStars International', 'High-end event management and celebrity coordination', 'https://eventstars.com', NULL)
ON CONFLICT (id) DO NOTHING;

-- Insert sample events
INSERT INTO public.events (id, title, description, company_id, location, start_date, end_date, status) VALUES
('660e8400-e29b-41d4-a716-446655440001', 'Tech Innovation Summit 2024', 'Annual technology and innovation conference featuring industry leaders', '550e8400-e29b-41d4-a716-446655440001', 'San Francisco Convention Center, CA', '2024-03-15 09:00:00+00', '2024-03-17 18:00:00+00', 'published'),
('660e8400-e29b-41d4-a716-446655440002', 'Summer Music Festival', 'Three-day outdoor music festival with multiple stages', '550e8400-e29b-41d4-a716-446655440002', 'Golden Gate Park, San Francisco, CA', '2024-06-20 14:00:00+00', '2024-06-22 23:00:00+00', 'published'),
('660e8400-e29b-41d4-a716-446655440003', 'Product Launch Spectacular', 'Grand product launch event with demonstrations and networking', '550e8400-e29b-41d4-a716-446655440003', 'Times Square, New York, NY', '2024-05-10 10:00:00+00', '2024-05-10 20:00:00+00', 'published'),
('660e8400-e29b-41d4-a716-446655440004', 'Corporate Gala Night', 'Elegant corporate networking and awards ceremony', '550e8400-e29b-41d4-a716-446655440001', 'Beverly Hills Hotel, CA', '2024-07-15 19:00:00+00', '2024-07-15 23:30:00+00', 'published'),
('660e8400-e29b-41d4-a716-446655440005', 'Trade Show Expo', 'Industry trade show with exhibitors and demonstrations', '550e8400-e29b-41d4-a716-446655440002', 'Las Vegas Convention Center, NV', '2024-08-05 08:00:00+00', '2024-08-07 17:00:00+00', 'published')
ON CONFLICT (id) DO NOTHING;

-- Insert sample jobs
INSERT INTO public.jobs (id, event_id, title, description, requirements, positions_available, positions_filled, hourly_rate, shift_start, shift_end, status) VALUES
('770e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', 'Registration Desk Assistant', 'Help with attendee registration, check-in, and information desk duties', 'Friendly personality, basic computer skills, customer service experience', 3, 1, 25.00, '08:00', '18:00', 'open'),
('770e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440002', 'Stage Crew Member', 'Assist with stage setup, equipment handling, and crowd control', 'Physical fitness, previous event experience preferred, teamwork skills', 5, 2, 30.00, '13:00', '01:00', 'open'),
('770e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440003', 'Product Demonstrator', 'Demonstrate new products to attendees and answer questions', 'Sales experience, product knowledge, excellent communication skills', 2, 0, 35.00, '09:00', '21:00', 'open'),
('770e8400-e29b-41d4-a716-446655440004', '660e8400-e29b-41d4-a716-446655440004', 'Event Coordinator Assistant', 'Support event coordination, guest management, and logistics', 'Event planning experience, organizational skills, professional appearance', 2, 1, 28.00, '17:00', '00:00', 'open'),
('770e8400-e29b-41d4-a716-446655440005', '660e8400-e29b-41d4-a716-446655440005', 'Booth Representative', 'Represent company at trade show booth, engage with visitors', 'Sales background, industry knowledge preferred, outgoing personality', 4, 1, 32.00, '07:30', '17:30', 'open'),
('770e8400-e29b-41d4-a716-446655440006', '660e8400-e29b-41d4-a716-446655440001', 'AV Technical Support', 'Provide audio-visual technical support during presentations', 'Technical AV experience, troubleshooting skills, equipment knowledge', 2, 0, 40.00, '07:00', '19:00', 'open')
ON CONFLICT (id) DO NOTHING;
