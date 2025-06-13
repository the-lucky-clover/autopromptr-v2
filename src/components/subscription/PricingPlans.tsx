
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Zap, Crown, Rocket } from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: "$29",
    period: "/month",
    description: "Perfect for individual developers and small teams getting started with AI prompt optimization",
    icon: Zap,
    features: [
      "100 AI-optimized prompts per month",
      "5 platforms supported",
      "Basic analytics dashboard",
      "Email support",
      "Template library access",
      "Standard processing speed"
    ],
    buttonText: "Start Free Trial",
    popular: false
  },
  {
    name: "Professional",
    price: "$89",
    period: "/month",
    description: "Ideal for growing teams and businesses that need advanced features and higher limits",
    icon: Crown,
    features: [
      "500 AI-optimized prompts per month",
      "15+ platforms supported",
      "Advanced analytics & insights",
      "Priority support & training",
      "Custom template creation",
      "3x faster processing speed",
      "Team collaboration tools",
      "API access"
    ],
    buttonText: "Start Free Trial",
    popular: true
  },
  {
    name: "Enterprise",
    price: "$299",
    period: "/month",
    description: "For large organizations requiring enterprise-grade security, compliance, and unlimited scale",
    icon: Rocket,
    features: [
      "Unlimited AI-optimized prompts",
      "All platforms supported",
      "Real-time analytics & reporting",
      "24/7 dedicated support",
      "White-label solutions",
      "10x fastest processing speed",
      "Advanced team management",
      "Full API access",
      "SOC 2 compliance",
      "Custom integrations"
    ],
    buttonText: "Contact Sales",
    popular: false
  }
];

export const PricingPlans = () => {
  const [lightningStates, setLightningStates] = useState<{ [key: string]: boolean }>({});

  const handlePlanClick = (planName: string) => {
    setLightningStates(prev => ({ ...prev, [planName]: true }));
    setTimeout(() => {
      setLightningStates(prev => ({ ...prev, [planName]: false }));
    }, 800);
  };

  return (
    <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
      {plans.map((plan) => {
        const IconComponent = plan.icon;
        return (
          <Card 
            key={plan.name} 
            className={`relative bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300 hover:shadow-[0_12px_48px_rgba(147,51,234,0.2)] group flex flex-col ${
              plan.popular ? 'ring-2 ring-purple-500/50 scale-105' : ''
            }`}
          >
            {plan.popular && (
              <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-500 to-pink-600 text-white px-4 py-1 font-semibold">
                Most Popular
              </Badge>
            )}
            
            <CardHeader className="text-center pb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-[0_8px_32px_rgba(59,130,246,0.3)]">
                <IconComponent className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl text-white font-bold font-sans">{plan.name}</CardTitle>
              <div className="flex items-baseline justify-center gap-1 mt-2">
                <span className="text-4xl font-bold text-white">{plan.price}</span>
                <span className="text-gray-400 font-medium">{plan.period}</span>
              </div>
              <CardDescription className="text-gray-300 mt-4 leading-relaxed font-sans">
                {plan.description}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="flex-1 flex flex-col">
              <div className="space-y-4 flex-1 mb-8">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-white stroke-[3]" />
                    </div>
                    <span className="text-gray-300 leading-relaxed font-sans">{feature}</span>
                  </div>
                ))}
              </div>
              
              <Button 
                className={`relative overflow-hidden w-full py-4 text-lg font-semibold rounded-full transition-all duration-300 transform hover:scale-105 group ${
                  plan.popular 
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-[0_8px_32px_rgba(147,51,234,0.4)]' 
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-[0_8px_32px_rgba(59,130,246,0.4)]'
                }`}
                onClick={() => handlePlanClick(plan.name)}
              >
                {/* Idle sheen layers */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent w-1/3 h-full transform -translate-x-full rotate-45 animate-idle-metallic-sheen pointer-events-none"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent w-1/4 h-full transform -translate-x-full rotate-47 animate-rare-glass-sheen-1 pointer-events-none"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/18 to-transparent w-1/3 h-full transform -translate-x-full rotate-43 animate-rare-glass-sheen-2 pointer-events-none"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/22 to-transparent w-1/5 h-full transform -translate-x-full rotate-49 animate-rare-glass-sheen-3 pointer-events-none"></div>
                
                {/* Hover sheen overlay */}
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/70 to-transparent w-1/2 h-full transform translate-x-full -translate-y-full rotate-45 group-hover:animate-enhanced-metallic-sheen pointer-events-none"></span>
                
                {/* Lightning flash overlay */}
                <div className={`absolute inset-0 bg-gradient-to-r from-cyan-400/40 via-white/50 to-pink-400/40 pointer-events-none ${lightningStates[plan.name] ? 'animate-lightning-flash' : 'opacity-0'}`}></div>
                
                <span className="relative z-10">{plan.buttonText}</span>
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
