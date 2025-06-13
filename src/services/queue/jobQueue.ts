
import { supabase } from "@/integrations/supabase/client";

export interface QueueJob {
  id: string;
  type: string;
  payload: any;
  priority: number;
  maxRetries: number;
  currentRetries: number;
  scheduledAt?: Date;
  status: 'pending' | 'running' | 'completed' | 'failed';
}

export class JobQueue {
  async enqueue(
    type: string,
    payload: any,
    options: {
      priority?: number;
      maxRetries?: number;
      delay?: number;
    } = {}
  ): Promise<string> {
    const job: Partial<QueueJob> = {
      type,
      payload,
      priority: options.priority || 0,
      maxRetries: options.maxRetries || 3,
      currentRetries: 0,
      scheduledAt: options.delay ? new Date(Date.now() + options.delay) : undefined,
      status: 'pending'
    };

    const { data, error } = await supabase
      .from('job_queue')
      .insert({
        job_type: job.type,
        metadata: { payload: job.payload },
        priority: job.priority,
        max_retries: job.maxRetries,
        scheduled_at: job.scheduledAt?.toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    return data.id;
  }

  async getNextJob(): Promise<any | null> {
    try {
      const { data } = await supabase.rpc('get_next_job');
      return data && data.length > 0 ? data[0] : null;
    } catch (error) {
      console.error('Failed to get next job:', error);
      return null;
    }
  }

  async updateJobStatus(jobId: string, status: string, error?: string): Promise<void> {
    const updates: any = {
      status,
      updated_at: new Date().toISOString()
    };

    if (status === 'completed') {
      updates.completed_at = new Date().toISOString();
    }

    if (error) {
      updates.error_message = error;
    }

    await supabase
      .from('job_queue')
      .update(updates)
      .eq('id', jobId);
  }

  async getQueueStats(): Promise<{
    pending: number;
    running: number;
    failed: number;
    avgProcessingTime: number;
  }> {
    const { data } = await supabase
      .from('job_queue')
      .select('status, created_at, completed_at');
    
    if (!data) return { pending: 0, running: 0, failed: 0, avgProcessingTime: 0 };
    
    const stats = data.reduce((acc, job) => {
      acc[job.status] = (acc[job.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const completedJobs = data.filter(job => job.status === 'completed' && job.completed_at);
    const avgProcessingTime = completedJobs.length > 0 
      ? completedJobs.reduce((sum, job) => {
          const start = new Date(job.created_at).getTime();
          const end = new Date(job.completed_at).getTime();
          return sum + (end - start);
        }, 0) / completedJobs.length
      : 0;
    
    return {
      pending: stats.pending || 0,
      running: stats.running || 0,
      failed: stats.failed || 0,
      avgProcessingTime
    };
  }
}
