import { Moon, Sun } from "lucide-react";
import { Button } from "@/app/components/ui/Button/button";

export function ThemeToggle({ isDark, onToggle }) {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onToggle}
      className="rounded-full"
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
    >
      {isDark ? (
        <Sun className="w-5 h-5 text-yellow-500" />
      ) : (
        <Moon className="w-5 h-5 text-slate-700" />
      )}
    </Button>
  );
}
