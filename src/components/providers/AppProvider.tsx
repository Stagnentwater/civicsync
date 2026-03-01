"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Locale, getDictionary, Dictionary } from "@/lib/i18n/dictionaries";

interface AppContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  dict: Dictionary;
  highContrast: boolean;
  toggleHighContrast: () => void;
  largeFont: boolean;
  toggleLargeFont: () => void;
  user: UserInfo | null;
  setUser: (user: UserInfo | null) => void;
  logout: () => Promise<void>;
}

interface UserInfo {
  userId: string;
  name: string;
  phone: string;
  role: "CITIZEN" | "ADMIN";
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");
  const [highContrast, setHighContrast] = useState(false);
  const [largeFont, setLargeFont] = useState(false);
  const [user, setUser] = useState<UserInfo | null>(null);
  const [lastActivity, setLastActivity] = useState(Date.now());

  const dict = getDictionary(locale);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    if (typeof window !== "undefined") {
      localStorage.setItem("civicsync_locale", newLocale);
    }
  };

  const toggleHighContrast = () => {
    setHighContrast((prev) => {
      const next = !prev;
      if (typeof window !== "undefined") {
        localStorage.setItem("civicsync_highcontrast", String(next));
      }
      return next;
    });
  };

  const toggleLargeFont = () => {
    setLargeFont((prev) => {
      const next = !prev;
      if (typeof window !== "undefined") {
        localStorage.setItem("civicsync_largefont", String(next));
      }
      return next;
    });
  };

  const logout = useCallback(async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {}
    setUser(null);
    window.location.href = "/login";
  }, []);

  // Load preferences from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedLocale = localStorage.getItem("civicsync_locale") as Locale;
      if (savedLocale && ["en", "hi", "te"].includes(savedLocale)) {
        setLocaleState(savedLocale);
      }
      const savedHC = localStorage.getItem("civicsync_highcontrast");
      if (savedHC === "true") setHighContrast(true);
      const savedLF = localStorage.getItem("civicsync_largefont");
      if (savedLF === "true") setLargeFont(true);
    }
  }, []);

  // Check auth on mount
  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated) {
          setUser({
            userId: data.user.userId,
            name: data.user.phone,
            phone: data.user.phone,
            role: data.user.role,
          });
        }
      })
      .catch(() => {});
  }, []);

  // Session timeout (15 minutes of inactivity)
  useEffect(() => {
    const resetTimer = () => setLastActivity(Date.now());
    const events = ["mousedown", "keydown", "touchstart", "scroll"];
    events.forEach((e) => window.addEventListener(e, resetTimer));

    const interval = setInterval(() => {
      const timeout = 15 * 60 * 1000; // 15 minutes
      if (user && Date.now() - lastActivity > timeout) {
        logout();
      }
    }, 30000); // Check every 30s

    return () => {
      events.forEach((e) => window.removeEventListener(e, resetTimer));
      clearInterval(interval);
    };
  }, [user, lastActivity, logout]);

  // Apply CSS classes based on accessibility settings
  useEffect(() => {
    const root = document.documentElement;
    if (highContrast) {
      root.classList.add("high-contrast");
    } else {
      root.classList.remove("high-contrast");
    }
    if (largeFont) {
      root.classList.add("large-font");
    } else {
      root.classList.remove("large-font");
    }
  }, [highContrast, largeFont]);

  return (
    <AppContext.Provider
      value={{
        locale,
        setLocale,
        dict,
        highContrast,
        toggleHighContrast,
        largeFont,
        toggleLargeFont,
        user,
        setUser,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
}
