
-- Add local tools support fields to existing tables
ALTER TABLE public.profiles 
ADD COLUMN local_tools_enabled boolean DEFAULT false;

-- Add local execution mode tracking to prompt_batches
ALTER TABLE public.prompt_batches 
ADD COLUMN local_execution_mode text DEFAULT 'web';

-- Add local tool targeting to prompts
ALTER TABLE public.prompts 
ADD COLUMN local_tool_target text;

-- Add execution type tracking to execution_logs
ALTER TABLE public.execution_logs 
ADD COLUMN execution_type text DEFAULT 'web';

-- Add platform categorization fields to platforms
ALTER TABLE public.platforms 
ADD COLUMN platform_type text DEFAULT 'web',
ADD COLUMN requires_local_install boolean DEFAULT false;

-- Add local tool execution tracking to user_usage
ALTER TABLE public.user_usage 
ADD COLUMN local_tool_executions integer DEFAULT 0;

-- Create local_tools_settings table for comprehensive local tool configuration
CREATE TABLE public.local_tools_settings (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tool_name text NOT NULL,
  tool_path text,
  enabled boolean DEFAULT true,
  configuration jsonb DEFAULT '{}',
  version text,
  last_verified timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id, tool_name)
);

-- Create local_execution_queues table for dedicated queue management
CREATE TABLE public.local_execution_queues (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  batch_id uuid REFERENCES public.prompt_batches(id) ON DELETE CASCADE,
  tool_target text NOT NULL,
  execution_data jsonb DEFAULT '{}',
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'failed', 'cancelled')),
  priority integer DEFAULT 0,
  scheduled_at timestamp with time zone,
  started_at timestamp with time zone,
  completed_at timestamp with time zone,
  error_message text,
  result_data jsonb DEFAULT '{}',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Add RLS policies for local_tools_settings
ALTER TABLE public.local_tools_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own local tools settings" 
  ON public.local_tools_settings 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own local tools settings" 
  ON public.local_tools_settings 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own local tools settings" 
  ON public.local_tools_settings 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own local tools settings" 
  ON public.local_tools_settings 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Add RLS policies for local_execution_queues
ALTER TABLE public.local_execution_queues ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own local execution queues" 
  ON public.local_execution_queues 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own local execution queues" 
  ON public.local_execution_queues 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own local execution queues" 
  ON public.local_execution_queues 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own local execution queues" 
  ON public.local_execution_queues 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_local_tools_settings_user_id ON public.local_tools_settings(user_id);
CREATE INDEX idx_local_tools_settings_enabled ON public.local_tools_settings(enabled) WHERE enabled = true;
CREATE INDEX idx_local_execution_queues_user_id ON public.local_execution_queues(user_id);
CREATE INDEX idx_local_execution_queues_status ON public.local_execution_queues(status);
CREATE INDEX idx_local_execution_queues_scheduled_at ON public.local_execution_queues(scheduled_at);

-- Add triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION public.update_local_tools_settings_updated_at()
RETURNS trigger AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_local_tools_settings_updated_at
    BEFORE UPDATE ON public.local_tools_settings
    FOR EACH ROW EXECUTE FUNCTION public.update_local_tools_settings_updated_at();

CREATE OR REPLACE FUNCTION public.update_local_execution_queues_updated_at()
RETURNS trigger AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_local_execution_queues_updated_at
    BEFORE UPDATE ON public.local_execution_queues
    FOR EACH ROW EXECUTE FUNCTION public.update_local_execution_queues_updated_at();
