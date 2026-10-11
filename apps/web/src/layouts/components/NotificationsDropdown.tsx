import React, { useState, useRef, useEffect } from 'react';
import { Bell, Check, Clock } from 'lucide-react';

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  type: 'info' | 'success' | 'warning';
}

export const NotificationsDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: '1',
      title: 'Hóa đơn mới',
      message: 'Hóa đơn #INV-2026-001 vừa được tạo thành công.',
      time: '5 phút trước',
      isRead: false,
      type: 'success',
    },
    {
      id: '2',
      title: 'Phân ca trực',
      message: 'Ca sáng (08:00 - 16:00) đã được phân cho đầu bếp.',
      time: '15 phút trước',
      isRead: false,
      type: 'info',
    },
    {
      id: '3',
      title: 'Bóc tách OCR',
      message: 'Ảnh hóa đơn thịt bò đã được bóc tách xong bản nháp.',
      time: '1 giờ trước',
      isRead: true,
      type: 'info',
    },
  ]);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors focus:outline-none"
        title="Thông báo hệ thống"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white ring-2 ring-white">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl bg-white shadow-xl ring-1 ring-slate-900/5 z-50 overflow-hidden border border-slate-100 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50/70">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm text-slate-800">Thông báo</span>
              {unreadCount > 0 && (
                <span className="bg-rose-100 text-rose-700 text-xs px-2 py-0.5 rounded-full font-medium">
                  {unreadCount} mới
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1"
              >
                <Check className="w-3.5 h-3.5" />
                Đánh dấu đã đọc
              </button>
            )}
          </div>

          <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
            {notifications.map((item) => (
              <div
                key={item.id}
                className={`p-3.5 hover:bg-slate-50 transition-colors cursor-pointer ${
                  !item.isRead ? 'bg-emerald-50/30' : ''
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <h4 className="text-xs font-semibold text-slate-900">{item.title}</h4>
                  <span className="text-[10px] text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {item.time}
                  </span>
                </div>
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{item.message}</p>
              </div>
            ))}
          </div>

          <div className="p-2.5 text-center border-t border-slate-100 bg-slate-50/50">
            <span className="text-xs text-slate-500 font-medium">RestaurantOS Notification Center</span>
          </div>
        </div>
      )}
    </div>
  );
};
