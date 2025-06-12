
import { supabase } from "@/integrations/supabase/client";

export interface BatchExecutionOptions {
  executionMode: 'sequential' | 'parallel';
  maxConcurrency?: number;
  scheduledTime?: string;
  retryOptions?: {
    maxRetries: number;
    backoffMultiplier: number;
  };
}

export interface ExecutionState {
  batchId: string;
  status: 'pending' | 'running' | 'paused' | 'completed' | 'failed' | 'cancelled';
  progress: {
    currentStep: number;
    totalSteps: number;
    percentage: number;
  };
  estimatedCompletion?: string;
  startTime?: string;
  endTime?: string;
}

export class BatchExecutionService {
  private static instance: BatchExecutionService;
  private executionStates: Map<string, ExecutionState> = new Map();
  private eventListeners: Map<string, ((state: ExecutionState) => void)[]> = new Map();

  public static getInstance(): BatchExecutionService {
    if (!BatchExecutionService.instance) {
      BatchExecutionService.instance = new BatchExecutionService();
    }
    return BatchExecutionService.instance;
  }

  async executeBatch(batchId: string, options: BatchExecutionOptions): Promise<void> {
    try {
      const response = await supabase.functions.invoke('batch-executor', {
        body: {
          batchId,
          action: 'execute',
          executionMode: options.executionMode,
          maxConcurrency: options.maxConcurrency || 3
        }
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      // Start monitoring the execution
      this.startMonitoring(batchId);
      
    } catch (error) {
      console.error('Failed to execute batch:', error);
      throw error;
    }
  }

  async pauseBatch(batchId: string): Promise<void> {
    try {
      const response = await supabase.functions.invoke('batch-executor', {
        body: {
          batchId,
          action: 'pause'
        }
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

    } catch (error) {
      console.error('Failed to pause batch:', error);
      throw error;
    }
  }

  async resumeBatch(batchId: string): Promise<void> {
    try {
      const response = await supabase.functions.invoke('batch-executor', {
        body: {
          batchId,
          action: 'resume'
        }
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      // Resume monitoring
      this.startMonitoring(batchId);

    } catch (error) {
      console.error('Failed to resume batch:', error);
      throw error;
    }
  }

  async cancelBatch(batchId: string): Promise<void> {
    try {
      const response = await supabase.functions.invoke('batch-executor', {
        body: {
          batchId,
          action: 'cancel'
        }
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      // Stop monitoring
      this.stopMonitoring(batchId);

    } catch (error) {
      console.error('Failed to cancel batch:', error);
      throw error;
    }
  }

  async scheduleBatch(batchId: string, scheduledTime: string): Promise<void> {
    try {
      const response = await supabase.functions.invoke('batch-executor', {
        body: {
          batchId,
          action: 'schedule',
          scheduledTime
        }
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

    } catch (error) {
      console.error('Failed to schedule batch:', error);
      throw error;
    }
  }

  async getExecutionState(batchId: string): Promise<ExecutionState | null> {
    try {
      const { data: executionState, error } = await supabase
        .from('batch_execution_state')
        .select('*')
        .eq('batch_id', batchId)
        .single();

      if (error || !executionState) {
        return null;
      }

      const { data: batch } = await supabase
        .from('prompt_batches')
        .select('status')
        .eq('id', batchId)
        .single();

      const state: ExecutionState = {
        batchId,
        status: batch?.status || 'pending',
        progress: {
          currentStep: executionState.current_step || 0,
          totalSteps: executionState.total_steps || 0,
          percentage: executionState.progress_percentage || 0
        },
        estimatedCompletion: executionState.estimated_completion,
        startTime: executionState.execution_start,
        endTime: executionState.execution_end
      };

      this.executionStates.set(batchId, state);
      return state;

    } catch (error) {
      console.error('Failed to get execution state:', error);
      return null;
    }
  }

  onExecutionStateChange(batchId: string, callback: (state: ExecutionState) => void): () => void {
    if (!this.eventListeners.has(batchId)) {
      this.eventListeners.set(batchId, []);
    }
    
    this.eventListeners.get(batchId)!.push(callback);

    // Return cleanup function
    return () => {
      const listeners = this.eventListeners.get(batchId);
      if (listeners) {
        const index = listeners.indexOf(callback);
        if (index > -1) {
          listeners.splice(index, 1);
        }
      }
    };
  }

  private async startMonitoring(batchId: string): Promise<void> {
    const pollInterval = 2000; // Poll every 2 seconds

    const poll = async () => {
      try {
        const state = await this.getExecutionState(batchId);
        if (state) {
          this.notifyListeners(batchId, state);

          // Continue polling if batch is still running
          if (state.status === 'running') {
            setTimeout(poll, pollInterval);
          } else {
            this.stopMonitoring(batchId);
          }
        }
      } catch (error) {
        console.error('Error polling execution state:', error);
        setTimeout(poll, pollInterval * 2); // Retry with longer interval
      }
    };

    poll();
  }

  private stopMonitoring(batchId: string): void {
    // Monitoring is controlled by the polling loop based on status
    // This method exists for explicit stopping if needed
  }

  private notifyListeners(batchId: string, state: ExecutionState): void {
    const listeners = this.eventListeners.get(batchId);
    if (listeners) {
      listeners.forEach(callback => {
        try {
          callback(state);
        } catch (error) {
          console.error('Error in execution state listener:', error);
        }
      });
    }
  }

  async getExecutionMetrics(batchId: string): Promise<any> {
    try {
      const { data: metrics, error } = await supabase
        .from('execution_metrics')
        .select('*')
        .eq('batch_id', batchId);

      if (error) {
        throw error;
      }

      return this.aggregateMetrics(metrics || []);

    } catch (error) {
      console.error('Failed to get execution metrics:', error);
      return null;
    }
  }

  private aggregateMetrics(metrics: any[]): any {
    if (metrics.length === 0) {
      return {
        totalJobs: 0,
        successfulJobs: 0,
        failedJobs: 0,
        averageExecutionTime: 0,
        totalTokensConsumed: 0,
        successRate: 0
      };
    }

    const successful = metrics.filter(m => m.success_rate === 100);
    const totalExecutionTime = metrics.reduce((sum, m) => sum + (m.execution_time_ms || 0), 0);
    const totalTokens = metrics.reduce((sum, m) => sum + (m.tokens_consumed || 0), 0);

    return {
      totalJobs: metrics.length,
      successfulJobs: successful.length,
      failedJobs: metrics.length - successful.length,
      averageExecutionTime: totalExecutionTime / metrics.length,
      totalTokensConsumed: totalTokens,
      successRate: (successful.length / metrics.length) * 100
    };
  }
}

// Export singleton instance
export const batchExecutionService = BatchExecutionService.getInstance();
