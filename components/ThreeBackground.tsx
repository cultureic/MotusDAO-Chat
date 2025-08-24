"use client";

import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const ThreeBackground: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const meshRef = useRef<THREE.Mesh | null>(null);
  const animationIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 30;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true,
      antialias: true 
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0); // Transparent background
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    // Create torus knot geometry
    const geometry = new THREE.TorusKnotGeometry(8, 2.5, 128, 32, 2, 3);
    
    // Create gradient material with color transitions
    const material = new THREE.MeshStandardMaterial({
      color: 0x6B48FF,
      transparent: true,
      opacity: 0.8,
      metalness: 0.4,
      roughness: 0.3,
      side: THREE.DoubleSide
    });

    // Create mesh
    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    scene.add(mesh);
    meshRef.current = mesh;

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);

    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(10, 10, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    // Add point light for dynamic highlights
    const pointLight = new THREE.PointLight(0x00D4FF, 1, 100);
    pointLight.position.set(-10, 10, 10);
    scene.add(pointLight);

    // Animation function
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);

      if (meshRef.current) {
        // Primary twirling motion around Y-axis
        meshRef.current.rotation.y += 0.012;
        
        // Secondary wobble motion
        meshRef.current.rotation.x = Math.sin(Date.now() * 0.001) * 0.15;
        meshRef.current.rotation.z = Math.cos(Date.now() * 0.0008) * 0.1;
        
        // Subtle scale animation
        const scale = 1 + Math.sin(Date.now() * 0.002) * 0.05;
        meshRef.current.scale.set(scale, scale, scale);

        // Dynamic color transitions
        const time = Date.now() * 0.001;
        const hue1 = (time * 0.1) % 1; // Purple to cyan transition
        const hue2 = (time * 0.1 + 0.5) % 1; // Complementary color
        
        const color1 = new THREE.Color().setHSL(hue1, 0.8, 0.6);
        const color2 = new THREE.Color().setHSL(hue2, 0.8, 0.6);
        
        // Interpolate between colors
        const mixFactor = (Math.sin(time * 2) + 1) / 2;
        material.color.lerpColors(color1, color2, mixFactor);
      }

      // Animate point light
      if (pointLight) {
        pointLight.position.x = Math.sin(Date.now() * 0.001) * 15;
        pointLight.position.z = Math.cos(Date.now() * 0.001) * 15;
        
        // Animate point light color
        const lightTime = Date.now() * 0.002;
        const lightHue = (lightTime * 0.3) % 1;
        pointLight.color.setHSL(lightHue, 0.8, 0.8);
      }

      renderer.render(scene, camera);
    };

    // Handle window resize
    const handleResize = () => {
      if (camera && renderer) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      }
    };

    window.addEventListener('resize', handleResize);
    mountRef.current.appendChild(renderer.domElement);

    // Start animation
    animate();

    // Cleanup function
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      if (renderer) {
        renderer.dispose();
      }
      if (geometry) {
        geometry.dispose();
      }
      if (material) {
        material.dispose();
      }
    };
  }, []);

  return (
    <div 
      ref={mountRef} 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none'
      }}
    />
  );
};

export default ThreeBackground;
