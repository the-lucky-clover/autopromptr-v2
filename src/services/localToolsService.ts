
import { supabase } from "@/integrations/supabase/client";

export interface LocalTool {
  id: string;
  user_id: string;
  tool_name: string;
  tool_path: string | null;
  enabled: boolean;
  configuration: any;
  version: string | null;
  last_verified: string | null;
  created_at: string;
  updated_at: string;
}

export interface LocalExecutionJob {
  id: string;
  user_id: string;
  batch_id: string | null;
  tool_target: string;
  execution_data: any;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  priority: number;
  scheduled_at: string | null;
  started_at: string | null;
  completed_at: string | null;
  error_message: string | null;
  result_data: any;
  created_at: string;
  updated_at: string;
}

class LocalToolsService {
  // Local Tools Management
  async getLocalTools(userId: string): Promise<LocalTool[]> {
    const { data, error } = await supabase
      .from('local_tools_settings')
      .select('*')
      .eq('user_id', userId)
      .order('tool_name');

    if (error) throw error;
    return data || [];
  }

  async addLocalTool(userId: string, toolName: string, toolPath: string, configuration: any = {}): Promise<LocalTool> {
    const { data, error } = await supabase
      .from('local_tools_settings')
      .insert({
        user_id: userId,
        tool_name: toolName,
        tool_path: toolPath,
        enabled: true,
        configuration
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateLocalTool(toolId: string, updates: Partial<LocalTool>): Promise<void> {
    const { error } = await supabase
      .from('local_tools_settings')
      .update(updates)
      .eq('id', toolId);

    if (error) throw error;
  }

  async deleteLocalTool(toolId: string): Promise<void> {
    const { error } = await supabase
      .from('local_tools_settings')
      .delete()
      .eq('id', toolId);

    if (error) throw error;
  }

  async verifyToolInstallation(toolPath: string): Promise<{ installed: boolean; version?: string }> {
    // This would typically interface with a local agent or API
    // For now, return a mock response
    try {
      // In a real implementation, this would check if the tool is actually installed
      // and get its version information
      return {
        installed: true,
        version: "1.0.0"
      };
    } catch (error) {
      return {
        installed: false
      };
    }
  }

  // Local Execution Queue Management
  async getExecutionQueue(userId: string): Promise<LocalExecutionJob[]> {
    const { data, error } = await supabase
      .from('local_execution_queues')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async queueLocalExecution(
    userId: string,
    toolTarget: string,
    executionData: any,
    batchId?: string,
    priority: number = 0
  ): Promise<LocalExecutionJob> {
    const { data, error } = await supabase
      .from('local_execution_queues')
      .insert({
        user_id: userId,
        batch_id: batchId,
        tool_target: toolTarget,
        execution_data: executionData,
        priority,
        status: 'pending'
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateExecutionStatus(
    executionId: string,
    status: LocalExecutionJob['status'],
    resultData?: any,
    errorMessage?: string
  ): Promise<void> {
    const updates: any = { status };
    
    if (status === 'running') {
      updates.started_at = new Date().toISOString();
    } else if (status === 'completed' || status === 'failed') {
      updates.completed_at = new Date().toISOString();
    }
    
    if (resultData) {
      updates.result_data = resultData;
    }
    
    if (errorMessage) {
      updates.error_message = errorMessage;
    }

    const { error } = await supabase
      .from('local_execution_queues')
      .update(updates)
      .eq('id', executionId);

    if (error) throw error;
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
        started_at: null,
        completed_at: null,
        error_message: null
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

  // Analytics and Usage
  async getLocalToolsUsageStats(userId: string): Promise<{
    totalExecutions: number;
    successRate: number;
    popularTools: Array<{ tool: string; count: number }>;
    recentActivity: LocalExecutionJob[];
  }> {
    const executions = await this.getExecutionQueue(userId);
    
    const totalExecutions = executions.length;
    const successfulExecutions = executions.filter(e => e.status === 'completed').length;
    const successRate = totalExecutions > 0 ? (successfulExecutions / totalExecutions) * 100 : 0;
    
    // Calculate popular tools
    const toolCounts = executions.reduce((acc, exec) => {
      acc[exec.tool_target] = (acc[exec.tool_target] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const popularTools = Object.entries(toolCounts)
      .map(([tool, count]) => ({ tool, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
    
    const recentActivity = executions.slice(0, 10);
    
    return {
      totalExecutions,
      successRate,
      popularTools,
      recentActivity
    };
  }

  // User Profile Updates
  async enableLocalTools(userId: string): Promise<void> {
    const { error } = await supabase
      .from('profiles')
      .update({ local_tools_enabled: true })
      .eq('id', userId);

    if (error) throw error;
  }

  async disableLocalTools(userId: string): Promise<void> {
    const { error } = await supabase
      .from('profiles')
      .update({ local_tools_enabled: false })
      .eq('id', userId);

    if (error) throw error;
  }

  async isLocalToolsEnabled(userId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('profiles')
      .select('local_tools_enabled')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data?.local_tools_enabled || false;
  }
}

export const localToolsService = new LocalToolsService();
