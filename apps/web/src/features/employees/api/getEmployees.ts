import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../../lib/axios';
import type { Employee } from '../types';

export const useEmployees = () => {
  return useQuery({
    queryKey: ['employees'],
    queryFn: async () => {
      const response = await apiClient.get<Employee[]>('/api/employees');
      return response.data;
    },
  });
};
