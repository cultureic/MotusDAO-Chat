'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { useSmartAccount } from '@/lib/smart-account';
import { menuItems, getNavbarClasses, getMenuItemClasses, getMobileMenuItemClasses } from './navbar-utils';

export default function RoundedTransparentNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  
  // Privy hooks
  const { ready, authenticated, login, logout, user } = usePrivy();
  const { wallets } = useWallets();
  const { eoaAddress, smartAccountAddress, hasSmartWallet, hasEOA, smartWallet, eoaWallet, userEmail, isReady } = useSmartAccount();

  // Debug logging
  useEffect(() => {
    console.log('Navbar Debug - Authentication state:', {
      ready,
      authenticated,
      user: user?.wallet?.address,
      userEmail,
      eoaAddress,
      smartAccountAddress,
      hasSmartWallet,
      hasEOA,
      smartWallet: smartWallet?.address,
      eoaWallet: eoaWallet?.address,
      wallets: wallets.map(w => ({ address: w.address, type: w.walletClientType })),
      isReady
    });
  }, [ready, authenticated, user, userEmail, eoaAddress, smartAccountAddress, hasSmartWallet, hasEOA, smartWallet, eoaWallet, wallets, isReady]);

  // Force update when wallet changes
  useEffect(() => {
    const currentWallet = wallets[0]?.address;
    if (currentWallet) {
      console.log('Wallet changed to:', currentWallet);
    }
  }, [wallets]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleAuthClick = () => {
    if (authenticated) {
      logout();
    } else {
      login();
    }
  };

  return (
    <div className="fixed top-4 left-4 right-4 z-50">
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={getNavbarClasses(scrolled)}
      >
        <div className="flex items-center justify-between">
          {/* Logo and Brand */}
          <Link href="/" className="flex items-center space-x-3 group">
            <motion.div 
              whileHover={{ scale: 1.05, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              className="relative w-12 h-12 bg-gradient-to-br from-purple-500 via-pink-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300"
            >
              <span className="text-white font-bold text-lg">M</span>
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl"></div>
            </motion.div>
            <div className="flex flex-col">
              <span className="text-xl font-bold bg-gradient-to-r from-gray-900 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                MotusDAO
              </span>
              <span className="text-xs text-gray-500 font-medium">AI Psychology Platform</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {menuItems.map((item) => (
              <motion.div
                key={item.href}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href={item.href}
                  className={getMenuItemClasses(pathname === item.href)}
                >
                  <span className="text-base">{item.icon}</span>
                  <span>{item.label}</span>
                  {pathname === item.href && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                      initial={false}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="hidden lg:flex items-center space-x-3">
            {/* Simple Connection Status */}
            {authenticated && (
              <div className="flex items-center space-x-2 px-3 py-2 bg-white/50 border border-white/30 rounded-xl backdrop-blur-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-700 font-medium">Connected</span>
              </div>
            )}
            
            <motion.button 
              onClick={handleAuthClick}
              disabled={!ready}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2.5 rounded-2xl text-sm font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
              style={{
                background: 'linear-gradient(to right, #9333ea, #ec4899)',
                color: 'white'
              }}
            >
              {authenticated ? "Sign Out" : "Sign In"}
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleMenu}
            className="lg:hidden flex items-center justify-center w-12 h-12 rounded-2xl bg-white/20 hover:bg-white/30 transition-all duration-300 border border-white/30 backdrop-blur-sm"
          >
            <div className="flex flex-col space-y-1.5">
              <motion.div
                animate={isOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
                className="w-6 h-0.5 bg-gray-700 rounded-full transition-all duration-300"
              />
              <motion.div
                animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
                className="w-6 h-0.5 bg-gray-700 rounded-full transition-all duration-300"
              />
              <motion.div
                animate={isOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
                className="w-6 h-0.5 bg-gray-700 rounded-full transition-all duration-300"
              />
            </div>
          </motion.button>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0, scale: 0.95 }}
              animate={{ opacity: 1, height: 'auto', scale: 1 }}
              exit={{ opacity: 0, height: 0, scale: 0.95 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="lg:hidden mt-4 rounded-2xl bg-white/20 backdrop-blur-xl border border-white/30 overflow-hidden"
            >
              <div className="px-4 py-6 space-y-2">
                {menuItems.map((item, index) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      href={item.href}
                      onClick={toggleMenu}
                      className={getMobileMenuItemClasses(pathname === item.href)}
                    >
                      <span className="text-lg">{item.icon}</span>
                      <span>{item.label}</span>
                    </Link>
                  </motion.div>
                ))}
                
                {/* Mobile Connection Status */}
                {authenticated && (
                  <div className="pt-4 p-3 bg-white/50 border border-white/30 rounded-xl backdrop-blur-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm text-gray-700 font-medium">Connected</span>
                    </div>
                  </div>
                )}
                
                {/* Mobile Action Buttons */}
                <div className="pt-4 space-y-3">
                  <motion.button 
                    onClick={handleAuthClick}
                    disabled={!ready}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center justify-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 shadow-lg"
                    style={{
                      background: 'linear-gradient(to right, #9333ea, #ec4899)',
                      color: 'white'
                    }}
                  >
                    {authenticated ? "Sign Out" : "Sign In"}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </div>
  );
}
