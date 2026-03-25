import { GraduationCap, Bell, Search, Sparkles } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { useState, useEffect } from "react";

const DashboardHeader = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="h-4 w-4 text-primary animate-pulse-soft" />
          <span className="text-xs font-medium text-muted-foreground">
            {time.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            {" • "}
            <span className="font-mono">{time.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}</span>
          </span>
        </div>
        <h1 className="text-xl font-bold tracking-tight">
          St. Francis Xavier Smart Academy Inc
        </h1>
        <p className="text-sm text-muted-foreground">
          School Command Center • SY 2025–2026
        </p>
      </div>
      <div className="flex items-center gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            className="h-9 w-48 rounded-lg border bg-card pl-9 pr-3 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/30 transition-all"
            placeholder="Search..."
          />
        </div>
        <button className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-card border text-muted-foreground transition-all duration-200 hover:text-foreground hover:scale-105">
          <Bell className="h-4 w-4" />
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground animate-pulse-soft">
            3
          </span>
        </button>
        <ThemeToggle />
      </div>
    </header>
  );
};

export default DashboardHeader;
