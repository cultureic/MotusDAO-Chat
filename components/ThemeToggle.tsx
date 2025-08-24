"use client";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

type Theme = 'light' | 'dark' | 'hc';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    // Get theme from localStorage or default to light
    const savedTheme = localStorage.getItem('theme') as Theme || 'light';
    setTheme(savedTheme);
    document.documentElement.className = savedTheme;
  }, []);

  const toggleTheme = (newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.className = newTheme;
  };

  return (
    <div className="flex items-center gap-2 p-1 rounded-lg bg-black/20 border border-fg-muted/20">
      <motion.button
        onClick={() => toggleTheme('light')}
        className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
          theme === 'light' 
            ? 'bg-brand-500/20 text-brand-300' 
            : 'text-fg-muted hover:text-fg'
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        ☀️ Light
      </motion.button>
      
      <motion.button
        onClick={() => toggleTheme('dark')}
        className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
          theme === 'dark' 
            ? 'bg-brand-500/20 text-brand-300' 
            : 'text-fg-muted hover:text-fg'
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        🌙 Dark
      </motion.button>
      
      <motion.button
        onClick={() => toggleTheme('hc')}
        className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
          theme === 'hc' 
            ? 'bg-brand-500/20 text-brand-300' 
            : 'text-fg-muted hover:text-fg'
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        ♿ HC
      </motion.button>
    </div>
  );
}
