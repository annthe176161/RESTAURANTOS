export interface Employee {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  role: string;
  hourlyRate: number;
  isActive: boolean;
  createdAtUtc: string;
}

export interface CreateEmployeeDto {
  fullName: string;
  email: string;
  phoneNumber?: string;
  role?: string;
  hourlyRate?: number;
}

export interface UpdateEmployeeDto {
  fullName: string;
  phoneNumber?: string;
  role?: string;
  hourlyRate?: number;
}

export interface EmployeeFilterParams {
  search?: string;
  role?: string;
  isActive?: boolean;
}
