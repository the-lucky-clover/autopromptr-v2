
import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const SocialProof = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [animatedStats, setAnimatedStats] = useState([0, 0, 0, 0]);
  const sectionRef = useRef<HTMLElement>(null);

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Senior Developer",
      company: "TechCorp",
      content: "AutoPromptr has revolutionized how I work with AI. The prompts are incredibly effective and save me hours every day.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b789?w=64&h=64&fit=crop&crop=face"
    },
    {
      name: "Marcus Rodriguez",
      role: "Product Manager",
      company: "InnovateLab",
      content: "The batch processing feature is a game-changer. I can now deploy prompts across multiple platforms seamlessly.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face"
    },
    {
      name: "Emily Watson",
      role: "AI Researcher",
      company: "DataFlow",
      content: "The quality of prompts and the analytics dashboard provide incredible insights into AI performance.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face"
    }
  ];

  const stats = [
    { number: 50, label: "Active Users", suffix: "K+" },
    { number: 1, label: "Prompts Generated", suffix: "M+" },
    { number: 99.9, label: "Uptime", suffix: "%" },
    { number: 24, label: "Support", suffix: "/7" }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Animate stats
          stats.forEach((stat, index) => {
            let start = 0;
            const end = stat.number;
            const duration = 2000;
            const increment = end / (duration / 16);
            
            const timer = setInterval(() => {
              start += increment;
              if (start >= end) {
                start = end;
                clearInterval(timer);
              }
              setAnimatedStats(prev => {
                const newStats = [...prev];
                newStats[index] = start;
                return newStats;
              });
            }, 16);
          });
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 px-4 bg-gradient-to-b from-purple-900/20 via-gray-900 to-blue-900/20">
      <div className="max-w-6xl mx-auto">
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Trusted by Thousands of Professionals
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Join the community of developers and creators who have transformed their AI workflow
          </p>
        </div>
        
        {/* Stats */}
        <div className={`grid grid-cols-2 md:grid-cols-4 gap-8 mb-16 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {stats.map((stat, index) => (
            <div key={index} className="text-center group hover:scale-105 transition-transform duration-300">
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">
                {index === 2 ? animatedStats[index].toFixed(1) : Math.floor(animatedStats[index])}{stat.suffix}
              </div>
              <div className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
        
        {/* Testimonials */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={index} 
              className={`group hover:shadow-2xl transition-all duration-500 border-0 shadow-lg hover:-translate-y-2 bg-gray-900/50 backdrop-blur-sm border border-white/10 hover:border-white/20 hover:scale-105 ${
                isVisible ? 'opacity-100 translate-x-0' : index % 2 === 0 ? 'opacity-0 -translate-x-8' : 'opacity-0 translate-x-8'
              }`}
              style={{
                transitionDelay: isVisible ? `${400 + index * 100}ms` : '0ms'
              }}
            >
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400 group-hover:scale-110 transition-transform duration-300" style={{ transitionDelay: `${i * 50}ms` }} />
                  ))}
                </div>
                <Quote className="w-8 h-8 text-blue-400 mb-4 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" />
                <p className="text-gray-300 mb-6 leading-relaxed group-hover:text-gray-200 transition-colors duration-300">
                  {testimonial.content}
                </p>
                <div className="flex items-center">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name}
                    className="w-10 h-10 rounded-full mr-3 group-hover:scale-110 transition-transform duration-300"
                  />
                  <div>
                    <div className="text-white font-semibold group-hover:text-blue-300 transition-colors duration-300">{testimonial.name}</div>
                    <div className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors duration-300">{testimonial.role} at {testimonial.company}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SocialProof;
