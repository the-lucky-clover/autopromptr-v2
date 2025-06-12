
import { supabase } from "@/integrations/supabase/client";

export enum ErrorCategory {
  USER = 'USER',
  SYSTEM = 'SYSTEM',
  API = 'API',
  NETWORK = 'NETWORK',
  BROWSER = 'BROWSER',
  AI = 'AI',
  EXTRACTION = 'EXTRACTION'
}

export enum ErrorSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export interface ErrorContext {
  correlationId: string;
  userId?: string;
  sessionId?: string;
  platform?: string;
  operation?: string;
  metadata?: Record<string, any>;
}

export interface ErrorReport {
  id: string;
  category: ErrorCategory;
  severity: ErrorSeverity;
  message: string;
  userMessage: string;
  context: ErrorContext;
  timestamp: Date;
  stackTrace?: string;
  resolved: boolean;
  resolutionSteps?: string[];
}

export class ErrorHandlingService {
  private static instance: ErrorHandlingService;
  private correlationIdCounter = 0;

  public static getInstance(): ErrorHandlingService {
    if (!ErrorHandlingService.instance) {
      ErrorHandlingService.instance = new ErrorHandlingService();
    }
    return ErrorHandlingService.instance;
  }

  generateCorrelationId(): string {
    return `err_${Date.now()}_${++this.correlationIdCounter}`;
  }

  async reportError(
    error: Error,
    category: ErrorCategory,
    severity: ErrorSeverity,
    context: Partial<ErrorContext> = {}
  ): Promise<ErrorReport> {
    const correlationId = context.correlationId || this.generateCorrelationId();
    
    const errorReport: ErrorReport = {
      id: correlationId,
      category,
      severity,
      message: error.message,
      userMessage: this.getUserFriendlyMessage(category, error),
      context: {
        correlationId,
        ...context
      },
      timestamp: new Date(),
      stackTrace: error.stack,
      resolved: false,
      resolutionSteps: this.getResolutionSteps(category, error)
    };

    // Log to system logs
    await this.logError(errorReport);

    // Send to monitoring service if critical
    if (severity === ErrorSeverity.CRITICAL) {
      await this.sendToMonitoring(errorReport);
    }

    // Auto-escalate high severity errors
    if (severity === ErrorSeverity.HIGH || severity === ErrorSeverity.CRITICAL) {
      await this.escalateError(errorReport);
    }

    return errorReport;
  }

  private getUserFriendlyMessage(category: ErrorCategory, error: Error): string {
    switch (category) {
      case ErrorCategory.BROWSER:
        return "Browser automation encountered an issue. Please try again or contact support if the problem persists.";
      case ErrorCategory.AI:
        return "AI service is temporarily unavailable. Your request will be retried automatically.";
      case ErrorCategory.EXTRACTION:
        return "Text extraction failed. Please check your content format and try again.";
      case ErrorCategory.API:
        return "External service is temporarily unavailable. Please try again in a few moments.";
      case ErrorCategory.NETWORK:
        return "Network connection issue detected. Please check your internet connection.";
      case ErrorCategory.SYSTEM:
        return "System maintenance in progress. Service will be restored shortly.";
      default:
        return "An unexpected error occurred. Our team has been notified and will resolve this quickly.";
    }
  }

  private getResolutionSteps(category: ErrorCategory, error: Error): string[] {
    switch (category) {
      case ErrorCategory.BROWSER:
        return [
          "Refresh the page and try again",
          "Clear browser cache and cookies",
          "Try using a different browser",
          "Contact support with error ID if issue persists"
        ];
      case ErrorCategory.AI:
        return [
          "Your request will be automatically retried",
          "Check AI service status page",
          "Reduce request complexity if possible",
          "Upgrade to Pro plan for priority AI access"
        ];
      case ErrorCategory.EXTRACTION:
        return [
          "Verify content is properly formatted",
          "Check character limits for your plan",
          "Try reducing content size",
          "Use supported file formats only"
        ];
      case ErrorCategory.API:
        return [
          "Service will retry automatically",
          "Check API service status",
          "Verify API credentials if applicable",
          "Try again in 5-10 minutes"
        ];
      default:
        return [
          "Refresh the page",
          "Try again in a few minutes",
          "Contact support if issue continues"
        ];
    }
  }

  private async logError(errorReport: ErrorReport): Promise<void> {
    try {
      await supabase.from('system_logs').insert({
        level: 'error',
        category: errorReport.category,
        message: errorReport.message,
        user_id: errorReport.context.userId,
        metadata: {
          correlationId: errorReport.context.correlationId,
          severity: errorReport.severity,
          context: errorReport.context,
          stackTrace: errorReport.stackTrace
        }
      });
    } catch (logError) {
      console.error('Failed to log error to database:', logError);
    }
  }

  private async sendToMonitoring(errorReport: ErrorReport): Promise<void> {
    // Integration with monitoring services like Sentry, DataDog
    console.error('CRITICAL ERROR:', errorReport);
    
    // Send to external monitoring
    try {
      if (typeof window !== 'undefined' && (window as any).Sentry) {
        (window as any).Sentry.captureException(new Error(errorReport.message), {
          tags: {
            category: errorReport.category,
            severity: errorReport.severity,
            correlationId: errorReport.context.correlationId
          },
          extra: errorReport.context
        });
      }
    } catch (sentryError) {
      console.error('Failed to send to Sentry:', sentryError);
    }
  }

  private async escalateError(errorReport: ErrorReport): Promise<void> {
    // Create support ticket for high/critical errors
    try {
      if (errorReport.context.userId) {
        await supabase.from('support_tickets').insert({
          user_id: errorReport.context.userId,
          subject: `${errorReport.severity} Error: ${errorReport.category}`,
          description: `Correlation ID: ${errorReport.context.correlationId}\n\nError: ${errorReport.message}\n\nContext: ${JSON.stringify(errorReport.context, null, 2)}`,
          status: 'open',
          priority: errorReport.severity === ErrorSeverity.CRITICAL ? 'high' : 'medium'
        });
      }
    } catch (ticketError) {
      console.error('Failed to create support ticket:', ticketError);
    }
  }

  async getErrorTrends(days: number = 7): Promise<any> {
    try {
      const { data, error } = await supabase
        .from('system_logs')
        .select('*')
        .eq('level', 'error')
        .gte('created_at', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString());

      if (error) throw error;
      return this.analyzeErrorTrends(data || []);
    } catch (error) {
      console.error('Failed to get error trends:', error);
      return null;
    }
  }

  private analyzeErrorTrends(errors: any[]): any {
    const trends = {
      totalErrors: errors.length,
      errorsByCategory: {} as Record<string, number>,
      errorsBySeverity: {} as Record<string, number>,
      hourlyDistribution: new Array(24).fill(0),
      topErrors: [] as any[]
    };

    errors.forEach(error => {
      const metadata = error.metadata || {};
      const category = error.category || 'UNKNOWN';
      const severity = metadata.severity || 'MEDIUM';
      const hour = new Date(error.created_at).getHours();

      trends.errorsByCategory[category] = (trends.errorsByCategory[category] || 0) + 1;
      trends.errorsBySeverity[severity] = (trends.errorsBySeverity[severity] || 0) + 1;
      trends.hourlyDistribution[hour]++;
    });

    return trends;
  }
}

export const errorHandlingService = ErrorHandlingService.getInstance();
