import { EmployeeHeader } from "@/components/employees/employee-header";
import { EmployeeList } from "@/components/employees/employee-list";
import { EmployeeStats } from "@/components/employees/employee-stats";
import { mockEmployees, mockEmployeeStats } from "@/lib/data/employee-data";

export default function EmployeesPage() {
  return (
    <div className="flex min-h-screen flex-col gap-8 p-8">
      <EmployeeHeader />
      
      {/* Employee Stats */}
      <EmployeeStats stats={mockEmployeeStats} />
      
      {/* Employee List */}
      <EmployeeList employees={mockEmployees} />
    </div>
  );
}