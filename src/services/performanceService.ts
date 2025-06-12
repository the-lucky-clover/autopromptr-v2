import { cacheService } from './cacheService';

export interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: number;
  category: 'browser' | 'ai' | 'database' | 'api' | 'extraction';
  metadata?: Record<string, any>;
}

export class PerformanceService {
  private static instance: PerformanceService;
  private metrics: PerformanceMetric[] = [];
  private thresholds: Map<string, number> = new Map();

  public static getInstance(): PerformanceService {
    if (!PerformanceService.instance) {
      PerformanceService.instance = new PerformanceService();
    }
    return PerformanceService.instance;
  }

  constructor() {
    this.initializeThresholds();
  }

  private initializeThresholds(): void {
    this.thresholds.set('browser_response_time', 10000); // 10s
    this.thresholds.set('ai_response_time', 30000); // 30s
    this.thresholds.set('database_query_time', 1000); // 1s
    this.thresholds.set('extraction_time', 5000); // 5s
    this.thresholds.set('memory_usage', 512 * 1024 * 1024); // 512MB
  }

  async recordMetric(metric: PerformanceMetric): Promise<void> {
    this.metrics.push(metric);
    
    // Keep only last 1000 metrics
    if (this.metrics.length > 1000) {
      this.metrics = this.metrics.slice(-1000);
    }
    
    // Check thresholds
    const threshold = this.thresholds.get(metric.name);
    if (threshold && metric.value > threshold) {
      await this.triggerAlert(metric, threshold);
    }
  }

  async measureExecution<T>(
    name: string,
    category: PerformanceMetric['category'],
    operation: () => Promise<T>,
    metadata?: Record<string, any>
  ): Promise<T> {
    const startTime = performance.now();
    const startMemory = this.getMemoryUsage();
    
    try {
      const result = await operation();
      const endTime = performance.now();
      const endMemory = this.getMemoryUsage();
      
      await this.recordMetric({
        name: `${name}_execution_time`,
        value: endTime - startTime,
        timestamp: Date.now(),
        category,
        metadata: {
          ...metadata,
          memoryDelta: endMemory - startMemory,
          success: true
        }
      });
      
      return result;
    } catch (error) {
      const endTime = performance.now();
      
      await this.recordMetric({
        name: `${name}_execution_time`,
        value: endTime - startTime,
        timestamp: Date.now(),
        category,
        metadata: {
          ...metadata,
          error: error.message,
          success: false
        }
      });
      
      throw error;
    }
  }

  async getMetrics(
    category?: PerformanceMetric['category'],
    since?: number
  ): Promise<PerformanceMetric[]> {
    const cacheKey = `metrics_${category || 'all'}_${since || 0}`;
    const cached = await cacheService.get<PerformanceMetric[]>(cacheKey);
    
    if (cached) return cached;
    
    let filtered = this.metrics;
    
    if (category) {
      filtered = filtered.filter(m => m.category === category);
    }
    
    if (since) {
      filtered = filtered.filter(m => m.timestamp >= since);
    }
    
    await cacheService.set(cacheKey, filtered, 30000); // 30s cache
    return filtered;
  }

  async getPerformanceReport(timeRange: number = 3600000): Promise<{
    averages: Record<string, number>;
    peaks: Record<string, number>;
    alerts: number;
    trends: Record<string, number[]>;
  }> {
    const since = Date.now() - timeRange;
    const metrics = await this.getMetrics(undefined, since);
    
    const grouped = metrics.reduce((acc, metric) => {
      if (!acc[metric.name]) acc[metric.name] = [];
      acc[metric.name].push(metric.value);
      return acc;
    }, {} as Record<string, number[]>);
    
    const averages: Record<string, number> = {};
    const peaks: Record<string, number> = {};
    const trends: Record<string, number[]> = {};
    
    for (const [name, values] of Object.entries(grouped)) {
      averages[name] = values.reduce((sum, val) => sum + val, 0) / values.length;
      peaks[name] = Math.max(...values);
      trends[name] = values.slice(-20); // Last 20 data points
    }
    
    const alerts = metrics.filter(m => {
      const threshold = this.thresholds.get(m.name);
      return threshold && m.value > threshold;
    }).length;
    
    return { averages, peaks, alerts, trends };
  }

  private getMemoryUsage(): number {
    if (typeof performance !== 'undefined' && (performance as any).memory) {
      return (performance as any).memory.usedJSHeapSize;
    }
    return 0;
  }

  private async triggerAlert(metric: PerformanceMetric, threshold: number): Promise<void> {
    console.warn(`Performance threshold exceeded: ${metric.name}`, {
      value: metric.value,
      threshold,
      category: metric.category,
      metadata: metric.metadata
    });
    
    // In production, this would trigger real alerts
    // await notificationService.sendAlert({
    //   type: 'performance',
    //   severity: 'warning',
    //   message: `${metric.name} exceeded threshold`,
    //   data: { metric, threshold }
    // });
  }
}

export const performanceService = PerformanceService.getInstance();
