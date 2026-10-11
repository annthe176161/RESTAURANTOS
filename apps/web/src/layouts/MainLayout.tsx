import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { 
  Users, 
  Calendar, 
  Receipt, 
  ScanLine, 
  LayoutDashboard, 
  UtensilsCrossed, 
  Store
} from 'lucide-react';
import { useUiStore } from '../stores/useThemeStore';
import { Header } from './components/Header';
import { Footer } from './components/Footer';

export const MainLayout: React.FC = () => {
  const { isSidebarOpen } = useUiStore();

  const navItems = [
    { label: 'Tổng quan', path: '/', icon: LayoutDashboard },
    { label: 'Quản lý nhân viên', path: '/employees', icon: Users },
    { label: 'Lịch làm & Ca trực', path: '/schedules', icon: Calendar },
    { label: 'Tài chính & Hóa đơn', path: '/finance', icon: Receipt },
    { label: 'Bóc tách chứng từ', path: '/ocr', icon: ScanLine },
  ];

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-800">
      {/* Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? 'w-64' : 'w-20'
        } bg-slate-900 text-slate-200 transition-all duration-300 flex flex-col flex-shrink-0 z-20`}
      >
        <div className="h-16 flex items-center px-4 border-b border-slate-800 gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-600 flex items-center justify-center text-white flex-shrink-0 shadow-sm">
            <UtensilsCrossed className="w-6 h-6" />
          </div>
          {isSidebarOpen && (
            <div className="overflow-hidden">
              <h1 className="font-bold text-lg text-white leading-none">RestaurantOS</h1>
              <span className="text-xs text-emerald-400 font-medium">Quản Lý Nhà Hàng</span>
            </div>
          )}
        </div>

        <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`
                }
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {isSidebarOpen && <span>{item.label}</span>}
              </NavLink>
            );
          })}
        </nav>

        {/* Thông tin cơ sở / chi nhánh nhà hàng */}
        {isSidebarOpen && (
          <div className="p-4 border-t border-slate-800 text-xs text-slate-400 bg-slate-950/40">
            <div className="flex items-center gap-2 mb-1">
              <Store className="w-4 h-4 text-emerald-400" />
              <span className="font-medium text-slate-300">Cơ sở: Chi nhánh chính</span>
            </div>
            <p className="text-[11px] text-slate-500">Giờ phục vụ: 11:00 - 22:30 hàng ngày</p>
          </div>
        )}
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <Header />

        {/* Nội dung trang */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};
