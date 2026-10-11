import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../../lib/axios';
import type { CreateInvoiceDto, Invoice } from '../types';

export const useCreateInvoice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateInvoiceDto) => {
      const response = await apiClient.post<Invoice>('/api/finance/invoices', payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
    },
  });
};
