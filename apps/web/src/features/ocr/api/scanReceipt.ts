import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../../lib/axios';
import type { OcrDocument, ScanReceiptDto } from '../types';

export const useScanReceipt = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: ScanReceiptDto) => {
      const response = await apiClient.post<OcrDocument>('/api/ocr/scan', payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ocr-documents'] });
    },
  });
};
