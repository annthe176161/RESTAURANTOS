import React from 'react';
import { useRouteError, isRouteErrorResponse, useNavigate } from 'react-router-dom';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';
import { Button } from '../ui/Button';

export const RouteErrorBoundary: React.FC = () => {
  const error = useRouteError();
  const navigate = useNavigate();

  let errorMessage = 'Đã xảy ra lỗi không mong muốn khi tải trang.';
  let errorStatus = 500;

  if (isRouteErrorResponse(error)) {
    errorStatus = error.status;
    errorMessage = error.statusText || error.data?.message || errorMessage;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center">
        <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-rose-100">
          <AlertTriangle className="w-7 h-7" />
        </div>

        <span className="text-xs font-bold text-rose-600 tracking-wider uppercase bg-rose-50 px-2.5 py-1 rounded-full">
          Mã lỗi: {errorStatus}
        </span>

        <h2 className="text-xl font-bold text-slate-800 mt-3 mb-2">Không thể tải nội dung</h2>
        <p className="text-xs text-slate-500 mb-6 leading-relaxed">
          {errorMessage}
        </p>

        <div className="flex gap-3 justify-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.location.reload()}
            className="flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Tải lại trang
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/')}
            className="flex items-center gap-1.5"
          >
            <Home className="w-3.5 h-3.5" />
            Về trang chủ
          </Button>
        </div>
      </div>
    </div>
  );
};

