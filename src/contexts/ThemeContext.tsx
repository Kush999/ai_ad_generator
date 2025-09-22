"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: "light" | "dark";
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("system");
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light");

  // Get system preference
  const getSystemTheme = (): "light" | "dark" => {
    if (typeof window !== "undefined") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    return "light";
  };

  // Update resolved theme based on current theme setting
  const updateResolvedTheme = (currentTheme: Theme) => {
    const resolved = currentTheme === "system" ? getSystemTheme() : currentTheme;
    setResolvedTheme(resolved);
    
    // Apply theme to document
    if (typeof document !== "undefined") {
      const root = document.documentElement;
      root.setAttribute("data-theme", resolved);
      
      // Also update class for compatibility
      root.classList.remove("light", "dark");
      root.classList.add(resolved);
    }
  };

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("theme") as Theme;
      const initialTheme = saved || "system";
      setTheme(initialTheme);
      updateResolvedTheme(initialTheme);
    }
  }, [updateResolvedTheme]);

  // Listen for system theme changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = () => {
        if (theme === "system") {
          updateResolvedTheme("system");
        }
      };

      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, [theme, updateResolvedTheme]);

  // Update theme
  const handleSetTheme = (newTheme: Theme) => {
    setTheme(newTheme);
    updateResolvedTheme(newTheme);
    
    if (typeof window !== "undefined") {
      localStorage.setItem("theme", newTheme);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme: handleSetTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
