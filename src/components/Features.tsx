
import { useEffect, useRef, useState } from "react";
import { Bot, Zap, Globe, Shield, Gauge, Users } from "lucide-react";

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
      icon: Bot,
      title: "AI-Powered Automation",
      description: "Intelligently batch process and optimize prompts across multiple platforms simultaneously.",
    },
    {
      icon: Zap,
      title: "Lightning Fast Execution",
      description: "Deploy prompts to dozens of platforms in seconds, not hours.",
    },
    {
      icon: Globe,
      title: "Universal Platform Support",
      description: "Works seamlessly with ChatGPT, Claude, Gemini, and 50+ AI platforms.",
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-grade encryption and compliance with SOC 2 and GDPR standards.",
    },
    {
      icon: Gauge,
      title: "Performance Analytics",
      description: "Real-time insights and metrics to optimize your AI workflow efficiency.",
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Share templates, manage permissions, and collaborate on prompt strategies.",
    },
  ];

  return (
    <section ref={sectionRef} id="features" className="py-24 px-4 bg-gradient-to-b from-gray-900 via-blue-900/30 to-purple-900/30 relative overflow-hidden -mt-1">
      {/* 2Advanced-inspired background elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.1),transparent_50%)]"></div>
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-400/50 to-transparent"></div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-4 font-sans relative">
            Powerful Features
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-pink-400/20 blur-2xl opacity-50"></div>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto font-sans">
            Everything you need to revolutionize your AI workflow
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`group relative bg-gray-800/40 backdrop-blur-sm p-8 rounded-2xl border border-gray-700/50 hover:border-blue-500/50 transition-all duration-500 hover:shadow-[0_20px_40px_rgba(59,130,246,0.3)] hover:bg-gray-800/60 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {/* 2Advanced-style hover effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
              
              <div className="relative z-10">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4 font-sans group-hover:text-blue-300 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-300 font-sans leading-relaxed">
                  {feature.description}
                </p>
              </div>
              
              {/* Subtle tech accent */}
              <div className="absolute top-4 right-4 w-2 h-2 bg-blue-400/50 rounded-full animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
