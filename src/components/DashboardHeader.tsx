import { GraduationCap, Bell, Search } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

const DashboardHeader = () => {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl gradient-primary animate-float">
          <GraduationCap className="h-7 w-7 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight">
            St. Francis Xavier Smart Academy Inc
          </h1>
          <p className="text-sm text-muted-foreground">
            Command Center • SY 2025–2026
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            className="h-9 w-48 rounded-lg border bg-secondary/50 pl-9 pr-3 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/30 transition-all"
            placeholder="Search..."
          />
        </div>
        <button className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-secondary/50 text-muted-foreground transition-colors hover:text-foreground">
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
