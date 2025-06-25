
-- Add payment tracking table
CREATE TABLE public.payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid REFERENCES public.jobs(id) ON DELETE CASCADE,
  company_id uuid REFERENCES public.companies(id) ON DELETE CASCADE,
  promoter_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  amount decimal(10,2) NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'refunded')),
  payment_method text,
  stripe_payment_intent_id text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Add payout requests table
CREATE TABLE public.payout_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  promoter_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  amount decimal(10,2) NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'rejected')),
  bank_details jsonb,
  requested_at timestamp with time zone DEFAULT now(),
  processed_at timestamp with time zone,
  notes text
);

-- Enable RLS on new tables
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payout_requests ENABLE ROW LEVEL SECURITY;

-- RLS policies for payments
CREATE POLICY "Companies can view their payments" ON public.payments 
  FOR SELECT USING (auth.uid() IN (
    SELECT owner_id FROM public.companies WHERE id = payments.company_id
  ));

CREATE POLICY "Promoters can view payments for their jobs" ON public.payments 
  FOR SELECT USING (auth.uid() = promoter_id);

-- RLS policies for payout requests
CREATE POLICY "Promoters can manage their payout requests" ON public.payout_requests 
  FOR ALL USING (auth.uid() = promoter_id);

-- Update wallet transactions to include payment references
ALTER TABLE public.wallet_transactions 
ADD COLUMN payment_id uuid REFERENCES public.payments(id) ON DELETE SET NULL;

-- Add function to calculate promoter earnings
CREATE OR REPLACE FUNCTION public.calculate_promoter_earnings(promoter_uuid uuid)
RETURNS TABLE (
  total_earned decimal(10,2),
  pending_earnings decimal(10,2),
  available_for_payout decimal(10,2)
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE(SUM(CASE WHEN wt.type = 'credit' AND wt.status = 'completed' THEN wt.amount ELSE 0 END), 0) as total_earned,
    COALESCE(SUM(CASE WHEN wt.type = 'pending' THEN wt.amount ELSE 0 END), 0) as pending_earnings,
    COALESCE(w.balance, 0) as available_for_payout
  FROM public.wallets w
  LEFT JOIN public.wallet_transactions wt ON w.id = wt.wallet_id
  WHERE w.user_id = promoter_uuid
  GROUP BY w.balance;
END;
$$;
