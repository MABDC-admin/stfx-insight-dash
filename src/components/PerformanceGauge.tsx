import { Target } from "lucide-react";

const metrics = [
  { label: "Passing Rate", value: 94, color: "hsl(160, 84%, 39%)" },
  { label: "Attendance Rate", value: 88, color: "hsl(45, 93%, 58%)" },
  { label: "Teacher Satisfaction", value: 91, color: "hsl(200, 80%, 55%)" },
  { label: "Parent Engagement", value: 76, color: "hsl(280, 65%, 60%)" },
];

const PerformanceGauge = () => {
  return (
    <div className="glass-card overflow-hidden animate-slide-up" style={{ animationDelay: "350ms" }}>
      <div className="px-5 py-4 flex items-center gap-2">
        <Target className="h-5 w-5 text-primary" />
        <h3 className="text-sm font-bold">Key Performance Indicators</h3>
      </div>
      <div className="space-y-4 px-5 pb-5">
        {metrics.map((m, i) => (
          <div key={i}>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-medium">{m.label}</span>
              <span className="font-mono font-bold" style={{ color: m.color }}>
                {m.value}%
              </span>
            </div>
            <div className="h-2 rounded-full bg-secondary overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-1000 ease-out"
                style={{
                  width: `${m.value}%`,
                  background: `linear-gradient(90deg, ${m.color}, ${m.color}dd)`,
                  animation: "slide-in-left 1s ease-out both",
                  animationDelay: `${600 + i * 150}ms`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PerformanceGauge;
