'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();
  
  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/chat', label: 'Chat' },
    { href: '/admin', label: 'Admin' },
  ];

  return (
    <nav className="flex items-center gap-4 mb-6 p-4 rounded-2xl border backdrop-blur bg-white/5">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`px-4 py-2 rounded-xl text-sm transition-colors ${
            pathname === item.href
              ? 'bg-white/10 border border-white/20'
              : 'hover:bg-white/5 border border-transparent'
          }`}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
