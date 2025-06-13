
import { useEffect, useState } from "react";

const ParticleVignette = () => {
  const [particles, setParticles] = useState<Array<{
    id: number;
    x: number;
    y: number;
    size: number;
    animationDelay: number;
    animationDuration: number;
  }>>([]);

  useEffect(() => {
    // Respect reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const createParticles = () => {
      const particleCount = window.innerWidth < 768 ? 15 : window.innerWidth < 1024 ? 25 : 35;
      const newParticles = [];

      for (let i = 0; i < particleCount; i++) {
        // Create more particles near edges for vignette effect
        const edge = Math.random();
        let x, y;
        
        if (edge < 0.25) {
          // Left edge
          x = Math.random() * 20;
          y = Math.random() * 100;
        } else if (edge < 0.5) {
          // Right edge
          x = 80 + Math.random() * 20;
          y = Math.random() * 100;
        } else if (edge < 0.75) {
          // Top edge
          x = Math.random() * 100;
          y = Math.random() * 20;
        } else {
          // Bottom edge
          x = Math.random() * 100;
          y = 80 + Math.random() * 20;
        }

        newParticles.push({
          id: i,
          x,
          y,
          size: Math.random() * 3 + 1,
          animationDelay: Math.random() * 10,
          animationDuration: Math.random() * 20 + 15
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
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full bg-white/10 blur-sm animate-pulse"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            animationDelay: `${particle.animationDelay}s`,
            animationDuration: `${particle.animationDuration}s`,
            transform: 'translate(-50%, -50%)',
          }}
        />
      ))}
      
      {/* Additional floating particles with different animation */}
      {particles.slice(0, Math.floor(particles.length / 2)).map((particle) => (
        <div
          key={`float-${particle.id}`}
          className="absolute rounded-full bg-blue-200/5 animate-bounce"
          style={{
            left: `${(particle.x + 10) % 100}%`,
            top: `${(particle.y + 15) % 100}%`,
            width: `${particle.size * 0.7}px`,
            height: `${particle.size * 0.7}px`,
            animationDelay: `${particle.animationDelay + 5}s`,
            animationDuration: `${particle.animationDuration + 10}s`,
            transform: 'translate(-50%, -50%)',
          }}
        />
      ))}
    </div>
  );
};

export default ParticleVignette;
