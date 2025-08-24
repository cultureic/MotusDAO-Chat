"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function ModernMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const menuItems = [
    { href: '/platform', label: 'Platform' },
    { href: '/customers', label: 'Customers' },
    { href: '/integrations', label: 'Integrations' },
    { href: '/company', label: 'Company' },
    { href: '/pricing', label: 'Pricing' },
  ];

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-6">
      {/* Main Navigation Bar - Glassmorphism */}
      <div className="w-full max-w-6xl mx-4">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl px-6 py-4 shadow-lg">
          <div className="flex items-center justify-between">
            {/* Left Section - Logo and Brand */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 relative">
                  {/* Stylized 'M' logo with overlapping V shapes */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-3 h-3 border-l-2 border-t-2 border-white transform -rotate-45"></div>
                    <div className="w-3 h-3 border-r-2 border-t-2 border-white transform rotate-45 ml-0.5"></div>
                  </div>
                </div>
              </div>
              <span className="text-gray-800 font-semibold text-lg">MotusDAO</span>
            </Link>

            {/* Middle Section - Navigation Links */}
            <div className="hidden md:flex items-center gap-8">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-gray-600 hover:text-gray-800 transition-colors duration-200 font-medium ${
                    pathname === item.href ? 'text-gray-800' : ''
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Right Section - Sign In Button */}
            <div className="hidden md:block">
              <button className="bg-gray-800 text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-700 transition-colors duration-200">
                Sign In
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg bg-gray-800/10 hover:bg-gray-800/20 transition-colors"
            >
              <div className="flex flex-col gap-1">
                <motion.div
                  animate={isOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
                  className="w-5 h-0.5 bg-gray-800 rounded-full"
                />
                <motion.div
                  animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
                  className="w-5 h-0.5 bg-gray-800 rounded-full"
                />
                <motion.div
                  animate={isOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
                  className="w-5 h-0.5 bg-gray-800 rounded-full"
                />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="md:hidden fixed inset-0 z-40"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleMenu}
              className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            />
            
            {/* Menu Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 h-full w-80 bg-white/10 backdrop-blur-xl border-l border-white/20"
            >
              <div className="p-6">
                {/* Close Button */}
                <div className="flex justify-end mb-8">
                  <button
                    onClick={toggleMenu}
                    className="w-10 h-10 rounded-lg bg-gray-800/10 hover:bg-gray-800/20 transition-colors flex items-center justify-center"
                  >
                    <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Mobile Menu Items */}
                <div className="space-y-2">
                  {menuItems.map((item, index) => (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        href={item.href}
                        onClick={toggleMenu}
                        className={`block px-4 py-3 rounded-xl transition-all duration-300 text-gray-600 hover:text-gray-800 hover:bg-white/10 ${
                          pathname === item.href ? 'text-gray-800 bg-white/10' : ''
                        }`}
                      >
                        <span className="font-medium">{item.label}</span>
                      </Link>
                    </motion.div>
                  ))}
                </div>

                {/* Mobile Action Button */}
                <div className="mt-8">
                  <button className="w-full bg-gray-800 text-white py-3 rounded-xl font-medium hover:bg-gray-700 transition-colors duration-200">
                    Sign In
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

