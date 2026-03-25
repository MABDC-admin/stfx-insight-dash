import { Activity, UserCheck, FileText, AlertTriangle, BookOpen } from "lucide-react";

const activities = [
  { icon: UserCheck, text: "Grade 10-A attendance submitted", time: "2 min ago", color: "text-primary" },
  { icon: FileText, text: "Quarterly report generated", time: "15 min ago", color: "text-chart-3" },
  { icon: AlertTriangle, text: "Low attendance alert: Grade 8-C", time: "32 min ago", color: "text-accent" },
  { icon: BookOpen, text: "New curriculum materials uploaded", time: "1 hr ago", color: "text-chart-4" },
  { icon: UserCheck, text: "Faculty meeting attendance logged", time: "2 hrs ago", color: "text-primary" },
];

const RecentActivity = () => {
  return (
    <div className="glass-card overflow-hidden animate-slide-up" style={{ animationDelay: "450ms" }}>
      <div className="px-5 py-4 flex items-center gap-2">
        <Activity className="h-5 w-5 text-primary" />
        <h3 className="text-sm font-bold">Recent Activity</h3>
      </div>
      <div className="space-y-0">
        {activities.map((a, i) => (
          <div key={i} className="flex items-start gap-3 px-5 py-3 transition-colors hover:bg-secondary/40">
            <a.icon className={`h-4 w-4 mt-0.5 shrink-0 ${a.color}`} />
            <div className="flex-1 min-w-0">
              <p className="text-sm">{a.text}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{a.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;
