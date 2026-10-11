import React, { useState } from 'react';
import { Menu, Search, Plus, Users, Calendar, Receipt, ScanLine } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useUiStore } from '../../stores/useThemeStore';
import { NotificationsDropdown } from './NotificationsDropdown';
import { UserNav } from './UserNav';

export const Header: React.FC = () => {
  const { toggleSidebar } = useUiStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [isQuickCreateOpen, setIsQuickCreateOpen] = useState(false);

  return (
    <header className="h-16 bg-white border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)]">
      {/* Khối bên trái: Nút Toggle Menu & Ô Tìm Kiếm Nhanh */}
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors focus:outline-none"
          title="Đóng / mở thanh điều hướng"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="relative w-full max-w-md hidden sm:block">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm nhân viên, ca trực, hóa đơn..."
            className="w-full pl-9 pr-14 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-0.5 pointer-events-none">
            <kbd className="px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 bg-white border border-slate-200 rounded shadow-xs">
              ⌘K
            </kbd>
          </div>
        </div>
      </div>

      {/* Khối bên phải: Trạng thái hệ thống, Tạo nhanh, Chuông thông báo, User Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* System Online Status */}
        <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-medium text-[11px] text-emerald-800">Hệ thống sẵn sàng</span>
        </div>

        {/* Nút Tạo Nhanh (Quick Actions) */}
        <div className="relative">
          <button
            onClick={() => setIsQuickCreateOpen(!isQuickCreateOpen)}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Tạo mới</span>
          </button>

          {isQuickCreateOpen && (
            <div
              className="absolute right-0 mt-2 w-48 rounded-xl bg-white shadow-xl ring-1 ring-slate-900/5 z-50 overflow-hidden border border-slate-100 py-1"
              onMouseLeave={() => setIsQuickCreateOpen(false)}
            >
              <Link
                to="/employees"
                onClick={() => setIsQuickCreateOpen(false)}
                className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-emerald-700"
              >
                <Users className="w-4 h-4 text-slate-400" />
                Thêm nhân viên
              </Link>
              <Link
                to="/schedules"
                onClick={() => setIsQuickCreateOpen(false)}
                className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-emerald-700"
              >
                <Calendar className="w-4 h-4 text-slate-400" />
                Xếp ca làm việc
              </Link>
              <Link
                to="/finance"
                onClick={() => setIsQuickCreateOpen(false)}
                className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-emerald-700"
              >
                <Receipt className="w-4 h-4 text-slate-400" />
                Tạo hóa đơn thu tiền
              </Link>
              <Link
                to="/ocr"
                onClick={() => setIsQuickCreateOpen(false)}
                className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-emerald-700"
              >
                <ScanLine className="w-4 h-4 text-slate-400" />
                Quét hóa đơn tự động
              </Link>
            </div>
          )}
        </div>

        {/* Chuông Thông Báo */}
        <NotificationsDropdown />

        {/* Đường phân cách */}
        <div className="h-6 w-[1px] bg-slate-200 mx-1 hidden sm:block" />

        {/* User Profile */}
        <UserNav />
      </div>
    </header>
  );
};
