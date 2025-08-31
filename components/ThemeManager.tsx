'use client';

import React, { useEffect, useMemo, useState } from 'react';
import ColorThemeToggle from './three/ColorThemeToggle';

type ThemeOption = 'white' | 'dark' | 'matrix';

function getInitialTheme(): ThemeOption {
  if (typeof window === 'undefined') return 'white';
  const stored = window.localStorage.getItem('app-theme') as ThemeOption | null;
  if (stored === 'white' || stored === 'dark' || stored === 'matrix') return stored;
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  return prefersDark ? 'dark' : 'white';
}

function applyThemeToDocument(theme: ThemeOption) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  // Set data attribute for CSS hooks and Tailwind configured dark mode
  root.setAttribute('data-theme', theme === 'white' ? 'light' : theme);
  // Toggle Tailwind dark class for both dark and matrix themes
  root.classList.toggle('dark', theme === 'dark' || theme === 'matrix');
}

export default function ThemeManager({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<ThemeOption>(() => getInitialTheme());

  useEffect(() => {
    applyThemeToDocument(theme);
    try { window.localStorage.setItem('app-theme', theme); } catch {}
  }, [theme]);

  // Ensure the theme is applied ASAP on mount/hydration
  useEffect(() => {
    applyThemeToDocument(theme);
  }, []);

  const handleThemeChange = useMemo(() => (next: ThemeOption) => setTheme(next), []);

  return (
    <>
      {children}
      <ColorThemeToggle colorTheme={theme} onThemeChange={handleThemeChange} />
    </>
  );
}


