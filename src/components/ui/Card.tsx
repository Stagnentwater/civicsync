import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  role?: string;
  ariaLabel?: string;
}

export default function Card({ children, className = "", onClick, role, ariaLabel }: CardProps) {
  const Component = onClick ? "button" : "div";
  return (
    <Component
      className={`bg-white rounded-2xl shadow-md border border-gray-100 p-6 transition-all hover:shadow-lg ${
        onClick ? "cursor-pointer active:scale-[0.98]" : ""
      } ${className}`}
      onClick={onClick}
      role={role}
      aria-label={ariaLabel}
    >
      {children}
    </Component>
  );
}
