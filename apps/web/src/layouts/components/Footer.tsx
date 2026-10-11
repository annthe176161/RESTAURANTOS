import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle2, Headphones, HelpCircle } from 'lucide-react';

export const Footer: React.FC = () => {
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('vi-VN', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        }) +
          ' - ' +
          now.toLocaleDateString('vi-VN')
      );
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <footer className="bg-white border-t border-slate-200/80 px-6 py-3.5 text-xs text-slate-500 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Bản quyền & Hệ thống */}
        <div className="flex items-center gap-2 text-center sm:text-left">
          <span className="font-semibold text-slate-800">RestaurantOS</span>
          <span className="text-slate-400">|</span>
          <span>Hệ thống quản lý nhà hàng chuyên nghiệp</span>
        </div>

        {/* Trạng thái, đồng hồ thời gian thực và hỗ trợ */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-slate-400">
          {currentTime && (
            <div className="flex items-center gap-1.5 font-mono text-slate-700 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100">
              <Clock className="w-3.5 h-3.5 text-emerald-600" />
              <span>{currentTime}</span>
            </div>
          )}

          <div className="flex items-center gap-1 text-emerald-700 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Hệ thống ổn định</span>
          </div>

          <button
            onClick={() => alert('Tổng đài hỗ trợ kỹ thuật RestaurantOS: 1900 xxxx (24/7)')}
            className="flex items-center gap-1 text-slate-500 hover:text-emerald-700 transition-colors"
          >
            <Headphones className="w-3.5 h-3.5" />
            <span>Hỗ trợ kỹ thuật</span>
          </button>

          <span className="flex items-center gap-1 text-slate-400">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>v0.1.0</span>
          </span>
        </div>
      </div>
    </footer>
  );
};
