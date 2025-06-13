
import { supabase } from '@/integrations/supabase/client';

export interface LocalTool {
  id: string;
  tool_name: string;
  tool_path: string | null;
  enabled: boolean;
  version: string | null;
  last_verified: string | null;
  configuration: Record<string, any>;
}

export interface LocalExecutionJob {
  id: string;
  user_id: string;
  tool_target: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  execution_data: Record<string, any>;
  result_data?: Record<string, any>;
  error_message?: string;
  created_at: string;
  scheduled_at?: string;
  started_at?: string;
  completed_at?: string;
  priority: number;
  batch_id?: string;
}

class LocalToolsService {
  async getLocalTools(userId: string): Promise<LocalTool[]> {
    const { data, error } = await supabase
      .from('local_tools_settings')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data.map(item => ({
      id: item.id,
      tool_name: item.tool_name,
      tool_path: item.tool_path,
      enabled: item.enabled,
      version: item.version,
      last_verified: item.last_verified,
      configuration: (item.configuration as Record<string, any>) || {},
    }));
  }

  async addLocalTool(userId: string, toolName: string, toolPath: string, configuration: Record<string, any> = {}): Promise<LocalTool> {
    const { data, error } = await supabase
      .from('local_tools_settings')
      .insert({
        user_id: userId,
        tool_name: toolName,
        tool_path: toolPath,
        enabled: true,
        configuration: configuration,
      })
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      tool_name: data.tool_name,
      tool_path: data.tool_path,
      enabled: data.enabled,
      version: data.version,
      last_verified: data.last_verified,
      configuration: (data.configuration as Record<string, any>) || {},
    };
  }

  async updateLocalTool(toolId: string, updates: Partial<LocalTool>): Promise<void> {
    const { error } = await supabase
      .from('local_tools_settings')
      .update({
        tool_name: updates.tool_name,
        tool_path: updates.tool_path,
        enabled: updates.enabled,
        version: updates.version,
        configuration: updates.configuration,
      })
      .eq('id', toolId);

    if (error) throw error;
  }

  async deleteLocalTool(id: string): Promise<void> {
    const { error } = await supabase
      .from('local_tools_settings')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  async enableLocalTools(userId: string): Promise<void> {
    const { error } = await supabase
      .from('local_tools_settings')
      .update({ enabled: true })
      .eq('user_id', userId);

    if (error) throw error;
  }

  async disableLocalTools(userId: string): Promise<void> {
    const { error } = await supabase
      .from('local_tools_settings')
      .update({ enabled: false })
      .eq('user_id', userId);

    if (error) throw error;
  }

  async getExecutionQueue(userId: string): Promise<LocalExecutionJob[]> {
    const { data, error } = await supabase
      .from('local_execution_queues')
      .select('*')
      .eq('user_id', userId)
      .order('priority', { ascending: false })
      .order('created_at', { ascending: true });

    if (error) throw error;

    return data.map(item => ({
      id: item.id,
      user_id: item.user_id,
      tool_target: item.tool_target,
      status: item.status as LocalExecutionJob['status'],
      execution_data: (item.execution_data as Record<string, any>) || {},
      result_data: (item.result_data as Record<string, any>) || undefined,
      error_message: item.error_message,
      created_at: item.created_at,
      scheduled_at: item.scheduled_at,
      started_at: item.started_at,
      completed_at: item.completed_at,
      priority: item.priority,
      batch_id: item.batch_id,
    }));
  }

  async queueLocalExecution(
    userId: string,
    toolTarget: string,
    executionData: Record<string, any>,
    batchId?: string,
    priority: number = 0
  ): Promise<LocalExecutionJob> {
    const { data, error } = await supabase
      .from('local_execution_queues')
      .insert({
        user_id: userId,
        tool_target: toolTarget,
        status: 'pending',
        execution_data: executionData,
        batch_id: batchId,
        priority: priority,
      })
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      user_id: data.user_id,
      tool_target: data.tool_target,
      status: data.status as LocalExecutionJob['status'],
      execution_data: (data.execution_data as Record<string, any>) || {},
      result_data: (data.result_data as Record<string, any>) || undefined,
      error_message: data.error_message,
      created_at: data.created_at,
      scheduled_at: data.scheduled_at,
      started_at: data.started_at,
      completed_at: data.completed_at,
      priority: data.priority,
      batch_id: data.batch_id,
    };
  }

  async cancelExecution(executionId: string): Promise<void> {
    const { error } = await supabase
      .from('local_execution_queues')
      .update({ status: 'cancelled' })
      .eq('id', executionId);

    if (error) throw error;
  }

  async retryExecution(executionId: string): Promise<void> {
    const { error } = await supabase
      .from('local_execution_queues')
      .update({ 
        status: 'pending',
        error_message: null,
        started_at: null,
        completed_at: null
      })
      .eq('id', executionId);

    if (error) throw error;
  }

  async deleteExecution(executionId: string): Promise<void> {
    const { error } = await supabase
      .from('local_execution_queues')
      .delete()
      .eq('id', executionId);

    if (error) throw error;
  }

  // Legacy methods for backward compatibility
  async saveLocalTool(tool: Omit<LocalTool, 'id'>): Promise<LocalTool> {
    const { data, error } = await supabase
      .from('local_tools_settings')
      .insert({
        tool_name: tool.tool_name,
        tool_path: tool.tool_path,
        enabled: tool.enabled,
        configuration: tool.configuration,
      })
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      tool_name: data.tool_name,
      tool_path: data.tool_path,
      enabled: data.enabled,
      version: data.version,
      last_verified: data.last_verified,
      configuration: (data.configuration as Record<string, any>) || {},
    };
  }

  async toggleLocalTool(id: string, enabled: boolean): Promise<void> {
    const { error } = await supabase
      .from('local_tools_settings')
      .update({ enabled })
      .eq('id', id);

    if (error) throw error;
  }

  async queueJob(job: Omit<LocalExecutionJob, 'id' | 'created_at'>): Promise<LocalExecutionJob> {
    const { data, error } = await supabase
      .from('local_execution_queues')
      .insert({
        user_id: job.user_id,
        tool_target: job.tool_target,
        status: job.status,
        execution_data: job.execution_data,
        result_data: job.result_data,
        error_message: job.error_message,
        scheduled_at: job.scheduled_at,
        started_at: job.started_at,
        completed_at: job.completed_at,
        priority: job.priority,
        batch_id: job.batch_id,
      })
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      user_id: data.user_id,
      tool_target: data.tool_target,
      status: data.status as LocalExecutionJob['status'],
      execution_data: (data.execution_data as Record<string, any>) || {},
      result_data: (data.result_data as Record<string, any>) || undefined,
      error_message: data.error_message,
      created_at: data.created_at,
      scheduled_at: data.scheduled_at,
      started_at: data.started_at,
      completed_at: data.completed_at,
      priority: data.priority,
      batch_id: data.batch_id,
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
      tool_target: item.tool_target,
      status: item.status as LocalExecutionJob['status'],
      execution_data: (item.execution_data as Record<string, any>) || {},
      result_data: (item.result_data as Record<string, any>) || undefined,
      error_message: item.error_message,
      created_at: item.created_at,
      scheduled_at: item.scheduled_at,
      started_at: item.started_at,
      completed_at: item.completed_at,
      priority: item.priority,
      batch_id: item.batch_id,
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
      tool_target: data.tool_target,
      status: data.status as LocalExecutionJob['status'],
      execution_data: (data.execution_data as Record<string, any>) || {},
      result_data: (data.result_data as Record<string, any>) || undefined,
      error_message: data.error_message,
      created_at: data.created_at,
      scheduled_at: data.scheduled_at,
      started_at: data.started_at,
      completed_at: data.completed_at,
      priority: data.priority,
      batch_id: data.batch_id,
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
