import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../../lib/axios';
import type { Employee, EmployeeFilterParams } from '../types';

export const useEmployees = (filters?: EmployeeFilterParams) => {
  return useQuery({
    queryKey: ['employees', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.search) params.append('search', filters.search);
      if (filters?.role && filters.role !== 'all') params.append('role', filters.role);
      if (filters?.isActive !== undefined) params.append('isActive', String(filters.isActive));

      const queryString = params.toString();
      const url = queryString ? `/api/employees?${queryString}` : '/api/employees';

      const response = await apiClient.get<Employee[]>(url);
      return Array.isArray(response.data) ? response.data : [];
    },
  });
};
