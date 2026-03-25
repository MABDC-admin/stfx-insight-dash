import { Users } from "lucide-react";

const faculty = [
  { name: "Bryan Abad", subject: "Mathematics", status: "present", initials: "BA" },
  { name: "Jasmine Andrada", subject: "English", status: "late", initials: "JA" },
  { name: "Lucia Catacutan", subject: "Mathematics", status: "present", initials: "LC" },
  { name: "Andrea Andrada", subject: "Values Education", status: "present", initials: "AA" },
  { name: "Chester Castillo", subject: "Values Education", status: "present", initials: "CC" },
  { name: "John Chua", subject: "Filipino", status: "present", initials: "JC" },
  { name: "Maria Santos", subject: "Science", status: "absent", initials: "MS" },
  { name: "Rico Dela Cruz", subject: "MAPEH", status: "present", initials: "RD" },
];

const statusColor: Record<string, string> = {
  present: "bg-primary",
  late: "bg-accent",
  absent: "bg-destructive",
};

const FacultyStatus = () => {
  return (
    <div className="glass-card overflow-hidden animate-slide-up" style={{ animationDelay: "400ms" }}>
      <div className="gradient-primary px-5 py-3 flex items-center gap-2">
        <Users className="h-5 w-5 text-primary-foreground" />
        <h3 className="text-sm font-bold text-primary-foreground">Faculty Status — Live</h3>
      </div>
      <div className="divide-y divide-border">
        {faculty.map((f, i) => (
          <div
            key={f.name}
            className="flex items-center gap-3 px-5 py-3 transition-colors hover:bg-secondary/50 animate-slide-in-left"
            style={{ animationDelay: `${500 + i * 80}ms` }}
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full gradient-primary text-xs font-bold text-primary-foreground shrink-0">
              {f.initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">{f.name}</p>
              <p className="text-xs text-muted-foreground">{f.subject}</p>
            </div>
            <span className={`h-2.5 w-2.5 rounded-full ${statusColor[f.status]} ${f.status === "late" ? "animate-pulse-soft" : ""}`} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default FacultyStatus;
