"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Footer() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <footer className="bg-white border-t border-gray-200 py-8 w-full">
      <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600 mb-6">
            <Link href="#" className="hover:text-blue-600 font-medium transition-colors">AUP</Link>
            <Link href="#" className="hover:text-blue-600 font-medium transition-colors">DMCA</Link>
            <Link href="/privacy" className="hover:text-blue-600 font-medium transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-blue-600 font-medium transition-colors">Terms</Link>
            {/* <Link href="#" className="hover:text-blue-600 font-medium transition-colors">2257</Link> */}
            <Link href="#" className="hover:text-blue-600 font-medium transition-colors">Help</Link>
        </div>
          <div className="text-center text-sm text-gray-500">
            <p className="mb-1">© 2018 - {new Date().getFullYear()} TheTradeNudes</p>
            <p>We are in no way affiliated or endorsed by &apos;Snap Inc.&apos;</p>
        </div>
      </div>
    </footer>
      
      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-2xl hover:shadow-blue-600/50 transition-all duration-300 transform hover:scale-110 z-50"
          aria-label="Scroll to top"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      )}
    </>
  );
}
