
import { useState, useEffect } from 'react';
import { subscriptionService, UserSubscription } from '@/services/subscriptionService';
import { useToast } from '@/hooks/use-toast';

export const useSubscription = () => {
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadSubscription();
  }, []);

  const loadSubscription = async () => {
    try {
      setLoading(true);
      const data = await subscriptionService.getUserSubscription();
      setSubscription(data);
    } catch (error) {
      console.error('Failed to load subscription:', error);
      toast({
        title: "Error",
        description: "Failed to load subscription information",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const checkFeatureAccess = (feature: string): boolean => {
    if (!subscription) return false;
    return subscription.features[feature] === true;
  };

  const checkUsageLimit = async (quotaType: string, amount: number = 1): Promise<boolean> => {
    try {
      return await subscriptionService.checkUsageLimit(quotaType, amount);
    } catch (error) {
      console.error('Failed to check usage limit:', error);
      return false;
    }
  };

  const incrementUsage = async (quotaType: string, amount: number = 1): Promise<void> => {
    try {
      await subscriptionService.incrementUsage(quotaType, amount);
    } catch (error) {
      console.error('Failed to increment usage:', error);
      throw error;
    }
  };

  return {
    subscription,
    loading,
    checkFeatureAccess,
    checkUsageLimit,
    incrementUsage,
    refreshSubscription: loadSubscription,
  };
};
