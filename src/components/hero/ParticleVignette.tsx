
import { useEffect, useState } from "react";

const ParticleVignette = () => {
  const [particles, setParticles] = useState<Array<{
    id: number;
    x: number;
    y: number;
    size: number;
    animationDelay: number;
    animationDuration: number;
    type: 'glow' | 'dot' | 'geometric';
  }>>([]);

  useEffect(() => {
    // Respect reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const createParticles = () => {
      const particleCount = window.innerWidth < 768 ? 20 : window.innerWidth < 1024 ? 35 : 50;
      const newParticles = [];

      for (let i = 0; i < particleCount; i++) {
        // Create more particles near edges for vignette effect with 2Advanced-style distribution
        const edge = Math.random();
        let x, y;
        
        if (edge < 0.3) {
          // Left and right edges - more concentrated
          x = Math.random() < 0.5 ? Math.random() * 15 : 85 + Math.random() * 15;
          y = Math.random() * 100;
        } else if (edge < 0.6) {
          // Top and bottom edges
          x = Math.random() * 100;
          y = Math.random() < 0.5 ? Math.random() * 15 : 85 + Math.random() * 15;
        } else {
          // Scattered throughout for depth
          x = Math.random() * 100;
          y = Math.random() * 100;
        }

        // Different particle types for 2Advanced aesthetic
        const types: Array<'glow' | 'dot' | 'geometric'> = ['glow', 'dot', 'geometric'];
        const type = types[Math.floor(Math.random() * types.length)];

        newParticles.push({
          id: i,
          x,
          y,
          size: type === 'geometric' ? Math.random() * 4 + 2 : Math.random() * 3 + 1,
          animationDelay: Math.random() * 15,
          animationDuration: Math.random() * 25 + 20,
          type
        });
      }

      setParticles(newParticles);
    };

    createParticles();

    const handleResize = () => {
      createParticles();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="absolute inset-0 z-5 pointer-events-none overflow-hidden">
      {particles.map((particle) => {
        const baseClasses = "absolute animate-pulse transform -translate-x-1/2 -translate-y-1/2";
        
        if (particle.type === 'glow') {
          return (
            <div
              key={particle.id}
              className={`${baseClasses} rounded-full bg-blue-200/15 blur-sm`}
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                animationDelay: `${particle.animationDelay}s`,
                animationDuration: `${particle.animationDuration}s`,
                boxShadow: '0 0 20px rgba(59, 130, 246, 0.3)'
              }}
            />
          );
        }
        
        if (particle.type === 'geometric') {
          return (
            <div
              key={particle.id}
              className={`${baseClasses} bg-purple-300/10 rotate-45 border border-purple-400/20`}
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                animationDelay: `${particle.animationDelay}s`,
                animationDuration: `${particle.animationDuration}s`,
              }}
            />
          );
        }

        return (
          <div
            key={particle.id}
            className={`${baseClasses} rounded-full bg-white/12`}
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              animationDelay: `${particle.animationDelay}s`,
              animationDuration: `${particle.animationDuration}s`,
            }}
          />
        );
      })}
      
      {/* Enhanced floating elements with 2Advanced-style motion */}
      {particles.slice(0, Math.floor(particles.length / 3)).map((particle) => (
        <div
          key={`float-${particle.id}`}
          className="absolute rounded-full bg-gradient-to-r from-cyan-200/8 to-pink-200/8 animate-bounce"
          style={{
            left: `${(particle.x + 15) % 100}%`,
            top: `${(particle.y + 20) % 100}%`,
            width: `${particle.size * 0.8}px`,
            height: `${particle.size * 0.8}px`,
            animationDelay: `${particle.animationDelay + 8}s`,
            animationDuration: `${particle.animationDuration + 15}s`,
            transform: 'translate(-50%, -50%)',
          }}
        />
      ))}

      {/* 2Advanced-inspired tech grid overlay */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent"></div>
        <div className="absolute top-0 left-0 w-px h-full bg-gradient-to-b from-transparent via-blue-400 to-transparent"></div>
        <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-transparent via-purple-400 to-transparent"></div>
      </div>
    </div>
  );
};

export default ParticleVignette;
