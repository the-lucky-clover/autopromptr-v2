
import { supabase } from "@/integrations/supabase/client";

export interface SubscriptionPlan {
  id: string;
  name: string;
  price_monthly: number;
  features: Record<string, boolean>;
  limits: Record<string, number>;
  stripe_price_id?: string;
}

export interface UserSubscription {
  plan_name: string;
  status: string;
  features: Record<string, boolean>;
  limits: Record<string, number>;
  current_period_end?: string;
}

export class SubscriptionService {
  async getAvailablePlans(): Promise<SubscriptionPlan[]> {
    try {
      const { data, error } = await supabase
        .from('subscription_plans')
        .select('*')
        .eq('is_active', true)
        .order('price_monthly', { ascending: true });

      if (error) throw error;
      
      return (data || []).map(plan => ({
        id: plan.id,
        name: plan.name,
        price_monthly: plan.price_monthly,
        features: (plan.features as any) || {},
        limits: (plan.limits as any) || {},
        stripe_price_id: plan.stripe_price_id
      }));
    } catch (error) {
      console.error('Failed to get subscription plans:', error);
      return [];
    }
  }

  async getUserSubscription(): Promise<UserSubscription | null> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return null;

      const { data, error } = await supabase.rpc('get_user_subscription', {
        p_user_id: user.user.id
      });

      if (error) throw error;
      
      const subscription = data?.[0];
      if (!subscription) return null;
      
      return {
        plan_name: subscription.plan_name,
        status: subscription.status,
        features: (subscription.features as any) || {},
        limits: (subscription.limits as any) || {},
        current_period_end: subscription.current_period_end
      };
    } catch (error) {
      console.error('Failed to get user subscription:', error);
      return null;
    }
  }

  async checkUsageLimit(quotaType: string, amount: number = 1): Promise<boolean> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return false;

      const { data, error } = await supabase.rpc('check_usage_limit', {
        p_user_id: user.user.id,
        p_quota_type: quotaType,
        p_amount: amount
      });

      if (error) throw error;
      return data || false;
    } catch (error) {
      console.error('Failed to check usage limit:', error);
      return false;
    }
  }

  async incrementUsage(quotaType: string, amount: number = 1): Promise<void> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

      const { error } = await supabase.rpc('increment_usage', {
        p_user_id: user.user.id,
        p_quota_type: quotaType,
        p_amount: amount
      });

      if (error) throw error;
    } catch (error) {
      console.error('Failed to increment usage:', error);
      throw error;
    }
  }

  async getUserUsageQuotas() {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return [];

      const { data, error } = await supabase
        .from('usage_quotas')
        .select('*')
        .eq('user_id', user.user.id);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Failed to get usage quotas:', error);
      return [];
    }
  }

  async createStripeCheckoutSession(priceId: string) {
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: { price_id: priceId }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Failed to create checkout session:', error);
      throw error;
    }
  }

  async createCustomerPortalSession() {
    try {
      const { data, error } = await supabase.functions.invoke('create-portal-session');

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Failed to create portal session:', error);
      throw error;
    }
  }
}

export const subscriptionService = new SubscriptionService();
