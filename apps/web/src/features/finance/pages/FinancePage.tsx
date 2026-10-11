import React, { useState } from 'react';
import { Receipt, PlusCircle, AlertCircle } from 'lucide-react';
import { useInvoices } from '../api/getInvoices';
import { useCreateInvoice } from '../api/createInvoice';
import { InvoiceStatus } from '../types';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge, Spinner } from '../../../components/ui/Badge';

export const FinancePage: React.FC = () => {
  const { data: invoices, isLoading, isError } = useInvoices();
  const createInvoiceMutation = useCreateInvoice();

  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [totalAmount, setTotalAmount] = useState<number>(150000);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!invoiceNumber || totalAmount <= 0) return;

    createInvoiceMutation.mutate(
      { invoiceNumber, totalAmount, currency: 'VND' },
      {
        onSuccess: () => {
          setInvoiceNumber('');
          setTotalAmount(150000);
        },
      }
    );
  };

  const getStatusBadge = (status: InvoiceStatus) => {
    switch (status) {
      case InvoiceStatus.Paid:
        return <Badge variant="success">Đã thanh toán</Badge>;
      case InvoiceStatus.Cancelled:
        return <Badge variant="danger">Đã hủy</Badge>;
      default:
        return <Badge variant="warning">Chờ thanh toán (Draft)</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Quản Lý Tài Chính & Hóa Đơn</h2>
        <p className="text-sm text-slate-500">
          Dữ liệu sở hữu độc quyền bởi <strong className="text-emerald-700">Finance Service (Port 5003)</strong>
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 h-fit">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
            <PlusCircle className="w-5 h-5 text-emerald-600" />
            <h3 className="font-semibold text-slate-900">Tạo hóa đơn thu tiền</h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Số hóa đơn / Mã phiếu</label>
              <input
                type="text"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                placeholder="VD: INV-2026-001"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Số tiền (VNĐ)</label>
              <input
                type="number"
                value={totalAmount}
                onChange={(e) => setTotalAmount(Number(e.target.value))}
                min="1000"
                step="1000"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              isLoading={createInvoiceMutation.isPending}
            >
              Ghi nhận hóa đơn
            </Button>
          </form>
        </Card>

        <Card className="lg:col-span-2">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
            <Receipt className="w-5 h-5 text-emerald-600" />
            <h3 className="font-semibold text-slate-900">Danh sách hóa đơn</h3>
          </div>

          {isLoading ? (
            <Spinner />
          ) : isError ? (
            <div className="p-6 text-center text-slate-500">
              <AlertCircle className="w-8 h-8 text-rose-500 mx-auto mb-2" />
              <p className="text-sm font-medium text-rose-600">Không thể kết nối đến Finance Service</p>
            </div>
          ) : !invoices || invoices.length === 0 ? (
            <div className="text-center py-10 text-slate-400">
              Chưa có hóa đơn nào trong hệ thống.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 text-xs">
                    <th className="pb-3 font-medium">Mã hóa đơn</th>
                    <th className="pb-3 font-medium">Tổng tiền</th>
                    <th className="pb-3 font-medium">Thời gian</th>
                    <th className="pb-3 font-medium">Trạng thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {invoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-slate-50/50">
                      <td className="py-3 font-mono font-medium text-slate-800">{inv.invoiceNumber}</td>
                      <td className="py-3 font-semibold text-emerald-600">
                        {inv.totalAmount.toLocaleString('vi-VN')} {inv.currency}
                      </td>
                      <td className="py-3 text-xs text-slate-500">
                        {new Date(inv.issuedAtUtc).toLocaleDateString()}
                      </td>
                      <td className="py-3">{getStatusBadge(inv.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
