
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Zap, Users, Shield } from "lucide-react";
import { subscriptionService, SubscriptionPlan } from '@/services/subscriptionService';
import { useSubscription } from '@/hooks/useSubscription';
import { useToast } from '@/hooks/use-toast';

export const PricingPlans = () => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const { subscription } = useSubscription();
  const { toast } = useToast();

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      const data = await subscriptionService.getAvailablePlans();
      setPlans(data);
    } catch (error) {
      console.error('Failed to load plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async (plan: SubscriptionPlan) => {
    if (!plan.stripe_price_id) {
      toast({
        title: "Contact Sales",
        description: "Please contact our sales team for enterprise pricing.",
      });
      return;
    }

    try {
      const { url } = await subscriptionService.createStripeCheckoutSession(plan.stripe_price_id);
      window.location.href = url;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create checkout session. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getPlanIcon = (planName: string) => {
    switch (planName.toLowerCase()) {
      case 'pro':
        return <Zap className="w-6 h-6 text-blue-600" />;
      case 'enterprise':
        return <Shield className="w-6 h-6 text-purple-600" />;
      default:
        return <Users className="w-6 h-6 text-green-600" />;
    }
  };

  const getPlanFeatures = (plan: SubscriptionPlan) => {
    const features = [];
    
    if (plan.limits.prompts_per_month === -1) {
      features.push('Unlimited prompts');
    } else {
      features.push(`${plan.limits.prompts_per_month} prompts per month`);
    }

    if (plan.features.ai_optimization) {
      if (plan.limits.ai_optimizations_per_month === -1) {
        features.push('Unlimited AI optimizations');
      } else {
        features.push(`${plan.limits.ai_optimizations_per_month} AI optimizations`);
      }
    }

    if (plan.features.api_access) {
      features.push('API access');
    }

    if (plan.features.team_collaboration) {
      features.push('Team collaboration');
    }

    if (plan.features.priority_support) {
      features.push('Priority support');
    }

    if (plan.features.white_label) {
      features.push('White-label deployment');
    }

    return features;
  };

  const isCurrentPlan = (planName: string) => {
    return subscription?.plan_name?.toLowerCase() === planName.toLowerCase();
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading plans...</div>;
  }

  return (
    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
      {plans.map((plan) => (
        <Card 
          key={plan.id} 
          className={`relative transition-all duration-300 hover:shadow-lg ${
            plan.name === 'Pro' ? 'border-2 border-blue-500 scale-105' : ''
          }`}
        >
          {plan.name === 'Pro' && (
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-blue-600 text-white">
                <Star className="w-3 h-3 mr-1" />
                Most Popular
              </Badge>
            </div>
          )}

          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-2">
              {getPlanIcon(plan.name)}
            </div>
            <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
            <div className="mt-4">
              <span className="text-4xl font-bold">
                ${plan.price_monthly}
              </span>
              {plan.price_monthly > 0 && (
                <span className="text-gray-600 ml-1">/month</span>
              )}
            </div>
            <CardDescription className="mt-2">
              {plan.name === 'Free' && 'Perfect for getting started'}
              {plan.name === 'Pro' && 'For professionals and growing teams'}
              {plan.name === 'Enterprise' && 'For large organizations'}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <ul className="space-y-3">
              {getPlanFeatures(plan).map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>

            <Button
              className={`w-full mt-6 ${
                plan.name === 'Pro'
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'border border-gray-300 hover:bg-gray-50'
              }`}
              variant={plan.name === 'Pro' ? 'default' : 'outline'}
              onClick={() => handleUpgrade(plan)}
              disabled={isCurrentPlan(plan.name)}
            >
              {isCurrentPlan(plan.name) 
                ? 'Current Plan' 
                : plan.price_monthly === 0 
                ? 'Get Started Free' 
                : `Upgrade to ${plan.name}`
              }
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
