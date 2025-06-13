
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Zap, Users, Target } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const Speedometers = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [animatedValues, setAnimatedValues] = useState([0, 0, 0, 0]);
  const sectionRef = useRef<HTMLElement>(null);

  const metrics = [
    {
      icon: TrendingUp,
      title: "Response Time",
      value: 85,
      improvement: "Faster AI responses",
      color: "from-green-400 to-emerald-600"
    },
    {
      icon: Target,
      title: "Success Rate",
      value: 99,
      improvement: "Prompt accuracy",
      color: "from-blue-400 to-purple-600"
    },
    {
      icon: Users,
      title: "User Satisfaction",
      value: 96,
      improvement: "Happy customers",
      color: "from-purple-400 to-pink-600"
    },
    {
      icon: Zap,
      title: "Platform Coverage",
      value: 100,
      improvement: "All major platforms",
      color: "from-orange-400 to-red-600"
    }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Animate counter values
          metrics.forEach((metric, index) => {
            let start = 0;
            const end = metric.value;
            const duration = 2000;
            const increment = end / (duration / 16);
            
            const timer = setInterval(() => {
              start += increment;
              if (start >= end) {
                start = end;
                clearInterval(timer);
              }
              setAnimatedValues(prev => {
                const newValues = [...prev];
                newValues[index] = Math.floor(start);
                return newValues;
              });
            }, 16);
          });
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 px-4 bg-gradient-to-b from-gray-800 via-gray-900 to-gray-800">
      <div className="max-w-6xl mx-auto">
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Performance That Speaks for Itself
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            See how AutoPromptr transforms your AI workflow with measurable results
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {metrics.map((metric, index) => (
            <Card 
              key={index} 
              className={`group hover:shadow-2xl transition-all duration-500 border-0 shadow-lg hover:-translate-y-2 bg-gray-800/50 backdrop-blur-sm border border-white/10 hover:border-white/20 hover:scale-105 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{
                transitionDelay: isVisible ? `${index * 150}ms` : '0ms'
              }}
            >
              <CardHeader className="pb-4 text-center">
                <div className={`w-16 h-16 bg-gradient-to-r ${metric.color} rounded-full flex items-center justify-center mb-4 mx-auto group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 group-hover:shadow-lg`}>
                  <metric.icon className="w-8 h-8 text-white group-hover:scale-110 transition-transform duration-300" />
                </div>
                <CardTitle className="text-xl font-bold text-white">
                  {metric.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className={`text-4xl font-bold bg-gradient-to-r ${metric.color} bg-clip-text text-transparent mb-2 transition-all duration-300`}>
                  {animatedValues[index]}%
                </div>
                <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors duration-300">
                  {metric.improvement}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Speedometers;
