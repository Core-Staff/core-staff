import { AnalyticsHeader } from "@/components/analytics/analytics-header";
import { MetricCard } from "@/components/analytics/metric-card";
import { DepartmentTable } from "@/components/analytics/department-table";
import { AttendanceTrendChart } from "@/components/analytics/attendance-trend-chart";
import { PerformanceChart } from "@/components/analytics/performance-chart";
import { TopPerformersList } from "@/components/analytics/top-performers-list";
import { LeaveRequestsTable } from "@/components/analytics/leave-requests-table";
import { RecentActivities } from "@/components/analytics/recent-activities";
import {
  metricsData,
  departmentData,
  attendanceTrends,
  performanceDistribution,
  topPerformers,
  recentLeaveRequests,
  recentActivities,
} from "@/lib/data/analytics-data";

export default function AnalyticsPage() {
  return (
    <div className="flex min-h-screen flex-col gap-8 p-8">
      <AnalyticsHeader />

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metricsData.map((metric) => (
          <MetricCard key={metric.title} {...metric} />
        ))}
      </div>

      {/* Main Content - Two Columns */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Larger Charts */}
        <div className="space-y-6 lg:col-span-2">
          <DepartmentTable data={departmentData} />
          <AttendanceTrendChart data={attendanceTrends} />
        </div>

        {/* Right Column - Performance & Top Performers */}
        <div className="space-y-6">
          <PerformanceChart data={performanceDistribution} />
          <TopPerformersList performers={topPerformers} />
        </div>
      </div>

      {/* Bottom Section - Leave Requests & Activities */}
      <div className="grid gap-6 lg:grid-cols-2">
        <LeaveRequestsTable requests={recentLeaveRequests} />
        <RecentActivities activities={recentActivities} />
      </div>
    </div>
  );
}
