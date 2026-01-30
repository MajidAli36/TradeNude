"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useState, useEffect } from "react";
import { getAdminSecret, setAdminSecret, promptAdminSecret } from "../../lib/auth";

interface NavItem {
  href: string;
  label: string;
  icon: string;
}

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const navItems: NavItem[] = [
    { href: "/admin", label: "Submissions", icon: "📋" },
    { href: "/admin/profiles", label: "All Profiles", icon: "👥" },
    { href: "/admin/settings", label: "Settings", icon: "⚙️" }
  ];

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col">
      {/* Admin Header - Fixed */}
      <header className="border-b border-slate-200 bg-white sticky top-0 z-50 shadow-sm">
        <div className="px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between h-14 sm:h-16">
          {/* Logo and Branding - Left */}
          <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 -ml-2 text-slate-600 hover:text-amber-600 hover:bg-slate-100 rounded-lg transition-colors flex-shrink-0"
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

            {/* Logo */}
            <div className="h-8 sm:h-10 w-8 sm:w-10 rounded-full border-2 border-amber-500 bg-gradient-to-tr from-amber-400 via-amber-500 to-orange-500 flex-shrink-0 flex items-center justify-center text-white font-bold text-sm">
              A
            </div>

            {/* Branding Text */}
            <div className="min-w-0 hidden sm:block">
              <div className="text-xs tracking-widest uppercase text-amber-600 font-bold leading-none">
                Admin
              </div>
              <div className="text-sm font-bold text-slate-900 leading-none">
                TheTradeNudes
              </div>
            </div>
          </div>

          {/* Back to Site Button - Right */}
          <Link
            href="/"
            className="ml-2 sm:ml-4 text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg border border-slate-300 text-slate-700 hover:border-amber-500 hover:text-amber-600 hover:bg-amber-50 transition-all duration-200 bg-white font-medium flex-shrink-0"
          >
            <span className="hidden sm:inline">← Back</span>
            <span className="sm:hidden">←</span>
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Mobile Sidebar Overlay */}
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 md:hidden animate-in fade-in duration-200"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        {/* Sidebar - Desktop */}
        <aside className="hidden md:flex flex-col w-48 lg:w-56 border-r border-slate-200 bg-white shadow-sm">
          <nav className="flex-1 overflow-y-auto p-4 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-amber-50 to-orange-50 text-amber-700 border-l-4 border-amber-500 shadow-sm"
                      : "text-slate-700 hover:bg-slate-50 border-l-4 border-transparent"
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Sidebar Footer */}
          <div className="border-t border-slate-200 p-4 space-y-3">
            <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-3">
              <p className="text-xs text-slate-600 font-semibold mb-1">Status</p>
              <p className="text-xs text-amber-600">⚠️ Admin authenticated</p>
            </div>
            <AdminSecretManager />
          </div>
        </aside>

        {/* Mobile Sidebar - Drawer */}
        <aside
          className={`fixed md:hidden top-14 sm:top-16 left-0 right-0 bottom-0 w-full max-w-xs bg-white border-r border-slate-200 shadow-2xl z-40 transform transition-transform duration-300 ease-in-out overflow-y-auto ${
            mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-amber-50 to-orange-50 text-amber-700 border-l-4 border-amber-500 shadow-sm"
                      : "text-slate-700 hover:bg-slate-50 border-l-4 border-transparent"
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Mobile Sidebar Footer */}
          <div className="border-t border-slate-200 p-4 space-y-3 mt-4">
            <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-3">
              <p className="text-xs text-slate-600 font-semibold mb-1">Status</p>
              <p className="text-xs text-amber-600">✓ Admin authenticated</p>
            </div>
            <AdminSecretManager />
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

// Admin Secret Manager Component
function AdminSecretManager() {
  const [secret, setSecret] = useState<string>("");
  const [isSet, setIsSet] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const currentSecret = getAdminSecret();
    setIsSet(!!currentSecret);
    if (currentSecret) {
      setSecret("••••••••"); // Show masked secret
    }
  }, []);

  function handleSetSecret() {
    const newSecret = prompt("Enter admin secret:");
    if (newSecret && newSecret.trim()) {
      setLoading(true);
      setAdminSecret(newSecret);
      setSecret("••••••••");
      setIsSet(true);
      // Reload to apply new secret
      setTimeout(() => window.location.reload(), 300);
    }
  }

  function handleClearSecret() {
    if (confirm("Are you sure? This will clear the admin secret.")) {
      setLoading(true);
      localStorage.removeItem("admin_secret");
      setSecret("");
      setIsSet(false);
      setTimeout(() => window.location.reload(), 300);
    }
  }

  return (
    <div className="rounded-lg border border-slate-300 bg-gradient-to-br from-white to-slate-50 p-3">
      <p className="text-xs text-slate-600 font-semibold mb-2">Admin Secret</p>
      {isSet ? (
        <div className="space-y-2">
          <p className="text-xs text-emerald-600 font-medium">✓ Secret configured</p>
          <button
            onClick={handleClearSecret}
            disabled={loading}
            className="w-full text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 disabled:opacity-50 py-1.5 rounded font-medium transition-colors"
          >
            {loading ? "Clearing..." : "Clear Secret"}
          </button>
        </div>
      ) : (
        <div>
          <p className="text-xs text-amber-600 font-medium mb-2">⚠️ No secret set</p>
          <button
            onClick={handleSetSecret}
            disabled={loading}
            className="w-full text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 disabled:opacity-50 py-1.5 rounded font-medium transition-colors"
          >
            {loading ? "Setting..." : "Set Secret"}
          </button>
        </div>
      )}
    </div>
  );
}
