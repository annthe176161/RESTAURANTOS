import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Users, 
  Calendar, 
  Receipt, 
  ScanLine, 
  LayoutDashboard, 
  UtensilsCrossed, 
  Store,
  X
} from 'lucide-react';
import { useUiStore } from '../../stores/useThemeStore';

export const Sidebar: React.FC = () => {
  const { 
    isSidebarOpen, 
    isMobileSidebarOpen, 
    closeMobileSidebar 
  } = useUiStore();
  
  const location = useLocation();

  const navItems = [
    { label: 'Tổng quan', path: '/', icon: LayoutDashboard },
    { label: 'Quản lý nhân viên', path: '/employees', icon: Users },
    { label: 'Lịch làm & Ca trực', path: '/schedules', icon: Calendar },
    { label: 'Tài chính & Hóa đơn', path: '/finance', icon: Receipt },
    { label: 'Bóc tách chứng từ', path: '/ocr', icon: ScanLine },
  ];

  return (
    <>
      {/* ========================================================= */}
      {/* 1. MOBILE BACKDROP & DRAWER (Màn hình nhỏ < 768px)       */}
      {/* ========================================================= */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-40 md:hidden transition-opacity duration-300"
          onClick={closeMobileSidebar}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 w-72 bg-slate-900 text-slate-200 z-50 flex flex-col shadow-2xl md:hidden transform transition-transform duration-300 ease-in-out ${
          isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header Drawer Mobile */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold text-base text-white leading-none">RestaurantOS</h1>
              <span className="text-[11px] text-emerald-400 font-medium">Quản lý nhà hàng</span>
            </div>
          </div>
          <button
            onClick={closeMobileSidebar}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Menu Items Mobile */}
        <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={closeMobileSidebar}
                className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Footer Mobile */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/40 text-xs text-slate-400">
          <div className="flex items-center gap-2 mb-1">
            <Store className="w-4 h-4 text-emerald-400" />
            <span className="font-medium text-slate-300">Cơ sở: Chi nhánh chính</span>
          </div>
          <p className="text-[11px] text-slate-500">Giờ phục vụ: 08:00 - 23:00</p>
        </div>
      </aside>

      {/* ========================================================= */}
      {/* 2. DESKTOP SIDEBAR (Màn hình >= 768px)                     */}
      {/* ========================================================= */}
      <aside
        className={`hidden md:flex flex-col flex-shrink-0 bg-slate-900 text-slate-200 transition-[width] duration-300 ease-in-out relative z-20 border-r border-slate-800/60 ${
          isSidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        {/* Logo & Brand Header */}
        <div className="h-16 flex items-center border-b border-slate-800/80 px-4 overflow-hidden">
          <div className="flex items-center gap-3 w-full">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white flex-shrink-0 shadow-md">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            
            <div
              className={`flex flex-col transition-all duration-200 overflow-hidden ${
                isSidebarOpen ? 'opacity-100 max-w-[160px]' : 'opacity-0 max-w-0 pointer-events-none'
              }`}
            >
              <h1 className="font-bold text-base text-white leading-tight truncate">RestaurantOS</h1>
              <span className="text-[11px] text-emerald-400 font-medium truncate">Quản Lý Nhà Hàng</span>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto overflow-x-hidden">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <div key={item.path} className="relative group">
                <NavLink
                  to={item.path}
                  className={`flex items-center rounded-xl text-sm font-medium transition-all ${
                    isSidebarOpen ? 'px-3.5 py-2.5 gap-3' : 'px-0 py-2.5 justify-center'
                  } ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  
                  {/* Text nhãn: mượt mà khi thu nhỏ, không giật layout */}
                  <span
                    className={`whitespace-nowrap transition-all duration-200 overflow-hidden ${
                      isSidebarOpen ? 'opacity-100 max-w-[160px]' : 'opacity-0 max-w-0 pointer-events-none'
                    }`}
                  >
                    {item.label}
                  </span>
                </NavLink>

                {/* Floating Tooltip khi Sidebar đang thu nhỏ */}
                {!isSidebarOpen && (
                  <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-1.5 bg-slate-800 text-white text-xs font-medium rounded-lg shadow-xl border border-slate-700 whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity z-50">
                    {item.label}
                    {/* Mũi tên tooltip nhỏ */}
                    <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-slate-800" />
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Footer Sidebar (Thông tin chi nhánh) */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/40 overflow-hidden">
          {isSidebarOpen ? (
            <div className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg bg-slate-900/60 border border-slate-800/80">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center flex-shrink-0">
                <Store className="w-4 h-4" />
              </div>
              <div className="overflow-hidden">
                <div className="text-xs font-medium text-slate-200 truncate">Chi nhánh chính</div>
                <div className="text-[10px] text-slate-500 truncate">Mở cửa: 08:00 - 23:00</div>
              </div>
            </div>
          ) : (
            <div className="flex justify-center group relative py-1">
              <div className="w-9 h-9 rounded-lg bg-slate-800 text-emerald-400 flex items-center justify-center cursor-default">
                <Store className="w-4 h-4" />
              </div>
              {/* Tooltip khi hover icon chi nhánh */}
              <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-1.5 bg-slate-800 text-white text-xs font-medium rounded-lg shadow-xl border border-slate-700 whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50">
                Chi nhánh chính (08:00 - 23:00)
                <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-slate-800" />
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
