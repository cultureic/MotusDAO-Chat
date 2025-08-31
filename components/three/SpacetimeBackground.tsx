'use client';

import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { gsap, Back } from 'gsap';
import ColorThemeToggle from './ColorThemeToggle';

interface SpacetimeBackgroundProps {
  className?: string;
  children?: React.ReactNode;
  colorTheme?: 'white' | 'dark' | 'matrix';
}

const SpacetimeBackground: React.FC<SpacetimeBackgroundProps> = ({ 
  className = '', 
  children,
  colorTheme: initialColorTheme = 'dark'
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const dotsRef = useRef<THREE.Points | null>(null);
  const positionsRef = useRef<Float32Array | null>(null);
  const animationRef = useRef<number | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [colorTheme, setColorTheme] = useState<'white' | 'dark' | 'matrix'>(initialColorTheme);
  let resizeTimeout: NodeJS.Timeout;



  useEffect(() => {
    if (!canvasRef.current) return;
    
    // Register GSAP Back easing plugin
    gsap.registerPlugin(Back);

    const canvas = canvasRef.current;
    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;

    // Create renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
      alpha: true
    });
    renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    rendererRef.current = renderer;

    // Create scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Create camera
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 2000);
    camera.position.set(0, 0, 80);
    cameraRef.current = camera;

    // Create dot texture - fixed path
    const textureLoader = new THREE.TextureLoader();
    textureLoader.crossOrigin = "Anonymous";
    let dotTexture: THREE.Texture;
    
    // Create fallback texture immediately
    const textureCanvas = document.createElement('canvas');
    textureCanvas.width = 32;
    textureCanvas.height = 32;
    const ctx = textureCanvas.getContext('2d')!;
    
    const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.8)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 32, 32);
    
    dotTexture = new THREE.CanvasTexture(textureCanvas);
    setIsLoaded(true);
    
    // Try to load the actual texture
    textureLoader.load('/textures/dotTexture.png', (tex: THREE.Texture) => {
      dotTexture = tex;
      if (shaderMaterial) {
        shaderMaterial.uniforms.dotTexture.value = tex;
      }
    });

    // Create geometry - exactly as in demo2.js
    const radius = 50;
    const sphereGeom = new THREE.IcosahedronGeometry(radius, 28);
    const bufferDotsGeom = new THREE.BufferGeometry();
    const positions = new Float32Array(sphereGeom.attributes.position.count * 3);
    const colors = new Float32Array(sphereGeom.attributes.position.count * 3);
    const vectors: THREE.Vector3[] = [];

    // Function to update colors based on theme
    const updateColors = (theme: 'white' | 'dark' | 'matrix') => {
      let colorChoices: number[][];
      
      switch (theme) {
        case 'white':
          colorChoices = [
            [1.0, 1.0, 1.0],   // Pure White
            [0.9, 0.9, 1.0],   // Light Blue White
            [1.0, 0.9, 1.0],   // Light Pink White
            [0.95, 0.95, 0.95], // Off White
            [0.9, 1.0, 0.9],   // Light Green White
            [1.0, 0.95, 0.9]   // Warm White
          ];
          break;
        case 'matrix':
          colorChoices = [
            [0.0, 1.0, 0.0],   // Bright Green
            [0.2, 0.8, 0.2],   // Medium Green
            [0.0, 0.6, 0.0],   // Dark Green
            [0.1, 1.0, 0.1],   // Lime Green
            [0.0, 0.8, 0.0],   // Forest Green
            [0.3, 1.0, 0.3]    // Light Green
          ];
          break;
        default: // dark
          colorChoices = [
            [0.2, 0.4, 1.0],   // Blue
            [0.6, 0.2, 1.0],   // Purple
            [1.0, 0.2, 0.8],   // Pink
            [0.4, 0.6, 1.0],   // Light Blue
            [0.8, 0.3, 1.0],   // Light Purple
            [1.0, 0.4, 0.9]    // Light Pink
          ];
      }
      
      for (let i = 0; i < sphereGeom.attributes.position.count; i++) {
        const randomColor = colorChoices[Math.floor(Math.random() * colorChoices.length)];
        colors[i * 3] = randomColor[0];
        colors[i * 3 + 1] = randomColor[1];
        colors[i * 3 + 2] = randomColor[2];
      }
      
      if (dotsRef.current) {
        dotsRef.current.geometry.attributes.dotColor.needsUpdate = true;
      }
    };

    // Copy vertices and create vectors - exactly as in demo2.js
    for (let i = 0; i < sphereGeom.attributes.position.count; i++) {
      const x = sphereGeom.attributes.position.getX(i);
      const y = sphereGeom.attributes.position.getY(i);
      const z = sphereGeom.attributes.position.getZ(i);
      
      const vector = new THREE.Vector3(x, y, z);
      vectors.push(vector);
      
      // Animate each dot - exactly as in demo2.js
      animateDot(i, vector);
      
      // Add to geometry and positions array
      vector.toArray(positions, i * 3);
    }
    
    // Initialize colors
    updateColors(colorTheme);
    positionsRef.current = positions;

    // Animate dot function - exactly as in demo2.js
    function animateDot(index: number, vector: THREE.Vector3) {
      const originalX = vector.x;
      const originalZ = vector.z;
      
      gsap.to(vector, {
        duration: 4,
        x: 0,
        z: 0,
        ease: "back.out",
        delay: Math.abs(vector.y / radius) * 2,
        repeat: -1,
        yoyo: true,
        yoyoEase: "back.out",
        onUpdate: () => {
          // Only update x and z positions, keep y constant
          updateDot(index, vector);
        }
      });
    }

    // Update dot function - exactly as in demo2.js
    function updateDot(index: number, vector: THREE.Vector3) {
      if (positions && index * 3 + 2 < positions.length) {
        positions[index * 3] = vector.x;     // Update X
        positions[index * 3 + 1] = vector.y; // Keep Y constant
        positions[index * 3 + 2] = vector.z; // Update Z
      }
    }

    // Set up buffer geometry - exactly as in demo2.js
    const attributePositions = new THREE.BufferAttribute(positions, 3);
    const attributeColors = new THREE.BufferAttribute(colors, 3);
    bufferDotsGeom.setAttribute('position', attributePositions);
    bufferDotsGeom.setAttribute('dotColor', attributeColors);

    // Simplified shaders to avoid WebGL errors
    const vertexShader = `
      #define PI 3.1415926535897932384626433832795
      attribute vec3 dotColor;
      varying vec3 vColor;
      void main() {
        vColor = dotColor;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = 1.0;
        gl_Position = projectionMatrix * mvPosition;
      }
    `;

    const fragmentShader = `
      uniform sampler2D dotTexture;
      varying vec3 vColor;
      void main() {
        vec4 textureColor = texture2D(dotTexture, gl_PointCoord);
        if (textureColor.a < 0.3) discard;
        vec4 color = vec4(vColor, 0.8) * textureColor;
        gl_FragColor = color;
      }
    `;

    let shaderMaterial: THREE.ShaderMaterial;
    shaderMaterial = new THREE.ShaderMaterial({
      uniforms: {
        dotTexture: { value: dotTexture }
      },
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      transparent: true,
      vertexColors: true
    });

    // Create points
    const dots = new THREE.Points(bufferDotsGeom, shaderMaterial);
    scene.add(dots);
    dotsRef.current = dots;
    
    console.log('Dots created:', sphereGeom.attributes.position.count, 'dots');
    console.log('Scene children:', scene.children.length);

    // Mouse interaction
    const mouse = new THREE.Vector2(0.8, 0.5);
    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = (e.clientX / window.innerWidth) - 0.5;
      mouse.y = (e.clientY / window.innerHeight) - 0.5;
      
      if (dotsRef.current) {
        gsap.to(dotsRef.current.rotation, {
          duration: 2,
          x: mouse.y * Math.PI * 1.2,
          z: mouse.x * Math.PI * 0.8,
          ease: "power2.out"
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Render loop
    const render = () => {
      if (dotsRef.current) {
        dotsRef.current.geometry.attributes.position.needsUpdate = true;
      }
      renderer.render(scene, camera);
    };
    gsap.ticker.add(render);

    // Handle resize
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        const width = canvas.offsetWidth;
        const height = canvas.offsetHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
      }, 200);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      
      gsap.ticker.remove(render);
      
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
      
      if (dotsRef.current) {
        dotsRef.current.geometry.dispose();
        if (dotsRef.current.material instanceof THREE.Material) {
          dotsRef.current.material.dispose();
        }
      }
    };
  }, [colorTheme]); // Add colorTheme as dependency

  return (
    <div className={`fixed inset-0 w-full h-full ${className}`}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />
      <ColorThemeToggle 
        colorTheme={colorTheme}
        onThemeChange={setColorTheme}
      />
      {children && (
        <div className="relative z-10 w-full h-full">
          {children}
        </div>
      )}
    </div>
  );
};

export default SpacetimeBackground;
