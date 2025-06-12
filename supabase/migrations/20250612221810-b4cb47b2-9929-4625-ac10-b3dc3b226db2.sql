
-- Add missing columns to existing tables
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS subscription_plan TEXT DEFAULT 'free';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS usage_limits JSONB DEFAULT '{"api_calls": 1000, "executions": 100, "tokens": 10000}';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS api_usage_count INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_login TIMESTAMP WITH TIME ZONE;

-- Enhance prompt_batches table
ALTER TABLE prompt_batches ADD COLUMN IF NOT EXISTS platform_targets TEXT[] DEFAULT '{}';
ALTER TABLE prompt_batches ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';
ALTER TABLE prompt_batches ADD COLUMN IF NOT EXISTS is_template BOOLEAN DEFAULT false;
ALTER TABLE prompt_batches ADD COLUMN IF NOT EXISTS execution_count INTEGER DEFAULT 0;

-- Enhance prompts table
ALTER TABLE prompts ADD COLUMN IF NOT EXISTS content TEXT;
ALTER TABLE prompts ADD COLUMN IF NOT EXISTS target_platform TEXT DEFAULT 'lovable.dev';
ALTER TABLE prompts ADD COLUMN IF NOT EXISTS execution_order INTEGER DEFAULT 0;
ALTER TABLE prompts ADD COLUMN IF NOT EXISTS optimization_score INTEGER;
ALTER TABLE prompts ADD COLUMN IF NOT EXISTS estimated_tokens INTEGER;

-- Update prompts table to use content instead of original_prompt
UPDATE prompts SET content = original_prompt WHERE content IS NULL;
ALTER TABLE prompts ALTER COLUMN content SET NOT NULL;

-- Enhance platforms table with performance metrics
ALTER TABLE platforms ADD COLUMN IF NOT EXISTS base_url TEXT;
ALTER TABLE platforms ADD COLUMN IF NOT EXISTS rate_limit_per_hour INTEGER DEFAULT 1000;
ALTER TABLE platforms ADD COLUMN IF NOT EXISTS success_rate DECIMAL(5,2) DEFAULT 99.0;
ALTER TABLE platforms ADD COLUMN IF NOT EXISTS avg_response_time INTEGER DEFAULT 1000;

-- Create ExecutionLogs table
CREATE TABLE IF NOT EXISTS public.execution_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    batch_id UUID REFERENCES public.prompt_batches(id) ON DELETE CASCADE,
    prompt_id UUID REFERENCES public.prompts(id) ON DELETE CASCADE,
    result_url TEXT,
    error_message TEXT,
    executed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    platform_response_time INTEGER,
    success_status BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create UserUsage table
CREATE TABLE IF NOT EXISTS public.user_usage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    api_calls INTEGER DEFAULT 0,
    executions_count INTEGER DEFAULT 0,
    tokens_used INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(user_id, date)
);

-- Create Templates table
CREATE TABLE IF NOT EXISTS public.templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    category TEXT DEFAULT 'general',
    prompts_json JSONB NOT NULL,
    created_by UUID NOT NULL,
    is_public BOOLEAN DEFAULT false,
    usage_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on new tables
ALTER TABLE public.execution_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;

-- RLS Policies for execution_logs
CREATE POLICY "Users can view their own execution logs" ON public.execution_logs
    FOR SELECT USING (
        batch_id IN (SELECT id FROM public.prompt_batches WHERE user_id = auth.uid())
    );

CREATE POLICY "Users can insert their own execution logs" ON public.execution_logs
    FOR INSERT WITH CHECK (
        batch_id IN (SELECT id FROM public.prompt_batches WHERE user_id = auth.uid())
    );

-- RLS Policies for user_usage
CREATE POLICY "Users can view their own usage" ON public.user_usage
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own usage" ON public.user_usage
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own usage" ON public.user_usage
    FOR UPDATE USING (user_id = auth.uid());

-- RLS Policies for templates
CREATE POLICY "Users can view public templates or their own" ON public.templates
    FOR SELECT USING (is_public = true OR created_by = auth.uid());

CREATE POLICY "Users can create templates" ON public.templates
    FOR INSERT WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can update their own templates" ON public.templates
    FOR UPDATE USING (created_by = auth.uid());

CREATE POLICY "Users can delete their own templates" ON public.templates
    FOR DELETE USING (created_by = auth.uid());

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_execution_logs_batch_id ON public.execution_logs(batch_id);
CREATE INDEX IF NOT EXISTS idx_execution_logs_prompt_id ON public.execution_logs(prompt_id);
CREATE INDEX IF NOT EXISTS idx_execution_logs_executed_at ON public.execution_logs(executed_at);
CREATE INDEX IF NOT EXISTS idx_user_usage_user_date ON public.user_usage(user_id, date);
CREATE INDEX IF NOT EXISTS idx_templates_category ON public.templates(category);
CREATE INDEX IF NOT EXISTS idx_templates_public ON public.templates(is_public) WHERE is_public = true;
CREATE INDEX IF NOT EXISTS idx_templates_created_by ON public.templates(created_by);

-- Create function to update usage tracking
CREATE OR REPLACE FUNCTION public.track_user_usage(
    p_user_id UUID,
    p_api_calls INTEGER DEFAULT 0,
    p_executions INTEGER DEFAULT 0,
    p_tokens INTEGER DEFAULT 0
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    INSERT INTO public.user_usage (user_id, api_calls, executions_count, tokens_used)
    VALUES (p_user_id, p_api_calls, p_executions, p_tokens)
    ON CONFLICT (user_id, date)
    DO UPDATE SET
        api_calls = user_usage.api_calls + p_api_calls,
        executions_count = user_usage.executions_count + p_executions,
        tokens_used = user_usage.tokens_used + p_tokens;
END;
$$;

-- Create trigger to update execution_count on prompt_batches
CREATE OR REPLACE FUNCTION public.update_batch_execution_count()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE public.prompt_batches 
    SET execution_count = execution_count + 1
    WHERE id = NEW.batch_id;
    RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_update_batch_execution_count
    AFTER INSERT ON public.execution_logs
    FOR EACH ROW
    EXECUTE FUNCTION public.update_batch_execution_count();

-- Create trigger to update template usage_count
CREATE OR REPLACE FUNCTION public.update_template_usage_count()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    IF NEW.is_template = true AND OLD.is_template = false THEN
        -- Template was just created from a batch
        UPDATE public.templates 
        SET usage_count = usage_count + 1
        WHERE id = NEW.id;
    END IF;
    RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_update_template_usage_count
    AFTER UPDATE ON public.prompt_batches
    FOR EACH ROW
    EXECUTE FUNCTION public.update_template_usage_count();
