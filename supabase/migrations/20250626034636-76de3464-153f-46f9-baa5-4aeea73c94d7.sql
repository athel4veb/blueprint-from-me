
-- Create enum for application roles
CREATE TYPE public.app_role AS ENUM ('admin', 'company_owner', 'company_manager', 'supervisor', 'promoter', 'event_coordinator');

-- Create enum for permission types
CREATE TYPE public.permission_type AS ENUM (
  'create_events', 'edit_events', 'delete_events', 'view_events',
  'create_jobs', 'edit_jobs', 'delete_jobs', 'view_jobs',
  'manage_applications', 'view_applications', 'approve_applications',
  'manage_payments', 'view_payments', 'process_payouts',
  'manage_users', 'view_users', 'delete_users',
  'manage_companies', 'view_companies',
  'send_messages', 'view_messages',
  'manage_ratings', 'view_ratings',
  'admin_panel', 'view_analytics'
);

-- Create user roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  assigned_by UUID REFERENCES public.profiles(id),
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  is_active BOOLEAN DEFAULT true,
  expires_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_id, role)
);

-- Create permissions table
CREATE TABLE public.permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name permission_type UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create role permissions mapping
CREATE TABLE public.role_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role app_role NOT NULL,
  permission permission_type NOT NULL,
  UNIQUE(role, permission)
);

-- Create user permissions (for custom permissions beyond roles)
CREATE TABLE public.user_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  permission permission_type NOT NULL,
  granted_by UUID REFERENCES public.profiles(id),
  granted_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  UNIQUE(user_id, permission)
);

-- Create company members table (for multi-user companies)
CREATE TABLE public.company_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  role TEXT DEFAULT 'member',
  permissions JSONB DEFAULT '{}',
  invited_by UUID REFERENCES public.profiles(id),
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  is_active BOOLEAN DEFAULT true,
  UNIQUE(company_id, user_id)
);

-- Enable RLS on all new tables
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_members ENABLE ROW LEVEL SECURITY;

-- Create security definer functions to avoid RLS recursion
CREATE OR REPLACE FUNCTION public.get_user_roles(user_uuid UUID)
RETURNS TABLE(role app_role)
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT ur.role
  FROM public.user_roles ur
  WHERE ur.user_id = user_uuid 
    AND ur.is_active = true
    AND (ur.expires_at IS NULL OR ur.expires_at > now());
$$;

CREATE OR REPLACE FUNCTION public.has_role(user_uuid UUID, check_role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.get_user_roles(user_uuid) WHERE role = check_role
  );
$$;

CREATE OR REPLACE FUNCTION public.has_permission(user_uuid UUID, check_permission permission_type)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    -- Check role-based permissions
    SELECT 1 
    FROM public.user_roles ur
    JOIN public.role_permissions rp ON ur.role = rp.role
    WHERE ur.user_id = user_uuid 
      AND rp.permission = check_permission
      AND ur.is_active = true
      AND (ur.expires_at IS NULL OR ur.expires_at > now())
    
    UNION
    
    -- Check direct user permissions
    SELECT 1
    FROM public.user_permissions up
    WHERE up.user_id = user_uuid 
      AND up.permission = check_permission
      AND up.is_active = true
      AND (up.expires_at IS NULL OR up.expires_at > now())
  );
$$;

-- Insert all permissions
INSERT INTO public.permissions (name, description) VALUES
('create_events', 'Create new events'),
('edit_events', 'Edit existing events'),
('delete_events', 'Delete events'),
('view_events', 'View events'),
('create_jobs', 'Create new job postings'),
('edit_jobs', 'Edit existing job postings'),
('delete_jobs', 'Delete job postings'),
('view_jobs', 'View job postings'),
('manage_applications', 'Manage job applications'),
('view_applications', 'View job applications'),
('approve_applications', 'Approve or reject applications'),
('manage_payments', 'Manage payment processing'),
('view_payments', 'View payment information'),
('process_payouts', 'Process payout requests'),
('manage_users', 'Manage user accounts'),
('view_users', 'View user information'),
('delete_users', 'Delete user accounts'),
('manage_companies', 'Manage company information'),
('view_companies', 'View company information'),
('send_messages', 'Send messages to other users'),
('view_messages', 'View messages'),
('manage_ratings', 'Manage ratings and reviews'),
('view_ratings', 'View ratings and reviews'),
('admin_panel', 'Access admin panel'),
('view_analytics', 'View analytics and reports');

-- Assign permissions to roles
-- Admin has all permissions
INSERT INTO public.role_permissions (role, permission)
SELECT 'admin', name FROM public.permissions;

-- Company Owner permissions
INSERT INTO public.role_permissions (role, permission) VALUES
('company_owner', 'create_events'), ('company_owner', 'edit_events'), ('company_owner', 'delete_events'), ('company_owner', 'view_events'),
('company_owner', 'create_jobs'), ('company_owner', 'edit_jobs'), ('company_owner', 'delete_jobs'), ('company_owner', 'view_jobs'),
('company_owner', 'manage_applications'), ('company_owner', 'view_applications'), ('company_owner', 'approve_applications'),
('company_owner', 'manage_payments'), ('company_owner', 'view_payments'), ('company_owner', 'process_payouts'),
('company_owner', 'manage_companies'), ('company_owner', 'view_companies'),
('company_owner', 'send_messages'), ('company_owner', 'view_messages'),
('company_owner', 'manage_ratings'), ('company_owner', 'view_ratings'),
('company_owner', 'view_analytics');

-- Company Manager permissions
INSERT INTO public.role_permissions (role, permission) VALUES
('company_manager', 'edit_events'), ('company_manager', 'view_events'),
('company_manager', 'create_jobs'), ('company_manager', 'edit_jobs'), ('company_manager', 'view_jobs'),
('company_manager', 'manage_applications'), ('company_manager', 'view_applications'), ('company_manager', 'approve_applications'),
('company_manager', 'view_payments'),
('company_manager', 'view_companies'),
('company_manager', 'send_messages'), ('company_manager', 'view_messages'),
('company_manager', 'view_ratings');

-- Supervisor permissions
INSERT INTO public.role_permissions (role, permission) VALUES
('supervisor', 'view_events'), ('supervisor', 'view_jobs'),
('supervisor', 'view_applications'), ('supervisor', 'approve_applications'),
('supervisor', 'view_payments'),
('supervisor', 'send_messages'), ('supervisor', 'view_messages'),
('supervisor', 'manage_ratings'), ('supervisor', 'view_ratings');

-- Event Coordinator permissions
INSERT INTO public.role_permissions (role, permission) VALUES
('event_coordinator', 'edit_events'), ('event_coordinator', 'view_events'),
('event_coordinator', 'edit_jobs'), ('event_coordinator', 'view_jobs'),
('event_coordinator', 'view_applications'),
('event_coordinator', 'send_messages'), ('event_coordinator', 'view_messages'),
('event_coordinator', 'view_ratings');

-- Promoter permissions
INSERT INTO public.role_permissions (role, permission) VALUES
('promoter', 'view_events'), ('promoter', 'view_jobs'),
('promoter', 'view_applications'),
('promoter', 'send_messages'), ('promoter', 'view_messages'),
('promoter', 'view_ratings');

-- Create RLS policies
CREATE POLICY "Users can view their own roles" ON public.user_roles
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all roles" ON public.user_roles
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Everyone can view permissions" ON public.permissions
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Everyone can view role permissions" ON public.role_permissions
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can view their own permissions" ON public.user_permissions
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admins can manage user permissions" ON public.user_permissions
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Company owners can view their company members" ON public.company_members
  FOR SELECT USING (
    company_id IN (
      SELECT id FROM public.companies WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "Company owners can manage their company members" ON public.company_members
  FOR ALL USING (
    company_id IN (
      SELECT id FROM public.companies WHERE owner_id = auth.uid()
    )
  );

-- Insert test users with roles
-- First, let's assign roles to existing test users
INSERT INTO public.user_roles (user_id, role) 
SELECT p.id, 'company_owner'::app_role
FROM public.profiles p 
WHERE p.full_name = 'John Company'
AND NOT EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = p.id AND ur.role = 'company_owner');

INSERT INTO public.user_roles (user_id, role)
SELECT p.id, 'promoter'::app_role
FROM public.profiles p 
WHERE p.full_name = 'Jane Promoter'
AND NOT EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = p.id AND ur.role = 'promoter');

INSERT INTO public.user_roles (user_id, role)
SELECT p.id, 'supervisor'::app_role
FROM public.profiles p 
WHERE p.full_name = 'Mike Supervisor'
AND NOT EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = p.id AND ur.role = 'supervisor');
