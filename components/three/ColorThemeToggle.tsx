'use client';

import React, { useState } from 'react';

interface ColorThemeToggleProps {
  colorTheme: 'white' | 'dark' | 'matrix';
  onThemeChange: (theme: 'white' | 'dark' | 'matrix') => void;
}

const ColorThemeToggle: React.FC<ColorThemeToggleProps> = ({ 
  colorTheme, 
  onThemeChange 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="fixed top-6 right-6 z-50">
      {/* Main toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 rounded-full bg-black/30 backdrop-blur-sm border border-white/20 text-white hover:bg-black/50 transition-all duration-300 flex items-center justify-center"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
        </svg>
      </button>
      
      {/* Theme options */}
      {isOpen && (
        <div className="fixed top-20 right-6 flex flex-col gap-2 z-50">
          {/* White theme */}
          <button
            onClick={() => {
              onThemeChange('white');
              setIsOpen(false);
            }}
            className={`w-10 h-10 rounded-full transition-all duration-300 flex items-center justify-center ${
              colorTheme === 'white' 
                ? 'bg-white text-black shadow-lg scale-110' 
                : 'bg-white/20 text-white hover:bg-white/30 hover:scale-105'
            }`}
            title="White Theme"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
          </button>
          
          {/* Dark theme */}
          <button
            onClick={() => {
              onThemeChange('dark');
              setIsOpen(false);
            }}
            className={`w-10 h-10 rounded-full transition-all duration-300 flex items-center justify-center ${
              colorTheme === 'dark' 
                ? 'bg-purple-600 text-white shadow-lg scale-110' 
                : 'bg-purple-600/20 text-purple-300 hover:bg-purple-600/30 hover:scale-105'
            }`}
            title="Dark Theme"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
            </svg>
          </button>
          
          {/* Matrix theme */}
          <button
            onClick={() => {
              onThemeChange('matrix');
              setIsOpen(false);
            }}
            className={`w-10 h-10 rounded-full transition-all duration-300 flex items-center justify-center ${
              colorTheme === 'matrix' 
                ? 'bg-green-600 text-black shadow-lg scale-110' 
                : 'bg-green-600/20 text-green-300 hover:bg-green-600/30 hover:scale-105'
            }`}
            title="Matrix Theme"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default ColorThemeToggle;
