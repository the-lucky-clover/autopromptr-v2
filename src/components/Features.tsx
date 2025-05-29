
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Zap, Target, Users, BookOpen, TrendingUp } from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: Brain,
      title: "AI-Optimized Templates",
      description: "Professionally crafted prompts tested across multiple AI models for maximum effectiveness."
    },
    {
      icon: Zap,
      title: "Instant Results",
      description: "Get immediate improvements in your AI outputs with our battle-tested prompt formulas."
    },
    {
      icon: Target,
      title: "Industry-Specific",
      description: "Specialized prompts for marketing, coding, writing, business, and creative projects."
    },
    {
      icon: Users,
      title: "Community Driven",
      description: "Join thousands of prompt engineers sharing insights and best practices."
    },
    {
      icon: BookOpen,
      title: "Expert Courses",
      description: "Learn from industry experts with comprehensive courses and workshops."
    },
    {
      icon: TrendingUp,
      title: "Performance Analytics",
      description: "Track your prompt performance and optimize for better results over time."
    }
  ];

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Why Choose AutoPrompt.us?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover the features that make us the leading platform for AI prompt engineering
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg hover:-translate-y-2 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
