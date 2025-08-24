'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { menuItems, getNavbarClasses, getMenuItemClasses, getMobileMenuItemClasses } from './navbar-utils';

export default function SimpleRoundedNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <div className="fixed top-4 left-4 right-4 z-50">
      <nav className={getNavbarClasses(scrolled)}>
        <div className="flex items-center justify-between">
          {/* Logo and Brand */}
          <Link href="/" className="flex items-center space-x-3 group hover:scale-105 transition-transform duration-200">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 via-pink-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">M</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                MotusDAO
              </span>
              <span className="text-xs text-gray-500 font-medium">Psychology</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-2">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`${getMenuItemClasses(pathname === item.href)} hover:scale-105`}
              >
                <span className="text-base">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="hidden lg:flex items-center space-x-3">
            <button className="flex items-center space-x-2 px-4 py-2.5 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors rounded-2xl hover:bg-white/15 hover:scale-105 duration-200">
              <div className="w-4 h-4 rounded-full border-2 border-gray-400"></div>
              <span>Sign In</span>
            </button>
            <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2.5 rounded-2xl text-sm font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105">
              Get Started
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="lg:hidden flex items-center justify-center w-12 h-12 rounded-2xl bg-white/20 hover:bg-white/30 transition-all duration-300 border border-white/30 hover:scale-105"
          >
            <div className="flex flex-col space-y-1.5">
              <div className={`w-6 h-0.5 bg-gray-700 rounded-full transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-2' : ''}`}></div>
              <div className={`w-6 h-0.5 bg-gray-700 rounded-full transition-all duration-300 ${isOpen ? 'opacity-0' : ''}`}></div>
              <div className={`w-6 h-0.5 bg-gray-700 rounded-full transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-2' : ''}`}></div>
            </div>
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        <div className={`lg:hidden mt-4 rounded-2xl bg-white/20 backdrop-blur-xl border border-white/30 overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="px-4 py-6 space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={toggleMenu}
                className={`${getMobileMenuItemClasses(pathname === item.href)} hover:scale-105`}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
            
            {/* Mobile Action Buttons */}
            <div className="pt-4 space-y-3">
              <button className="w-full flex items-center justify-center space-x-2 px-4 py-3 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors rounded-xl hover:bg-white/20 hover:scale-105 duration-200">
                <div className="w-4 h-4 rounded-full border-2 border-gray-400"></div>
                <span>Sign In</span>
              </button>
              <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-3 rounded-xl text-sm font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:scale-105">
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}
