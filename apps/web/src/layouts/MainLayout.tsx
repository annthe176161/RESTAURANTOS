import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { 
  Users, 
  Calendar, 
  Receipt, 
  ScanLine, 
  LayoutDashboard, 
  UtensilsCrossed, 
  Menu,
  Server
} from 'lucide-react';
import { useUiStore } from '../stores/useThemeStore';

export const MainLayout: React.FC = () => {
  const { isSidebarOpen, toggleSidebar } = useUiStore();

  const navItems = [
    { label: 'Tổng quan hệ thống', path: '/', icon: LayoutDashboard },
    { label: 'Nhân viên (Employee)', path: '/employees', icon: Users },
    { label: 'Lịch làm việc (Schedule)', path: '/schedules', icon: Calendar },
    { label: 'Tài chính (Finance)', path: '/finance', icon: Receipt },
    { label: 'Bóc tách hóa đơn (OCR)', path: '/ocr', icon: ScanLine },
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
          <div className="w-10 h-10 rounded-lg bg-emerald-600 flex items-center justify-center text-white flex-shrink-0">
            <UtensilsCrossed className="w-6 h-6" />
          </div>
          {isSidebarOpen && (
            <div className="overflow-hidden">
              <h1 className="font-bold text-lg text-white leading-none">RestaurantOS</h1>
              <span className="text-xs text-emerald-400 font-medium">Microservices Web</span>
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
                      ? 'bg-emerald-600 text-white'
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

        {/* Microservices Gateway Indicator */}
        {isSidebarOpen && (
          <div className="p-4 border-t border-slate-800 text-xs text-slate-400">
            <div className="flex items-center gap-2 mb-1">
              <Server className="w-4 h-4 text-emerald-400" />
              <span className="font-medium text-slate-300">Gateway: Port 5000</span>
            </div>
            <p className="text-[11px] text-slate-500">Tất cả request được proxy qua YARP Gateway</p>
          </div>
        )}
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 focus:outline-none"
              title="Đóng / mở thanh menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-medium text-slate-600">Local Microservices Mode</span>
            </div>
          </div>
          
          <div className="text-sm text-slate-500">
            Phiên bản nền tảng: <span className="font-semibold text-slate-700">v0.1.0</span>
          </div>
        </header>

        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
