import React from "react";

interface BadgeProps {
  status: string;
  className?: string;
}

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800 border-yellow-300",
  PAID: "bg-green-100 text-green-800 border-green-300",
  SUCCESS: "bg-green-100 text-green-800 border-green-300",
  FAILED: "bg-red-100 text-red-800 border-red-300",
  OPEN: "bg-blue-100 text-blue-800 border-blue-300",
  IN_PROGRESS: "bg-orange-100 text-orange-800 border-orange-300",
  RESOLVED: "bg-green-100 text-green-800 border-green-300",
};

export default function StatusBadge({ status, className = "" }: BadgeProps) {
  const colorClass = statusColors[status] || "bg-gray-100 text-gray-800 border-gray-300";

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold border ${colorClass} ${className}`}
      role="status"
      aria-label={`Status: ${status.replace("_", " ")}`}
    >
      {status.replace("_", " ")}
    </span>
  );
}
