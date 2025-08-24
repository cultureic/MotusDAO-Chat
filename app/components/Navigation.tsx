"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center justify-between mb-6 p-4 rounded-2xl bg-white/80 backdrop-blur-md border border-gray-200/50 shadow-sm">
      {/* Left Section - Brand/Logo */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-pink-300 to-blue-300 flex items-center justify-center">
          <div className="text-white text-lg font-bold">Y</div>
        </div>
        <div className="flex flex-col">
          <span className="text-lg font-semibold text-gray-900">MotusDAO</span>
          <span className="text-sm text-gray-600">Psychology</span>
        </div>
      </div>

      {/* Middle Section - Navigation Links */}
      <div className="flex items-center gap-1 px-4 py-2 rounded-xl bg-gray-100/80">
        <Link 
          href="/" 
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            pathname === "/" 
              ? "bg-white text-gray-900 shadow-sm" 
              : "text-gray-700 hover:text-gray-900"
          }`}
        >
          MotusDAO
        </Link>
        <Link 
          href="/chat" 
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            pathname === "/chat" 
              ? "bg-white text-gray-900 shadow-sm" 
              : "text-gray-700 hover:text-gray-900"
          }`}
        >
          Psicoterapia
        </Link>
        <Link 
          href="/admin" 
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${
            pathname === "/admin" 
              ? "bg-white text-gray-900 shadow-sm" 
              : "text-gray-700 hover:text-gray-900"
          }`}
        >
          Psicólogos
          <span className="text-xs">▼</span>
        </Link>
        <Link 
          href="/news" 
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            pathname === "/news" 
              ? "bg-white text-gray-900 shadow-sm" 
              : "text-gray-700 hover:text-gray-900"
          }`}
        >
          Noticias
        </Link>
        <Link 
          href="/faq" 
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            pathname === "/faq" 
              ? "bg-white text-gray-900 shadow-sm" 
              : "text-gray-700 hover:text-gray-900"
          }`}
        >
          Preguntas
        </Link>
      </div>

      {/* Right Section - User Actions */}
      <div className="flex items-center gap-4">
        <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
          <div className="w-5 h-5 rounded-full border-2 border-gray-700"></div>
          Iniciar sesión
        </button>
        <div className="w-px h-6 bg-gray-300"></div>
        <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
          <div className="w-5 h-5 rounded-full border-2 border-gray-700 flex items-center justify-center">
            <div className="w-2 h-2 bg-gray-700 rounded-full"></div>
          </div>
          Iniciar
        </button>
      </div>
    </nav>
  );
}
