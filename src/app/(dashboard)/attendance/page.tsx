import { AttendanceHeader } from "@/components/attendance/attendance-header";
import { Suspense } from "react";
import { AttendanceList } from "@/components/attendance/attendance-list";
import { AttendanceStats } from "@/components/attendance/attendance-stats";
import type {
  AttendanceLog,
  AttendanceStats as AttendanceStatsType,
} from "@/types/attendance";
import { listAttendanceLogs } from "@/lib/db/attendance";

export default async function AttendancePage({
  searchParams,
}: {
  searchParams?: Promise<{
    q?: string;
    dept?: string;
    status?: "open" | "closed";
  }>;
}) {
  const sp = (await searchParams) ?? {};
  const q = (sp.q ?? "").trim();
  const dept = (sp.dept ?? "").trim();
  const status = sp.status;
  let logs: AttendanceLog[] = [];
  try {
    logs = await listAttendanceLogs({ q, dept, status });
  } catch {
    logs = [];
  }
  const now = new Date();
  const stats: AttendanceStatsType = {
    openNow: logs.filter((l) => l.status === "open").length,
    todayLogs: logs.filter((l) => {
      const d = new Date(l.clockIn);
      return (
        d.getDate() === now.getDate() &&
        d.getMonth() === now.getMonth() &&
        d.getFullYear() === now.getFullYear()
      );
    }).length,
    avgDurationMinutes: Math.round(
      logs
        .filter((l) => l.clockOut)
        .map(
          (l) =>
            (new Date(l.clockOut as string).getTime() -
              new Date(l.clockIn).getTime()) /
            60000,
        )
        .reduce((a, b) => a + b, 0) /
        Math.max(1, logs.filter((l) => l.clockOut).length),
    ),
  };

  return (
    <div className="flex min-h-screen flex-col gap-8 p-8">
      <Suspense>
        <AttendanceHeader />
      </Suspense>
      <AttendanceStats stats={stats} />
      <AttendanceList logs={logs} />
    </div>
  );
}
