
import { useEffect, useRef, useState } from "react";

const TrustedPlatforms = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const platforms = [
    { name: "bolt.new", logo: "⚡" },
    { name: "replit", logo: "🔄" },
    { name: "v0.dev", logo: "🎯" },
    { name: "a0.dev", logo: "⭐" },
    { name: "create.xyz", logo: "✨" },
    { name: "lovable.dev", logo: "💜" }
  ];

  // Duplicate the array for seamless scrolling
  const duplicatedPlatforms = [...platforms, ...platforms];

  return (
    <section ref={sectionRef} className="py-16 px-4 bg-gradient-to-b from-blue-900/20 via-gray-900 to-purple-900/20">
      <div className="max-w-6xl mx-auto">
        <div className={`text-center mb-12 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Trusted by AI Coding Platforms
          </h2>
          <p className="text-lg text-gray-300">
            Seamlessly integrated with all major development platforms
          </p>
        </div>
        
        <div className={`relative overflow-hidden transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          <div 
            className={`flex ${isPaused ? '' : 'animate-scroll'}`}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {duplicatedPlatforms.map((platform, index) => (
              <div 
                key={index}
                className="flex items-center justify-center min-w-[200px] mx-8 p-6 bg-gray-900/30 backdrop-blur-sm rounded-lg border border-white/10 hover:border-white/20 hover:bg-gray-900/50 hover:shadow-lg hover:shadow-blue-500/10 hover:scale-105 transition-all duration-300 group"
              >
                <span className="text-2xl mr-3 group-hover:scale-110 transition-transform duration-300">{platform.logo}</span>
                <span className="text-white font-medium text-lg whitespace-nowrap group-hover:text-blue-300 transition-colors duration-300">
                  {platform.name}
                </span>
              </div>
            ))}
          </div>
          
          {/* Gradient overlays for smooth fade effect */}
          <div className="absolute left-0 top-0 w-20 h-full bg-gradient-to-r from-gray-900 to-transparent pointer-events-none"></div>
          <div className="absolute right-0 top-0 w-20 h-full bg-gradient-to-l from-gray-900 to-transparent pointer-events-none"></div>
        </div>
      </div>
    </section>
  );
};

export default TrustedPlatforms;
