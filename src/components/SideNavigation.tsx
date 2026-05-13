import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Users, GraduationCap, BookOpen, ClipboardList,
  Calendar, BarChart3, FileText, Settings, MessageSquare, DollarSign,
  Bus, ChevronLeft, ChevronRight, Shield, HeartPulse, Layers,
} from "lucide-react";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/" },
  { icon: GraduationCap, label: "Enrollment", path: "/enrollment" },
  { icon: Users, label: "Students", path: "/students" },
  { icon: Shield, label: "Faculty", path: "/teachers" },
  { icon: BookOpen, label: "Curriculum", path: "/subjects" },
  { icon: Layers, label: "Sections", path: "/sections" },
  { icon: ClipboardList, label: "Attendance", path: "/attendance" },
  { icon: BarChart3, label: "Grades", path: "/grades" },
  { icon: Calendar, label: "Schedule", path: "/" },
  { icon: FileText, label: "Reports", path: "/" },
  { icon: DollarSign, label: "Finance", path: "/" },
  { icon: Bus, label: "Transport", path: "/" },
  { icon: HeartPulse, label: "Health", path: "/" },
  { icon: MessageSquare, label: "Messages", path: "/" },
  { icon: Settings, label: "Settings", path: "/" },
];

const SideNavigation = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <aside
      className={`fixed left-0 top-0 z-30 flex h-screen flex-col border-r bg-card transition-all duration-300 ${
        collapsed ? "w-16" : "w-56"
      }`}
      style={{ boxShadow: "var(--shadow-widget)" }}
    >
      <div className="flex items-center gap-2 border-b px-3 py-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg gradient-primary animate-glow">
          <GraduationCap className="h-5 w-5 text-primary-foreground" />
        </div>
        {!collapsed && (
          <span className="text-xs font-bold leading-tight animate-slide-in-left">
            SFX Smart<br />Academy
          </span>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto py-3 space-y-0.5 px-2">
        {navItems.map((item, i) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className={`group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <item.icon className={`h-[18px] w-[18px] shrink-0 transition-transform duration-200 group-hover:scale-110 ${isActive ? "text-primary" : ""}`} />
              {!collapsed && <span className="truncate">{item.label}</span>}
              {isActive && !collapsed && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary animate-pulse-soft" />}
            </button>
          );
        })}
      </nav>

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
