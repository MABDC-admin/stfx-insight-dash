import { Users, GraduationCap, BookOpen, School } from "lucide-react";
import DashboardHeader from "@/components/DashboardHeader";
import AnnouncementTicker from "@/components/AnnouncementTicker";
import StatCard from "@/components/StatCard";
import AttendanceChart from "@/components/AttendanceChart";
import FacultyStatus from "@/components/FacultyStatus";
import GradeDistribution from "@/components/GradeDistribution";
import UpcomingEvents from "@/components/UpcomingEvents";
import QuickActions from "@/components/QuickActions";
import PerformanceGauge from "@/components/PerformanceGauge";
import RecentActivity from "@/components/RecentActivity";
import { useEffect } from "react";

const Index = () => {
  useEffect(() => {
    // Initialize dark mode from localStorage
    const theme = localStorage.getItem("theme");
    if (theme === "dark" || !theme) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
  }, []);

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8 transition-colors duration-300">
      <div className="mx-auto max-w-7xl space-y-5">
        <DashboardHeader />
        <AnnouncementTicker />

        {/* Stat Cards */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard icon={GraduationCap} value={1149} label="Total Learners" change={12} delay={0} />
          <StatCard icon={Users} value={61} label="Faculty & Staff" change={3} delay={100} />
          <StatCard icon={BookOpen} value={42} label="Active Sections" change={5} delay={200} />
          <StatCard icon={School} value={6} label="Grade Levels" change={0} delay={300} />
        </div>

        {/* Quick Actions */}
        <QuickActions />

        {/* Chart + Distribution */}
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <AttendanceChart />
          </div>
          <GradeDistribution />
        </div>

        {/* KPIs + Events */}
        <div className="grid gap-4 md:grid-cols-2">
          <PerformanceGauge />
          <UpcomingEvents />
        </div>

        {/* Faculty + Activity */}
        <div className="grid gap-4 md:grid-cols-2">
          <FacultyStatus />
          <RecentActivity />
        </div>

        {/* Footer */}
        <footer className="text-center text-xs text-muted-foreground py-4">
          © 2026 St. Francis Xavier Smart Academy Inc. All rights reserved.
        </footer>
      </div>
    </div>
  );
};

export default Index;
