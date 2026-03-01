import React from "react";

interface StatCardProps {
  title: string;
  value: number | string;
  icon: string;
  color?: string;
}

export default function StatCard({ title, value, icon, color = "blue" }: StatCardProps) {
  const colorClasses: Record<string, string> = {
    blue: "bg-blue-50 border-blue-200 text-blue-700",
    green: "bg-green-50 border-green-200 text-green-700",
    yellow: "bg-yellow-50 border-yellow-200 text-yellow-700",
    red: "bg-red-50 border-red-200 text-red-700",
    purple: "bg-purple-50 border-purple-200 text-purple-700",
    orange: "bg-orange-50 border-orange-200 text-orange-700",
  };

  return (
    <div
      className={`rounded-2xl border-2 p-6 ${colorClasses[color] || colorClasses.blue}`}
      role="region"
      aria-label={`${title}: ${value}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium opacity-75">{title}</p>
          <p className="text-3xl font-bold mt-1">{value}</p>
        </div>
        <span className="text-4xl" aria-hidden="true">
          {icon}
        </span>
      </div>
    </div>
  );
}
