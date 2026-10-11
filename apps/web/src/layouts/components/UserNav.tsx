import React, { useState, useRef, useEffect } from 'react';
import { User, Settings, LogOut, ChevronDown, HelpCircle } from 'lucide-react';

export const UserNav: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-slate-100 transition-colors focus:outline-none"
      >
        <div className="w-9 h-9 rounded-full bg-emerald-600 text-white font-bold text-sm flex items-center justify-center ring-2 ring-emerald-100">
          QL
        </div>
        <div className="text-left hidden md:block">
          <div className="text-xs font-semibold text-slate-800 leading-tight">Quản Lý Nhà Hàng</div>
          <div className="text-[11px] text-slate-500">manager@restaurantos.vn</div>
        </div>
        <ChevronDown className="w-4 h-4 text-slate-400 hidden sm:block" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white shadow-xl ring-1 ring-slate-900/5 z-50 overflow-hidden border border-slate-100 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/60 md:hidden">
            <p className="text-xs font-semibold text-slate-800">Quản Lý Nhà Hàng</p>
            <p className="text-[11px] text-slate-500">manager@restaurantos.vn</p>
          </div>

          <div className="py-1">
            <button
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-emerald-700 transition-colors"
            >
              <User className="w-4 h-4 text-slate-400" />
              Thông tin tài khoản
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-emerald-700 transition-colors"
            >
              <Settings className="w-4 h-4 text-slate-400" />
              Cài đặt nhà hàng
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-emerald-700 transition-colors"
            >
              <HelpCircle className="w-4 h-4 text-slate-400" />
              Hướng dẫn sử dụng
            </button>
          </div>

          <div className="border-t border-slate-100 py-1">
            <button
              onClick={() => {
                setIsOpen(false);
                alert('Tính năng đăng xuất');
              }}
              className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 transition-colors font-medium"
            >
              <LogOut className="w-4 h-4 text-rose-500" />
              Đăng xuất
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
