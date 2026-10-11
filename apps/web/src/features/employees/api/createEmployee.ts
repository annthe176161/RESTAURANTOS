import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../../lib/axios';
import type { CreateEmployeeDto, Employee } from '../types';

export const useCreateEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateEmployeeDto) => {
      const response = await apiClient.post<Employee>('/api/employees', payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });
};
