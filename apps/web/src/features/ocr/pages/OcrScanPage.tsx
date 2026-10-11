import React, { useState } from 'react';
import { ScanLine, UploadCloud, CheckCircle2, AlertCircle } from 'lucide-react';
import { useOcrDocuments } from '../api/getOcrDocuments';
import { useScanReceipt } from '../api/scanReceipt';
import { OcrStatus } from '../types';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge, Spinner } from '../../../components/ui/Badge';

export const OcrScanPage: React.FC = () => {
  const { data: documents, isLoading, isError } = useOcrDocuments();
  const scanMutation = useScanReceipt();

  const [fileName, setFileName] = useState('hoa_don_nhap_thit_bo.jpg');
  const [sampleContent, setSampleContent] = useState('HÓA ĐƠN NHẬP NGUYÊN LIỆU\nMặt hàng: Thịt bò Wagyu 5kg\nTổng tiền: 2,500,000 VND');

  const handleScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileName) return;

    scanMutation.mutate({
      fileName,
      mockRawContent: sampleContent,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Bóc Tách Hóa Đơn AI (OCR Service)</h2>
        <p className="text-sm text-slate-500">
          Trích xuất dữ liệu thô độc lập bởi <strong className="text-emerald-700">OCR Service (Port 5004)</strong>
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 h-fit">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
            <UploadCloud className="w-5 h-5 text-emerald-600" />
            <h3 className="font-semibold text-slate-900">Mô phỏng tải ảnh hóa đơn</h3>
          </div>

          <form onSubmit={handleScan} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Tên tệp ảnh</label>
              <input
                type="text"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                placeholder="bill_01.jpg"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Văn bản mô phỏng bóc tách</label>
              <textarea
                value={sampleContent}
                onChange={(e) => setSampleContent(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Nguyên tắc Human-in-the-loop: Dữ liệu OCR lưu tạm, người dùng duyệt rồi mới tạo hóa đơn chính thức.
              </p>
            </div>

            <Button
              type="submit"
              className="w-full"
              isLoading={scanMutation.isPending}
            >
              Gửi quét hóa đơn
            </Button>
          </form>
        </Card>

        <Card className="lg:col-span-2">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
            <ScanLine className="w-5 h-5 text-emerald-600" />
            <h3 className="font-semibold text-slate-900">Lịch sử bóc tách chứng từ</h3>
          </div>

          {isLoading ? (
            <Spinner />
          ) : isError ? (
            <div className="p-6 text-center text-slate-500">
              <AlertCircle className="w-8 h-8 text-rose-500 mx-auto mb-2" />
              <p className="text-sm font-medium text-rose-600">Không thể kết nối đến OCR Service</p>
            </div>
          ) : !documents || documents.length === 0 ? (
            <div className="text-center py-10 text-slate-400">
              Chưa có tài liệu bóc tách nào. Hãy thử tải lên hóa đơn mẫu!
            </div>
          ) : (
            <div className="space-y-4">
              {documents.map((doc) => (
                <div key={doc.id} className="p-4 rounded-lg border border-slate-200/80 bg-slate-50/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-medium text-sm text-slate-800">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      {doc.fileName}
                    </div>
                    <Badge variant={doc.status === OcrStatus.Processed ? 'success' : 'warning'}>
                      {doc.status === OcrStatus.Processed ? 'Đã bóc tách' : 'Chờ xử lý'}
                    </Badge>
                  </div>
                  <pre className="text-xs bg-white p-3 rounded border border-slate-200 text-slate-700 whitespace-pre-wrap font-mono">
                    {doc.extractedText || 'Chưa có nội dung'}
                  </pre>
                  <div className="text-[11px] text-slate-400">
                    Thời gian: {new Date(doc.createdAtUtc).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
