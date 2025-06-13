
import { useState, useCallback } from 'react';
import { localToolsService, LocalTool, LocalExecutionJob } from '@/services/localToolsService';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export const useLocalTools = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [tools, setTools] = useState<LocalTool[]>([]);

  const loadLocalTools = useCallback(async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      const data = await localToolsService.getLocalTools(user.id);
      setTools(data);
    } catch (error) {
      console.error('Error loading local tools:', error);
      toast.error('Failed to load local tools');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  const addTool = useCallback(async (toolName: string, toolPath: string, configuration: any = {}) => {
    if (!user?.id) return;
    
    try {
      const newTool = await localToolsService.addLocalTool(user.id, toolName, toolPath, configuration);
      setTools(prev => [...prev, newTool]);
      toast.success(`${toolName} added successfully`);
      return newTool;
    } catch (error) {
      console.error('Error adding tool:', error);
      toast.error('Failed to add tool');
      throw error;
    }
  }, [user?.id]);

  const updateTool = useCallback(async (toolId: string, updates: Partial<LocalTool>) => {
    try {
      await localToolsService.updateLocalTool(toolId, updates);
      setTools(prev => prev.map(tool => 
        tool.id === toolId ? { ...tool, ...updates } : tool
      ));
      toast.success('Tool updated successfully');
    } catch (error) {
      console.error('Error updating tool:', error);
      toast.error('Failed to update tool');
      throw error;
    }
  }, []);

  const deleteTool = useCallback(async (toolId: string) => {
    try {
      await localToolsService.deleteLocalTool(toolId);
      setTools(prev => prev.filter(tool => tool.id !== toolId));
      toast.success('Tool removed successfully');
    } catch (error) {
      console.error('Error deleting tool:', error);
      toast.error('Failed to remove tool');
      throw error;
    }
  }, []);

  const enableLocalTools = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      await localToolsService.enableLocalTools(user.id);
      toast.success('Local tools enabled');
    } catch (error) {
      console.error('Error enabling local tools:', error);
      toast.error('Failed to enable local tools');
      throw error;
    }
  }, [user?.id]);

  const disableLocalTools = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      await localToolsService.disableLocalTools(user.id);
      toast.success('Local tools disabled');
    } catch (error) {
      console.error('Error disabling local tools:', error);
      toast.error('Failed to disable local tools');
      throw error;
    }
  }, [user?.id]);

  return {
    tools,
    loading,
    loadLocalTools,
    addTool,
    updateTool,
    deleteTool,
    enableLocalTools,
    disableLocalTools
  };
};

export const useLocalExecutionQueue = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [executions, setExecutions] = useState<LocalExecutionJob[]>([]);

  const loadExecutionQueue = useCallback(async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      const data = await localToolsService.getExecutionQueue(user.id);
      setExecutions(data);
    } catch (error) {
      console.error('Error loading execution queue:', error);
      toast.error('Failed to load execution queue');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  const queueExecution = useCallback(async (
    toolTarget: string,
    executionData: any,
    batchId?: string,
    priority: number = 0
  ) => {
    if (!user?.id) return;
    
    try {
      const job = await localToolsService.queueLocalExecution(
        user.id,
        toolTarget,
        executionData,
        batchId,
        priority
      );
      setExecutions(prev => [job, ...prev]);
      toast.success('Execution queued successfully');
      return job;
    } catch (error) {
      console.error('Error queueing execution:', error);
      toast.error('Failed to queue execution');
      throw error;
    }
  }, [user?.id]);

  const cancelExecution = useCallback(async (executionId: string) => {
    try {
      await localToolsService.cancelExecution(executionId);
      setExecutions(prev => prev.map(exec => 
        exec.id === executionId ? { ...exec, status: 'cancelled' as const } : exec
      ));
      toast.success('Execution cancelled');
    } catch (error) {
      console.error('Error cancelling execution:', error);
      toast.error('Failed to cancel execution');
      throw error;
    }
  }, []);

  const retryExecution = useCallback(async (executionId: string) => {
    try {
      await localToolsService.retryExecution(executionId);
      setExecutions(prev => prev.map(exec => 
        exec.id === executionId ? { 
          ...exec, 
          status: 'pending' as const,
          error_message: undefined,
          started_at: undefined,
          completed_at: undefined
        } : exec
      ));
      toast.success('Execution queued for retry');
    } catch (error) {
      console.error('Error retrying execution:', error);
      toast.error('Failed to retry execution');
      throw error;
    }
  }, []);

  const deleteExecution = useCallback(async (executionId: string) => {
    try {
      await localToolsService.deleteExecution(executionId);
      setExecutions(prev => prev.filter(exec => exec.id !== executionId));
      toast.success('Execution removed');
    } catch (error) {
      console.error('Error deleting execution:', error);
      toast.error('Failed to remove execution');
      throw error;
    }
  }, []);

  return {
    executions,
    loading,
    loadExecutionQueue,
    queueExecution,
    cancelExecution,
    retryExecution,
    deleteExecution
  };
};
