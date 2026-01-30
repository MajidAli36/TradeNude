interface EmptyStateProps {
  message?: string;
  description?: string;
}

export default function EmptyState({ message = "No items found.", description }: EmptyStateProps) {
  return (
    <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center text-sm text-slate-600">
      <p className="font-medium">{message}</p>
      {description && <p className="mt-2 text-xs text-slate-500">{description}</p>}
    </div>
  );
}
