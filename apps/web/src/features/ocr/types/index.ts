export const OcrStatus = {
  Pending: 0,
  Processed: 1,
  Failed: 2,
} as const;

export type OcrStatus = (typeof OcrStatus)[keyof typeof OcrStatus];

export interface OcrDocument {
  id: string;
  fileName: string;
  extractedText: string;
  status: OcrStatus;
  createdAtUtc: string;
}

export interface ScanReceiptDto {
  fileName: string;
  mockRawContent?: string;
}
