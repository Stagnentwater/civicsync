"use client";

import { useApp } from "../providers/AppProvider";
import type { Locale } from "@/lib/i18n/dictionaries";

export default function AccessibilityBar() {
  const { dict, locale, setLocale, highContrast, toggleHighContrast, largeFont, toggleLargeFont } = useApp();

  const languages: { code: Locale; label: string }[] = [
    { code: "en", label: "EN" },
    { code: "hi", label: "हि" },
    { code: "te", label: "తె" },
  ];

  return (
    <div
      className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2"
      role="toolbar"
      aria-label={dict.common.accessibility}
    >
      {/* Language selector */}
      <div className="flex gap-1 bg-white border border-zinc-200 rounded-lg p-1 shadow-sm">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => setLocale(lang.code)}
            className={`w-8 h-8 rounded text-xs font-medium transition-colors ${
              locale === lang.code
                ? "bg-zinc-900 text-white"
                : "text-zinc-500 hover:bg-zinc-100"
            }`}
            aria-pressed={locale === lang.code}
            aria-label={`Switch to ${lang.label}`}
          >
            {lang.label}
          </button>
        ))}
      </div>

      {/* Accessibility toggles */}
      <div className="flex gap-1 bg-white border border-zinc-200 rounded-lg p-1 shadow-sm">
        <button
          onClick={toggleHighContrast}
          className={`w-8 h-8 rounded text-xs transition-colors ${
            highContrast ? "bg-yellow-400 text-black" : "text-zinc-500 hover:bg-zinc-100"
          }`}
          aria-pressed={highContrast}
          aria-label={dict.common.highContrast}
          title={dict.common.highContrast}
        >
          ◐
        </button>
        <button
          onClick={toggleLargeFont}
          className={`w-8 h-8 rounded text-xs font-bold transition-colors ${
            largeFont ? "bg-zinc-900 text-white" : "text-zinc-500 hover:bg-zinc-100"
          }`}
          aria-pressed={largeFont}
          aria-label={dict.common.largeFont}
          title={dict.common.largeFont}
        >
          A+
        </button>
      </div>
    </div>
  );
}
