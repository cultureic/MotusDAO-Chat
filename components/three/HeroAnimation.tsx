"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

function AnimatedShape() {
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    meshRef.current.rotation.x = time * 0.5;
    meshRef.current.rotation.y = time * 0.3;
    meshRef.current.rotation.z = time * 0.2;
  });

  return (
    <mesh ref={meshRef}>
      <octahedronGeometry args={[1, 0]} />
      <meshStandardMaterial 
        color="#8b5cf6" 
        metalness={0.3}
        roughness={0.4}
        transparent
        opacity={0.8}
      />
    </mesh>
  );
}

export const HeroAnimation = () => {
  return (
    <div className="w-32 h-32 mx-auto backdrop-blur-[20px] bg-white/12 border border-white/20 rounded-3xl flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-[0_8px_32px_rgba(0,0,0,0.1)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.15)]" style={{filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.1))'}}>
      <div className="w-24 h-24">
        <Canvas
          camera={{ position: [0, 0, 5], fov: 50 }}
          style={{ width: '100%', height: '100%' }}
        >
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <AnimatedShape />
        </Canvas>
      </div>
    </div>
  );
};

