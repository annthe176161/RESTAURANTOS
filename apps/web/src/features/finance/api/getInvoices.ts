import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../../lib/axios';
import type { Invoice } from '../types';

export const useInvoices = () => {
  return useQuery({
    queryKey: ['invoices'],
    queryFn: async () => {
      const response = await apiClient.get<Invoice[]>('/api/finance/invoices');
      return response.data;
    },
  });
};

