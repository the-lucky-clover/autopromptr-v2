
import { BoltAdapter } from '../adapters/boltAdapter';
import { LovableAdapter } from '../adapters/lovableAdapter';
import { ReplitAdapter } from '../adapters/replitAdapter';
import { V0Adapter } from '../adapters/v0Adapter';
import { BasePlatformAdapter } from '../adapters/basePlatformAdapter';
import { BrowserOperationResult } from './browserEngineManager';

export interface PlatformCapabilities {
  supportsFullProjects: boolean;
  supportsComponents: boolean;
  supportsForking: boolean;
  supportsAuthentication: boolean;
  avgResponseTime: number;
  reliability: number;
}

export interface PlatformStatus {
  name: string;
  isAvailable: boolean;
  lastChecked: Date;
  responseTime: number;
  errorRate: number;
  capabilities: PlatformCapabilities;
}

export class PlatformManager {
  private static instance: PlatformManager;
  private adapters: Map<string, () => BasePlatformAdapter> = new Map();
  private platformStatuses: Map<string, PlatformStatus> = new Map();
  private activeAdapters: Map<string, BasePlatformAdapter> = new Map();

  private constructor() {
    this.initializePlatforms();
    this.startHealthChecking();
  }

  public static getInstance(): PlatformManager {
    if (!PlatformManager.instance) {
      PlatformManager.instance = new PlatformManager();
    }
    return PlatformManager.instance;
  }

  private initializePlatforms(): void {
    // Register platform adapters
    this.adapters.set('lovable', () => new LovableAdapter());
    this.adapters.set('bolt', () => new BoltAdapter());
    this.adapters.set('replit', () => new ReplitAdapter());
    this.adapters.set('v0', () => new V0Adapter());

    // Initialize platform statuses
    this.platformStatuses.set('lovable', {
      name: 'Lovable',
      isAvailable: true,
      lastChecked: new Date(),
      responseTime: 5000,
      errorRate: 0.02,
      capabilities: {
        supportsFullProjects: true,
        supportsComponents: true,
        supportsForking: true,
        supportsAuthentication: false,
        avgResponseTime: 8000,
        reliability: 0.98
      }
    });

    this.platformStatuses.set('bolt', {
      name: 'Bolt.new',
      isAvailable: true,
      lastChecked: new Date(),
      responseTime: 7000,
      errorRate: 0.05,
      capabilities: {
        supportsFullProjects: true,
        supportsComponents: true,
        supportsForking: true,
        supportsAuthentication: false,
        avgResponseTime: 12000,
        reliability: 0.95
      }
    });

    this.platformStatuses.set('replit', {
      name: 'Replit',
      isAvailable: true,
      lastChecked: new Date(),
      responseTime: 6000,
      errorRate: 0.03,
      capabilities: {
        supportsFullProjects: true,
        supportsComponents: false,
        supportsForking: true,
        supportsAuthentication: true,
        avgResponseTime: 10000,
        reliability: 0.97
      }
    });

    this.platformStatuses.set('v0', {
      name: 'V0.dev',
      isAvailable: true,
      lastChecked: new Date(),
      responseTime: 4000,
      errorRate: 0.04,
      capabilities: {
        supportsFullProjects: false,
        supportsComponents: true,
        supportsForking: false,
        supportsAuthentication: true,
        avgResponseTime: 6000,
        reliability: 0.96
      }
    });
  }

  async getOptimalPlatform(requirements: {
    needsFullProject?: boolean;
    needsComponents?: boolean;
    needsForking?: boolean;
    prioritizeSpeed?: boolean;
    prioritizeReliability?: boolean;
  }): Promise<string> {
    const availablePlatforms = Array.from(this.platformStatuses.entries())
      .filter(([_, status]) => status.isAvailable)
      .map(([name, status]) => ({ name, status }));

    // Filter by requirements
    const compatiblePlatforms = availablePlatforms.filter(({ status }) => {
      const caps = status.capabilities;
      
      if (requirements.needsFullProject && !caps.supportsFullProjects) return false;
      if (requirements.needsComponents && !caps.supportsComponents) return false;
      if (requirements.needsForking && !caps.supportsForking) return false;
      
      return true;
    });

    if (compatiblePlatforms.length === 0) {
      throw new Error('No compatible platforms available for the given requirements');
    }

    // Score platforms based on preferences
    const scoredPlatforms = compatiblePlatforms.map(({ name, status }) => {
      let score = 0;
      
      if (requirements.prioritizeSpeed) {
        score += (10000 - status.capabilities.avgResponseTime) / 100;
      }
      
      if (requirements.prioritizeReliability) {
        score += status.capabilities.reliability * 100;
      }
      
      // Factor in current performance
      score += (5000 - status.responseTime) / 50;
      score += (1 - status.errorRate) * 50;
      
      return { name, score };
    });

    // Return the highest scored platform
    scoredPlatforms.sort((a, b) => b.score - a.score);
    return scoredPlatforms[0].name;
  }

  async createAdapter(platformName: string): Promise<BasePlatformAdapter> {
    const adapterFactory = this.adapters.get(platformName);
    if (!adapterFactory) {
      throw new Error(`Unknown platform: ${platformName}`);
    }

    const adapter = adapterFactory();
    const adapterId = `${platformName}_${Date.now()}`;
    
    await adapter.initialize(true); // headless by default
    this.activeAdapters.set(adapterId, adapter);

    // Cleanup adapter after 10 minutes of inactivity
    setTimeout(async () => {
      await adapter.cleanup();
      this.activeAdapters.delete(adapterId);
    }, 600000);

    return adapter;
  }

  async executePromptOnBestPlatform(
    prompt: string,
    requirements: {
      needsFullProject?: boolean;
      needsComponents?: boolean;
      needsForking?: boolean;
      prioritizeSpeed?: boolean;
      prioritizeReliability?: boolean;
    } = {}
  ): Promise<BrowserOperationResult & { platform: string }> {
    try {
      const optimalPlatform = await this.getOptimalPlatform(requirements);
      console.log(`Selected optimal platform: ${optimalPlatform}`);
      
      const adapter = await this.createAdapter(optimalPlatform);
      
      // Navigate to platform
      await adapter.navigate();
      
      // Submit prompt
      const submitResult = await adapter.submitPrompt(prompt);
      if (!submitResult.success) {
        throw new Error(`Failed to submit prompt: ${submitResult.error}`);
      }
      
      // Wait for completion
      const completionResult = await adapter.waitForCompletion();
      if (!completionResult.success) {
        throw new Error(`Processing failed: ${completionResult.error}`);
      }
      
      // Extract result
      const extractResult = await adapter.extractResult();
      
      // Update platform performance metrics
      this.updatePlatformMetrics(optimalPlatform, true);
      
      return {
        ...extractResult,
        platform: optimalPlatform
      };
      
    } catch (error) {
      console.error('Failed to execute prompt on platform:', error);
      return {
        success: false,
        error: String(error),
        platform: 'unknown'
      };
    }
  }

  private updatePlatformMetrics(platformName: string, success: boolean): void {
    const status = this.platformStatuses.get(platformName);
    if (!status) return;

    status.lastChecked = new Date();
    
    if (!success) {
      status.errorRate = Math.min(1, status.errorRate * 1.1 + 0.01);
    } else {
      status.errorRate = Math.max(0, status.errorRate * 0.9);
    }
  }

  private startHealthChecking(): void {
    // Health check every 5 minutes
    setInterval(async () => {
      for (const [platformName, status] of this.platformStatuses.entries()) {
        try {
          // Simple availability check - could be enhanced with actual platform pings
          const isOld = Date.now() - status.lastChecked.getTime() > 300000; // 5 minutes
          if (isOld && status.errorRate > 0.1) {
            status.isAvailable = false;
          } else if (status.errorRate < 0.05) {
            status.isAvailable = true;
          }
        } catch (error) {
          console.error(`Health check failed for ${platformName}:`, error);
          status.isAvailable = false;
        }
      }
    }, 300000); // 5 minutes
  }

  getPlatformStatuses(): PlatformStatus[] {
    return Array.from(this.platformStatuses.values());
  }

  async cleanup(): Promise<void> {
    console.log('Cleaning up platform manager');
    
    const cleanupPromises = Array.from(this.activeAdapters.values()).map(
      adapter => adapter.cleanup()
    );
    
    await Promise.allSettled(cleanupPromises);
    this.activeAdapters.clear();
    
    console.log('Platform manager cleanup completed');
  }
}

export const platformManager = PlatformManager.getInstance();
