import React, { useState, useEffect, useRef } from 'react';
import { 
  UserPlus, 
  Users, 
  AlertCircle, 
  Search, 
  Trash2, 
  Power, 
  Phone, 
  Mail, 
  Filter,
  Pencil,
  X,
  CheckCircle2,
  MoreHorizontal,
  Coins,
  RotateCcw
} from 'lucide-react';
import { useEmployees } from '../api/getEmployees';
import { useCreateEmployee } from '../api/createEmployee';
import { useUpdateEmployee } from '../api/updateEmployee';
import { useToggleEmployeeStatus } from '../api/toggleEmployeeStatus';
import { useDeleteEmployee } from '../api/deleteEmployee';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge, Spinner } from '../../../components/ui/Badge';
import type { Employee } from '../types';

export const EmployeesPage: React.FC = () => {
  // Bộ lọc tìm kiếm
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const { data: employees, isLoading, isError, refetch } = useEmployees({
    search: searchTerm,
    role: selectedRole,
    isActive: selectedStatus === 'all' ? undefined : selectedStatus === 'active',
  });

  const createEmployeeMutation = useCreateEmployee();
  const updateEmployeeMutation = useUpdateEmployee();
  const toggleStatusMutation = useToggleEmployeeStatus();
  const deleteEmployeeMutation = useDeleteEmployee();

  // Modal State Thêm mới
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [role, setRole] = useState('Phục vụ');
  const [hourlyRate, setHourlyRate] = useState<number>(25000);
  const [formError, setFormError] = useState<string | null>(null);

  // Modal State Sửa
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [editFullName, setEditFullName] = useState('');
  const [editPhoneNumber, setEditPhoneNumber] = useState('');
  const [editRole, setEditRole] = useState('Phục vụ');
  const [editHourlyRate, setEditHourlyRate] = useState<number>(25000);
  const [editError, setEditError] = useState<string | null>(null);

  // Dropdown Action State (quản lý ID dòng nào đang mở menu thao tác)
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  // Tự động đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Tính toán nhanh số liệu thống kê (KPIs)
  const totalEmployees = employees?.length ?? 0;
  const activeCount = employees?.filter(e => e.isActive).length ?? 0;
  const inactiveCount = totalEmployees - activeCount;
  const avgHourlyRate = totalEmployees > 0
    ? Math.round(employees!.reduce((acc, cur) => acc + (cur.hourlyRate || 0), 0) / totalEmployees)
    : 0;

  // Xử lý mở Modal Thêm mới
  const handleOpenCreate = () => {
    setFullName('');
    setEmail('');
    setPhoneNumber('');
    setRole('Phục vụ');
    setHourlyRate(25000);
    setFormError(null);
    setIsCreateOpen(true);
  };

  const handleCloseCreate = () => {
    setIsCreateOpen(false);
    setFormError(null);
  };

  // Xử lý mở Modal Sửa
  const handleOpenEdit = (emp: Employee) => {
    setActiveMenuId(null);
    setEditingEmployee(emp);
    setEditFullName(emp.fullName);
    setEditPhoneNumber(emp.phoneNumber || '');
    setEditRole(emp.role);
    setEditHourlyRate(emp.hourlyRate);
    setEditError(null);
  };

  const handleCloseEdit = () => {
    setEditingEmployee(null);
    setEditError(null);
  };

  // Submit Thêm mới
  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!fullName.trim() || !email.trim()) {
      setFormError('Vui lòng điền đầy đủ họ tên và email liên hệ.');
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
          handleCloseCreate();
        },
        onError: (err: any) => {
          const message = err.response?.data?.error || err.response?.data?.message || 'Có lỗi xảy ra khi tạo nhân viên.';
          setFormError(message);
        },
      }
    );
  };

  // Submit Sửa
  const handleUpdateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEmployee) return;

    if (!editFullName.trim()) {
      setEditError('Họ và tên nhân viên không được để trống.');
      return;
    }

    updateEmployeeMutation.mutate(
      {
        id: editingEmployee.id,
        data: {
          fullName: editFullName.trim(),
          phoneNumber: editPhoneNumber.trim(),
          role: editRole,
          hourlyRate: editHourlyRate,
        },
      },
      {
        onSuccess: () => {
          handleCloseEdit();
        },
        onError: (err: any) => {
          const message = err.response?.data?.error || err.response?.data?.message || 'Có lỗi xảy ra khi cập nhật nhân viên.';
          setEditError(message);
        },
      }
    );
  };

  // Bật/tắt trạng thái
  const handleToggleStatus = (id: string) => {
    setActiveMenuId(null);
    toggleStatusMutation.mutate(id);
  };

  // Xóa nhân sự
  const handleDelete = (id: string, name: string) => {
    setActiveMenuId(null);
    if (window.confirm(`Bạn có chắc chắn muốn xóa nhân viên "${name}" khỏi hệ thống? Dữ liệu lịch làm việc cũng sẽ được cập nhật tương ứng.`)) {
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

  const getShortId = (id: unknown) => {
    if (!id) return '';
    const str = String(id);
    return str.length > 8 ? `${str.slice(0, 8)}...` : str;
  };

  const getAvatarInitial = (name: unknown) => {
    if (!name) return 'U';
    const str = String(name).trim();
    return str.length > 0 ? str.charAt(0).toUpperCase() : 'U';
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* ========================================================= */}
      {/* 1. HEADER CHÍNH & NÚT TẠO MỚI (CÂN XỨNG 2 ĐẦU)           */}
      {/* ========================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">Quản Lý Đội Ngũ Nhân Sự</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Theo dõi danh sách nhân viên, vị trí công việc, mức lương giờ và trạng thái làm việc
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            onClick={handleOpenCreate}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs px-4 py-2 text-xs font-semibold rounded-xl"
          >
            <UserPlus className="w-4 h-4" />
            <span>Thêm nhân sự mới</span>
          </Button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. THỐNG KÊ NHANH (4 THẺ KPI ĐỒNG BỘ CÂN ĐỐI)             */}
      {/* ========================================================= */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Tổng nhân viên */}
        <Card className="p-4 bg-white border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Tổng nhân sự</span>
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 tracking-tight">{totalEmployees}</span>
            <span className="text-[11px] text-slate-400 font-medium">người</span>
          </div>
        </Card>

        {/* Card 2: Đang làm việc */}
        <Card className="p-4 bg-white border border-slate-200/80 shadow-xs hover:border-emerald-200 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Đang làm việc</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-emerald-600 tracking-tight">{activeCount}</span>
            <span className="text-[11px] text-emerald-700/70 font-medium">sẵn sàng xếp ca</span>
          </div>
        </Card>

        {/* Card 3: Đã tạm dừng */}
        <Card className="p-4 bg-white border border-slate-200/80 shadow-xs hover:border-amber-200 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Đã tạm dừng</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Power className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-amber-600 tracking-tight">{inactiveCount}</span>
            <span className="text-[11px] text-amber-700/70 font-medium">nghỉ phép / tạm dừng</span>
          </div>
        </Card>

        {/* Card 4: Lương giờ trung bình */}
        <Card className="p-4 bg-white border border-slate-200/80 shadow-xs hover:border-blue-200 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Lương giờ TB</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 tracking-tight">
              {avgHourlyRate.toLocaleString('vi-VN')}
            </span>
            <span className="text-[11px] text-slate-400 font-medium">đ/giờ</span>
          </div>
        </Card>
      </div>

      {/* ========================================================= */}
      {/* 3. THANH TÌM KIẾM VÀ BỘ LỌC (CĂN CHỈNH THẲNG HÀNG)        */}
      {/* ========================================================= */}
      <Card className="p-4 bg-white border border-slate-200/80 shadow-xs">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Ô tìm kiếm linh hoạt */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm theo họ tên, email hoặc SĐT..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50/60 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Các bộ lọc Dropdown bên phải */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <Filter className="w-3.5 h-3.5" />
              <span className="hidden md:inline text-[11px]">Lọc theo:</span>
            </div>

            {/* Lọc theo chức vụ */}
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="px-3 py-2 text-xs border border-slate-200 bg-slate-50/70 text-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium transition-all"
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
              className="px-3 py-2 text-xs border border-slate-200 bg-slate-50/70 text-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium transition-all"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Đang làm việc</option>
              <option value="inactive">Đã tạm dừng</option>
            </select>

            {/* Nút reset bộ lọc */}
            {(searchTerm || selectedRole !== 'all' || selectedStatus !== 'all') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedRole('all');
                  setSelectedStatus('all');
                }}
                title="Đặt lại bộ lọc"
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </Card>

      {/* ========================================================= */}
      {/* 4. BẢNG DANH SÁCH NHÂN VIÊN (FULL WIDTH, DROPDOWN THAO TÁC) */}
      {/* ========================================================= */}
      <Card className="p-0 overflow-hidden border border-slate-200/80 shadow-xs bg-white rounded-2xl">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/40">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <h3 className="font-semibold text-slate-800 text-sm">Danh sách nhân sự hệ thống</h3>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            Hiển thị: <strong className="text-slate-900">{employees?.length ?? 0}</strong> nhân sự
          </span>
        </div>

        {isLoading ? (
          <div className="p-16 flex flex-col items-center justify-center space-y-3">
            <Spinner />
            <p className="text-xs text-slate-400">Đang tải danh sách nhân sự...</p>
          </div>
        ) : isError ? (
          <div className="p-12 text-center text-slate-500 space-y-3">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-semibold text-rose-600">Không thể kết nối đến máy chủ nhân sự</p>
              <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                Hệ thống chưa kết nối được tới API Gateway (Port 5000) hoặc Employee Service (Port 5001). Vui lòng khởi động Docker trước khi sử dụng.
              </p>
            </div>
            <button
              type="button"
              onClick={() => refetch()}
              className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 transition-colors shadow-xs"
            >
              Thử kết nối lại
            </button>
          </div>
        ) : !employees || employees.length === 0 ? (
          <div className="text-center py-16 px-4 text-slate-400 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center mx-auto border border-slate-100">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="font-semibold text-slate-700 text-sm">Chưa có nhân viên nào trong danh sách</p>
              <p className="text-xs text-slate-400 mt-0.5">
                Hãy bấm nút "Thêm nhân sự mới" ở góc trên để tạo tài khoản đầu tiên.
              </p>
            </div>
            <Button
              onClick={handleOpenCreate}
              className="mt-2 text-xs bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl"
            >
              + Thêm nhân sự ngay
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto min-h-[320px]">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200/80 bg-slate-50/70 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-3.5 px-5">Nhân sự</th>
                  <th className="py-3.5 px-5">Liên hệ</th>
                  <th className="py-3.5 px-5">Chức vụ</th>
                  <th className="py-3.5 px-5 text-right">Lương giờ</th>
                  <th className="py-3.5 px-5 text-center">Trạng thái</th>
                  <th className="py-3.5 px-5 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {employees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Cột Nhân sự: Avatar + Tên + ID */}
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center flex-shrink-0 shadow-xs border border-emerald-200/50">
                          {getAvatarInitial(emp.fullName)}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900 text-xs">{emp.fullName || 'Chưa đặt tên'}</div>
                          <div className="text-[10px] text-slate-400 font-mono mt-0.5">ID: {getShortId(emp.id)}</div>
                        </div>
                      </div>
                    </td>

                    {/* Cột Liên hệ */}
                    <td className="py-4 px-5 text-slate-600">
                      <div className="flex items-center gap-1.5 text-xs text-slate-700">
                        <Mail className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                        <span>{emp.email}</span>
                      </div>
                      {emp.phoneNumber ? (
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-1">
                          <Phone className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                          <span>{emp.phoneNumber}</span>
                        </div>
                      ) : (
                        <div className="text-[11px] text-slate-400 mt-1 italic">Chưa có SĐT</div>
                      )}
                    </td>

                    {/* Cột Chức vụ */}
                    <td className="py-4 px-5">
                      <span className={`inline-flex px-2.5 py-1 rounded-lg text-[11px] font-medium border ${getRoleBadgeColor(emp.role)}`}>
                        {emp.role}
                      </span>
                    </td>

                    {/* Cột Mức lương giờ */}
                    <td className="py-4 px-5 text-right font-mono font-medium text-slate-700">
                      {emp.hourlyRate > 0 ? (
                        <span className="text-emerald-700 font-semibold text-xs">
                          {Number(emp.hourlyRate).toLocaleString('vi-VN')} đ/h
                        </span>
                      ) : (
                        <span className="text-slate-400 text-xs">Chưa đặt</span>
                      )}
                    </td>

                    {/* Cột Trạng thái */}
                    <td className="py-4 px-5 text-center">
                      <Badge variant={emp.isActive ? 'success' : 'danger'}>
                        {emp.isActive ? 'Đang làm việc' : 'Đã tạm dừng'}
                      </Badge>
                    </td>

                    {/* Cột Thao tác: DROPDOWN MENU BA CHẤM (...) */}
                    <td className="py-4 px-5 text-right relative">
                      <div className="inline-block text-left" ref={activeMenuId === emp.id ? menuRef : null}>
                        <button
                          type="button"
                          onClick={() => setActiveMenuId(activeMenuId === emp.id ? null : emp.id)}
                          className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors focus:outline-none"
                          title="Tùy chọn thao tác"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </button>

                        {/* Dropdown Menu nổi */}
                        {activeMenuId === emp.id && (
                          <div className="absolute right-5 mt-1 w-44 rounded-xl bg-white shadow-xl ring-1 ring-slate-900/10 border border-slate-100 z-50 py-1.5 animate-in fade-in zoom-in-95 duration-100 text-left">
                            {/* Nút Chỉnh sửa */}
                            <button
                              type="button"
                              onClick={() => handleOpenEdit(emp)}
                              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-emerald-700 transition-colors"
                            >
                              <Pencil className="w-3.5 h-3.5 text-slate-400" />
                              <span>Sửa thông tin</span>
                            </button>

                            {/* Nút Bật / Tắt trạng thái */}
                            <button
                              type="button"
                              onClick={() => handleToggleStatus(emp.id)}
                              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors"
                            >
                              <Power className={`w-3.5 h-3.5 ${emp.isActive ? 'text-amber-500' : 'text-emerald-500'}`} />
                              <span>{emp.isActive ? 'Tạm dừng làm việc' : 'Kích hoạt lại'}</span>
                            </button>

                            <div className="my-1 border-t border-slate-100" />

                            {/* Nút Xóa nhân sự */}
                            <button
                              type="button"
                              onClick={() => handleDelete(emp.id, emp.fullName)}
                              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 transition-colors font-medium"
                            >
                              <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                              <span>Xóa hồ sơ</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* ========================================================= */}
      {/* 5. MODAL DIALOG: THÊM NHÂN SỰ MỚI (CÂN ĐỐI Ở GIỮA)        */}
      {/* ========================================================= */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 space-y-5 animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <UserPlus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Thêm nhân sự mới</h3>
                  <p className="text-[11px] text-slate-400">Tạo tài khoản và hồ sơ công việc cho nhân viên</p>
                </div>
              </div>
              <button
                onClick={handleCloseCreate}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form Thêm mới */}
            <form onSubmit={handleCreateSubmit} className="space-y-4">
              {formError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-rose-700 text-xs">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Họ và tên <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: Nguyễn Văn Nam"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email liên hệ <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  placeholder="nam.nguyen@restaurantos.vn"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Số điện thoại
                </label>
                <input
                  type="tel"
                  placeholder="Ví dụ: 0987654321"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Vị trí công việc</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  >
                    <option value="Phục vụ">Phục vụ</option>
                    <option value="Đầu bếp">Đầu bếp</option>
                    <option value="Thu ngân">Thu ngân</option>
                    <option value="Quản lý">Quản lý</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Lương theo giờ (đ)</label>
                  <input
                    type="number"
                    min="0"
                    step="1000"
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(Number(e.target.value))}
                    className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                  />
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseCreate}
                  disabled={createEmployeeMutation.isPending}
                  className="text-xs rounded-xl"
                >
                  Hủy bỏ
                </Button>
                <Button
                  type="submit"
                  disabled={createEmployeeMutation.isPending}
                  className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold"
                >
                  {createEmployeeMutation.isPending ? 'Đang lưu...' : 'Lưu hồ sơ nhân viên'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 6. MODAL DIALOG: CHỈNH SỬA THÔNG TIN NHÂN VIÊN            */}
      {/* ========================================================= */}
      {editingEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 space-y-5 animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Pencil className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Chỉnh sửa hồ sơ nhân sự</h3>
                  <p className="text-[11px] text-slate-400">Cập nhật thông tin công việc và mức lương</p>
                </div>
              </div>
              <button
                onClick={handleCloseEdit}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form Chỉnh sửa */}
            <form onSubmit={handleUpdateSubmit} className="space-y-4">
              {editError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-rose-700 text-xs">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{editError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Họ và tên <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={editFullName}
                  onChange={(e) => setEditFullName(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email liên hệ</label>
                <input
                  type="email"
                  value={editingEmployee.email}
                  disabled
                  className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 text-slate-500 cursor-not-allowed"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">Email là định danh tài khoản, không thể thay đổi.</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Số điện thoại</label>
                <input
                  type="tel"
                  value={editPhoneNumber}
                  onChange={(e) => setEditPhoneNumber(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Vị trí công việc</label>
                  <select
                    value={editRole}
                    onChange={(e) => setEditRole(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  >
                    <option value="Phục vụ">Phục vụ</option>
                    <option value="Đầu bếp">Đầu bếp</option>
                    <option value="Thu ngân">Thu ngân</option>
                    <option value="Quản lý">Quản lý</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Lương theo giờ (đ)</label>
                  <input
                    type="number"
                    min="0"
                    step="1000"
                    value={editHourlyRate}
                    onChange={(e) => setEditHourlyRate(Number(e.target.value))}
                    className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                  />
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseEdit}
                  disabled={updateEmployeeMutation.isPending}
                  className="text-xs rounded-xl"
                >
                  Hủy bỏ
                </Button>
                <Button
                  type="submit"
                  disabled={updateEmployeeMutation.isPending}
                  className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold"
                >
                  {updateEmployeeMutation.isPending ? 'Đang lưu...' : 'Lưu thay đổi'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
