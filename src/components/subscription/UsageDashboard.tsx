
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { subscriptionService } from '@/services/subscriptionService';
import { useSubscription } from '@/hooks/useSubscription';
import { formatUsageValue, calculateUsagePercentage, getUsageColor, getProgressColor } from '@/utils/usageUtils';
import { Zap, BarChart3, FileText, Bot, Clock, TrendingUp } from 'lucide-react';

interface UsageQuota {
  quota_type: string;
  current_usage: number;
  limit_value: number;
  reset_date: string;
}

export const UsageDashboard = () => {
  const [quotas, setQuotas] = useState<UsageQuota[]>([]);
  const [loading, setLoading] = useState(true);
  const { subscription } = useSubscription();

  useEffect(() => {
    loadUsageData();
  }, []);

  const loadUsageData = async () => {
    try {
      const data = await subscriptionService.getUserUsageQuotas();
      setQuotas(data);
    } catch (error) {
      console.error('Failed to load usage data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getQuotaIcon = (quotaType: string) => {
    switch (quotaType) {
      case 'prompts_per_month':
        return <FileText className="w-5 h-5" />;
      case 'ai_optimizations_per_month':
        return <Bot className="w-5 h-5" />;
      case 'batch_extractions_per_month':
        return <BarChart3 className="w-5 h-5" />;
      case 'api_calls':
        return <Zap className="w-5 h-5" />;
      default:
        return <TrendingUp className="w-5 h-5" />;
    }
  };

  const getQuotaLabel = (quotaType: string) => {
    switch (quotaType) {
      case 'prompts_per_month':
        return 'Prompts';
      case 'ai_optimizations_per_month':
        return 'AI Optimizations';
      case 'batch_extractions_per_month':
        return 'Batch Extractions';
      case 'batch_extraction_chars':
        return 'Extraction Characters';
      case 'api_calls':
        return 'API Calls';
      default:
        return quotaType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
  };

  const formatResetDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 0) return 'Resets today';
    if (diffDays === 1) return 'Resets tomorrow';
    return `Resets in ${diffDays} days`;
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading usage data...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Plan Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Current Plan: {subscription?.plan_name || 'Free'}
          </CardTitle>
          <CardDescription>
            Your usage limits and current consumption
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Usage Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {quotas.map((quota) => {
          const percentage = calculateUsagePercentage(quota.current_usage, quota.limit_value);
          const isUnlimited = quota.limit_value === -1;
          
          return (
            <Card key={quota.quota_type}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                  {getQuotaIcon(quota.quota_type)}
                  {getQuotaLabel(quota.quota_type)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold">
                      {formatUsageValue(quota.current_usage)}
                    </div>
                    <Badge 
                      variant={percentage >= 90 ? 'destructive' : percentage >= 75 ? 'secondary' : 'default'}
                    >
                      {isUnlimited ? 'Unlimited' : `${percentage.toFixed(0)}%`}
                    </Badge>
                  </div>
                  
                  {!isUnlimited && (
                    <>
                      <div className="text-xs text-gray-500">
                        of {formatUsageValue(quota.limit_value)} limit
                      </div>
                      <Progress 
                        value={percentage} 
                        className="h-2"
                      />
                    </>
                  )}
                  
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    {formatResetDate(quota.reset_date)}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {quotas.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-500">No usage data available yet.</p>
            <p className="text-sm text-gray-400 mt-1">
              Start using the platform to see your usage statistics here.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
