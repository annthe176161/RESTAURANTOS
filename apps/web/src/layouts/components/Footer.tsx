import React, { useState, useEffect } from 'react';
import { Clock, ShieldCheck, HeartHandshake, FileCode2 } from 'lucide-react';

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
    <footer className="bg-white border-t border-slate-200/80 px-6 py-4 text-xs text-slate-500 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Bản quyền & Kiến trúc */}
        <div className="flex items-center gap-2 text-center sm:text-left">
          <span className="font-semibold text-slate-700">RestaurantOS</span>
          <span>© 2026 — Nền tảng quản lý nhà hàng Microservices</span>
        </div>

        {/* Thông tin môi trường, đồng hồ thời gian thực */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-slate-400">
          {currentTime && (
            <div className="flex items-center gap-1.5 font-mono text-slate-600 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100">
              <Clock className="w-3.5 h-3.5 text-emerald-600" />
              <span>{currentTime}</span>
            </div>
          )}

          <div className="flex items-center gap-1 text-slate-500">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>.NET 8 LTS</span>
          </div>

          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 text-slate-500 hover:text-emerald-700 transition-colors"
          >
            <FileCode2 className="w-3.5 h-3.5" />
            <span>Tài liệu API</span>
          </a>

          <span className="flex items-center gap-1 text-slate-400">
            <HeartHandshake className="w-3.5 h-3.5 text-rose-400" />
            <span>Build v0.1.0</span>
          </span>
        </div>
      </div>
    </footer>
  );
};
