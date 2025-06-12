
-- Add job queue system tables
CREATE TABLE IF NOT EXISTS public.job_queue (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    batch_id UUID REFERENCES public.prompt_batches(id) ON DELETE CASCADE,
    prompt_id UUID REFERENCES public.prompts(id) ON DELETE CASCADE,
    job_type TEXT NOT NULL,
    priority INTEGER DEFAULT 0,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'failed', 'paused', 'cancelled')),
    scheduled_at TIMESTAMP WITH TIME ZONE,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    retry_attempts INTEGER DEFAULT 0,
    max_retries INTEGER DEFAULT 3,
    error_message TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add execution state tracking
CREATE TABLE IF NOT EXISTS public.batch_execution_state (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    batch_id UUID REFERENCES public.prompt_batches(id) ON DELETE CASCADE UNIQUE,
    execution_mode TEXT DEFAULT 'sequential' CHECK (execution_mode IN ('sequential', 'parallel')),
    current_step INTEGER DEFAULT 0,
    total_steps INTEGER DEFAULT 0,
    progress_percentage DECIMAL(5,2) DEFAULT 0.00,
    estimated_completion TIMESTAMP WITH TIME ZONE,
    execution_start TIMESTAMP WITH TIME ZONE,
    execution_end TIMESTAMP WITH TIME ZONE,
    paused_at TIMESTAMP WITH TIME ZONE,
    cancelled_at TIMESTAMP WITH TIME ZONE,
    state_data JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add performance metrics tracking
CREATE TABLE IF NOT EXISTS public.execution_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    batch_id UUID REFERENCES public.prompt_batches(id) ON DELETE CASCADE,
    prompt_id UUID REFERENCES public.prompts(id) ON DELETE CASCADE,
    platform_name TEXT NOT NULL,
    execution_time_ms INTEGER,
    queue_time_ms INTEGER,
    retry_count INTEGER DEFAULT 0,
    success_rate DECIMAL(5,2),
    cost_estimate DECIMAL(10,4),
    tokens_consumed INTEGER,
    error_category TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add platform health monitoring
CREATE TABLE IF NOT EXISTS public.platform_health (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    platform_name TEXT NOT NULL,
    status TEXT DEFAULT 'healthy' CHECK (status IN ('healthy', 'degraded', 'down')),
    response_time_ms INTEGER,
    success_rate DECIMAL(5,2),
    error_count INTEGER DEFAULT 0,
    last_check TIMESTAMP WITH TIME ZONE DEFAULT now(),
    circuit_breaker_open BOOLEAN DEFAULT false,
    rate_limit_remaining INTEGER,
    next_reset_time TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(platform_name)
);

-- Add batch scheduling
CREATE TABLE IF NOT EXISTS public.batch_schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    batch_id UUID REFERENCES public.prompt_batches(id) ON DELETE CASCADE,
    schedule_type TEXT DEFAULT 'once' CHECK (schedule_type IN ('once', 'recurring', 'cron')),
    cron_expression TEXT,
    scheduled_time TIMESTAMP WITH TIME ZONE,
    timezone TEXT DEFAULT 'UTC',
    is_active BOOLEAN DEFAULT true,
    last_run TIMESTAMP WITH TIME ZONE,
    next_run TIMESTAMP WITH TIME ZONE,
    run_count INTEGER DEFAULT 0,
    max_runs INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on new tables
ALTER TABLE public.job_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.batch_execution_state ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.execution_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_health ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.batch_schedules ENABLE ROW LEVEL SECURITY;

-- RLS Policies for job_queue
CREATE POLICY "Users can view their own job queue" ON public.job_queue
    FOR SELECT USING (
        batch_id IN (SELECT id FROM public.prompt_batches WHERE user_id = auth.uid())
    );

CREATE POLICY "Users can insert their own jobs" ON public.job_queue
    FOR INSERT WITH CHECK (
        batch_id IN (SELECT id FROM public.prompt_batches WHERE user_id = auth.uid())
    );

CREATE POLICY "Users can update their own jobs" ON public.job_queue
    FOR UPDATE USING (
        batch_id IN (SELECT id FROM public.prompt_batches WHERE user_id = auth.uid())
    );

-- RLS Policies for batch_execution_state
CREATE POLICY "Users can view their own execution state" ON public.batch_execution_state
    FOR SELECT USING (
        batch_id IN (SELECT id FROM public.prompt_batches WHERE user_id = auth.uid())
    );

CREATE POLICY "Users can manage their own execution state" ON public.batch_execution_state
    FOR ALL USING (
        batch_id IN (SELECT id FROM public.prompt_batches WHERE user_id = auth.uid())
    );

-- RLS Policies for execution_metrics
CREATE POLICY "Users can view their own metrics" ON public.execution_metrics
    FOR SELECT USING (
        batch_id IN (SELECT id FROM public.prompt_batches WHERE user_id = auth.uid())
    );

CREATE POLICY "Users can insert their own metrics" ON public.execution_metrics
    FOR INSERT WITH CHECK (
        batch_id IN (SELECT id FROM public.prompt_batches WHERE user_id = auth.uid())
    );

-- RLS Policies for platform_health (read-only for users)
CREATE POLICY "Users can view platform health" ON public.platform_health
    FOR SELECT USING (true);

-- RLS Policies for batch_schedules
CREATE POLICY "Users can manage their own schedules" ON public.batch_schedules
    FOR ALL USING (
        batch_id IN (SELECT id FROM public.prompt_batches WHERE user_id = auth.uid())
    );

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_job_queue_status ON public.job_queue(status);
CREATE INDEX IF NOT EXISTS idx_job_queue_priority ON public.job_queue(priority DESC);
CREATE INDEX IF NOT EXISTS idx_job_queue_scheduled_at ON public.job_queue(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_batch_execution_state_batch_id ON public.batch_execution_state(batch_id);
CREATE INDEX IF NOT EXISTS idx_execution_metrics_batch_id ON public.execution_metrics(batch_id);
CREATE INDEX IF NOT EXISTS idx_execution_metrics_platform ON public.execution_metrics(platform_name);
CREATE INDEX IF NOT EXISTS idx_platform_health_status ON public.platform_health(status);
CREATE INDEX IF NOT EXISTS idx_batch_schedules_next_run ON public.batch_schedules(next_run) WHERE is_active = true;

-- Create function to update execution progress
CREATE OR REPLACE FUNCTION public.update_execution_progress(
    p_batch_id UUID,
    p_current_step INTEGER,
    p_total_steps INTEGER
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    progress_pct DECIMAL(5,2);
BEGIN
    progress_pct := CASE 
        WHEN p_total_steps > 0 THEN (p_current_step::decimal / p_total_steps::decimal) * 100
        ELSE 0
    END;
    
    UPDATE public.batch_execution_state 
    SET 
        current_step = p_current_step,
        total_steps = p_total_steps,
        progress_percentage = progress_pct,
        updated_at = now()
    WHERE batch_id = p_batch_id;
END;
$$;

-- Create function to get next job from queue
CREATE OR REPLACE FUNCTION public.get_next_job()
RETURNS TABLE (
    job_id UUID,
    batch_id UUID,
    prompt_id UUID,
    job_type TEXT,
    metadata JSONB
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    UPDATE public.job_queue 
    SET 
        status = 'running',
        started_at = now(),
        updated_at = now()
    WHERE id = (
        SELECT jq.id 
        FROM public.job_queue jq
        WHERE jq.status = 'pending' 
        AND (jq.scheduled_at IS NULL OR jq.scheduled_at <= now())
        ORDER BY jq.priority DESC, jq.created_at ASC
        LIMIT 1
        FOR UPDATE SKIP LOCKED
    )
    RETURNING id, job_queue.batch_id, job_queue.prompt_id, job_queue.job_type, job_queue.metadata;
END;
$$;

-- Create trigger to update batch execution count on job completion
CREATE OR REPLACE FUNCTION public.update_batch_on_job_completion()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    -- Update batch execution state when job completes
    IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
        PERFORM public.update_execution_progress(
            NEW.batch_id,
            (SELECT COUNT(*) FROM public.job_queue WHERE batch_id = NEW.batch_id AND status = 'completed'),
            (SELECT COUNT(*) FROM public.job_queue WHERE batch_id = NEW.batch_id)
        );
    END IF;
    
    RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_update_batch_on_job_completion
    AFTER UPDATE ON public.job_queue
    FOR EACH ROW
    EXECUTE FUNCTION public.update_batch_on_job_completion();
