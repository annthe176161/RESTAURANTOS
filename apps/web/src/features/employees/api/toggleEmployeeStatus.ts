import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../../lib/axios';

export const useToggleEmployeeStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.patch(`/api/employees/${id}/toggle-status`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });
};

