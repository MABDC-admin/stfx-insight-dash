import { Palette, Moon } from "lucide-react";
import { useEffect, useState } from "react";

const ThemeToggle = () => {
  const [dark, setDark] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") === "dark";
    }
    return false;
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  return (
    <button
      onClick={() => setDark(!dark)}
      className="relative flex items-center gap-2 rounded-full bg-secondary p-1 transition-all duration-300 hover:shadow-md"
      aria-label="Toggle theme"
    >
      <span
        className={`flex h-8 w-8 items-center justify-center rounded-full transition-all duration-300 ${
          !dark ? "bg-primary text-primary-foreground scale-110 shadow-md" : "text-muted-foreground"
        }`}
      >
        <Palette className="h-4 w-4" />
      </span>
      <span
        className={`flex h-8 w-8 items-center justify-center rounded-full transition-all duration-300 ${
          dark ? "bg-primary text-primary-foreground scale-110 shadow-md" : "text-muted-foreground"
        }`}
      >
        <Moon className="h-4 w-4" />
      </span>
    </button>
  );
};

export default ThemeToggle;
