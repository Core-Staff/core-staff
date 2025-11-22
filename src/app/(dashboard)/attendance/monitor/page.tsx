import { AttendanceHeader } from "@/components/attendance/attendance-header";
import { AttendanceList } from "@/components/attendance/attendance-list";
import type { AttendanceLog } from "@/types/attendance";
import { listAttendanceLogs } from "@/lib/db/attendance";

export default async function AttendanceMonitorPage() {
  const logs: AttendanceLog[] = await listAttendanceLogs({ status: "open" });
  return (
    <div className="flex min-h-screen flex-col gap-8 p-8">
      <AttendanceHeader />
      <AttendanceList logs={logs} />
    </div>
  );
}
