
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Zap, Target, Users, BookOpen, TrendingUp } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const Features = () => {
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

  const features = [
    {
      icon: Brain,
      title: "AI-Optimized Templates",
      description: "Professionally crafted prompts tested across multiple AI models <br className='hidden sm:block' />for maximum effectiveness and precision."
    },
    {
      icon: Zap,
      title: "Instant Results",
      description: "Get immediate improvements in your AI outputs with our <br className='hidden sm:block' />battle-tested prompt formulas."
    },
    {
      icon: Target,
      title: "Industry-Specific",
      description: "Specialized prompts for marketing, coding, writing, business, <br className='hidden sm:block' />and creative projects."
    },
    {
      icon: Users,
      title: "Community Driven",
      description: "Join thousands of prompt engineers sharing insights <br className='hidden sm:block' />and best practices daily."
    },
    {
      icon: BookOpen,
      title: "Expert Courses",
      description: "Learn from industry experts with comprehensive courses <br className='hidden sm:block' />and interactive workshops."
    },
    {
      icon: TrendingUp,
      title: "Performance Analytics",
      description: "Track your prompt performance and optimize for better <br className='hidden sm:block' />results over time."
    }
  ];

  return (
    <section ref={sectionRef} className="py-20 px-4 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-6xl mx-auto">
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 font-serif">
            Why Choose AutoPromptr?
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Discover the features that make us the leading platform <br className="hidden sm:block" />
            for AI prompt engineering excellence
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className={`group hover:shadow-xl transition-all duration-500 border-0 shadow-lg hover:-translate-y-2 bg-gray-800/50 backdrop-blur-sm border border-white/10 hover:border-white/20 hover:scale-105 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{
                transitionDelay: isVisible ? `${index * 100}ms` : '0ms'
              }}
            >
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-blue-500/25">
                  <feature.icon className="w-6 h-6 text-white group-hover:scale-110 transition-transform duration-300" />
                </div>
                <CardTitle className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors duration-300">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription 
                  className="text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors duration-300"
                  dangerouslySetInnerHTML={{ __html: feature.description }}
                />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
