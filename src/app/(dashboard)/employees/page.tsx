import { EmployeeHeader } from "@/components/employees/employee-header";
import { EmployeeList } from "@/components/employees/employee-list";
import { EmployeeStats } from "@/components/employees/employee-stats";
import type {
  Employee,
  EmployeeStats as EmployeeStatsType,
} from "@/types/employee";
import { listEmployees } from "@/lib/db/employees";

export default async function EmployeesPage({
  searchParams,
}: {
  searchParams?: { q?: string; dept?: string };
}) {
  const employees: Employee[] = await listEmployees();
  const q = (searchParams?.q ?? "").trim().toLowerCase();
  const dept = (searchParams?.dept ?? "").trim().toLowerCase();
  const filtered = employees.filter((e) => {
    const matchesQuery = q
      ? [e.name, e.email, e.position, e.department]
          .filter(Boolean)
          .some((v) => v.toLowerCase().includes(q))
      : true;
    const matchesDept =
      dept && dept !== "all" ? e.department.toLowerCase() === dept : true;
    return matchesQuery && matchesDept;
  });
  const now = new Date();
  const stats: EmployeeStatsType = {
    totalEmployees: filtered.length,
    activeEmployees: filtered.filter((e) => e.status === "active").length,
    newThisMonth: filtered.filter((e) => {
      const d = new Date(e.joinDate);
      return (
        d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
      );
    }).length,
    pendingInvites: filtered.filter((e) => e.status === "pending").length,
  };

  return (
    <div className="flex min-h-screen flex-col gap-8 p-8">
      <EmployeeHeader />
      <EmployeeStats stats={stats} />
      <EmployeeList employees={filtered} />
    </div>
  );
}
