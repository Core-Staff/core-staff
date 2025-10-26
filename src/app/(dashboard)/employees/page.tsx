import { EmployeeHeader } from "@/components/employees/employee-header";
import { EmployeeList } from "@/components/employees/employee-list";
import { EmployeeStats } from "@/components/employees/employee-stats";
import type {
  Employee,
  EmployeeStats as EmployeeStatsType,
} from "@/types/employee";
import { listEmployees } from "@/lib/db/employees";

export default async function EmployeesPage() {
  const employees: Employee[] = await listEmployees();
  const now = new Date();
  const stats: EmployeeStatsType = {
    totalEmployees: employees.length,
    activeEmployees: employees.filter((e) => e.status === "active").length,
    newThisMonth: employees.filter((e) => {
      const d = new Date(e.joinDate);
      return (
        d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
      );
    }).length,
    pendingInvites: employees.filter((e) => e.status === "pending").length,
  };

  return (
    <div className="flex min-h-screen flex-col gap-8 p-8">
      <EmployeeHeader />
      <EmployeeStats stats={stats} />
      <EmployeeList employees={employees} />
    </div>
  );
}
