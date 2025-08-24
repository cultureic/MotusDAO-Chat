// Shared utilities for navbar components

export const menuItems = [
  { href: '/', label: 'Home', icon: '🏠' },
  { href: '/chat', label: 'Chat', icon: '💬' },
  { href: '/admin', label: 'Profile', icon: '👤' },
  { href: '/about', label: 'About', icon: 'ℹ️' },
];

export const getNavbarClasses = (scrolled: boolean) => `
  relative mx-auto max-w-7xl rounded-3xl px-6 py-4
  backdrop-blur-xl transition-all duration-500 ease-out
  border border-white/20
  ${scrolled 
    ? 'bg-white/15 shadow-[0_8px_32px_rgba(0,0,0,0.1)]' 
    : 'bg-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.05)]'
  }
`;

export const getMenuItemClasses = (isActive: boolean) => `
  flex items-center space-x-2 px-4 py-2.5 rounded-2xl text-sm font-medium
  transition-all duration-300 ease-out
  ${isActive
    ? 'bg-white/20 text-gray-900 shadow-lg border border-white/30'
    : 'text-gray-700 hover:text-gray-900 hover:bg-white/15 hover:shadow-md'
  }
`;

export const getMobileMenuItemClasses = (isActive: boolean) => `
  flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium
  transition-all duration-300
  ${isActive
    ? 'bg-white/30 text-gray-900 shadow-md'
    : 'text-gray-700 hover:text-gray-900 hover:bg-white/20'
  }
`;
