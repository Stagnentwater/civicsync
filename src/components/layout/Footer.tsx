"use client";

import { useApp } from "../providers/AppProvider";

export default function Footer() {
  const { dict } = useApp();

  return (
    <footer className="border-t border-zinc-200 py-6 mt-auto" role="contentinfo">
      <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
        <p className="text-xs text-zinc-400">
          © 2026 {dict.common.appName}
        </p>
        <p className="text-xs text-zinc-400">
          {dict.common.tagline}
        </p>
      </div>
    </footer>
  );
}
