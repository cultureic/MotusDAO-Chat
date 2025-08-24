"use client";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Points, PointMaterial, Preload, useTexture } from "@react-three/drei";
import * as THREE from "three";
import React, { useMemo, useRef, useEffect, useState } from "react";

interface DNANode {
  position: THREE.Vector3;
  originalPosition: THREE.Vector3;
  targetPosition: THREE.Vector3;
  phase: number;
  type: 'biological' | 'digital' | 'human';
}

function DNAHelix({ count = 2000 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null!);
  const [nodes, setNodes] = useState<DNANode[]>([]);
  const [animationPhase, setAnimationPhase] = useState(0);
  
  // Create DNA helix structure
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const newNodes: DNANode[] = [];
    
    for (let i = 0; i < count; i++) {
      const t = (i / count) * Math.PI * 8; // 4 complete turns
      const radius = 1.5 + Math.sin(t * 2) * 0.3; // Varying radius
      const height = (i / count) * 8 - 4; // Height from -4 to 4
      
      // Create double helix effect
      const strand = i % 2;
      const angle = t + (strand * Math.PI);
      
      const x = Math.cos(angle) * radius;
      const y = height;
      const z = Math.sin(angle) * radius;
      
      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;
      
      // Create node for animation
      const originalPos = new THREE.Vector3(x, y, z);
      const targetPos = new THREE.Vector3(
        x * 2 + Math.sin(t * 3) * 0.5,
        y + Math.cos(t * 2) * 0.3,
        z * 2 + Math.cos(t * 3) * 0.5
      );
      
      newNodes.push({
        position: originalPos.clone(),
        originalPosition: originalPos.clone(),
        targetPosition: targetPos,
        phase: Math.random(),
        type: 'biological'
      });
    }
    
    setNodes(newNodes);
    return pos;
  }, [count]);

  // Animation loop
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    // Update animation phase (0 = biological, 1 = digital, 2 = human)
    const phase = (Math.sin(time * 0.1) + 1) / 2; // 0 to 1
    setAnimationPhase(phase);
    
    // Animate each node
    nodes.forEach((node, i) => {
      const t = (i / count) * Math.PI * 8;
      const progress = (phase + node.phase * 0.5) % 1;
      
      // Interpolate between biological and digital positions
      if (progress < 0.5) {
        // Biological to digital transition
        const t1 = progress * 2;
        node.position.lerpVectors(node.originalPosition, node.targetPosition, t1);
        node.type = t1 > 0.5 ? 'digital' : 'biological';
      } else {
        // Digital to human transition
        const t2 = (progress - 0.5) * 2;
        const humanPos = new THREE.Vector3(
          Math.sin(t * 2) * 2,
          Math.cos(t * 3) * 1.5,
          Math.sin(t * 4) * 2
        );
        node.position.lerpVectors(node.targetPosition, humanPos, t2);
        node.type = t2 > 0.5 ? 'human' : 'digital';
      }
      
      // Update positions array
      positions[i * 3] = node.position.x;
      positions[i * 3 + 1] = node.position.y;
      positions[i * 3 + 2] = node.position.z;
    });
    
    // Rotate the entire structure
    ref.current.rotation.y = time * 0.2;
    ref.current.rotation.x = Math.sin(time * 0.1) * 0.1;
  });

  // Dynamic color based on animation phase
  const colors = useMemo(() => {
    const colors = new Float32Array(count * 3);
    
    nodes.forEach((node, i) => {
      let color = new THREE.Color();
      
      switch (node.type) {
        case 'biological':
          color.setHSL(0.6, 0.8, 0.6); // Blue-green
          break;
        case 'digital':
          color.setHSL(0.8, 0.9, 0.7); // Purple-pink
          break;
        case 'human':
          color.setHSL(0.1, 0.9, 0.7); // Orange-gold
          break;
      }
      
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    });
    
    return colors;
  }, [nodes, count]);

  return (
    <Points ref={ref} positions={positions} colors={colors} stride={3}>
      <PointMaterial 
        size={0.06} 
        transparent 
        depthWrite={false}
        vertexColors
        opacity={0.95}
        sizeAttenuation
      />
    </Points>
  );
}

// Floating particles around the DNA
function FloatingParticles({ count = 800 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null!);
  
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      // Spread particles across the entire screen
      const x = (Math.random() - 0.5) * 20; // -10 to 10
      const y = (Math.random() - 0.5) * 20; // -10 to 10  
      const z = (Math.random() - 0.5) * 15; // -7.5 to 7.5
      
      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;
      
      // Create varied colors for particles
      const colorType = Math.random();
      let color = new THREE.Color();
      
      if (colorType < 0.4) {
        color.setHSL(0.8, 0.9, 0.7); // Purple
      } else if (colorType < 0.7) {
        color.setHSL(0.9, 0.8, 0.7); // Pink
      } else if (colorType < 0.85) {
        color.setHSL(0.6, 0.8, 0.7); // Blue
      } else {
        color.setHSL(0.1, 0.9, 0.7); // Orange/Gold
      }
      
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }
    
    return { positions: pos, colors };
  }, [count]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    ref.current.rotation.x = time * 0.02;
    ref.current.rotation.y = time * 0.015;
  });

  return (
    <Points ref={ref} positions={positions.positions} colors={positions.colors} stride={3}>
      <PointMaterial 
        size={0.08} 
        transparent 
        depthWrite={false}
        vertexColors
        opacity={0.8}
        sizeAttenuation
      />
    </Points>
  );
}

export default function DNAAnimation() {
  const [enabled, setEnabled] = useState(true);
  
  useEffect(() => {
    // Performance and accessibility guards
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) setEnabled(false);
    
    if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
      setEnabled(false);
    }
    
    // Check if tab is hidden
    const handleVisibilityChange = () => {
      if (document.hidden) setEnabled(false);
      else setEnabled(true);
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  if (!enabled) return null;

  return (
    <div aria-hidden className="fixed inset-0 -z-10">
      <Canvas 
        dpr={[1, 1.25]} 
        gl={{ 
          antialias: false, 
          powerPreference: "low-power",
          alpha: true,
          premultipliedAlpha: false
        }} 
        camera={{ 
          position: [0, 0, 8], 
          fov: 60,
          near: 0.1,
          far: 1000
        }}
      >
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={0.8} />
        <pointLight position={[-10, -10, -10]} intensity={0.4} color="#8b5cf6" />
        
        <DNAHelix count={2000} />
        <FloatingParticles count={800} />
        
        <Preload all />
      </Canvas>
    </div>
  );
}
