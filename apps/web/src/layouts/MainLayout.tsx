import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Footer } from './components/Footer';

export const MainLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-800">
      {/* Sidebar Responsive (Desktop Collapsible & Mobile Drawer) */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">
        {/* Header Cố Định */}
        <Header />

        {/* Nội dung trang */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto">
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
