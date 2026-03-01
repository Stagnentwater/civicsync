"use client";

import { useApp } from "../providers/AppProvider";

export default function Footer() {
  const { dict } = useApp();

  return (
    <footer
      className="bg-gray-800 text-gray-300 py-6 mt-auto"
      role="contentinfo"
    >
      <div className="max-w-7xl mx-auto px-4 text-center">
        <p className="text-sm">
          © 2026 {dict.common.appName}. All rights reserved.
        </p>
        <p className="text-xs text-gray-500 mt-1">
          {dict.common.tagline}
        </p>
      </div>
    </footer>
  );
}
