'use client'

import { Canvas } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import { useMemo, useRef, useEffect } from 'react'
import * as THREE from 'three'

function Ribbon() {
  const curve = useRef(new THREE.CatmullRomCurve3([
    new THREE.Vector3(-2, 0.2, 0),
    new THREE.Vector3(-1, 0.6, 0.8),
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(1.2, -0.4, -0.6),
    new THREE.Vector3(2.2, 0.2, 0),
  ]))
  
  const geom = useMemo(() => new THREE.TubeGeometry(curve.current, 200, 0.16, 64, false), [])
  
  const mat = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: '#A78BFA',
    metalness: 0.35,
    roughness: 0.15,
    transmission: 0.6,
    thickness: 0.6,
    iridescence: 1,
    iridescenceIOR: 1.2,
  }), [])

  // Simplified animation to prevent WebGL context loss
  useEffect(() => {
    let animationId: number;
    
    const animate = () => {
      const time = Date.now() * 0.001
      const points = curve.current.points
      
      // Gentle animation to prevent performance issues
      points[0].y = 0.2 + Math.sin(time * 0.3) * 0.2
      points[1].y = 0.6 + Math.sin(time * 0.4 + 1) * 0.15
      points[1].z = 0.8 + Math.sin(time * 0.3) * 0.2
      points[2].y = Math.sin(time * 0.5 + 2) * 0.3
      points[3].y = -0.4 + Math.sin(time * 0.6 + 3) * 0.2
      points[3].z = -0.6 + Math.sin(time * 0.4 + 1) * 0.15
      points[4].y = 0.2 + Math.sin(time * 0.4 + 4) * 0.15
      
      // Update curve
      curve.current.updateArcLengths()
      
      // Update geometry less frequently to improve performance
      if (Math.floor(time * 10) % 2 === 0) {
        geom.dispose()
        const newGeom = new THREE.TubeGeometry(curve.current, 200, 0.16, 64, false)
        geom.copy(newGeom)
        newGeom.dispose()
      }
      
      animationId = requestAnimationFrame(animate)
    }
    
    animate()
    
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
    }
  }, [geom])

  return <mesh geometry={geom} material={mat} />
}

export default function HoloRibbon() {
  return (
    <div className="w-full h-full">
      <Canvas 
        dpr={[1, 1.5]} 
        camera={{ position: [0, 0, 4], fov: 45 }}
        frameloop="demand"
        gl={{ 
          antialias: true,
          alpha: true,
          powerPreference: "high-performance"
        }}
      >
        <ambientLight intensity={0.8} />
        <Environment preset="city" />
        <Ribbon />
      </Canvas>
    </div>
  )
}
