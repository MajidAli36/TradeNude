"use client";

interface CityFilterProps {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}

export default function CityFilter({ label, value, options, onChange }: CityFilterProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-semibold uppercase tracking-wider text-gray-700">
        {label}
      </label>
      <select
        className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-900 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all min-w-[180px]"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((opt) => (
          <option key={opt} value={opt} className="bg-white text-gray-900">
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}
