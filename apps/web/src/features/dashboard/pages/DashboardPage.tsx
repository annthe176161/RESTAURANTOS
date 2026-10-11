import React from 'react';
import { Users, Calendar, Receipt, ScanLine, ArrowUpRight, Clock, ChefHat, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { useEmployees } from '../../employees/api/getEmployees';
import { useShifts } from '../../schedules/api/getShifts';
import { useInvoices } from '../../finance/api/getInvoices';
import { useOcrDocuments } from '../../ocr/api/getOcrDocuments';

export const DashboardPage: React.FC = () => {
  const { data: employees } = useEmployees();
  const { data: shifts } = useShifts();
  const { data: invoices } = useInvoices();
  const { data: ocrDocs } = useOcrDocuments();

  const totalRevenue = invoices?.reduce((sum, inv) => sum + Number(inv.totalAmount || 0), 0) ?? 0;

  const stats = [
    {
      title: 'Đội ngũ nhân sự',
      value: employees?.length ?? 0,
      subtext: 'nhân viên đang hoạt động',
      icon: Users,
      link: '/employees',
      color: 'bg-emerald-50 text-emerald-700',
    },
    {
      title: 'Phân ca làm việc',
      value: shifts?.length ?? 0,
      subtext: 'ca trực đã lên lịch',
      icon: Calendar,
      link: '/schedules',
      color: 'bg-blue-50 text-blue-700',
    },
    {
      title: 'Hóa đơn & Doanh thu',
      value: `${totalRevenue.toLocaleString('vi-VN')} đ`,
      subtext: `${invoices?.length ?? 0} hóa đơn ghi nhận`,
      icon: Receipt,
      link: '/finance',
      color: 'bg-amber-50 text-amber-700',
    },
    {
      title: 'Chứng từ bóc tách AI',
      value: ocrDocs?.length ?? 0,
      subtext: 'tài liệu hóa đơn đã xử lý',
      icon: ScanLine,
      link: '/ocr',
      color: 'bg-purple-50 text-purple-700',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Banner Chào Mừng */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white p-6 md:p-8 rounded-2xl shadow-sm">
        <div className="max-w-2xl">
          <Badge variant="success">Hệ Thống Trực Tuyến</Badge>
          <h1 className="text-2xl md:text-3xl font-bold mt-3 mb-2">
            Chào mừng trở lại, Quản Lý Nhà Hàng!
          </h1>
          <p className="text-emerald-100 text-sm leading-relaxed">
            Dưới đây là tóm tắt tình hình nhân sự, ca kíp và tài chính của nhà hàng trong ngày hôm nay.
          </p>
        </div>
      </div>

      {/* 4 Thẻ Thống Kê Chính */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.title} to={item.link}>
              <Card className="h-full hover:border-emerald-300 hover:shadow-md transition-all">
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2.5 rounded-xl ${item.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600" />
                </div>
                <div className="text-xs font-medium text-slate-500 mb-1">{item.title}</div>
                <div className="text-xl md:text-2xl font-bold text-slate-800 tracking-tight">{item.value}</div>
                <div className="text-xs text-slate-400 mt-2">{item.subtext}</div>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Khối Hoạt Động Nhà Hàng Nhanh */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <ChefHat className="w-5 h-5 text-emerald-600" />
              <h3 className="font-semibold text-slate-900">Vận hành ca kíp trong ngày</h3>
            </div>
            <Link to="/schedules" className="text-xs text-emerald-600 hover:text-emerald-700 font-medium">
              Xem tất cả ca
            </Link>
          </div>

          {!shifts || shifts.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-sm">
              Hôm nay chưa có ca trực nào được xếp. Hãy vào mục Lịch làm việc để xếp ca!
            </div>
          ) : (
            <div className="space-y-3">
              {shifts.slice(0, 4).map((s) => (
                <div key={s.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50/70 border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                      Ca
                    </div>
                    <div>
                      <div className="text-sm font-medium text-slate-800">{s.shiftName}</div>
                      <div className="text-xs text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(s.startTimeUtc).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(s.endTimeUtc).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                  <Badge variant={s.isCancelled ? 'danger' : 'success'}>
                    {s.isCancelled ? 'Đã hủy' : 'Đang hoạt động'}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card className="lg:col-span-1">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <h3 className="font-semibold text-slate-900">Thao tác nhanh</h3>
          </div>

          <div className="space-y-2.5">
            <Link
              to="/employees"
              className="flex items-center justify-between p-3 rounded-lg border border-slate-200/80 hover:bg-slate-50 text-xs font-medium text-slate-700 transition-colors"
            >
              <span>Thêm nhân viên mới</span>
              <span className="text-emerald-600">→</span>
            </Link>
            <Link
              to="/schedules"
              className="flex items-center justify-between p-3 rounded-lg border border-slate-200/80 hover:bg-slate-50 text-xs font-medium text-slate-700 transition-colors"
            >
              <span>Xếp ca trực hôm nay</span>
              <span className="text-emerald-600">→</span>
            </Link>
            <Link
              to="/finance"
              className="flex items-center justify-between p-3 rounded-lg border border-slate-200/80 hover:bg-slate-50 text-xs font-medium text-slate-700 transition-colors"
            >
              <span>Ghi nhận hóa đơn / thu chi</span>
              <span className="text-emerald-600">→</span>
            </Link>
            <Link
              to="/ocr"
              className="flex items-center justify-between p-3 rounded-lg border border-slate-200/80 hover:bg-slate-50 text-xs font-medium text-slate-700 transition-colors"
            >
              <span>Tải ảnh quét hóa đơn nhập hàng</span>
              <span className="text-emerald-600">→</span>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};
