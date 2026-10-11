import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../../lib/axios';
import type { CreateShiftDto, Shift } from '../types';

export const useCreateShift = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateShiftDto) => {
      const response = await apiClient.post<Shift>('/api/schedules/shifts', payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shifts'] });
    },
  });
};

