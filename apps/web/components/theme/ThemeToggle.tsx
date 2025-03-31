"use client";

import { Moon, Sun, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu";
// import { useTheme } from "../provider/ThemeProvider";

export function ThemeToggle() {
  const { setTheme, themeColor, setThemeColor } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Palette className="mr-2 h-4 w-4" />
            <span>Theme Color</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <DropdownMenuItem
                onClick={() => setThemeColor("default")}
                className={themeColor === "default" ? "bg-secondary" : ""}
              >
                <div className="h-4 w-4 rounded-full bg-primary mr-2" />
                <span>Default</span>
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => setThemeColor("blue")}
                className={themeColor === "blue" ? "bg-secondary" : ""}
              >
                <div className="h-4 w-4 rounded-full bg-blue-500 mr-2" />
                <span>Blue</span>
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => setThemeColor("green")}
                className={themeColor === "green" ? "bg-secondary" : ""}
              >
                <div className="h-4 w-4 rounded-full bg-green-500 mr-2" />
                <span>Green</span>
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => setThemeColor("purple")}
                className={themeColor === "purple" ? "bg-secondary" : ""}
              >
                <div className="h-4 w-4 rounded-full bg-purple-500 mr-2" />
                <span>Purple</span>
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => setThemeColor("orange")}
                className={themeColor === "orange" ? "bg-secondary" : ""}
              >
                <div className="h-4 w-4 rounded-full bg-orange-500 mr-2" />
                <span>Orange</span>
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => setThemeColor("pink")}
                className={themeColor === "pink" ? "bg-secondary" : ""}
              >
                <div className="h-4 w-4 rounded-full bg-pink-500 mr-2" />
                <span>Pink</span>
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
