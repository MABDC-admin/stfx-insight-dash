import { Zap, UserCheck, FileText, AlertTriangle, BookOpen } from "lucide-react";

const activities = [
  { icon: UserCheck, text: "Grade 10-A attendance submitted", time: "2 min ago", color: "text-primary" },
  { icon: FileText, text: "Quarterly report generated", time: "15 min ago", color: "text-chart-3" },
  { icon: AlertTriangle, text: "Low attendance alert: Grade 8-C", time: "32 min ago", color: "text-accent" },
  { icon: BookOpen, text: "New curriculum materials uploaded", time: "1 hr ago", color: "text-chart-4" },
  { icon: UserCheck, text: "Faculty meeting attendance logged", time: "2 hrs ago", color: "text-primary" },
];

const RecentActivity = () => {
  return (
    <div className="glass-card animate-slide-up" style={{ animationDelay: "450ms" }}>
      <div className="widget-header-2 px-5 py-3 flex items-center gap-2">
        <Zap className="h-5 w-5 text-primary-foreground" />
        <h3 className="text-sm font-bold text-primary-foreground">Recent Activity</h3>
      </div>
      <div className="divide-y divide-border/50">
        {activities.map((a, i) => (
          <div
            key={i}
            className="flex items-start gap-3 px-5 py-3.5 transition-all duration-200 hover:bg-secondary/40 hover:translate-x-1 animate-slide-in-left"
            style={{ animationDelay: `${600 + i * 100}ms` }}
          >
            <div className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-secondary ${a.color}`}>
              <a.icon className="h-3.5 w-3.5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">{a.text}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{a.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;
