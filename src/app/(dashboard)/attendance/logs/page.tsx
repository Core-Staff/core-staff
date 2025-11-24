import { AttendanceHeader } from "@/components/attendance/attendance-header";
import { Suspense } from "react";
import { AttendanceList } from "@/components/attendance/attendance-list";
import type { AttendanceLog } from "@/types/attendance";
import { listAttendanceLogs } from "@/lib/db/attendance";

export default async function AttendanceLogsPage({
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
  const logs: AttendanceLog[] = await listAttendanceLogs({ q, dept, status });
  return (
    <div className="flex min-h-screen flex-col gap-8 p-8">
      <Suspense>
        <AttendanceHeader />
      </Suspense>
      <AttendanceList logs={logs} />
    </div>
  );
}
