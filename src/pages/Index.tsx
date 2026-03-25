import { Users, GraduationCap, BookOpen, School, Layers } from "lucide-react";
import DashboardHeader from "@/components/DashboardHeader";
import AnnouncementTicker from "@/components/AnnouncementTicker";
import StatCard from "@/components/StatCard";
import AttendanceChart from "@/components/AttendanceChart";
import FacultyStatus from "@/components/FacultyStatus";
import GradeDistribution from "@/components/GradeDistribution";
import UpcomingEvents from "@/components/UpcomingEvents";
import PerformanceGauge from "@/components/PerformanceGauge";
import RecentActivity from "@/components/RecentActivity";
import SideNavigation from "@/components/SideNavigation";
import MouseFollower from "@/components/MouseFollower";
import { useEffect } from "react";

const Index = () => {
  useEffect(() => {
    const theme = localStorage.getItem("theme");
    if (!theme) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else if (theme === "dark") {
      document.documentElement.classList.add("dark");
    }
  }, []);

  return (
    <div className="min-h-screen bg-background transition-colors duration-500">
      <MouseFollower />
      <SideNavigation />

      {/* Main content with sidebar offset */}
      <div className="pl-16 lg:pl-56 transition-all duration-300">
        <div className="p-4 md:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl space-y-5 relative z-10">
            <DashboardHeader />
            <AnnouncementTicker />

            {/* Stat Cards */}
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
              <StatCard icon={GraduationCap} value={1149} label="Total Learners" change={12} delay={0} headerColor="widget-header-1" />
              <StatCard icon={Users} value={61} label="Faculty & Staff" change={3} delay={100} headerColor="widget-header-2" />
              <StatCard icon={BookOpen} value={42} label="Active Sections" change={5} delay={200} headerColor="widget-header-3" />
              <StatCard icon={School} value={6} label="Grade Levels" change={0} delay={300} headerColor="widget-header-4" />
              <StatCard icon={Layers} value={97} label="Completion Rate" change={2} delay={400} headerColor="widget-header-5" />
            </div>

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

            <footer className="text-center text-xs text-muted-foreground py-4">
              © 2026 St. Francis Xavier Smart Academy Inc. All rights reserved.
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
