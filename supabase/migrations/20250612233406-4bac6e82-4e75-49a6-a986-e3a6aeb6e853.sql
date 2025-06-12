
-- Create subscription plans table
CREATE TABLE public.subscription_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  stripe_price_id TEXT UNIQUE,
  price_monthly DECIMAL(10,2) NOT NULL,
  features JSONB NOT NULL DEFAULT '{}',
  limits JSONB NOT NULL DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create subscriptions table
CREATE TABLE public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT UNIQUE,
  plan_id UUID REFERENCES public.subscription_plans(id),
  status TEXT NOT NULL DEFAULT 'active',
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create billing history table
CREATE TABLE public.billing_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES public.subscriptions(id) ON DELETE SET NULL,
  stripe_invoice_id TEXT,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'usd',
  status TEXT NOT NULL,
  invoice_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create usage quotas table for real-time tracking
CREATE TABLE public.usage_quotas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES public.subscriptions(id) ON DELETE CASCADE,
  quota_type TEXT NOT NULL,
  limit_value INTEGER NOT NULL,
  current_usage INTEGER DEFAULT 0,
  reset_date TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, quota_type)
);

-- Create team workspaces table
CREATE TABLE public.team_workspaces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES public.subscriptions(id) ON DELETE CASCADE,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create team members table 
CREATE TABLE public.team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.team_workspaces(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member',
  invited_by UUID REFERENCES auth.users(id),
  invited_at TIMESTAMPTZ DEFAULT now(),
  joined_at TIMESTAMPTZ,
  status TEXT DEFAULT 'pending',
  UNIQUE(workspace_id, user_id)
);

-- Create audit logs table
CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  workspace_id UUID REFERENCES public.team_workspaces(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id UUID,
  details JSONB DEFAULT '{}',
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create api_tokens table
CREATE TABLE public.api_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  token_hash TEXT NOT NULL UNIQUE,
  scopes TEXT[] DEFAULT '{}',
  last_used_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create support_tickets table
CREATE TABLE public.support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT DEFAULT 'open',
  priority TEXT DEFAULT 'medium',
  assigned_to UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on all new tables
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.billing_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_quotas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;

-- RLS Policies for subscription_plans (public read)
CREATE POLICY "Anyone can view subscription plans" ON public.subscription_plans
  FOR SELECT USING (is_active = true);

-- RLS Policies for subscriptions
CREATE POLICY "Users can view their own subscriptions" ON public.subscriptions
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update their own subscriptions" ON public.subscriptions
  FOR UPDATE USING (user_id = auth.uid());

-- RLS Policies for billing_history
CREATE POLICY "Users can view their own billing history" ON public.billing_history
  FOR SELECT USING (user_id = auth.uid());

-- RLS Policies for usage_quotas
CREATE POLICY "Users can view their own usage quotas" ON public.usage_quotas
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update their own usage quotas" ON public.usage_quotas
  FOR UPDATE USING (user_id = auth.uid());

-- RLS Policies for team_workspaces
CREATE POLICY "Users can view workspaces they own or are members of" ON public.team_workspaces
  FOR SELECT USING (
    owner_id = auth.uid() OR 
    id IN (SELECT workspace_id FROM public.team_members WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can create workspaces" ON public.team_workspaces
  FOR INSERT WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Workspace owners can update their workspaces" ON public.team_workspaces
  FOR UPDATE USING (owner_id = auth.uid());

-- RLS Policies for team_members
CREATE POLICY "Users can view team members in their workspaces" ON public.team_members
  FOR SELECT USING (
    workspace_id IN (
      SELECT id FROM public.team_workspaces 
      WHERE owner_id = auth.uid() OR id IN (
        SELECT workspace_id FROM public.team_members WHERE user_id = auth.uid()
      )
    )
  );

-- RLS Policies for audit_logs
CREATE POLICY "Users can view their own audit logs" ON public.audit_logs
  FOR SELECT USING (user_id = auth.uid());

-- RLS Policies for api_tokens
CREATE POLICY "Users can manage their own API tokens" ON public.api_tokens
  FOR ALL USING (user_id = auth.uid());

-- RLS Policies for support_tickets
CREATE POLICY "Users can manage their own support tickets" ON public.support_tickets
  FOR ALL USING (user_id = auth.uid());

-- Insert default subscription plans
INSERT INTO public.subscription_plans (name, stripe_price_id, price_monthly, features, limits) VALUES
('Free', null, 0.00, 
 '{"ai_optimization": false, "team_collaboration": false, "api_access": false, "priority_support": false}',
 '{"prompts_per_month": 10, "ai_optimizations_per_month": 0, "batch_extraction_chars": 1000, "batch_extractions_per_month": 5, "team_members": 1}'),
('Pro', 'price_pro_monthly', 19.00,
 '{"ai_optimization": true, "team_collaboration": false, "api_access": true, "priority_support": true}',
 '{"prompts_per_month": 500, "ai_optimizations_per_month": 100, "batch_extraction_chars": 50000, "batch_extractions_per_month": 100, "team_members": 1}'),
('Enterprise', 'price_enterprise_monthly', 99.00,
 '{"ai_optimization": true, "team_collaboration": true, "api_access": true, "priority_support": true, "white_label": true}',
 '{"prompts_per_month": -1, "ai_optimizations_per_month": -1, "batch_extraction_chars": -1, "batch_extractions_per_month": -1, "team_members": 50}');

-- Create functions for usage management
CREATE OR REPLACE FUNCTION public.check_usage_limit(
  p_user_id UUID,
  p_quota_type TEXT,
  p_amount INTEGER DEFAULT 1
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_limit INTEGER;
  current_usage INTEGER;
BEGIN
  SELECT limit_value, current_usage 
  INTO current_limit, current_usage
  FROM public.usage_quotas 
  WHERE user_id = p_user_id AND quota_type = p_quota_type;
  
  -- If no limit found, check subscription plan defaults
  IF current_limit IS NULL THEN
    SELECT (s.limits ->> p_quota_type)::INTEGER
    INTO current_limit
    FROM public.subscriptions sub
    JOIN public.subscription_plans s ON sub.plan_id = s.id
    WHERE sub.user_id = p_user_id AND sub.status = 'active';
    
    current_usage := 0;
  END IF;
  
  -- -1 means unlimited
  IF current_limit = -1 THEN
    RETURN TRUE;
  END IF;
  
  RETURN (current_usage + p_amount) <= current_limit;
END;
$$;

-- Create function to increment usage
CREATE OR REPLACE FUNCTION public.increment_usage(
  p_user_id UUID,
  p_quota_type TEXT,
  p_amount INTEGER DEFAULT 1
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.usage_quotas (user_id, quota_type, limit_value, current_usage, reset_date)
  SELECT 
    p_user_id,
    p_quota_type,
    (s.limits ->> p_quota_type)::INTEGER,
    p_amount,
    DATE_TRUNC('month', NOW()) + INTERVAL '1 month'
  FROM public.subscriptions sub
  JOIN public.subscription_plans s ON sub.plan_id = s.id
  WHERE sub.user_id = p_user_id AND sub.status = 'active'
  ON CONFLICT (user_id, quota_type)
  DO UPDATE SET 
    current_usage = usage_quotas.current_usage + p_amount,
    updated_at = NOW();
END;
$$;

-- Create function to get user subscription info
CREATE OR REPLACE FUNCTION public.get_user_subscription(p_user_id UUID)
RETURNS TABLE(
  plan_name TEXT,
  status TEXT,
  features JSONB,
  limits JSONB,
  current_period_end TIMESTAMPTZ
)
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT 
    COALESCE(sp.name, 'Free') as plan_name,
    COALESCE(s.status, 'active') as status,
    COALESCE(sp.features, '{"ai_optimization": false, "team_collaboration": false, "api_access": false, "priority_support": false}'::jsonb) as features,
    COALESCE(sp.limits, '{"prompts_per_month": 10, "ai_optimizations_per_month": 0, "batch_extraction_chars": 1000, "batch_extractions_per_month": 5, "team_members": 1}'::jsonb) as limits,
    s.current_period_end
  FROM auth.users u
  LEFT JOIN public.subscriptions s ON u.id = s.user_id AND s.status = 'active'
  LEFT JOIN public.subscription_plans sp ON s.plan_id = sp.id
  WHERE u.id = p_user_id;
$$;

-- Create indexes for performance
CREATE INDEX idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX idx_subscriptions_stripe_customer ON public.subscriptions(stripe_customer_id);
CREATE INDEX idx_usage_quotas_user_type ON public.usage_quotas(user_id, quota_type);
CREATE INDEX idx_team_members_workspace ON public.team_members(workspace_id);
CREATE INDEX idx_team_members_user ON public.team_members(user_id);
CREATE INDEX idx_audit_logs_user_created ON public.audit_logs(user_id, created_at);
CREATE INDEX idx_api_tokens_user_active ON public.api_tokens(user_id, is_active);
