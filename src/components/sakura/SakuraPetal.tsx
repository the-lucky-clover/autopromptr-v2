
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, Vector3 } from 'three';

interface SakuraPetalProps {
  position: [number, number, number];
  initialVelocity: [number, number, number];
  onRemove: () => void;
  mousePosition?: { x: number; y: number };
}

export const SakuraPetal = ({ position, initialVelocity, onRemove, mousePosition }: SakuraPetalProps) => {
  const meshRef = useRef<Mesh>(null);
  const velocityRef = useRef(new Vector3(...initialVelocity));
  const timeRef = useRef(0);
  
  // Random properties for each petal
  const petalProps = useMemo(() => ({
    scale: 0.02 + Math.random() * 0.03,
    rotationSpeed: (Math.random() - 0.5) * 0.02,
    swayAmplitude: 0.5 + Math.random() * 0.3,
    color: Math.random() > 0.7 ? '#ffb3d1' : Math.random() > 0.4 ? '#ffc0cb' : '#ffffff',
  }), []);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    
    timeRef.current += delta;
    
    // Gravity and wind effects
    velocityRef.current.y -= 0.3 * delta;
    velocityRef.current.x += Math.sin(timeRef.current * 2) * 0.1 * delta;
    
    // Mouse interaction - gentle push away from cursor
    if (mousePosition) {
      const distance = Math.sqrt(
        Math.pow(meshRef.current.position.x - mousePosition.x * 10, 2) +
        Math.pow(meshRef.current.position.y - mousePosition.y * 10, 2)
      );
      
      if (distance < 3) {
        const force = (3 - distance) / 3;
        const dirX = meshRef.current.position.x - mousePosition.x * 10;
        const dirY = meshRef.current.position.y - mousePosition.y * 10;
        velocityRef.current.x += dirX * force * 2 * delta;
        velocityRef.current.y += dirY * force * 2 * delta;
      }
    }
    
    // Apply velocity
    meshRef.current.position.add(velocityRef.current.clone().multiplyScalar(delta));
    
    // Gentle swaying rotation
    meshRef.current.rotation.z += petalProps.rotationSpeed * delta;
    meshRef.current.rotation.x = Math.sin(timeRef.current) * 0.3;
    
    // Remove if too far down or off screen
    if (meshRef.current.position.y < -15 || 
        Math.abs(meshRef.current.position.x) > 20) {
      onRemove();
    }
  });

  return (
    <mesh ref={meshRef} position={position} scale={petalProps.scale}>
      {/* Petal geometry - simple plane with slight curve */}
      <planeGeometry args={[1, 1.5]} />
      <meshLambertMaterial 
        color={petalProps.color}
        transparent
        opacity={0.8}
        side={2}
      />
    </mesh>
  );
};
