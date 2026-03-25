import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { TrendingUp } from "lucide-react";

const data = [
  { date: "Feb 6", present: 1065, target: 1080 },
  { date: "Feb 7", present: 1058, target: 1080 },
  { date: "Feb 10", present: 1082, target: 1080 },
  { date: "Feb 11", present: 1085, target: 1080 },
  { date: "Feb 12", present: 1072, target: 1080 },
  { date: "Feb 13", present: 1060, target: 1080 },
  { date: "Feb 14", present: 1078, target: 1080 },
  { date: "Feb 17", present: 1080, target: 1080 },
  { date: "Feb 18", present: 1068, target: 1080 },
  { date: "Feb 19", present: 1075, target: 1080 },
  { date: "Feb 20", present: 1082, target: 1080 },
  { date: "Feb 21", present: 1080, target: 1080 },
  { date: "Feb 24", present: 1065, target: 1080 },
  { date: "Feb 25", present: 1060, target: 1080 },
];

const AttendanceChart = () => {
  return (
    <div className="glass-card animate-slide-up" style={{ animationDelay: "300ms" }}>
      <div className="widget-header-1 px-5 py-3 flex items-center gap-2">
        <TrendingUp className="h-5 w-5 text-primary-foreground" />
        <h3 className="text-sm font-bold text-primary-foreground">
          Daily Attendance Trend — SY 2025–2026
        </h3>
      </div>
      <div className="p-4 pt-6">
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="attendanceGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0.35} />
                <stop offset="100%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="targetGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(200, 80%, 50%)" stopOpacity={0.15} />
                <stop offset="100%" stopColor="hsl(200, 80%, 50%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 30%)" opacity={0.2} />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: "hsl(220, 10%, 55%)" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              domain={[1050, 1095]}
              tick={{ fontSize: 11, fill: "hsl(220, 10%, 55%)" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(220, 20%, 15%)",
                border: "1px solid hsl(220, 15%, 25%)",
                borderRadius: "10px",
                fontSize: "12px",
                color: "hsl(210, 20%, 92%)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
              }}
            />
            <Area
              type="monotone"
              dataKey="target"
              stroke="hsl(200, 80%, 50%)"
              strokeWidth={2}
              fill="url(#targetGrad)"
              dot={false}
              strokeDasharray="5 5"
            />
            <Area
              type="monotone"
              dataKey="present"
              stroke="hsl(60, 90%, 55%)"
              strokeWidth={2.5}
              fill="url(#attendanceGrad)"
              dot={{ r: 3, fill: "hsl(60, 90%, 55%)", strokeWidth: 0 }}
              activeDot={{ r: 6, fill: "hsl(60, 90%, 55%)", stroke: "hsl(60, 90%, 80%)", strokeWidth: 2 }}
              animationDuration={1500}
              animationEasing="ease-out"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AttendanceChart;
