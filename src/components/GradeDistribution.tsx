import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { PieChart } from "lucide-react";

const data = [
  { grade: "Grade 7", students: 195 },
  { grade: "Grade 8", students: 210 },
  { grade: "Grade 9", students: 188 },
  { grade: "Grade 10", students: 205 },
  { grade: "Grade 11", students: 178 },
  { grade: "Grade 12", students: 173 },
];

const colors = [
  "hsl(160, 84%, 39%)",
  "hsl(170, 80%, 42%)",
  "hsl(200, 80%, 50%)",
  "hsl(45, 93%, 52%)",
  "hsl(280, 65%, 55%)",
  "hsl(340, 75%, 50%)",
];

const GradeDistribution = () => {
  return (
    <div className="glass-card animate-slide-up" style={{ animationDelay: "500ms" }}>
      <div className="widget-header-2 px-5 py-3 flex items-center gap-2">
        <PieChart className="h-5 w-5 text-primary-foreground" />
        <h3 className="text-sm font-bold text-primary-foreground">Enrollment by Grade Level</h3>
      </div>
      <div className="px-4 pb-4 pt-4">
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data}>
            <XAxis
              dataKey="grade"
              tick={{ fontSize: 10, fill: "hsl(220, 10%, 55%)" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis hide />
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
            <Bar dataKey="students" radius={[8, 8, 0, 0]} animationDuration={1200} animationEasing="ease-out">
              {data.map((_, i) => (
                <Cell key={i} fill={colors[i]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default GradeDistribution;
