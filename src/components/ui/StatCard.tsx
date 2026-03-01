import React from "react";

interface StatCardProps {
  title: string;
  value: number | string;
  icon: string;
  color?: string;
}

export default function StatCard({ title, value, icon, color = "blue" }: StatCardProps) {
  const colorClasses: Record<string, string> = {
    blue: "border-l-2 border-l-blue-500",
    green: "border-l-2 border-l-emerald-500",
    yellow: "border-l-2 border-l-amber-500",
    red: "border-l-2 border-l-red-500",
    purple: "border-l-2 border-l-violet-500",
    orange: "border-l-2 border-l-orange-500",
  };

  return (
    <div
      className={`bg-white rounded-lg border border-zinc-200 p-4 ${colorClasses[color] || colorClasses.blue}`}
      role="region"
      aria-label={`${title}: ${value}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-zinc-500 uppercase tracking-wide">{title}</p>
          <p className="text-2xl font-semibold text-zinc-900 mt-1">{value}</p>
        </div>
        <span className="text-2xl opacity-60" aria-hidden="true">{icon}</span>
      </div>
    </div>
  );
}
