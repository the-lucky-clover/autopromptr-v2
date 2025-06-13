
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Zap, Clock, Calendar } from "lucide-react";
import { subscriptionService, SubscriptionPlan } from '@/services/subscriptionService';
import { useSubscription } from '@/hooks/useSubscription';
import { useToast } from '@/hooks/use-toast';

export const PricingPlans = () => {
  const [loading, setLoading] = useState(false);
  const { subscription } = useSubscription();
  const { toast } = useToast();

  // Static pricing plans - no more free tier
  const plans = [
    {
      id: 'trial',
      name: '3-Day Trial',
      price: 0,
      period: '3 days',
      description: 'Full access to all features',
      features: [
        'Unlimited prompts',
        'AI optimization',
        'Batch processing',
        'API access',
        'All integrations',
        'Priority support',
        'Team collaboration'
      ],
      badge: 'Trial',
      badgeColor: 'bg-green-600',
      icon: <Clock className="w-6 h-6 text-green-600" />,
      buttonText: 'Start Free Trial',
      popular: false
    },
    {
      id: 'monthly',
      name: 'Monthly',
      price: 19,
      period: 'month',
      description: 'Full access billed monthly',
      features: [
        'Unlimited prompts',
        'AI optimization',
        'Batch processing', 
        'API access',
        'All integrations',
        'Priority support',
        'Team collaboration'
      ],
      badge: 'Most Flexible',
      badgeColor: 'bg-blue-600',
      icon: <Zap className="w-6 h-6 text-blue-600" />,
      buttonText: 'Get Monthly Access',
      popular: true
    },
    {
      id: 'annual',
      name: 'Annual',
      price: 120,
      period: 'year',
      originalPrice: 228, // $19 * 12 months
      description: 'Full access billed annually',
      features: [
        'Unlimited prompts',
        'AI optimization',
        'Batch processing',
        'API access', 
        'All integrations',
        'Priority support',
        'Team collaboration',
        '2 months FREE'
      ],
      badge: 'Best Value',
      badgeColor: 'bg-purple-600',
      icon: <Calendar className="w-6 h-6 text-purple-600" />,
      buttonText: 'Get Annual Access',
      popular: false,
      savings: {
        percent: 47,
        amount: 108 // $228 - $120
      }
    }
  ];

  const handlePlanSelect = async (plan: any) => {
    if (plan.id === 'trial') {
      toast({
        title: "Trial Started!",
        description: "Your 3-day full access trial has begun. Enjoy all features!",
      });
      return;
    }

    try {
      setLoading(true);
      // In a real implementation, this would create a Stripe checkout session
      toast({
        title: "Redirecting to Payment",
        description: `Setting up ${plan.name} subscription...`,
      });
      
      // Simulate payment redirect
      setTimeout(() => {
        window.location.href = `#/checkout?plan=${plan.id}`;
      }, 1000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process subscription. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const isCurrentPlan = (planId: string) => {
    return subscription?.plan_name?.toLowerCase() === planId;
  };

  return (
    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
      <div className="grid md:grid-cols-3 gap-8 md:grid-rows-1">
        {plans.map((plan) => (
          <Card 
            key={plan.id} 
            className={`relative transition-all duration-300 hover:shadow-lg flex flex-col h-full ${
              plan.popular ? 'border-2 border-blue-500 md:scale-105' : ''
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                <Badge className="bg-blue-600 text-white">
                  <Star className="w-3 h-3 mr-1" />
                  Most Popular
                </Badge>
              </div>
            )}

            <CardHeader className="text-center pb-4 flex-shrink-0">
              <div className="flex justify-center mb-2">
                {plan.icon}
              </div>
              <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
              
              <div className="mt-4">
                <div className="flex items-center justify-center gap-2">
                  <span className="text-4xl font-bold">
                    ${plan.price}
                  </span>
                  <span className="text-gray-600">/{plan.period}</span>
                </div>
                
                {/* Savings display for annual plan */}
                {plan.savings && (
                  <div className="mt-2 space-y-1">
                    <div className="text-sm text-gray-500 line-through">
                      ${plan.originalPrice}/year
                    </div>
                    <Badge className="bg-green-100 text-green-800 border-green-200">
                      Save {plan.savings.percent}% (${plan.savings.amount})
                    </Badge>
                  </div>
                )}
              </div>
              
              <CardDescription className="mt-2">
                {plan.description}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4 flex-grow flex flex-col">
              <ul className="space-y-3 flex-grow">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-auto pt-4">
                <Button
                  className={`w-full ${
                    plan.popular
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : plan.id === 'annual'
                      ? 'bg-purple-600 hover:bg-purple-700 text-white'
                      : 'border border-gray-300 hover:bg-gray-50'
                  }`}
                  variant={plan.popular || plan.id === 'annual' ? 'default' : 'outline'}
                  onClick={() => handlePlanSelect(plan)}
                  disabled={isCurrentPlan(plan.id) || loading}
                >
                  {isCurrentPlan(plan.id) 
                    ? 'Current Plan' 
                    : plan.buttonText
                  }
                </Button>

                {/* Additional value messaging for annual plan */}
                {plan.id === 'annual' && (
                  <div className="text-center text-sm text-purple-600 font-medium mt-2">
                    💰 That's only $10/month when paid annually!
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
