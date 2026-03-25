import { FileText, UserPlus, ClipboardList, MessageSquare, Settings, BarChart3 } from "lucide-react";

const actions = [
  { icon: UserPlus, label: "New Enrollment", color: "text-primary" },
  { icon: FileText, label: "Generate Report", color: "text-chart-3" },
  { icon: ClipboardList, label: "Attendance Log", color: "text-accent" },
  { icon: BarChart3, label: "Analytics", color: "text-chart-4" },
  { icon: MessageSquare, label: "Announcements", color: "text-chart-5" },
  { icon: Settings, label: "Settings", color: "text-muted-foreground" },
];

const QuickActions = () => {
  return (
    <div className="glass-card overflow-hidden animate-slide-up" style={{ animationDelay: "200ms" }}>
      <div className="px-5 py-4">
        <h3 className="text-sm font-bold">Quick Actions</h3>
      </div>
      <div className="grid grid-cols-3 gap-2 px-4 pb-4">
        {actions.map((a, i) => (
          <button
            key={i}
            className="flex flex-col items-center gap-2 rounded-lg bg-secondary/40 p-3 transition-all hover:bg-secondary hover:scale-105 active:scale-95"
          >
            <a.icon className={`h-5 w-5 ${a.color}`} />
            <span className="text-[11px] font-medium text-muted-foreground">{a.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
