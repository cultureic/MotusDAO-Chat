"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import * as THREE from "three";
import React, { useRef } from "react";

function GlassCard({ r=1.2, speed=0.3, y=0 }:{r?:number; speed?:number; y?:number}){
  const ref = useRef<THREE.Mesh>(null!);
  useFrame(({ clock })=>{
    const t = clock.getElapsedTime()*speed;
    ref.current.position.x = Math.cos(t)*r;
    ref.current.position.z = Math.sin(t)*r;
    ref.current.position.y = y + Math.sin(t*2)*0.05;
    ref.current.rotation.y = t;
  });
  return (
    <mesh ref={ref}>
      <boxGeometry args={[0.9, 0.56, 0.05]} />
      <meshPhysicalMaterial roughness={0} transmission={0.85} thickness={0.3} color={"#8b9dff"} transparent />
    </mesh>
  );
}

export default function GlassOrbits(){
  return (
    <div className="w-full h-48 rounded-2xl overflow-hidden glass">
      <Canvas dpr={[1,1.25]} gl={{ powerPreference:"low-power" }} camera={{ position:[0,0,3.2], fov:60 }}>
        <ambientLight intensity={0.4}/>
        <GlassCard r={1.1} speed={0.35} y={0.02}/>
        <GlassCard r={1.5} speed={0.22} y={-0.03}/>
        <Environment preset="city"/>
      </Canvas>
    </div>
  );
}




