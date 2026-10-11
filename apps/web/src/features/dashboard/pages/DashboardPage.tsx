import React from 'react';
import { Server, Users, Calendar, Receipt, ScanLine, ShieldCheck } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { useEmployees } from '../../employees/api/getEmployees';
import { useShifts } from '../../schedules/api/getShifts';
import { useInvoices } from '../../finance/api/getInvoices';
import { useOcrDocuments } from '../../ocr/api/getOcrDocuments';

export const DashboardPage: React.FC = () => {
  const { data: employees, isSuccess: empSuccess } = useEmployees();
  const { data: shifts, isSuccess: shiftSuccess } = useShifts();
  const { data: invoices, isSuccess: finSuccess } = useInvoices();
  const { data: ocrDocs, isSuccess: ocrSuccess } = useOcrDocuments();

  const services = [
    {
      name: 'Employee Service',
      port: 5001,
      route: '/api/employees',
      icon: Users,
      isOnline: empSuccess,
      count: employees?.length ?? 0,
      unit: 'nhân sự',
      db: 'employee.db (SQLite)',
    },
    {
      name: 'Schedule Service',
      port: 5002,
      route: '/api/schedules',
      icon: Calendar,
      isOnline: shiftSuccess,
      count: shifts?.length ?? 0,
      unit: 'ca trực',
      db: 'schedule.db (SQLite)',
    },
    {
      name: 'Finance Service',
      port: 5003,
      route: '/api/finance',
      icon: Receipt,
      isOnline: finSuccess,
      count: invoices?.length ?? 0,
      unit: 'hóa đơn',
      db: 'finance.db (SQLite)',
    },
    {
      name: 'OCR Service',
      port: 5004,
      route: '/api/ocr',
      icon: ScanLine,
      isOnline: ocrSuccess,
      count: ocrDocs?.length ?? 0,
      unit: 'tài liệu quét',
      db: 'ocr.db (SQLite)',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6 md:p-8 rounded-2xl shadow-sm">
        <div className="max-w-3xl">
          <Badge variant="success">Microservices Foundation Ready</Badge>
          <h1 className="text-2xl md:text-3xl font-bold mt-3 mb-2">
            Chào mừng bạn đến với RestaurantOS
          </h1>
          <p className="text-slate-300 text-sm leading-relaxed">
            Hệ thống quản lý nhà hàng chạy trên kiến trúc Microservices phân tán với .NET 8, YARP Gateway và Frontend React 18/TypeScript sạch sẽ, chuẩn doanh nghiệp.
          </p>
        </div>
      </div>

      {/* Gateway Status Header */}
      <div className="flex items-center justify-between p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-600 text-white rounded-lg">
            <Server className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-bold text-emerald-950">
              API Gateway Trung Tâm (YARP Reverse Proxy)
            </div>
            <div className="text-xs text-emerald-700">
              Cổng tiếp nhận: <code>http://localhost:5000</code> — Định tuyến tự động đến các Microservices
            </div>
          </div>
        </div>
        <Badge variant="success">Hoạt động bình thường</Badge>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {services.map((svc) => {
          const Icon = svc.icon;
          return (
            <Card key={svc.name} className="flex flex-col justify-between hover:border-slate-300 transition-colors">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2.5 rounded-lg bg-slate-100 text-slate-700">
                    <Icon className="w-5 h-5" />
                  </div>
                  <Badge variant={svc.isOnline ? 'success' : 'warning'}>
                    {svc.isOnline ? 'Đã kết nối' : 'Chờ service'}
                  </Badge>
                </div>
                <h3 className="font-semibold text-slate-900 text-sm">{svc.name}</h3>
                <p className="text-xs text-slate-500 font-mono mt-0.5">Port {svc.port} • {svc.route}</p>
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <div className="text-2xl font-bold text-slate-800">{svc.count}</div>
                  <div className="text-xs text-slate-500">{svc.unit} đã ghi nhận</div>
                </div>
              </div>
              <div className="mt-4 pt-2 text-[11px] text-slate-400 font-mono border-t border-slate-50">
                DB: {svc.db}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Clean Architecture Principles Card */}
      <Card>
        <div className="flex items-center gap-2 mb-4 text-slate-900 font-semibold">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          <h3>Nguyên Tắc Kiến Trúc Frontend Đang Áp Dụng</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600">
          <div className="p-3 bg-slate-50 rounded-lg">
            <strong className="text-slate-800 block mb-1">1. Feature-Based Isolation</strong>
            Mỗi nghiệp vụ (`features/employees`, `features/schedules`, v.v.) khép kín gồm api, types, pages.
          </div>
          <div className="p-3 bg-slate-50 rounded-lg">
            <strong className="text-slate-800 block mb-1">2. Single Gateway Communication</strong>
            Toàn bộ HTTP call đi qua <code>http://localhost:5000</code>. Client không biết port nội bộ của backend.
          </div>
          <div className="p-3 bg-slate-50 rounded-lg">
            <strong className="text-slate-800 block mb-1">3. Server & Client State Separate</strong>
            TanStack Query quản lý cache và retry tự động; Zustand quản lý giao diện UI.
          </div>
        </div>
      </Card>
    </div>
  );
};

