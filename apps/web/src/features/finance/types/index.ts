export const InvoiceStatus = {
  Draft: 0,
  Paid: 1,
  Cancelled: 2,
} as const;

export type InvoiceStatus = (typeof InvoiceStatus)[keyof typeof InvoiceStatus];

export interface Invoice {
  id: string;
  invoiceNumber: string;
  totalAmount: number;
  currency: string;
  status: InvoiceStatus;
  issuedAtUtc: string;
}

export interface CreateInvoiceDto {
  invoiceNumber: string;
  totalAmount: number;
  currency?: string;
}
