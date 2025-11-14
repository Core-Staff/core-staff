export interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  position: string;
  status: "active" | "inactive";
  avatar?: string;
  joinDate: string;
  phone?: string;
  location?: string;
}

export interface EmployeeStats {
  totalEmployees: number;
  activeEmployees: number;
  newThisMonth: number;
}
