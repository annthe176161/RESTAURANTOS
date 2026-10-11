import React, { useState } from 'react';
import { UserPlus, Users, AlertCircle } from 'lucide-react';
import { useEmployees } from '../api/getEmployees';
import { useCreateEmployee } from '../api/createEmployee';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge, Spinner } from '../../../components/ui/Badge';

export const EmployeesPage: React.FC = () => {
  const { data: employees, isLoading, isError } = useEmployees();
  const createEmployeeMutation = useCreateEmployee();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Phục vụ');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email) return;

    createEmployeeMutation.mutate(
      { fullName, email, role },
      {
        onSuccess: () => {
          setFullName('');
          setEmail('');
        },
      }
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Quản Lý Nhân Viên</h2>
          <p className="text-sm text-slate-500">
            Dữ liệu được sở hữu độc lập bởi <strong className="text-emerald-700">Employee Service (Port 5001)</strong>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form thêm mới */}
        <Card className="lg:col-span-1 h-fit">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
            <UserPlus className="w-5 h-5 text-emerald-600" />
            <h3 className="font-semibold text-slate-900">Thêm nhân viên mới</h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Họ và tên</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Ví dụ: Nguyễn Văn A"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="a.nguyen@restaurantos.local"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Vị trí công việc</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="Phục vụ">Phục vụ (Waiter)</option>
                <option value="Đầu bếp">Đầu bếp (Chef)</option>
                <option value="Thu ngân">Thu ngân (Cashier)</option>
                <option value="Quản lý">Quản lý (Manager)</option>
              </select>
            </div>

            <Button
              type="submit"
              className="w-full"
              isLoading={createEmployeeMutation.isPending}
            >
              Lưu nhân viên
            </Button>

            {createEmployeeMutation.isError && (
              <p className="text-xs text-rose-600 mt-2">
                Không thể tạo nhân viên. Vui lòng kiểm tra email có bị trùng không.
              </p>
            )}
          </form>
        </Card>

        {/* Bảng danh sách */}
        <Card className="lg:col-span-2">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
            <Users className="w-5 h-5 text-emerald-600" />
            <h3 className="font-semibold text-slate-900">Danh sách nhân sự</h3>
          </div>

          {isLoading ? (
            <Spinner />
          ) : isError ? (
            <div className="p-6 text-center text-slate-500">
              <AlertCircle className="w-8 h-8 text-rose-500 mx-auto mb-2" />
              <p className="text-sm font-medium text-rose-600">Không thể kết nối đến Employee Service</p>
              <p className="text-xs text-slate-400 mt-1">
                Hãy đảm bảo API Gateway (5000) và Employee Service (5001) đang chạy.
              </p>
            </div>
          ) : !employees || employees.length === 0 ? (
            <div className="text-center py-10 text-slate-400">
              Chưa có nhân viên nào trong hệ thống. Hãy thêm nhân viên đầu tiên!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 text-xs">
                    <th className="pb-3 font-medium">Họ tên</th>
                    <th className="pb-3 font-medium">Email</th>
                    <th className="pb-3 font-medium">Vị trí</th>
                    <th className="pb-3 font-medium">Trạng thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {employees.map((emp) => (
                    <tr key={emp.id} className="hover:bg-slate-50/50">
                      <td className="py-3 font-medium text-slate-800">{emp.fullName}</td>
                      <td className="py-3 text-slate-500 text-xs">{emp.email}</td>
                      <td className="py-3">
                        <span className="text-xs font-medium text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md">
                          {emp.role}
                        </span>
                      </td>
                      <td className="py-3">
                        <Badge variant={emp.isActive ? 'success' : 'danger'}>
                          {emp.isActive ? 'Đang làm việc' : 'Đã nghỉ'}
                        </Badge>
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
  );
};
