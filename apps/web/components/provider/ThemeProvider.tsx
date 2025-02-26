// "use client";

// import * as React from "react";
// import { ThemeProvider as NextThemesProvider } from "next-themes";

// export function ThemeProvider({
//   children,
//   ...props
// }: React.ComponentProps<typeof NextThemesProvider>) {
//   return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
// }

// components/theme-provider.tsx
"use client";

import { createContext, useContext, useEffect, useState } from "react";

// Define available themes and modes
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
  // Initialize state from localStorage if available, otherwise use defaults
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

  // Effect for handling theme mode (light/dark)
  useEffect(() => {
    const root = window.document.documentElement;

    // Remove all theme modes
    root.classList.remove("light", "dark");

    // Save to localStorage
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

    // Save to localStorage
    localStorage.setItem("theme-color", themeColor);

    // Add current theme color
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
