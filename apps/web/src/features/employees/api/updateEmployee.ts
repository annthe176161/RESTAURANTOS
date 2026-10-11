import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../../lib/axios';
import type { UpdateEmployeeDto, Employee } from '../types';

interface UpdateEmployeeParams {
  id: string;
  data: UpdateEmployeeDto;
}

export const useUpdateEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: UpdateEmployeeParams) => {
      const response = await apiClient.put<Employee>(`/api/employees/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });
};
