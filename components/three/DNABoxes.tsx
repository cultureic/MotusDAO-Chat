"use client";
import React, { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import * as THREE from "three";

function HelixBoxes({
  count = 36,
  radius = 2.2,
  pitch = 0.28,
}: { count?: number; radius?: number; pitch?: number }) {
  const group = useRef<THREE.Group>(null!);

  // positions + rotations along a helix
  const items = useMemo(() => {
    const arr: { pos: [number, number, number]; rot: [number, number, number]; hue: number }[] = [];
    for (let i = 0; i < count; i++) {
      const t = i * 0.35;
      const x = Math.cos(t) * radius;
      const z = Math.sin(t) * radius;
      const y = (i - count / 2) * pitch;
      const rotY = t + Math.PI / 3;
      arr.push({ pos: [x, y, z], rot: [0.15, rotY, 0], hue: (i / count) * 360 });
    }
    return arr;
  }, [count, radius, pitch]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * 0.25;
    group.current.rotation.set(0.05, t, 0);
  });

  return (
    <group ref={group}>
      {items.map((it, i) => (
        <mesh key={i} position={it.pos} rotation={it.rot} castShadow receiveShadow>
          {/* Slight bevel look via more segments */}
          <boxGeometry args={[1.2, 0.75, 0.08]} />
          <meshPhysicalMaterial
            color={new THREE.Color().setHSL((it.hue + 260) / 360, 0.65, 0.6)}
            roughness={0.05}
            metalness={0.1}
            transmission={0.92}     // glass
            thickness={0.45}
            ior={1.45}
            clearcoat={1}
            clearcoatRoughness={0.08}
            reflectivity={0.8}
            transparent
          />
          {/* Border (thin, iridescent rim) */}
          <mesh>
            <boxGeometry args={[1.205, 0.755, 0.082]} />
            <meshBasicMaterial
              color={"#ffffff"}
              transparent
              opacity={0.25}
              wireframe
            />
          </mesh>
        </mesh>
      ))}
    </group>
  );
}

export default function DNABoxesBackground() {
  // NOTE: use low DPR and low‑power GL for perf; this is decorative
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
      <Canvas
        dpr={[1, 1.25]}
        gl={{ antialias: false, powerPreference: "low-power" }}
        camera={{ position: [0, 1.3, 6.5], fov: 55 }}
      >
        <color attach="background" args={["#000000"]} />
        <ambientLight intensity={0.35} />
        {/* cool rim light to get that holographic sheen */}
        <directionalLight position={[3, 5, 2]} intensity={1.2} color={"#a6c8ff"} />
        <directionalLight position={[-4, -2, -2]} intensity={0.8} color={"#ff9bd6"} />
        <Environment preset="city" />
        <group rotation={[0.05, Math.PI / 8, 0]}>
          <HelixBoxes />
        </group>
      </Canvas>
      {/* soft gradient wash like the reference site */}
      <div className="absolute inset-0 bg-[radial-gradient(1200px_800px_at_70%_-10%,rgba(147,197,253,.18),transparent_60%),radial-gradient(900px_600px_at_-10%_60%,rgba(168,85,247,.16),transparent_60%)]" />
    </div>
  );
}


