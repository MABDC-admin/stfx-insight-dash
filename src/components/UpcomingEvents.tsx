import { Calendar, Clock } from "lucide-react";

const events = [
  { title: "3rd Quarter Exams Begin", date: "Mar 28", time: "8:00 AM", type: "exam" },
  { title: "Parent-Teacher Conference", date: "Mar 30", time: "1:00 PM", type: "meeting" },
  { title: "Intramurals Opening", date: "Apr 5", time: "7:30 AM", type: "event" },
  { title: "Science Fair 2026", date: "Apr 12", time: "9:00 AM", type: "event" },
  { title: "SY 2026-2027 Enrollment", date: "Apr 15", time: "8:00 AM", type: "admin" },
];

const typeColors: Record<string, string> = {
  exam: "border-l-destructive",
  meeting: "border-l-accent",
  event: "border-l-primary",
  admin: "border-l-chart-3",
};

const UpcomingEvents = () => {
  return (
    <div className="glass-card overflow-hidden animate-slide-up" style={{ animationDelay: "600ms" }}>
      <div className="px-5 py-4 flex items-center gap-2">
        <Calendar className="h-5 w-5 text-primary" />
        <h3 className="text-sm font-bold">Upcoming Events</h3>
      </div>
      <div className="space-y-1 px-4 pb-4">
        {events.map((e, i) => (
          <div
            key={i}
            className={`flex items-center justify-between rounded-lg border-l-4 bg-secondary/40 px-4 py-3 transition-all hover:bg-secondary/70 ${typeColors[e.type]}`}
          >
            <div>
              <p className="text-sm font-semibold">{e.title}</p>
              <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {e.date}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {e.time}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UpcomingEvents;
