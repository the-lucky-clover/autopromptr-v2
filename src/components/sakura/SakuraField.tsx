
import { useState, useEffect, useCallback, useRef } from 'react';
import { SakuraPetal } from './SakuraPetal';

interface Petal {
  id: number;
  position: [number, number, number];
  initialVelocity: [number, number, number];
}

interface SakuraFieldProps {
  mousePosition?: { x: number; y: number };
}

export const SakuraField = ({ mousePosition }: SakuraFieldProps) => {
  const [petals, setPetals] = useState<Petal[]>([]);
  const nextIdRef = useRef(0);
  const spawnTimerRef = useRef(0);

  // Generate random petal
  const createPetal = useCallback((): Petal => {
    return {
      id: nextIdRef.current++,
      position: [
        (Math.random() - 0.5) * 30, // Random X position
        12 + Math.random() * 3,     // Start above screen
        (Math.random() - 0.5) * 5   // Random Z depth
      ],
      initialVelocity: [
        (Math.random() - 0.5) * 0.5, // Slight horizontal drift
        -0.5 - Math.random() * 0.5,  // Downward velocity
        0
      ]
    };
  }, []);

  // Remove petal by id
  const removePetal = useCallback((id: number) => {
    setPetals(prev => prev.filter(petal => petal.id !== id));
  }, []);

  // Spawn petals periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setPetals(prev => {
        // Limit number of petals for performance
        if (prev.length >= 80) return prev;
        
        // Add 1-3 new petals
        const newPetals = [];
        const count = Math.floor(Math.random() * 3) + 1;
        
        for (let i = 0; i < count; i++) {
          newPetals.push(createPetal());
        }
        
        return [...prev, ...newPetals];
      });
    }, 200 + Math.random() * 300); // Random spawn timing

    return () => clearInterval(interval);
  }, [createPetal]);

  // Initial petals
  useEffect(() => {
    const initialPetals = [];
    for (let i = 0; i < 20; i++) {
      const petal = createPetal();
      // Distribute initial petals across the screen
      petal.position[1] = Math.random() * 20 - 5;
      initialPetals.push(petal);
    }
    setPetals(initialPetals);
  }, [createPetal]);

  return (
    <>
      {petals.map(petal => (
        <SakuraPetal
          key={petal.id}
          position={petal.position}
          initialVelocity={petal.initialVelocity}
          onRemove={() => removePetal(petal.id)}
          mousePosition={mousePosition}
        />
      ))}
    </>
  );
};
