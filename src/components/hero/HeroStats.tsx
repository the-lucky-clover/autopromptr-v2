
import { useState, useEffect, useRef } from "react";

const HeroStats = () => {
  const [isVisible, setIsVisible] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div 
      ref={statsRef}
      className={`flex items-center gap-8 text-slate-400 transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      <div className={`text-center transition-all duration-1000 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="text-3xl font-bold text-white">10K+</div>
        <div className="text-sm">Premium Prompts</div>
      </div>
      <div className="w-px h-8 bg-slate-600"></div>
      <div className={`text-center transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="text-3xl font-bold text-white">50K+</div>
        <div className="text-sm">Happy Users</div>
      </div>
      <div className="w-px h-8 bg-slate-600"></div>
      <div className={`text-center transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="text-3xl font-bold text-white">99%</div>
        <div className="text-sm">Success Rate</div>
      </div>
    </div>
  );
};

export default HeroStats;
