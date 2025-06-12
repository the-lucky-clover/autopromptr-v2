
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

export class JobQueueService {
  private static instance: JobQueueService;
  private processingJobs: Set<string> = new Set();
  private isProcessing: boolean = false;

  public static getInstance(): JobQueueService {
    if (!JobQueueService.instance) {
      JobQueueService.instance = new JobQueueService();
    }
    return JobQueueService.instance;
  }

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
    
    // Start processing if not already running
    if (!this.isProcessing) {
      this.startProcessing();
    }
    
    return data.id;
  }

  private async startProcessing(): Promise<void> {
    if (this.isProcessing) return;
    
    this.isProcessing = true;
    
    while (this.isProcessing) {
      try {
        const { data: jobs } = await supabase.rpc('get_next_job');
        
        if (!jobs || jobs.length === 0) {
          await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1s
          continue;
        }
        
        // Process jobs concurrently but limit concurrency
        const activeJobs = Array.from(this.processingJobs);
        if (activeJobs.length < 5) { // Max 5 concurrent jobs
          const job = jobs[0];
          this.processJob(job);
        }
        
      } catch (error) {
        console.error('Job queue processing error:', error);
        await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5s on error
      }
    }
  }

  private async processJob(job: any): Promise<void> {
    if (this.processingJobs.has(job.job_id)) return;
    
    this.processingJobs.add(job.job_id);
    
    try {
      console.log(`Processing job ${job.job_id} of type ${job.job_type}`);
      
      // Execute the job based on type
      await this.executeJob(job);
      
      // Mark as completed
      await supabase
        .from('job_queue')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString()
        })
        .eq('id', job.job_id);
        
    } catch (error) {
      console.error(`Job ${job.job_id} failed:`, error);
      
      // Update retry count and status
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

  private async executeJob(job: any): Promise<void> {
    const { job_type, metadata } = job;
    
    switch (job_type) {
      case 'browser_automation':
        await this.executeBrowserJob(metadata);
        break;
      case 'ai_optimization':
        await this.executeAIJob(metadata);
        break;
      case 'text_extraction':
        await this.executeExtractionJob(metadata);
        break;
      case 'cleanup':
        await this.executeCleanupJob(metadata);
        break;
      default:
        throw new Error(`Unknown job type: ${job_type}`);
    }
  }

  private async executeBrowserJob(metadata: any): Promise<void> {
    // Browser automation job execution
    const { browserAutomationService } = await import('./browserAutomationService');
    
    if (metadata.payload.batchId) {
      // Process batch
      const prompts = metadata.payload.prompts || [];
      await browserAutomationService.executeBatch(prompts);
    } else {
      // Process single prompt
      await browserAutomationService.executePrompt(
        metadata.payload.promptId,
        metadata.payload.prompt,
        metadata.payload.platform
      );
    }
  }

  private async executeAIJob(metadata: any): Promise<void> {
    // AI optimization job execution
    // This would integrate with AI services when enabled
    console.log('AI job execution:', metadata);
  }

  private async executeExtractionJob(metadata: any): Promise<void> {
    // Text extraction job execution
    const { textExtractionService } = await import('./textExtractionService');
    
    await textExtractionService.extractText(
      metadata.payload.content,
      metadata.payload.options
    );
  }

  private async executeCleanupJob(metadata: any): Promise<void> {
    // Cleanup job execution
    console.log('Cleanup job execution:', metadata);
    
    // Clean up old logs, cache entries, etc.
    const cutoffDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // 7 days ago
    
    await supabase
      .from('system_logs')
      .delete()
      .lt('created_at', cutoffDate.toISOString());
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

  stopProcessing(): void {
    this.isProcessing = false;
  }
}

export const jobQueueService = JobQueueService.getInstance();
