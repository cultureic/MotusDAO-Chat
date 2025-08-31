'use client';

import React from 'react';
import SpacetimeBackground from '@/components/three/SpacetimeBackground';

export default function TestSpacetimePage() {
  return (
    <div className="min-h-screen">
      <SpacetimeBackground />
      <div className="relative z-10 p-8 text-white">
        <h1 className="text-4xl font-bold mb-4">Spacetime Background Test</h1>
        <p className="text-xl">If you can see this text, the background is working!</p>
        <p className="text-lg mt-4">You should see animated dots moving in a spacetime pattern.</p>
      </div>
    </div>
  );
}
