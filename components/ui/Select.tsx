"use client";

import { SelectHTMLAttributes, ReactNode } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  children: ReactNode;
  className?: string;
}

export default function Select({ children, className = "", ...props }: SelectProps) {
  return (
    <select
      className={`w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-base text-gray-900 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all ${className}`}
      {...props}
    >
      {children}
    </select>
  );
}
