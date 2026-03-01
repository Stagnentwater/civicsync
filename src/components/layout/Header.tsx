"use client";

import { useApp } from "../providers/AppProvider";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const { dict, user, logout } = useApp();
  const pathname = usePathname();

  return (
    <header
      className="bg-blue-700 text-white shadow-lg sticky top-0 z-50"
      role="banner"
    >
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link
          href={user ? "/dashboard" : "/"}
          className="flex items-center gap-2"
          aria-label={dict.common.appName}
        >
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
            <span className="text-blue-700 font-bold text-lg">CS</span>
          </div>
          <div>
            <h1 className="text-xl font-bold leading-tight">
              {dict.common.appName}
            </h1>
            <p className="text-xs text-blue-200 hidden sm:block">
              {dict.common.tagline}
            </p>
          </div>
        </Link>

        {user && (
          <nav className="flex items-center gap-2 sm:gap-4" role="navigation" aria-label="Main navigation">
            <Link
              href="/dashboard"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname === "/dashboard"
                  ? "bg-blue-800 text-white"
                  : "text-blue-100 hover:bg-blue-600"
              }`}
              aria-current={pathname === "/dashboard" ? "page" : undefined}
            >
              {dict.common.dashboard}
            </Link>
            <Link
              href="/dashboard/bills"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname === "/dashboard/bills"
                  ? "bg-blue-800 text-white"
                  : "text-blue-100 hover:bg-blue-600"
              }`}
              aria-current={pathname === "/dashboard/bills" ? "page" : undefined}
            >
              {dict.common.bills}
            </Link>
            <Link
              href="/dashboard/complaints"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname?.startsWith("/dashboard/complaints")
                  ? "bg-blue-800 text-white"
                  : "text-blue-100 hover:bg-blue-600"
              }`}
              aria-current={pathname?.startsWith("/dashboard/complaints") ? "page" : undefined}
            >
              {dict.common.complaints}
            </Link>
            {user.role === "ADMIN" && (
              <Link
                href="/admin"
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pathname?.startsWith("/admin")
                    ? "bg-yellow-500 text-black"
                    : "text-yellow-200 hover:bg-blue-600"
                }`}
                aria-current={pathname?.startsWith("/admin") ? "page" : undefined}
              >
                {dict.common.admin}
              </Link>
            )}
            <button
              onClick={logout}
              className="px-3 py-2 rounded-lg text-sm font-medium bg-red-600 hover:bg-red-700 transition-colors ml-2"
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
