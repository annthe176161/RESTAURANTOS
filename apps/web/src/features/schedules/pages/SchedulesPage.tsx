import React, { useState } from 'react';
import { CalendarPlus, Calendar, AlertCircle } from 'lucide-react';
import { useShifts } from '../api/getShifts';
import { useCreateShift } from '../api/createShift';
import { useEmployees } from '../../employees/api/getEmployees';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge, Spinner } from '../../../components/ui/Badge';

export const SchedulesPage: React.FC = () => {
  const { data: shifts, isLoading, isError } = useShifts();
  const { data: employees } = useEmployees();
  const createShiftMutation = useCreateShift();

  const [shiftName, setShiftName] = useState('Ca sáng (08:00 - 16:00)');
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmployeeId) return;

    const start = new Date();
    start.setHours(8, 0, 0, 0);

    const end = new Date();
    end.setHours(16, 0, 0, 0);

    createShiftMutation.mutate({
      employeeId: selectedEmployeeId,
      shiftName,
      startTimeUtc: start.toISOString(),
      endTimeUtc: end.toISOString(),
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Quản Lý Lịch Làm & Ca Kíp</h2>
        <p className="text-sm text-slate-500">
          Dữ liệu thuộc sở hữu của <strong className="text-emerald-700">Schedule Service (Port 5002)</strong>
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 h-fit">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
            <CalendarPlus className="w-5 h-5 text-emerald-600" />
            <h3 className="font-semibold text-slate-900">Phân ca làm việc</h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Chọn nhân viên</label>
              <select
                value={selectedEmployeeId}
                onChange={(e) => setSelectedEmployeeId(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              >
                <option value="">-- Chọn nhân viên --</option>
                {employees?.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.fullName} ({emp.role})
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-slate-400 mt-1">
                Lưu ý: Schedule Service chỉ lưu `EmployeeId` (Loose Coupling).
              </p>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Tên ca làm</label>
              <select
                value={shiftName}
                onChange={(e) => setShiftName(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="Ca sáng (08:00 - 16:00)">Ca sáng (08:00 - 16:00)</option>
                <option value="Ca chiều (16:00 - 23:00)">Ca chiều (16:00 - 23:00)</option>
                <option value="Ca gãy (10:00 - 14:00 & 18:00 - 22:00)">Ca gãy (10:00 - 14:00 & 18:00 - 22:00)</option>
              </select>
            </div>

            <Button
              type="submit"
              className="w-full"
              isLoading={createShiftMutation.isPending}
              disabled={!selectedEmployeeId}
            >
              Phân công ca
            </Button>
          </form>
        </Card>

        <Card className="lg:col-span-2">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
            <Calendar className="w-5 h-5 text-emerald-600" />
            <h3 className="font-semibold text-slate-900">Danh sách phân ca</h3>
          </div>

          {isLoading ? (
            <Spinner />
          ) : isError ? (
            <div className="p-6 text-center text-slate-500">
              <AlertCircle className="w-8 h-8 text-rose-500 mx-auto mb-2" />
              <p className="text-sm font-medium text-rose-600">Không thể kết nối đến Schedule Service</p>
            </div>
          ) : !shifts || shifts.length === 0 ? (
            <div className="text-center py-10 text-slate-400">
              Chưa có ca làm việc nào được xếp. Hãy phân ca đầu tiên!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 text-xs">
                    <th className="pb-3 font-medium">Tên ca</th>
                    <th className="pb-3 font-medium">Mã nhân viên (Ref ID)</th>
                    <th className="pb-3 font-medium">Bắt đầu</th>
                    <th className="pb-3 font-medium">Trạng thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {shifts.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50/50">
                      <td className="py-3 font-medium text-slate-800">{s.shiftName}</td>
                      <td className="py-3 font-mono text-xs text-slate-500">{s.employeeId.slice(0, 8)}...</td>
                      <td className="py-3 text-xs text-slate-600">
                        {new Date(s.startTimeUtc).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="py-3">
                        <Badge variant={s.isCancelled ? 'danger' : 'success'}>
                          {s.isCancelled ? 'Đã hủy' : 'Hoạt động'}
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

