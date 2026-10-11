export interface Employee {
  id: string;
  fullName: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAtUtc: string;
}

export interface CreateEmployeeDto {
  fullName: string;
  email: string;
  role?: string;
}
