"use client";

import { useApp } from "../providers/AppProvider";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const { dict, user, logout } = useApp();
  const pathname = usePathname();

  const navLink = (href: string, label: string, match?: string) => {
    const isActive = match ? pathname?.startsWith(match) : pathname === href;
    return (
      <Link
        href={href}
        className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
          isActive ? "bg-zinc-100 text-zinc-900 font-medium" : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50"
        }`}
        aria-current={isActive ? "page" : undefined}
      >
        {label}
      </Link>
    );
  };

  return (
    <header className="bg-white border-b border-zinc-200 sticky top-0 z-50" role="banner">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href={user ? "/dashboard" : "/"} className="flex items-center gap-2" aria-label={dict.common.appName}>
          <div className="w-7 h-7 bg-zinc-900 rounded flex items-center justify-center">
            <span className="text-white text-xs font-bold">CS</span>
          </div>
          <span className="font-semibold text-zinc-900 text-sm hidden sm:block">{dict.common.appName}</span>
        </Link>

        {user && (
          <nav className="flex items-center gap-1" role="navigation" aria-label="Main navigation">
            {navLink("/dashboard", dict.common.dashboard)}
            {navLink("/dashboard/bills", dict.common.bills)}
            {navLink("/dashboard/services", "Services", "/dashboard/services")}
            {navLink("/dashboard/complaints", dict.common.complaints, "/dashboard/complaints")}
            {user.role === "ADMIN" && navLink("/admin", dict.common.admin, "/admin")}
            <div className="w-px h-5 bg-zinc-200 mx-1" />
            <span className="text-xs text-zinc-400 hidden sm:block">{user.name || user.phone}</span>
            <button
              onClick={logout}
              className="px-3 py-1.5 rounded-md text-sm text-zinc-500 hover:text-red-600 hover:bg-red-50 transition-colors"
              aria-label={dict.common.logout}
            >
              {dict.common.logout}
            </button>
          </nav>
        )}
      </div>
    </header>
  );
}
