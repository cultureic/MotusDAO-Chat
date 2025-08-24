"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial, Preload } from "@react-three/drei";
import * as THREE from "three";
import React, { useMemo, useRef, useEffect, useState } from "react";

function Particles({ count=8000 }:{count?:number}){
  const ref = useRef<THREE.Points>(null!);
  const positions = useMemo(()=>{
    const pos = new Float32Array(count*3);
    for(let i=0;i<count;i++){
      const r = 1.5 + Math.random()*1.5;
      const theta = Math.random()*Math.PI*2;
      const phi = Math.acos(2*Math.random()-1);
      pos[i*3+0] = r*Math.sin(phi)*Math.cos(theta);
      pos[i*3+1] = r*Math.sin(phi)*Math.sin(theta);
      pos[i*3+2] = r*Math.cos(phi);
    }
    return pos;
  },[count]);
  useFrame((state)=>{
    const t = state.clock.getElapsedTime()*0.05;
    ref.current.rotation.x = t;
    ref.current.rotation.y = t*1.2;
  });
  return (
    <Points ref={ref} positions={positions} stride={3}>
      <PointMaterial size={0.015} transparent depthWrite={false} color={"#94ccfb"} opacity={0.9}/>
    </Points>
  );
}

export default function BackgroundParticles(){
  const [enabled, setEnabled] = useState(true);
  useEffect(()=>{
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) setEnabled(false);
    if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) setEnabled(false);
  },[]);
  if(!enabled) return null;
  return (
    <div aria-hidden className="fixed inset-0 -z-10">
      <Canvas dpr={[1, 1.25]} gl={{ antialias:false, powerPreference:"low-power" }} camera={{ position:[0,0,3.5], fov:60 }}>
        <Particles />
        <Preload all />
      </Canvas>
    </div>
  );
}




