import { supabase } from '@/integrations/supabase/client';

export interface LocalTool {
  id: string;
  name: string;
  description: string;
  command: string;
  parameters: Record<string, any>;
  isActive: boolean;
}

export interface LocalExecutionJob {
  id: string;
  user_id: string;
  tool_name: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  parameters: Record<string, any>;
  result_data?: Record<string, any>;
  error_message?: string;
  created_at: string;
  scheduled_at?: string;
  started_at?: string;
  completed_at?: string;
  priority: number;
  batch_id?: string;
  execution_data?: Record<string, any>;
}

class LocalToolsService {
  async saveLocalTool(tool: Omit<LocalTool, 'id'>): Promise<LocalTool> {
    const { data, error } = await supabase
      .from('local_tools_settings')
      .insert({
        name: tool.name,
        description: tool.description,
        command: tool.command,
        parameters: tool.parameters,
        is_active: tool.isActive,
      })
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      name: data.name,
      description: data.description,
      command: data.command,
      parameters: data.parameters,
      isActive: data.is_active,
    };
  }

  async getLocalTools(): Promise<LocalTool[]> {
    const { data, error } = await supabase
      .from('local_tools_settings')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data.map(item => ({
      id: item.id,
      name: item.name,
      description: item.description,
      command: item.command,
      parameters: item.parameters,
      isActive: item.is_active,
    }));
  }

  async deleteLocalTool(id: string): Promise<void> {
    const { error } = await supabase
      .from('local_tools_settings')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  async toggleLocalTool(id: string, isActive: boolean): Promise<void> {
    const { error } = await supabase
      .from('local_tools_settings')
      .update({ is_active: isActive })
      .eq('id', id);

    if (error) throw error;
  }

  async queueJob(job: Omit<LocalExecutionJob, 'id' | 'created_at'>): Promise<LocalExecutionJob> {
    const { data, error } = await supabase
      .from('local_execution_queues')
      .insert({
        tool_name: job.tool_name,
        status: job.status,
        parameters: job.parameters,
        result_data: job.result_data,
        error_message: job.error_message,
        scheduled_at: job.scheduled_at,
        started_at: job.started_at,
        completed_at: job.completed_at,
        priority: job.priority,
        batch_id: job.batch_id,
        execution_data: job.execution_data,
      })
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      user_id: data.user_id,
      tool_name: data.tool_name,
      status: data.status as LocalExecutionJob['status'],
      parameters: data.parameters,
      result_data: data.result_data,
      error_message: data.error_message,
      created_at: data.created_at,
      scheduled_at: data.scheduled_at,
      started_at: data.started_at,
      completed_at: data.completed_at,
      priority: data.priority,
      batch_id: data.batch_id,
      execution_data: data.execution_data,
    };
  }

  async getQueuedJobs(): Promise<LocalExecutionJob[]> {
    const { data, error } = await supabase
      .from('local_execution_queues')
      .select('*')
      .order('priority', { ascending: false })
      .order('created_at', { ascending: true });

    if (error) throw error;

    return data.map(item => ({
      id: item.id,
      user_id: item.user_id,
      tool_name: item.tool_name,
      status: item.status as LocalExecutionJob['status'],
      parameters: item.parameters,
      result_data: item.result_data,
      error_message: item.error_message,
      created_at: item.created_at,
      scheduled_at: item.scheduled_at,
      started_at: item.started_at,
      completed_at: item.completed_at,
      priority: item.priority,
      batch_id: item.batch_id,
      execution_data: item.execution_data,
    }));
  }

  async updateJobStatus(id: string, status: LocalExecutionJob['status'], result?: any, error?: string): Promise<LocalExecutionJob> {
    const updateData: any = { status };
    
    if (result) updateData.result_data = result;
    if (error) updateData.error_message = error;
    if (status === 'running') updateData.started_at = new Date().toISOString();
    if (status === 'completed' || status === 'failed') updateData.completed_at = new Date().toISOString();

    const { data, error: updateError } = await supabase
      .from('local_execution_queues')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (updateError) throw updateError;

    return {
      id: data.id,
      user_id: data.user_id,
      tool_name: data.tool_name,
      status: data.status as LocalExecutionJob['status'],
      parameters: data.parameters,
      result_data: data.result_data,
      error_message: data.error_message,
      created_at: data.created_at,
      scheduled_at: data.scheduled_at,
      started_at: data.started_at,
      completed_at: data.completed_at,
      priority: data.priority,
      batch_id: data.batch_id,
      execution_data: data.execution_data,
    };
  }

  async deleteJob(id: string): Promise<void> {
    const { error } = await supabase
      .from('local_execution_queues')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
}

export const localToolsService = new LocalToolsService();
