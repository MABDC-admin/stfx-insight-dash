import { Gauge } from "lucide-react";
import { useEffect, useState } from "react";

const metrics = [
  { label: "Passing Rate", value: 94, color: "hsl(160, 84%, 39%)" },
  { label: "Attendance Rate", value: 88, color: "hsl(45, 93%, 52%)" },
  { label: "Teacher Satisfaction", value: 91, color: "hsl(200, 80%, 50%)" },
  { label: "Parent Engagement", value: 76, color: "hsl(280, 65%, 55%)" },
];

const PerformanceGauge = () => {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 600);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="glass-card animate-slide-up" style={{ animationDelay: "350ms" }}>
      <div className="widget-header-5 px-5 py-3 flex items-center gap-2">
        <Gauge className="h-5 w-5 text-primary-foreground" />
        <h3 className="text-sm font-bold text-primary-foreground">Key Performance Indicators</h3>
      </div>
      <div className="space-y-5 p-5">
        {metrics.map((m, i) => (
          <div key={i}>
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-semibold">{m.label}</span>
              <span className="font-mono font-bold text-sm" style={{ color: m.color }}>
                {animated ? m.value : 0}%
              </span>
            </div>
            <div className="h-2.5 rounded-full bg-secondary overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  width: animated ? `${m.value}%` : "0%",
                  background: `linear-gradient(90deg, ${m.color}, ${m.color}cc)`,
                  transition: `width 1.2s cubic-bezier(0.16, 1, 0.3, 1) ${i * 150}ms`,
                  boxShadow: `0 0 8px ${m.color}40`,
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
