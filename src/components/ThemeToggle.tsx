
import React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="rounded-full bg-transparent border-none hover:bg-secondary"
    >
      {theme === "light" ? (
        <Moon className="h-[1.2rem] w-[1.2rem] text-foreground" />
      ) : (
        <Sun className="h-[1.2rem] w-[1.2rem] text-foreground" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
