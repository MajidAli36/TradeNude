"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === "/") {
      return pathname === "/";
    }
    return pathname?.startsWith(path);
  };

  return (
    <header className="bg-white sticky top-0 z-50 shadow-md">
      {/* Main Header */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
          <Link href="/" className="flex items-center group">
            <div className="relative">
              <img 
                src="/logo/logo1.png" 
                alt="TheTradeNudes Logo" 
                className="h-10 sm:h-12 md:h-16 w-auto object-contain group-hover:opacity-90 transition-opacity"
              />
            </div>
        </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link 
              href="/" 
              className={`font-semibold transition-all ${
                isActive("/")
                  ? "text-transparent bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text border-b-2 border-purple-600 pb-1"
                  : "text-gray-800 hover:text-pink-600"
              }`}
            >
            Home
          </Link>
            <Link 
              href="/girls" 
              className={`font-semibold transition-all ${
                isActive("/girls")
                  ? "text-transparent bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text border-b-2 border-purple-600 pb-1"
                  : "text-gray-800 hover:text-pink-600"
              }`}
            >
            Girls
          </Link>
            <Link 
              href="/boys" 
              className={`font-semibold transition-all ${
                isActive("/boys")
                  ? "text-transparent bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text border-b-2 border-purple-600 pb-1"
                  : "text-gray-800 hover:text-pink-600"
              }`}
            >
            Boys
          </Link>
          <Link
            href="/submit-profile"
              className="px-5 py-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
          >
            Submit profile
          </Link>
        </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-800 hover:text-pink-600 transition-colors"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white">
            <nav className="px-4 py-4 space-y-3">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className={`block font-semibold transition-all py-2 ${
                  isActive("/")
                    ? "text-transparent bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text"
                    : "text-gray-800 hover:text-pink-600"
                }`}
              >
                Home
              </Link>
              <Link
                href="/girls"
                onClick={() => setMobileMenuOpen(false)}
                className={`block font-semibold transition-all py-2 ${
                  isActive("/girls")
                    ? "text-transparent bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text"
                    : "text-gray-800 hover:text-pink-600"
                }`}
              >
                Girls
              </Link>
              <Link
                href="/boys"
                onClick={() => setMobileMenuOpen(false)}
                className={`block font-semibold transition-all py-2 ${
                  isActive("/boys")
                    ? "text-transparent bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text"
                    : "text-gray-800 hover:text-pink-600"
                }`}
              >
                Boys
              </Link>
              <Link
                href="/submit-profile"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-center px-5 py-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold shadow-lg transition-all"
              >
                Submit profile
              </Link>
            </nav>
          </div>
        )}
      </div>
      {/* Purple Bottom Border */}
      <div className="h-1 bg-gradient-to-r from-purple-500 to-purple-600"></div>
    </header>
  );
}
