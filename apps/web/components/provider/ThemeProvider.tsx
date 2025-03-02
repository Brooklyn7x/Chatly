"use client";

import { createContext, useContext, useEffect, useState } from "react";


type ThemeMode = "light" | "dark" | "system";
type ThemeColor = "default" | "blue" | "green" | "purple" | "orange" | "pink";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: ThemeMode;
  defaultColor?: ThemeColor;
};

type ThemeProviderState = {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  themeColor: ThemeColor;
  setThemeColor: (color: ThemeColor) => void;
};

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
  themeColor: "default",
  setThemeColor: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "system",
  defaultColor = "default",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme-mode") as ThemeMode;
      return savedTheme || defaultTheme;
    }
    return defaultTheme;
  });

  const [themeColor, setThemeColor] = useState<ThemeColor>(() => {
    if (typeof window !== "undefined") {
      const savedColor = localStorage.getItem("theme-color") as ThemeColor;
      return savedColor || defaultColor;
    }
    return defaultColor;
  });

  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove("light", "dark");

    localStorage.setItem("theme-mode", theme);

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";

      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(theme);
  }, [theme]);

  // Effect for handling theme color
  useEffect(() => {
    const root = window.document.documentElement;

    // Remove all theme colors
    root.classList.remove(
      "theme-default",
      "theme-blue",
      "theme-green",
      "theme-purple",
      "theme-orange",
      "theme-pink"
    );

  
    localStorage.setItem("theme-color", themeColor);

  
    root.classList.add(`theme-${themeColor}`);
  }, [themeColor]);

  const value = {
    theme,
    setTheme: (theme: ThemeMode) => {
      setTheme(theme);
    },
    themeColor,
    setThemeColor: (color: ThemeColor) => {
      setThemeColor(color);
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};
