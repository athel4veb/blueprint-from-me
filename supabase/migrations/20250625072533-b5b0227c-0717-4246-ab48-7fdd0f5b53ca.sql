
-- Create user profiles table
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  phone text,
  user_type text NOT NULL CHECK (user_type IN ('promoter', 'company', 'supervisor')),
  avatar_url text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create companies table
CREATE TABLE public.companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  website text,
  logo_url text,
  owner_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create events table
CREATE TABLE public.events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  company_id uuid REFERENCES public.companies(id) ON DELETE CASCADE,
  location text NOT NULL,
  start_date timestamp with time zone NOT NULL,
  end_date timestamp with time zone NOT NULL,
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'active', 'completed', 'cancelled')),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create jobs table
CREATE TABLE public.jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES public.events(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  requirements text,
  positions_available integer NOT NULL DEFAULT 1,
  positions_filled integer DEFAULT 0,
  hourly_rate decimal(10,2),
  shift_start time,
  shift_end time,
  status text DEFAULT 'open' CHECK (status IN ('open', 'closed', 'filled')),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create job applications table
CREATE TABLE public.job_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid REFERENCES public.jobs(id) ON DELETE CASCADE,
  promoter_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'withdrawn')),
  application_date timestamp with time zone DEFAULT now(),
  notes text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  UNIQUE(job_id, promoter_id)
);

-- Create ratings table
CREATE TABLE public.ratings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid REFERENCES public.jobs(id) ON DELETE CASCADE,
  rater_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  rated_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  created_at timestamp with time zone DEFAULT now()
);

-- Create wallets table
CREATE TABLE public.wallets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  balance decimal(10,2) DEFAULT 0.00,
  pending_balance decimal(10,2) DEFAULT 0.00,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id)
);

-- Create wallet transactions table
CREATE TABLE public.wallet_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_id uuid REFERENCES public.wallets(id) ON DELETE CASCADE,
  job_id uuid REFERENCES public.jobs(id) ON DELETE SET NULL,
  type text NOT NULL CHECK (type IN ('credit', 'debit', 'pending', 'released')),
  amount decimal(10,2) NOT NULL,
  description text,
  status text DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed')),
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallet_transactions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Profiles policies
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Companies policies
CREATE POLICY "Everyone can view companies" ON public.companies FOR SELECT USING (true);
CREATE POLICY "Company owners can manage their companies" ON public.companies 
  FOR ALL USING (auth.uid() = owner_id);

-- Events policies
CREATE POLICY "Everyone can view published events" ON public.events FOR SELECT USING (true);
CREATE POLICY "Company owners can manage their events" ON public.events 
  FOR ALL USING (auth.uid() IN (
    SELECT owner_id FROM public.companies WHERE id = events.company_id
  ));

-- Jobs policies
CREATE POLICY "Everyone can view jobs" ON public.jobs FOR SELECT USING (true);
CREATE POLICY "Company owners can manage jobs" ON public.jobs 
  FOR ALL USING (auth.uid() IN (
    SELECT c.owner_id FROM public.companies c 
    JOIN public.events e ON c.id = e.company_id 
    WHERE e.id = jobs.event_id
  ));

-- Job applications policies
CREATE POLICY "Users can view their applications" ON public.job_applications 
  FOR SELECT USING (auth.uid() = promoter_id);
CREATE POLICY "Company owners can view applications for their jobs" ON public.job_applications 
  FOR SELECT USING (auth.uid() IN (
    SELECT c.owner_id FROM public.companies c 
    JOIN public.events e ON c.id = e.company_id 
    JOIN public.jobs j ON e.id = j.event_id 
    WHERE j.id = job_applications.job_id
  ));
CREATE POLICY "Promoters can create applications" ON public.job_applications 
  FOR INSERT WITH CHECK (auth.uid() = promoter_id);
CREATE POLICY "Users can update their applications" ON public.job_applications 
  FOR UPDATE USING (auth.uid() = promoter_id);

-- Ratings policies
CREATE POLICY "Everyone can view ratings" ON public.ratings FOR SELECT USING (true);
CREATE POLICY "Users can create ratings" ON public.ratings FOR INSERT WITH CHECK (auth.uid() = rater_id);

-- Wallets policies
CREATE POLICY "Users can view their own wallet" ON public.wallets 
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own wallet" ON public.wallets 
  FOR UPDATE USING (auth.uid() = user_id);

-- Wallet transactions policies
CREATE POLICY "Users can view their wallet transactions" ON public.wallet_transactions 
  FOR SELECT USING (auth.uid() IN (
    SELECT user_id FROM public.wallets WHERE id = wallet_transactions.wallet_id
  ));

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, phone, user_type)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    COALESCE(NEW.raw_user_meta_data->>'user_type', 'promoter')
  );
  
  -- Create wallet for new user
  INSERT INTO public.wallets (user_id, balance, pending_balance)
  VALUES (NEW.id, 0.00, 0.00);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert seed data
-- Note: You'll need to create these users through the auth system first
-- For now, I'll insert sample data with placeholder UUIDs that you can update

-- Sample companies (you'll need to update owner_id with real user IDs)
INSERT INTO public.companies (name, description, website) VALUES
('EventCorp', 'Leading event management company', 'https://eventcorp.com'),
('PromoMax', 'Premium promotional services', 'https://promomax.com'),
('EventStars', 'Celebrity event management', 'https://eventstars.com');

-- Sample events
INSERT INTO public.events (title, description, company_id, location, start_date, end_date, status) VALUES
('Tech Conference 2024', 'Annual technology conference', (SELECT id FROM public.companies WHERE name = 'EventCorp'), 'San Francisco, CA', '2024-03-15 09:00:00', '2024-03-17 18:00:00', 'published'),
('Music Festival', 'Summer music festival', (SELECT id FROM public.companies WHERE name = 'PromoMax'), 'Los Angeles, CA', '2024-04-20 14:00:00', '2024-04-22 23:00:00', 'published'),
('Product Launch', 'New product launch event', (SELECT id FROM public.companies WHERE name = 'EventStars'), 'New York, NY', '2024-05-10 10:00:00', '2024-05-10 20:00:00', 'published');

-- Sample jobs
INSERT INTO public.jobs (event_id, title, description, requirements, positions_available, hourly_rate, shift_start, shift_end) VALUES
((SELECT id FROM public.events WHERE title = 'Tech Conference 2024'), 'Registration Desk Assistant', 'Help with attendee registration and check-in', 'Friendly personality, basic computer skills', 3, 25.00, '08:00', '18:00'),
((SELECT id FROM public.events WHERE title = 'Music Festival'), 'Crowd Control', 'Manage crowd flow and safety', 'Previous security experience preferred', 5, 30.00, '13:00', '01:00'),
((SELECT id FROM public.events WHERE title = 'Product Launch'), 'Product Demonstrator', 'Demonstrate new products to attendees', 'Sales experience, product knowledge', 2, 35.00, '09:00', '21:00');
