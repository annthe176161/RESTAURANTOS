# RestaurantOS — Hệ Thống Quản Lý Nhà Hàng (Microservices)

Chào mừng bạn đến với **RestaurantOS** — nền tảng quản lý nhà hàng xây dựng trên kiến trúc Microservices hiện đại bằng .NET 8 LTS.

---

## 1. Tổng quan Kiến trúc

Hệ thống được thiết kế theo mô hình **Monorepo** với các Microservices độc lập:

```text
[ Client: Web / Mobile ]
           │
           ▼ (HTTP Port 5000)
    [ API Gateway (YARP) ]
      ├── /api/employees/* ──► [ Employee Service ] (Port 5001) ──► DB: employee.db
      ├── /api/schedules/* ──► [ Schedule Service ] (Port 5002) ──► DB: schedule.db
      ├── /api/finance/*   ──► [ Finance Service ]  (Port 5003) ──► DB: finance.db
      └── /api/ocr/*       ──► [ OCR Service ]      (Port 5004) ──► DB: ocr.db
```

### Điểm nổi bật về mặt kỹ thuật:
- **Ngôn ngữ & Nền tảng**: .NET 8.0 LTS, C# 12, ASP.NET Core.
- **Monorepo Management**:
  - `global.json`: Cố định SDK version.
  - `Directory.Build.props`: Cấu hình compiler, Nullable types, C# 12 tập trung.
  - `Directory.Packages.props`: Central Package Management (CPM) quản lý toàn bộ thư viện NuGet tại một nơi duy nhất.
- **API Gateway**: YARP (Yet Another Reverse Proxy) định tuyến request động, loại bỏ việc client phải nhớ từng địa chỉ IP/port của service.
- **Data Isolation**: Áp dụng triệt để nguyên tắc **Database-per-Service**. Mỗi service sở hữu DbContext và CSDL riêng biệt (SQLite cho local dev, sẵn sàng chuyển PostgreSQL khi production).
- **Clean Architecture**: Mỗi service chia thành 4 lớp độc lập: `Domain`, `Application`, `Infrastructure`, `Api`.

---

## 2. Hướng dẫn khởi chạy Local Development

### Yêu cầu tiên quyết:
- Đã cài đặt [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0).

### Cách 1: Chạy toàn bộ Test để xác minh hệ thống
```bash
dotnet test backend/RestaurantOS.sln
```

### Cách 2: Chạy từng Service độc lập bằng Terminal
Bạn có thể mở từng cửa sổ terminal và chạy:

**1. Khởi chạy Employee Service (Port 5001):**
```bash
dotnet run --project backend/services/employee/RestaurantOS.Employee.Api
```

**2. Khởi chạy Schedule Service (Port 5002):**
```bash
dotnet run --project backend/services/schedule/RestaurantOS.Schedule.Api
```

**3. Khởi chạy Finance Service (Port 5003):**
```bash
dotnet run --project backend/services/finance/RestaurantOS.Finance.Api
```

**4. Khởi chạy OCR Service (Port 5004):**
```bash
dotnet run --project backend/services/ocr/RestaurantOS.Ocr.Api
```

**5. Khởi chạy API Gateway (Port 5000):**
```bash
dotnet run --project backend/gateway/RestaurantOS.Gateway
```

**6. Khởi chạy Web Frontend (Port 5173):**
```bash
cd apps/web
npm run dev
```
Truy cập trình duyệt: `http://localhost:5173` để trải nghiệm giao diện quản trị đầy đủ.

### Kiểm tra kết quả qua Gateway:
- **Kiểm tra Gateway status**: `GET http://localhost:5000/`
- **Kiểm tra Health Gateway**: `GET http://localhost:5000/health`
- **Lấy danh sách nhân viên qua Gateway**: `GET http://localhost:5000/api/employees`
- **Lấy danh sách ca làm qua Gateway**: `GET http://localhost:5000/api/schedules/shifts`
- **Lấy danh sách hóa đơn qua Gateway**: `GET http://localhost:5000/api/finance/invoices`
- **Gửi ảnh quét hóa đơn OCR qua Gateway**: `POST http://localhost:5000/api/ocr/scan`

---

## 3. Khởi chạy bằng Docker & Docker Compose (Khi có Docker)
Nếu máy bạn đã cài Docker Desktop:
```bash
docker compose -f deploy/compose/docker-compose.yml up --build -d
```
Xem log container:
```bash
docker compose -f deploy/compose/docker-compose.yml logs -f
```
Dừng hệ thống:
```bash
docker compose -f deploy/compose/docker-compose.yml down
```

---

## 4. Cấu trúc tài liệu chi tiết trong thư mục `docs/`

- [`docs/architecture/overview.md`](docs/architecture/overview.md): Kiến trúc tổng thể và luồng dữ liệu.
- [`docs/service-boundaries/README.md`](docs/service-boundaries/README.md): Chi tiết ranh giới nghiệp vụ & phân quyền dữ liệu.
- [`docs/api-contracts/README.md`](docs/api-contracts/README.md): Quy ước đặt tên API, format dữ liệu & versioning.
- [`docs/database/strategy.md`](docs/database/strategy.md): Chiến lược migration và quản lý CSDL phân tán.
- [`docs/development/getting-started.md`](docs/development/getting-started.md): Hướng dẫn cho Junior Developer thiết lập môi trường và code mới.
- [`docs/releases/versioning-and-rollout.md`](docs/releases/versioning-and-rollout.md): Quy chuẩn Semantic Versioning và rollout từng service.
- [`docs/decisions/`](docs/decisions/): Các Architecture Decision Record (ADR-001 đến ADR-004).

