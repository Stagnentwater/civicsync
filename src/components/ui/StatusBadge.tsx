import React from "react";

interface BadgeProps {
  status: string;
  className?: string;
}

const statusColors: Record<string, string> = {
  PENDING: "bg-amber-50 text-amber-700 border-amber-200",
  PAID: "bg-emerald-50 text-emerald-700 border-emerald-200",
  SUCCESS: "bg-emerald-50 text-emerald-700 border-emerald-200",
  FAILED: "bg-red-50 text-red-700 border-red-200",
  OPEN: "bg-blue-50 text-blue-700 border-blue-200",
  IN_PROGRESS: "bg-orange-50 text-orange-700 border-orange-200",
  RESOLVED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  BOOKED: "bg-violet-50 text-violet-700 border-violet-200",
  PROCESSING: "bg-sky-50 text-sky-700 border-sky-200",
  COMPLETED: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

export default function StatusBadge({ status, className = "" }: BadgeProps) {
  const colorClass = statusColors[status] || "bg-zinc-50 text-zinc-700 border-zinc-200";

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${colorClass} ${className}`}
      role="status"
      aria-label={`Status: ${status.replace("_", " ")}`}
    >
      {status.replace("_", " ")}
    </span>
  );
}
