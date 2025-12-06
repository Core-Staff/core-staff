import { LeaveRequestsTable } from "@/components/analytics/leave-requests-table";
import { listLeaveRequests } from "@/lib/data/leave-requests";
import { LeaveRequest } from "@/types/leaveRequest";

export default async function LeaveRequestsPage() {
  let requests: LeaveRequest[] = [];
  try {
    requests = await listLeaveRequests();
  } catch (err) {
    // keep the page rendering even if the fetch fails
    console.error("Failed to load leave requests:", err);
    requests = [];
  }

  return (
    <div className="flex min-h-screen flex-col gap-8 p-8">
      <div className="grid gap-6 lg:grid-cols-1">
        <LeaveRequestsTable requests={requests} />
      </div>
    </div>
  );
}
