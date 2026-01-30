import { ReactNode } from "react";

interface PageTitleProps {
  title: string;
  description?: string;
  children?: ReactNode;
}

export default function PageTitle({ title, description, children }: PageTitleProps) {
  return (
    <header className="space-y-1">
      <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
      {description && <p className="text-sm text-slate-600">{description}</p>}
      {children}
    </header>
  );
}
