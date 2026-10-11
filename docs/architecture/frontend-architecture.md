# Kiến Trúc Web Frontend (Feature-Based Architecture)

Tài liệu này giải thích chi tiết cấu trúc Frontend tại thư mục `apps/web/` dành cho Junior / Mid-level Developer.

---

## 1. Triết Lý Thiết Kế: Feature-Based (Bulletproof React)

Thay vì chia code theo kỹ thuật truyền thống (dồn tất cả component vào `components/`, dồn tất cả hook vào `hooks/`), RestaurantOS áp dụng mô hình **Feature-Based**:

> **Nguyên tắc**: Mọi thứ liên quan đến một tính năng nghiệp vụ (API, Component, Types, Page) được gom chung vào một thư mục riêng biệt.

```text
apps/web/src/features/
├── employees/          # Toàn bộ logic quản lý nhân sự
│   ├── api/            # getEmployees.ts, createEmployee.ts
│   ├── pages/          # EmployeesPage.tsx
│   └── types/          # index.ts (Employee, CreateEmployeeDto)
├── schedules/          # Toàn bộ logic ca kíp & lịch làm
│   ├── api/            # getShifts.ts, createShift.ts
│   ├── pages/          # SchedulesPage.tsx
│   └── types/          # index.ts (Shift, CreateShiftDto)
├── finance/            # Toàn bộ logic hóa đơn & thu chi
│   ├── api/            # getInvoices.ts, createInvoice.ts
│   ├── pages/          # FinancePage.tsx
│   └── types/          # index.ts (Invoice, CreateInvoiceDto)
├── ocr/                # Toàn bộ logic bóc tách chứng từ AI
│   ├── api/            # scanReceipt.ts, getOcrDocuments.ts
│   ├── pages/          # OcrScanPage.tsx
│   └── types/          # index.ts (OcrDocument, ScanReceiptDto)
└── dashboard/          # Màn hình tổng quan kiến trúc hệ thống
```

---

## 2. Ranh Giới Giao Tiếp Với Microservices (API Gateway Rule)

- Frontend **TUYỆT ĐỐI KHÔNG** gọi trực tiếp các port nội bộ của backend (5001, 5002, 5003, 5004).
- Mọi request đều đi qua **API Gateway Trung Tâm (Port 5000)**:
  - File cấu hình: `apps/web/src/lib/axios.ts`
  - URL Base: `http://localhost:5000`
  - Gateway sẽ tự động proxy đến các service tương ứng dựa trên URL path:
    - `/api/employees/**` -> Employee Service
    - `/api/schedules/**` -> Schedule Service
    - `/api/finance/**` -> Finance Service
    - `/api/ocr/**` -> OCR Service

---

## 3. Phân Tách Server State & Client State

Một tiêu chuẩn quan trọng mà các công ty đánh giá cao:

1. **Server State (Dữ liệu từ API)**:
   - Dùng **TanStack Query (React Query v5)**.
   - Quản lý tự động cache, loading spinner, error handling, revalidate query.
   - Không lưu danh sách nhân viên hay hóa đơn vào Redux/Context/Zustand.
2. **Client State (Trạng thái giao diện)**:
   - Dùng **Zustand** (`src/stores/useThemeStore.ts`).
   - Quản lý đóng/mở Sidebar, Theme màu sắc, Auth Token của người dùng.

---

## 4. Hướng Dẫn Thêm Màn Hình Mới Cho Junior Developer

Khi cần thêm tính năng mới (Ví dụ: Quản lý Bàn ăn `tables`):

1. **Tạo thư mục**: `src/features/tables/`
2. **Định nghĩa Type** trong `types/index.ts`:
   ```ts
   export interface DiningTable {
     id: string;
     tableNumber: number;
     capacity: number;
     isOccupied: boolean;
   }
   ```
3. **Viết Hook API** trong `api/getTables.ts`:
   ```ts
   import { useQuery } from '@tanstack/react-query';
   import { apiClient } from '../../../lib/axios';
   import type { DiningTable } from '../types';

   export const useTables = () => useQuery({
     queryKey: ['tables'],
     queryFn: () => apiClient.get<DiningTable[]>('/api/tables').then(res => res.data),
   });
   ```
4. **Viết Giao diện** trong `pages/TablesPage.tsx` và gọi `const { data, isLoading } = useTables();`.
5. **Đăng ký Route** trong `src/routes/index.tsx`.
