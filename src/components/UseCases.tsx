
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Code, Layers, Rocket, Users, Zap, GitBranch } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const UseCases = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const useCases = [
    {
      icon: Code,
      title: "Individual Developers",
      description: "Streamline your coding workflow with intelligent prompt optimization",
      benefits: ["50% faster prototyping", "Consistent code quality", "Multi-platform support"],
      color: "from-blue-500 to-purple-500",
      delay: "delay-100"
    },
    {
      icon: Users,
      title: "Development Teams",
      description: "Coordinate team-wide prompt strategies and maintain consistency",
      benefits: ["Shared prompt libraries", "Team collaboration tools", "Performance analytics"],
      color: "from-green-500 to-blue-500",
      delay: "delay-200"
    },
    {
      icon: Rocket,
      title: "Startup MVPs",
      description: "Rapidly iterate and deploy features with automated prompt workflows",
      benefits: ["Rapid prototyping", "Cost-effective scaling", "Quick market validation"],
      color: "from-purple-500 to-pink-500",
      delay: "delay-300"
    },
    {
      icon: Layers,
      title: "Enterprise Solutions",
      description: "Scale AI-assisted development across large organizations",
      benefits: ["Enterprise security", "Custom integrations", "Advanced analytics"],
      color: "from-orange-500 to-red-500",
      delay: "delay-400"
    },
    {
      icon: GitBranch,
      title: "Open Source Projects",
      description: "Enhance community contributions with standardized prompt practices",
      benefits: ["Contributor onboarding", "Code consistency", "Documentation automation"],
      color: "from-teal-500 to-green-500",
      delay: "delay-500"
    },
    {
      icon: Zap,
      title: "AI Research Teams",
      description: "Optimize prompt engineering experiments and research workflows",
      benefits: ["Experiment tracking", "A/B testing tools", "Research collaboration"],
      color: "from-indigo-500 to-purple-500",
      delay: "delay-600"
    }
  ];

  return (
    <section ref={sectionRef} className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 border border-blue-200 mb-6">
            <Zap className="w-4 h-4 text-blue-600 mr-2" />
            <span className="text-sm text-blue-700 font-medium">Real-World Applications</span>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Use Cases That Drive Results
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From solo developers to enterprise teams, see how AutoPromptr transforms development workflows across different scenarios and scales
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {useCases.map((useCase, index) => {
            const Icon = useCase.icon;
            return (
              <Card 
                key={index} 
                className={`transition-all duration-1000 hover:shadow-lg hover:-translate-y-1 ${useCase.delay} ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              >
                <CardHeader>
                  <div className={`w-12 h-12 bg-gradient-to-r ${useCase.color} rounded-lg flex items-center justify-center mb-4`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-xl mb-2">{useCase.title}</CardTitle>
                  <CardDescription className="text-base leading-relaxed">
                    {useCase.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <h5 className="font-medium text-gray-900 mb-3">Key Benefits:</h5>
                    {useCase.benefits.map((benefit, benefitIndex) => (
                      <div key={benefitIndex} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-gray-600">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className={`mt-16 text-center transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Transform Your Workflow?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Join thousands of developers who have already streamlined their AI-assisted development process with AutoPromptr
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Badge variant="secondary" className="px-4 py-2">10,000+ Active Users</Badge>
              <Badge variant="secondary" className="px-4 py-2">50+ Supported Platforms</Badge>
              <Badge variant="secondary" className="px-4 py-2">99.9% Uptime</Badge>
              <Badge variant="secondary" className="px-4 py-2">24/7 Support</Badge>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UseCases;
