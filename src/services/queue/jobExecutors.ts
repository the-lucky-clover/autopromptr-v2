
import { JobExecutor } from './jobProcessor';
import { supabase } from "@/integrations/supabase/client";

export class BrowserAutomationExecutor implements JobExecutor {
  async execute(job: any): Promise<void> {
    const { metadata } = job;
    
    if (metadata.payload.batchId) {
      await this.executeBatch(metadata.payload);
    } else {
      await this.executeSinglePrompt(metadata.payload);
    }
  }

  private async executeBatch(payload: any): Promise<void> {
    const { data, error } = await supabase.functions.invoke('platform-automation', {
      body: {
        platform: payload.platform || 'lovable',
        prompts: payload.prompts,
        batchId: payload.batchId
      }
    });

    if (error) throw error;
    console.log('Batch execution completed:', data);
  }

  private async executeSinglePrompt(payload: any): Promise<void> {
    const { data, error } = await supabase.functions.invoke('platform-automation', {
      body: {
        platform: payload.platform || 'lovable',
        prompt: payload.prompt,
        promptId: payload.promptId
      }
    });

    if (error) throw error;
    console.log('Single prompt execution completed:', data);
  }
}

export class TextExtractionExecutor implements JobExecutor {
  async execute(job: any): Promise<void> {
    const { metadata } = job;
    
    // Delegate to text extraction service
    console.log('Text extraction job execution:', metadata);
    
    // In a real implementation, this would call the text extraction service
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}

export class CleanupExecutor implements JobExecutor {
  async execute(job: any): Promise<void> {
    console.log('Cleanup job execution');
    
    const cutoffDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    
    await supabase
      .from('system_logs')
      .delete()
      .lt('created_at', cutoffDate.toISOString());
  }
}
