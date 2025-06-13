
import { Canvas } from '@react-three/fiber';
import { useState, useEffect } from 'react';
import { SakuraField } from './SakuraField';

export const SakuraBackground = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Track mouse position for interaction
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <Canvas
        camera={{ 
          position: [0, 0, 10], 
          fov: 75,
          near: 0.1,
          far: 100
        }}
        style={{ 
          background: 'transparent',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%'
        }}
      >
        {/* Soft ambient lighting */}
        <ambientLight intensity={0.6} color="#fff5f5" />
        
        {/* Directional light for depth */}
        <directionalLight 
          position={[5, 5, 5]} 
          intensity={0.4}
          color="#ffb3d1"
        />
        
        {/* Additional soft light from below */}
        <directionalLight 
          position={[-3, -3, 2]} 
          intensity={0.2}
          color="#ffc0cb"
        />
        
        {/* Sakura petals */}
        <SakuraField mousePosition={mousePosition} />
      </Canvas>
    </div>
  );
};
