export interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  position: string;
  status: "active" | "inactive" | "pending";
  avatar?: string;
  joinDate: string;
  phone?: string;
  location?: string;
}

export interface EmployeeStats {
  totalEmployees: number;
  activeEmployees: number;
  newThisMonth: number;
  pendingInvites: number;
}

export interface InviteEmployeeData {
  email: string;
  firstName: string;
  lastName: string;
  department: string;
  position: string;
  message?: string;
}
