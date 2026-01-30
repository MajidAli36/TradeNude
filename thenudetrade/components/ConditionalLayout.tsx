"use client";

import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import Header from "./layout/Header";
import Footer from "./layout/Footer";

interface ConditionalLayoutProps {
  children: ReactNode;
}

export default function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  if (isAdminRoute) {
    return <>{children}</>;
  }

  return (
    <div className="page-layout">
      <Header />
      <main className="page-content w-full">{children}</main>
      <div className="page-footer">
        <Footer />
      </div>
    </div>
  );
}
