import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  ClipboardList,
  Calendar,
  BarChart3,
  FileText,
  Settings,
  MessageSquare,
  DollarSign,
  Bus,
  ChevronLeft,
  ChevronRight,
  Shield,
  HeartPulse,
} from "lucide-react";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: GraduationCap, label: "Enrollment" },
  { icon: Users, label: "Students" },
  { icon: Shield, label: "Faculty" },
  { icon: BookOpen, label: "Curriculum" },
  { icon: ClipboardList, label: "Attendance" },
  { icon: BarChart3, label: "Grades" },
  { icon: Calendar, label: "Schedule" },
  { icon: FileText, label: "Reports" },
  { icon: DollarSign, label: "Finance" },
  { icon: Bus, label: "Transport" },
  { icon: HeartPulse, label: "Health" },
  { icon: MessageSquare, label: "Messages" },
  { icon: Settings, label: "Settings" },
];

const SideNavigation = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`fixed left-0 top-0 z-30 flex h-screen flex-col border-r bg-card transition-all duration-300 ${
        collapsed ? "w-16" : "w-56"
      }`}
      style={{ boxShadow: "var(--shadow-widget)" }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2 border-b px-3 py-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg gradient-primary animate-glow">
          <GraduationCap className="h-5 w-5 text-primary-foreground" />
        </div>
        {!collapsed && (
          <span className="text-xs font-bold leading-tight animate-slide-in-left">
            SFX Smart
            <br />
            Academy
          </span>
        )}
      </div>

      {/* Nav Items */}
      <nav className="flex-1 overflow-y-auto py-3 space-y-0.5 px-2">
        {navItems.map((item, i) => (
          <button
            key={item.label}
            className={`group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
              item.active
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            }`}
            style={{ animationDelay: `${i * 40}ms` }}
          >
            <item.icon
              className={`h-[18px] w-[18px] shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                item.active ? "text-primary" : ""
              }`}
            />
            {!collapsed && (
              <span className="truncate">{item.label}</span>
            )}
            {item.active && !collapsed && (
              <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary animate-pulse-soft" />
            )}
          </button>
        ))}
      </nav>

      {/* Collapse Button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="mx-2 mb-3 flex items-center justify-center rounded-lg bg-secondary py-2 text-muted-foreground transition-colors hover:text-foreground"
      >
        {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </button>
    </aside>
  );
};

export default SideNavigation;
