
import { PricingPlans } from "@/components/subscription/PricingPlans";
import { useEffect, useRef, useState } from "react";

const Pricing = () => {
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
    <section ref={sectionRef} id="pricing" className="py-24 px-4 bg-gradient-to-b from-purple-900/20 via-gray-900 to-blue-900/20 relative overflow-hidden -mt-1">
      {/* 2Advanced-inspired background elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(147,51,234,0.1),transparent_50%)]"></div>
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-400/50 to-transparent"></div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-4 font-sans relative">
            Choose Your Plan
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 via-blue-400/20 to-pink-400/20 blur-2xl opacity-50"></div>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto font-sans">
            Select the perfect plan to accelerate your <br className="hidden sm:block" />
            AI prompting journey and unlock success
          </p>
        </div>
        
        <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <PricingPlans />
        </div>
        
        <div className={`text-center mt-12 text-gray-300 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} font-sans`}>
          <p>All plans include a 14-day money-back guarantee • No setup fees • <br className="hidden sm:block" />Cancel anytime with ease</p>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
