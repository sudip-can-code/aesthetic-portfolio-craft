
import * as React from "react";
import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light";

type ThemeContextType = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [theme, setTheme] = useState<Theme>(() => {
    // Safely access localStorage and window
    if (typeof window === 'undefined') {
      return 'light';
    }
    
    try {
      const storedTheme = localStorage.getItem("theme") as Theme | null;
      
      if (storedTheme && (storedTheme === 'dark' || storedTheme === 'light')) {
        return storedTheme;
      }
      
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    } catch (error) {
      return 'light';
    }
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    try {
      const root = window.document.documentElement;
      
      root.classList.remove("light", "dark");
      root.classList.add(theme);
      
      localStorage.setItem("theme", theme);
    } catch (error) {
      console.error('Error setting theme:', error);
    }
  }, [theme]);

  const contextValue = {
    theme,
    setTheme,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
