import { AttendanceHeader } from "@/components/attendance/attendance-header";
import { Suspense } from "react";
import { AttendanceList } from "@/components/attendance/attendance-list";
import type { AttendanceLog } from "@/types/attendance";
import { listAttendanceLogs } from "@/lib/db/attendance";

export default async function AttendanceMonitorPage() {
  let logs: AttendanceLog[] = [];
  try {
    logs = await listAttendanceLogs({ status: "open" });
  } catch {
    logs = [];
  }
  return (
    <div className="flex min-h-screen flex-col gap-8 p-8">
      <Suspense>
        <AttendanceHeader />
      </Suspense>
      <AttendanceList logs={logs} />
    </div>
  );
}
