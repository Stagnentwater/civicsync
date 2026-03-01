import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  role?: string;
  ariaLabel?: string;
  hover?: boolean;
}

export default function Card({ children, className = "", onClick, role, ariaLabel, hover = true }: CardProps) {
  const Component = onClick ? "button" : "div";
  return (
    <Component
      className={`bg-white rounded-lg border border-zinc-200 p-5 ${
        hover ? "transition-shadow hover:shadow-sm" : ""
      } ${
        onClick ? "cursor-pointer text-left w-full" : ""
      } ${className}`}
      onClick={onClick}
      role={role}
      aria-label={ariaLabel}
    >
      {children}
    </Component>
  );
}
