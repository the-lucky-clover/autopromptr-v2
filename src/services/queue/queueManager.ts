
import { JobQueue } from './jobQueue';
import { JobProcessor } from './jobProcessor';
import { BrowserAutomationExecutor, TextExtractionExecutor, CleanupExecutor } from './jobExecutors';

export class QueueManager {
  private static instance: QueueManager;
  private queue: JobQueue;
  private processor: JobProcessor;

  private constructor() {
    this.queue = new JobQueue();
    this.processor = new JobProcessor();
    
    this.setupExecutors();
  }

  public static getInstance(): QueueManager {
    if (!QueueManager.instance) {
      QueueManager.instance = new QueueManager();
    }
    return QueueManager.instance;
  }

  private setupExecutors(): void {
    this.processor.registerExecutor('browser_automation', new BrowserAutomationExecutor());
    this.processor.registerExecutor('text_extraction', new TextExtractionExecutor());
    this.processor.registerExecutor('cleanup', new CleanupExecutor());
  }

  async enqueue(type: string, payload: any, options: any = {}): Promise<string> {
    return await this.queue.enqueue(type, payload, options);
  }

  async start(): Promise<void> {
    await this.processor.start();
  }

  stop(): void {
    this.processor.stop();
  }

  async getStats(): Promise<any> {
    return await this.queue.getQueueStats();
  }
}

export const queueManager = QueueManager.getInstance();
