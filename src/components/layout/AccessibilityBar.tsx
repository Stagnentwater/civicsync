"use client";

import { useApp } from "../providers/AppProvider";
import type { Locale } from "@/lib/i18n/dictionaries";

export default function AccessibilityBar() {
  const { dict, locale, setLocale, highContrast, toggleHighContrast, largeFont, toggleLargeFont } = useApp();

  const languages: { code: Locale; label: string }[] = [
    { code: "en", label: "English" },
    { code: "hi", label: "हिन्दी" },
    { code: "te", label: "తెలుగు" },
  ];

  return (
    <div
      className="bg-gray-100 border-b border-gray-200 px-4 py-2 high-contrast:bg-black high-contrast:border-yellow-400"
      role="toolbar"
      aria-label={dict.common.accessibility}
    >
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-end gap-3 text-sm">
        {/* Language Selector */}
        <div className="flex items-center gap-2" role="group" aria-label={dict.common.language}>
          <span className="font-medium text-gray-600" aria-hidden="true">🌐</span>
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => setLocale(lang.code)}
              className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                locale === lang.code
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-200 border border-gray-300"
              }`}
              aria-pressed={locale === lang.code}
              aria-label={`Switch to ${lang.label}`}
            >
              {lang.label}
            </button>
          ))}
        </div>

        {/* Accessibility Toggles */}
        <button
          onClick={toggleHighContrast}
          className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
            highContrast
              ? "bg-yellow-400 text-black border-2 border-yellow-600"
              : "bg-white text-gray-700 hover:bg-gray-200 border border-gray-300"
          }`}
          aria-pressed={highContrast}
          aria-label={dict.common.highContrast}
        >
          ◐ {dict.common.highContrast}
        </button>

        <button
          onClick={toggleLargeFont}
          className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
            largeFont
              ? "bg-green-500 text-white border-2 border-green-700"
              : "bg-white text-gray-700 hover:bg-gray-200 border border-gray-300"
          }`}
          aria-pressed={largeFont}
          aria-label={dict.common.largeFont}
        >
          A+ {dict.common.largeFont}
        </button>
      </div>
    </div>
  );
}
