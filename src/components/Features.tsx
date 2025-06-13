
import { useEffect, useRef, useState } from "react";
import { Zap, Layers, BarChart3, Globe, Lock, Rocket } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Lightning-Fast Processing",
    description: "Process hundreds of prompts simultaneously with our advanced batch automation system"
  },
  {
    icon: Layers,
    title: "Multi-Platform Deployment",
    description: "Deploy to ChatGPT, Claude, Gemini, and 15+ other AI platforms with a single click"
  },
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    description: "Track performance metrics, response quality, and optimize your prompt strategies"
  },
  {
    icon: Globe,
    title: "Global CDN Distribution",
    description: "Lightning-fast delivery worldwide with our enterprise-grade infrastructure"
  },
  {
    icon: Lock,
    title: "Enterprise Security",
    description: "Bank-level encryption and SOC 2 compliance for your most sensitive prompts"
  },
  {
    icon: Rocket,
    title: "AI-Powered Optimization",
    description: "Our ML algorithms automatically enhance your prompts for maximum effectiveness"
  }
];

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

  return (
    <section ref={sectionRef} id="features" className="py-24 px-4 bg-gray-900 relative overflow-hidden">
      {/* Dark background with subtle gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.05),transparent_50%)]"></div>
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-400/30 to-transparent"></div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-4 font-sans relative">
            Powerful Features
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-pink-400/20 blur-2xl opacity-50"></div>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto font-sans">
            Everything you need to supercharge your AI workflow <br className="hidden sm:block" />
            and achieve breakthrough results
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`group p-6 rounded-2xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 hover:border-blue-500/50 hover:shadow-[0_8px_32px_rgba(59,130,246,0.15)] transition-all duration-500 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-[0_4px_16px_rgba(59,130,246,0.3)]">
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3 font-sans">{feature.title}</h3>
              <p className="text-gray-300 leading-relaxed font-sans">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
