
-- Add AI optimization settings to profiles table
ALTER TABLE public.profiles 
ADD COLUMN ai_features_enabled boolean DEFAULT false,
ADD COLUMN ai_usage_quota integer DEFAULT 100,
ADD COLUMN ai_usage_remaining integer DEFAULT 100;

-- Create AI optimization settings table
CREATE TABLE public.ai_optimization_settings (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  optimization_level text DEFAULT 'balanced' CHECK (optimization_level IN ('conservative', 'balanced', 'aggressive')),
  auto_apply_suggestions boolean DEFAULT false,
  preferred_ai_model text DEFAULT 'gpt-4o-mini',
  platform_specific_optimization boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create prompt optimization history table
CREATE TABLE public.prompt_optimization_history (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  original_prompt text NOT NULL,
  optimized_prompt text NOT NULL,
  optimization_type text NOT NULL,
  quality_score_before numeric(3,2),
  quality_score_after numeric(3,2),
  platform_target text,
  was_applied boolean DEFAULT false,
  execution_success boolean,
  created_at timestamp with time zone DEFAULT now()
);

-- Create AI usage tracking table
CREATE TABLE public.ai_usage_tracking (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  operation_type text NOT NULL CHECK (operation_type IN ('optimization', 'analysis', 'extraction_enhancement', 'bulk_optimization')),
  tokens_consumed integer DEFAULT 0,
  cost_estimate numeric(10,4) DEFAULT 0,
  success boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now()
);

-- Create optimization templates table
CREATE TABLE public.optimization_templates (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid,
  template_name text NOT NULL,
  template_description text,
  original_pattern text NOT NULL,
  optimized_pattern text NOT NULL,
  success_rate numeric(3,2) DEFAULT 0,
  usage_count integer DEFAULT 0,
  platform_target text,
  is_public boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Add Row Level Security
ALTER TABLE public.ai_optimization_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prompt_optimization_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_usage_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.optimization_templates ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for AI optimization settings
CREATE POLICY "Users can view their own AI settings" 
  ON public.ai_optimization_settings 
  FOR SELECT 
  USING (user_id = auth.uid());

CREATE POLICY "Users can create their own AI settings" 
  ON public.ai_optimization_settings 
  FOR INSERT 
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own AI settings" 
  ON public.ai_optimization_settings 
  FOR UPDATE 
  USING (user_id = auth.uid());

-- Create RLS policies for optimization history
CREATE POLICY "Users can view their own optimization history" 
  ON public.prompt_optimization_history 
  FOR SELECT 
  USING (user_id = auth.uid());

CREATE POLICY "Users can create their own optimization history" 
  ON public.prompt_optimization_history 
  FOR INSERT 
  WITH CHECK (user_id = auth.uid());

-- Create RLS policies for usage tracking
CREATE POLICY "Users can view their own usage tracking" 
  ON public.ai_usage_tracking 
  FOR SELECT 
  USING (user_id = auth.uid());

CREATE POLICY "Users can create their own usage records" 
  ON public.ai_usage_tracking 
  FOR INSERT 
  WITH CHECK (user_id = auth.uid());

-- Create RLS policies for optimization templates
CREATE POLICY "Users can view their own templates and public templates" 
  ON public.optimization_templates 
  FOR SELECT 
  USING (user_id = auth.uid() OR is_public = true);

CREATE POLICY "Users can create their own templates" 
  ON public.optimization_templates 
  FOR INSERT 
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own templates" 
  ON public.optimization_templates 
  FOR UPDATE 
  USING (user_id = auth.uid());

-- Create function to track AI usage
CREATE OR REPLACE FUNCTION public.track_ai_usage(
  p_user_id uuid,
  p_operation_type text,
  p_tokens_consumed integer DEFAULT 0,
  p_cost_estimate numeric DEFAULT 0,
  p_success boolean DEFAULT true
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.ai_usage_tracking (user_id, operation_type, tokens_consumed, cost_estimate, success)
  VALUES (p_user_id, p_operation_type, p_tokens_consumed, p_cost_estimate, p_success);
  
  -- Update remaining quota
  UPDATE public.profiles 
  SET ai_usage_remaining = GREATEST(0, ai_usage_remaining - 1)
  WHERE id = p_user_id;
END;
$$;

-- Create function to check AI usage eligibility
CREATE OR REPLACE FUNCTION public.can_use_ai_features(p_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT 
    COALESCE(p.ai_features_enabled, false) AND 
    COALESCE(p.ai_usage_remaining, 0) > 0
  FROM public.profiles p
  WHERE p.id = p_user_id;
$$;
