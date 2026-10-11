import React, { useState } from 'react';
import { 
  UserPlus, 
  Users, 
  AlertCircle, 
  Search, 
  Trash2, 
  Power, 
  Phone, 
  Mail, 
  Filter
} from 'lucide-react';
import { useEmployees } from '../api/getEmployees';
import { useCreateEmployee } from '../api/createEmployee';
import { useToggleEmployeeStatus } from '../api/toggleEmployeeStatus';
import { useDeleteEmployee } from '../api/deleteEmployee';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge, Spinner } from '../../../components/ui/Badge';

export const EmployeesPage: React.FC = () => {
  // Bộ lọc tìm kiếm
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const { data: employees, isLoading, isError } = useEmployees({
    search: searchTerm,
    role: selectedRole,
    isActive: selectedStatus === 'all' ? undefined : selectedStatus === 'active',
  });

  const createEmployeeMutation = useCreateEmployee();
  const toggleStatusMutation = useToggleEmployeeStatus();
  const deleteEmployeeMutation = useDeleteEmployee();

  // Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [role, setRole] = useState('Phục vụ');
  const [hourlyRate, setHourlyRate] = useState<number>(25000);
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!fullName.trim() || !email.trim()) {
      setFormError('Vui lòng điền đầy đủ họ tên và email.');
      return;
    }

    createEmployeeMutation.mutate(
      { 
        fullName: fullName.trim(), 
        email: email.trim(), 
        phoneNumber: phoneNumber.trim(),
        role, 
        hourlyRate 
      },
      {
        onSuccess: () => {
          setFullName('');
          setEmail('');
          setPhoneNumber('');
          setHourlyRate(25000);
          setFormError(null);
        },
        onError: (err: any) => {
          const message = err.response?.data?.error || err.response?.data?.message || 'Có lỗi xảy ra khi tạo nhân viên.';
          setFormError(message);
        },
      }
    );
  };

  const handleToggleStatus = (id: string) => {
    toggleStatusMutation.mutate(id);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa nhân viên "${name}" khỏi hệ thống?`)) {
      deleteEmployeeMutation.mutate(id);
    }
  };

  const getRoleBadgeColor = (r: string) => {
    switch (r) {
      case 'Quản lý':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Đầu bếp':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Thu ngân':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Trang */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Quản Lý Đội Ngũ Nhân Sự</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Theo dõi danh sách nhân viên, vị trí công việc, mức lương giờ và trạng thái làm việc
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ========================================================= */}
        {/* CỘT TRÁI: FORM THÊM NHÂN VIÊN MỚI                        */}
        {/* ========================================================= */}
        <Card className="lg:col-span-1 h-fit shadow-xs">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <UserPlus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 text-sm">Tiếp nhận nhân sự mới</h3>
              <p className="text-[11px] text-slate-400">Tạo tài khoản và hồ sơ nhân sự</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Họ và tên *</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="VD: Nguyễn Văn Nam"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Email liên hệ *</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nam.nguyen@restaurantos.vn"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Số điện thoại</label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="VD: 0987654321"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Vị trí công việc</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-2.5 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                >
                  <option value="Phục vụ">Phục vụ</option>
                  <option value="Đầu bếp">Đầu bếp</option>
                  <option value="Thu ngân">Thu ngân</option>
                  <option value="Quản lý">Quản lý</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Lương theo giờ (đ)</label>
                <input
                  type="number"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(Number(e.target.value))}
                  min="0"
                  step="1000"
                  className="w-full px-2.5 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>
            </div>

            {formError && (
              <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-1.5">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{formError}</span>
              </div>
            )}

            <Button
              type="submit"
              className="w-full text-xs py-2.5 mt-2"
              isLoading={createEmployeeMutation.isPending}
            >
              Lưu hồ sơ nhân viên
            </Button>
          </form>
        </Card>

        {/* ========================================================= */}
        {/* CỘT PHẢI: BỘ LỌC & DANH SÁCH NHÂN SỰ                      */}
        {/* ========================================================= */}
        <div className="lg:col-span-2 space-y-4">
          {/* Thanh Công Cụ Tìm Kiếm & Lọc */}
          <Card className="p-4 shadow-xs">
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Ô tìm kiếm */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Tìm theo họ tên, email hoặc SĐT..."
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                />
              </div>

              {/* Lọc theo chức vụ */}
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-400 hidden sm:block" />
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="px-2.5 py-1.5 text-xs border border-slate-200 bg-slate-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="all">Tất cả chức vụ</option>
                  <option value="Quản lý">Quản lý</option>
                  <option value="Đầu bếp">Đầu bếp</option>
                  <option value="Thu ngân">Thu ngân</option>
                  <option value="Phục vụ">Phục vụ</option>
                </select>

                {/* Lọc theo trạng thái */}
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-2.5 py-1.5 text-xs border border-slate-200 bg-slate-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="all">Tất cả trạng thái</option>
                  <option value="active">Đang làm việc</option>
                  <option value="inactive">Đã tạm dừng</option>
                </select>
              </div>
            </div>
          </Card>

          {/* Bảng Dữ Liệu */}
          <Card className="p-0 overflow-hidden shadow-xs">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-600" />
                <h3 className="font-semibold text-slate-800 text-sm">Danh sách nhân viên</h3>
              </div>
              <span className="text-xs text-slate-500 font-medium">
                Tổng cộng: <strong className="text-slate-800">{employees?.length ?? 0}</strong> nhân sự
              </span>
            </div>

            {isLoading ? (
              <Spinner />
            ) : isError ? (
              <div className="p-8 text-center text-slate-500">
                <AlertCircle className="w-8 h-8 text-rose-500 mx-auto mb-2" />
                <p className="text-sm font-medium text-rose-600">Không thể kết nối đến máy chủ nhân sự</p>
                <p className="text-xs text-slate-400 mt-1">
                  Vui lòng đảm bảo Backend Employee Service đang được khởi chạy.
                </p>
              </div>
            ) : !employees || employees.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-xs">
                Không tìm thấy nhân viên nào phù hợp với điều kiện tìm kiếm.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-600 font-medium">
                      <th className="py-3 px-4">Nhân sự</th>
                      <th className="py-3 px-4">Liên hệ</th>
                      <th className="py-3 px-4">Chức vụ</th>
                      <th className="py-3 px-4">Lương theo giờ</th>
                      <th className="py-3 px-4">Trạng thái</th>
                      <th className="py-3 px-4 text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {employees.map((emp) => (
                      <tr key={emp.id} className="hover:bg-slate-50/60 transition-colors">
                        {/* Cột Họ tên & Avatar */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center flex-shrink-0">
                              {emp.fullName.slice(0, 1).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-semibold text-slate-900 text-xs">{emp.fullName}</div>
                              <div className="text-[10px] text-slate-400">ID: {emp.id.slice(0, 6)}...</div>
                            </div>
                          </div>
                        </td>

                        {/* Cột Liên hệ (Email, SĐT) */}
                        <td className="py-3.5 px-4 text-slate-600">
                          <div className="flex items-center gap-1.5 text-[11px]">
                            <Mail className="w-3 h-3 text-slate-400" />
                            <span>{emp.email}</span>
                          </div>
                          {emp.phoneNumber && (
                            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-0.5">
                              <Phone className="w-3 h-3 text-slate-400" />
                              <span>{emp.phoneNumber}</span>
                            </div>
                          )}
                        </td>

                        {/* Cột Chức vụ */}
                        <td className="py-3.5 px-4">
                          <span className={`inline-flex px-2 py-0.5 rounded-md text-[11px] font-medium border ${getRoleBadgeColor(emp.role)}`}>
                            {emp.role}
                          </span>
                        </td>

                        {/* Cột Mức lương */}
                        <td className="py-3.5 px-4 font-mono font-medium text-slate-700">
                          {emp.hourlyRate > 0 ? (
                            <span className="flex items-center text-emerald-700">
                              {emp.hourlyRate.toLocaleString('vi-VN')} đ/h
                            </span>
                          ) : (
                            <span className="text-slate-400">Chưa đặt</span>
                          )}
                        </td>

                        {/* Cột Trạng thái */}
                        <td className="py-3.5 px-4">
                          <Badge variant={emp.isActive ? 'success' : 'danger'}>
                            {emp.isActive ? 'Đang làm việc' : 'Đã tạm dừng'}
                          </Badge>
                        </td>

                        {/* Cột Thao tác */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Nút Bật / Tắt trạng thái */}
                            <button
                              onClick={() => handleToggleStatus(emp.id)}
                              title={emp.isActive ? 'Tạm dừng làm việc' : 'Kích hoạt làm việc lại'}
                              disabled={toggleStatusMutation.isPending}
                              className={`p-1.5 rounded-lg border transition-colors ${
                                emp.isActive
                                  ? 'border-amber-200 text-amber-600 hover:bg-amber-50'
                                  : 'border-emerald-200 text-emerald-600 hover:bg-emerald-50'
                              }`}
                            >
                              <Power className="w-3.5 h-3.5" />
                            </button>

                            {/* Nút Xóa nhân viên */}
                            <button
                              onClick={() => handleDelete(emp.id, emp.fullName)}
                              title="Xóa nhân viên khỏi hệ thống"
                              disabled={deleteEmployeeMutation.isPending}
                              className="p-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};
