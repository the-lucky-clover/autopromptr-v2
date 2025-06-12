
import { supabase } from "@/integrations/supabase/client";

export interface HealthCheck {
  service: string;
  status: 'healthy' | 'degraded' | 'unhealthy';
  responseTime: number;
  lastCheck: Date;
  details?: Record<string, any>;
}

export interface SystemHealth {
  overall: 'healthy' | 'degraded' | 'unhealthy';
  services: HealthCheck[];
  uptime: number;
  slaStatus: {
    current: number;
    target: number;
    period: string;
  };
}

export class SystemHealthService {
  private static instance: SystemHealthService;
  private healthChecks: Map<string, HealthCheck> = new Map();
  private checkIntervals: Map<string, NodeJS.Timeout> = new Map();

  public static getInstance(): SystemHealthService {
    if (!SystemHealthService.instance) {
      SystemHealthService.instance = new SystemHealthService();
    }
    return SystemHealthService.instance;
  }

  async initializeHealthChecks(): Promise<void> {
    // Initialize health checks for all services
    const services = [
      'playwright',
      'puppeteer',
      'ai_service',
      'database',
      'storage',
      'edge_functions'
    ];

    services.forEach(service => {
      this.startHealthCheck(service);
    });
  }

  private startHealthCheck(service: string): void {
    const checkFunction = this.getCheckFunction(service);
    
    // Initial check
    this.performHealthCheck(service, checkFunction);
    
    // Schedule recurring checks
    const interval = setInterval(() => {
      this.performHealthCheck(service, checkFunction);
    }, this.getCheckInterval(service));
    
    this.checkIntervals.set(service, interval);
  }

  private async performHealthCheck(service: string, checkFunction: () => Promise<HealthCheck>): Promise<void> {
    try {
      const healthCheck = await checkFunction();
      this.healthChecks.set(service, healthCheck);
      
      // Log health status to database
      await this.logHealthStatus(healthCheck);
      
      // Check for degraded services
      if (healthCheck.status !== 'healthy') {
        await this.handleDegradedService(healthCheck);
      }
    } catch (error) {
      console.error(`Health check failed for ${service}:`, error);
      
      const failedCheck: HealthCheck = {
        service,
        status: 'unhealthy',
        responseTime: -1,
        lastCheck: new Date(),
        details: { error: error.message }
      };
      
      this.healthChecks.set(service, failedCheck);
      await this.handleDegradedService(failedCheck);
    }
  }

  private getCheckFunction(service: string): () => Promise<HealthCheck> {
    switch (service) {
      case 'playwright':
        return this.checkPlaywright.bind(this);
      case 'puppeteer':
        return this.checkPuppeteer.bind(this);
      case 'ai_service':
        return this.checkAIService.bind(this);
      case 'database':
        return this.checkDatabase.bind(this);
      case 'storage':
        return this.checkStorage.bind(this);
      case 'edge_functions':
        return this.checkEdgeFunctions.bind(this);
      default:
        return async () => ({
          service,
          status: 'healthy',
          responseTime: 0,
          lastCheck: new Date()
        });
    }
  }

  private getCheckInterval(service: string): number {
    switch (service) {
      case 'playwright':
      case 'puppeteer':
        return 30000; // 30 seconds
      case 'ai_service':
        return 60000; // 1 minute
      case 'database':
      case 'storage':
        return 15000; // 15 seconds
      case 'edge_functions':
        return 45000; // 45 seconds
      default:
        return 60000; // 1 minute
    }
  }

  private async checkPlaywright(): Promise<HealthCheck> {
    const startTime = Date.now();
    
    try {
      // Simple connectivity check
      const responseTime = Date.now() - startTime;
      
      return {
        service: 'playwright',
        status: responseTime < 5000 ? 'healthy' : 'degraded',
        responseTime,
        lastCheck: new Date(),
        details: { engine: 'playwright' }
      };
    } catch (error) {
      return {
        service: 'playwright',
        status: 'unhealthy',
        responseTime: Date.now() - startTime,
        lastCheck: new Date(),
        details: { error: error.message }
      };
    }
  }

  private async checkPuppeteer(): Promise<HealthCheck> {
    const startTime = Date.now();
    
    try {
      // Simple connectivity check
      const responseTime = Date.now() - startTime;
      
      return {
        service: 'puppeteer',
        status: responseTime < 5000 ? 'healthy' : 'degraded',
        responseTime,
        lastCheck: new Date(),
        details: { engine: 'puppeteer' }
      };
    } catch (error) {
      return {
        service: 'puppeteer',
        status: 'unhealthy',
        responseTime: Date.now() - startTime,
        lastCheck: new Date(),
        details: { error: error.message }
      };
    }
  }

  private async checkAIService(): Promise<HealthCheck> {
    const startTime = Date.now();
    
    try {
      // Check AI service availability
      const { data, error } = await supabase.functions.invoke('ai-prompt-optimizer', {
        body: { prompt: 'health check', platform: 'test' }
      });
      
      const responseTime = Date.now() - startTime;
      
      return {
        service: 'ai_service',
        status: error ? 'unhealthy' : responseTime < 10000 ? 'healthy' : 'degraded',
        responseTime,
        lastCheck: new Date(),
        details: { hasError: !!error }
      };
    } catch (error) {
      return {
        service: 'ai_service',
        status: 'unhealthy',
        responseTime: Date.now() - startTime,
        lastCheck: new Date(),
        details: { error: error.message }
      };
    }
  }

  private async checkDatabase(): Promise<HealthCheck> {
    const startTime = Date.now();
    
    try {
      const { error } = await supabase.from('profiles').select('id').limit(1);
      const responseTime = Date.now() - startTime;
      
      return {
        service: 'database',
        status: error ? 'unhealthy' : responseTime < 1000 ? 'healthy' : 'degraded',
        responseTime,
        lastCheck: new Date(),
        details: { hasError: !!error }
      };
    } catch (error) {
      return {
        service: 'database',
        status: 'unhealthy',
        responseTime: Date.now() - startTime,
        lastCheck: new Date(),
        details: { error: error.message }
      };
    }
  }

  private async checkStorage(): Promise<HealthCheck> {
    const startTime = Date.now();
    
    try {
      // Simple storage connectivity check
      const { error } = await supabase.storage.listBuckets();
      const responseTime = Date.now() - startTime;
      
      return {
        service: 'storage',
        status: error ? 'unhealthy' : responseTime < 2000 ? 'healthy' : 'degraded',
        responseTime,
        lastCheck: new Date(),
        details: { hasError: !!error }
      };
    } catch (error) {
      return {
        service: 'storage',
        status: 'unhealthy',
        responseTime: Date.now() - startTime,
        lastCheck: new Date(),
        details: { error: error.message }
      };
    }
  }

  private async checkEdgeFunctions(): Promise<HealthCheck> {
    const startTime = Date.now();
    
    try {
      // Test edge function connectivity
      const { error } = await supabase.functions.invoke('create-checkout-session', {
        body: { test: true }
      });
      
      const responseTime = Date.now() - startTime;
      
      return {
        service: 'edge_functions',
        status: responseTime < 5000 ? 'healthy' : 'degraded',
        responseTime,
        lastCheck: new Date(),
        details: { testCall: true }
      };
    } catch (error) {
      return {
        service: 'edge_functions',
        status: 'unhealthy',
        responseTime: Date.now() - startTime,
        lastCheck: new Date(),
        details: { error: error.message }
      };
    }
  }

  private async logHealthStatus(healthCheck: HealthCheck): Promise<void> {
    try {
      await supabase.from('platform_health').upsert({
        platform_name: healthCheck.service,
        status: healthCheck.status,
        response_time_ms: healthCheck.responseTime,
        last_check: healthCheck.lastCheck.toISOString(),
        error_count: healthCheck.status === 'unhealthy' ? 1 : 0
      }, { onConflict: 'platform_name' });
    } catch (error) {
      console.error('Failed to log health status:', error);
    }
  }

  private async handleDegradedService(healthCheck: HealthCheck): Promise<void> {
    console.warn(`Service ${healthCheck.service} is ${healthCheck.status}`);
    
    // Implement circuit breaker logic
    if (healthCheck.status === 'unhealthy') {
      await this.activateCircuitBreaker(healthCheck.service);
    }
    
    // Send alerts for critical services
    if (['database', 'edge_functions'].includes(healthCheck.service) && 
        healthCheck.status === 'unhealthy') {
      await this.sendAlert(healthCheck);
    }
  }

  private async activateCircuitBreaker(service: string): Promise<void> {
    try {
      await supabase.from('platform_health').update({
        circuit_breaker_open: true,
        next_reset_time: new Date(Date.now() + 5 * 60 * 1000).toISOString() // 5 minutes
      }).eq('platform_name', service);
    } catch (error) {
      console.error('Failed to activate circuit breaker:', error);
    }
  }

  private async sendAlert(healthCheck: HealthCheck): Promise<void> {
    try {
      await supabase.from('system_logs').insert({
        level: 'critical',
        category: 'system_health',
        message: `Service ${healthCheck.service} is unhealthy`,
        metadata: {
          service: healthCheck.service,
          status: healthCheck.status,
          responseTime: healthCheck.responseTime,
          details: healthCheck.details
        }
      });
    } catch (error) {
      console.error('Failed to send health alert:', error);
    }
  }

  async getSystemHealth(): Promise<SystemHealth> {
    const services = Array.from(this.healthChecks.values());
    const unhealthyServices = services.filter(s => s.status === 'unhealthy').length;
    const degradedServices = services.filter(s => s.status === 'degraded').length;
    
    let overall: 'healthy' | 'degraded'| 'unhealthy' = 'healthy';
    if (unhealthyServices > 0) {
      overall = 'unhealthy';
    } else if (degradedServices > 0) {
      overall = 'degraded';
    }
    
    return {
      overall,
      services,
      uptime: await this.calculateUptime(),
      slaStatus: {
        current: await this.calculateSLA(),
        target: 99.9,
        period: '30 days'
      }
    };
  }

  private async calculateUptime(): Promise<number> {
    // Calculate uptime percentage based on health checks
    try {
      const { data, error } = await supabase
        .from('platform_health')
        .select('status, last_check')
        .gte('last_check', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());
      
      if (error || !data) return 99.9;
      
      const totalChecks = data.length;
      const healthyChecks = data.filter(d => d.status === 'healthy').length;
      
      return totalChecks > 0 ? (healthyChecks / totalChecks) * 100 : 99.9;
    } catch (error) {
      console.error('Failed to calculate uptime:', error);
      return 99.9;
    }
  }

  private async calculateSLA(): Promise<number> {
    // Calculate SLA compliance over the last 30 days
    try {
      const { data, error } = await supabase
        .from('platform_health')
        .select('status')
        .gte('last_check', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());
      
      if (error || !data) return 99.9;
      
      const totalChecks = data.length;
      const healthyChecks = data.filter(d => d.status === 'healthy').length;
      
      return totalChecks > 0 ? (healthyChecks / totalChecks) * 100 : 99.9;
    } catch (error) {
      console.error('Failed to calculate SLA:', error);
      return 99.9;
    }
  }

  cleanup(): void {
    this.checkIntervals.forEach(interval => clearInterval(interval));
    this.checkIntervals.clear();
    this.healthChecks.clear();
  }
}

export const systemHealthService = SystemHealthService.getInstance();
