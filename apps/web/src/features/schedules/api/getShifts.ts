import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../../lib/axios';
import type { Shift } from '../types';

export const useShifts = (employeeId?: string) => {
  return useQuery({
    queryKey: ['shifts', employeeId],
    queryFn: async () => {
      const url = employeeId ? `/api/schedules/shifts?employeeId=${employeeId}` : '/api/schedules/shifts';
      const response = await apiClient.get<Shift[]>(url);
      return response.data;
    },
  });
};
