
import { Moon, Sun } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/lib/theme";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <div className="flex items-center space-x-2">
      <Sun className="h-4 w-4 text-foreground" />
      <Switch 
        checked={theme === "dark"} 
        onCheckedChange={toggleTheme}
        className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-input"
      />
      <Moon className="h-4 w-4 text-foreground" />
    </div>
  );
}
