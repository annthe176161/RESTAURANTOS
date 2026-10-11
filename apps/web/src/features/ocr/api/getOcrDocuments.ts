import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../../lib/axios';
import type { OcrDocument } from '../types';

export const useOcrDocuments = () => {
  return useQuery({
    queryKey: ['ocr-documents'],
    queryFn: async () => {
      const response = await apiClient.get<OcrDocument[]>('/api/ocr/documents');
      return response.data;
    },
  });
};
