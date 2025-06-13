
import { supabase } from "@/integrations/supabase/client";

export interface JobExecutor {
  execute(job: any): Promise<void>;
}

export class JobProcessor {
  private executors: Map<string, JobExecutor> = new Map();
  private isProcessing: boolean = false;
  private maxConcurrency: number = 5;
  private processingJobs: Set<string> = new Set();

  registerExecutor(jobType: string, executor: JobExecutor): void {
    this.executors.set(jobType, executor);
  }

  async start(): Promise<void> {
    if (this.isProcessing) return;
    
    this.isProcessing = true;
    console.log('Job processor started');
    
    this.processLoop();
  }

  stop(): void {
    this.isProcessing = false;
    console.log('Job processor stopped');
  }

  private async processLoop(): Promise<void> {
    while (this.isProcessing) {
      try {
        if (this.processingJobs.size < this.maxConcurrency) {
          const { data: jobs } = await supabase.rpc('get_next_job');
          
          if (jobs && jobs.length > 0) {
            const job = jobs[0];
            this.processJob(job);
          }
        }
        
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error('Job processing loop error:', error);
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    }
  }

  private async processJob(job: any): Promise<void> {
    if (this.processingJobs.has(job.job_id)) return;
    
    this.processingJobs.add(job.job_id);
    
    try {
      console.log(`Processing job ${job.job_id} of type ${job.job_type}`);
      
      const executor = this.executors.get(job.job_type);
      if (!executor) {
        throw new Error(`No executor found for job type: ${job.job_type}`);
      }
      
      await executor.execute(job);
      
      await supabase
        .from('job_queue')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString()
        })
        .eq('id', job.job_id);
        
    } catch (error) {
      console.error(`Job ${job.job_id} failed:`, error);
      
      const newRetryCount = (job.retry_attempts || 0) + 1;
      const status = newRetryCount >= job.max_retries ? 'failed' : 'pending';
      
      await supabase
        .from('job_queue')
        .update({
          status,
          retry_attempts: newRetryCount,
          error_message: error.message,
          updated_at: new Date().toISOString()
        })
        .eq('id', job.job_id);
        
    } finally {
      this.processingJobs.delete(job.job_id);
    }
  }
}
