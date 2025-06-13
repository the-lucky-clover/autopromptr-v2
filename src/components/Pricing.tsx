
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
    <section ref={sectionRef} className="py-20 px-4 bg-gradient-to-b from-purple-900/20 via-gray-900 to-blue-900/20">
      <div className="max-w-6xl mx-auto">
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 font-serif">
            Choose Your Plan
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Select the perfect plan to accelerate your <br className="hidden sm:block" />
            AI prompting journey and unlock success
          </p>
        </div>
        
        <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <PricingPlans />
        </div>
        
        <div className={`text-center mt-12 text-gray-300 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <p>All plans include a 14-day money-back guarantee • No setup fees • <br className="hidden sm:block" />Cancel anytime with ease</p>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
