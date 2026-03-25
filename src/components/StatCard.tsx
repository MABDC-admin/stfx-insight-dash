import { ArrowUpRight, ArrowDownRight, type LucideIcon } from "lucide-react";
import { useEffect, useState, useRef } from "react";

interface StatCardProps {
  icon: LucideIcon;
  value: number;
  label: string;
  change: number;
  delay?: number;
  headerColor?: string;
}

const StatCard = ({ icon: Icon, value, label, change, delay = 0, headerColor = "widget-header-1" }: StatCardProps) => {
  const [displayValue, setDisplayValue] = useState(0);
  const [bouncing, setBouncing] = useState(false);
  const prevValue = useRef(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const duration = 1400;
      const steps = 50;
      const increment = value / steps;
      let current = 0;
      const interval = setInterval(() => {
        current += increment;
        if (current >= value) {
          setDisplayValue(value);
          clearInterval(interval);
          setBouncing(true);
          setTimeout(() => setBouncing(false), 400);
        } else {
          setDisplayValue(Math.floor(current));
        }
      }, duration / steps);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timeout);
  }, [value, delay]);

  const isPositive = change >= 0;

  return (
    <div className="glass-card animate-slide-up" style={{ animationDelay: `${delay}ms` }}>
      <div className={`${headerColor} px-4 py-2 flex items-center gap-2`}>
        <Icon className="h-4 w-4 text-primary-foreground" />
        <span className="text-xs font-semibold text-primary-foreground uppercase tracking-wider">{label}</span>
      </div>
      <div className="p-5">
        <div className="flex items-end justify-between">
          <p className={`text-4xl font-black tracking-tight font-mono transition-transform ${bouncing ? "counter-bounce" : ""}`}>
            {displayValue.toLocaleString()}
          </p>
          <div
            className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${
              isPositive
                ? "bg-primary/10 text-primary"
                : "bg-destructive/10 text-destructive"
            }`}
          >
            {isPositive ? (
              <ArrowUpRight className="h-3.5 w-3.5" />
            ) : (
              <ArrowDownRight className="h-3.5 w-3.5" />
            )}
            {isPositive ? "+" : ""}{change}%
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
