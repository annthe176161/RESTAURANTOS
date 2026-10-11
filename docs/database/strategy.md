# Chiến Lược Quản Lý Cơ Sở Dữ Liệu & Migrations (Database Strategy)

## 1. Triết Lý Database-per-Service

Trong hệ thống RestaurantOS:
- Mỗi microservice sở hữu CSDL riêng biệt.
- **Không có CSDL dùng chung (No Shared Database)**: Employee không đọc DB Finance; Schedule không đọc DB Employee.
- Ngăn chặn triệt để tình trạng "Database Monolith" và khóa bảng liên dịch vụ (Cross-service table locks).

---

## 2. Công Nghệ CSDL Theo Từng Môi Trường

### Môi trường Local Development & CI:
- **Công nghệ**: SQLite (`Microsoft.EntityFrameworkCore.Sqlite`).
- **Lý do**:
  - Không đòi hỏi cài đặt máy chủ DB hay Docker daemon nặng nề.
  - Tự động tạo file database cục bộ (`employee.db`, `schedule.db`, `finance.db`, `ocr.db`) thông qua `EnsureCreated()` hoặc EF Migrations.
  - Thời gian khởi động test dưới 1 giây, cực kỳ tiện lợi cho Junior Developer học tập và debug.

### Môi trường Staging & Production:
- **Công nghệ định hướng**: PostgreSQL (`Npgsql.EntityFrameworkCore.PostgreSQL`).
- **Cách chuyển đổi**:
  - Mỗi service chỉ cần thay đổi cấu hình `ConnectionStrings` và đăng ký provider `UseNpgsql` trong tầng `Infrastructure`.
  - Toàn bộ Domain và Application logic không bị ảnh hưởng.

---

## 3. Quản Lý Migration & Schema Changes

- Sử dụng Entity Framework Core Migrations cho từng service:
  ```bash
  # Ví dụ tạo migration cho Employee Service:
  dotnet ef migrations add InitialCreate --project backend/services/employee/RestaurantOS.Employee.Infrastructure --startup-project backend/services/employee/RestaurantOS.Employee.Api
  ```
- **Quy tắc Rollout Schema an toàn**:
  1. *Expand Phase*: Thêm cột mới (nullable hoặc có default value), deploy code mới đọc được cả cột cũ và mới.
  2. *Migrate Phase*: Chuyển đổi dữ liệu cũ sang định dạng mới.
  3. *Contract Phase*: Xóa cột cũ sau khi toàn bộ hệ thống đã ổn định.

---

## 4. Xử Lý Giao Dịch Phân Tán (Distributed Transactions)

- Trong mô hình Microservices, **không thể dùng `BEGIN TRANSACTION ... COMMIT` của SQL trên nhiều database khác nhau**.
- Không lạm dụng Two-Phase Commit (2PC) vì gây tắc nghẽn hiệu năng mạng.
- **Hướng tiếp cận của RestaurantOS**:
  - Mỗi service đảm bảo tính nhất quán nội bộ (ACID) trong database của riêng mình.
  - Phối hợp giữa các service sử dụng nguyên lý **Eventual Consistency** (Nhất quán cuối cùng) thông qua Message Broker hoặc Transactional Outbox Pattern khi hệ thống phát triển thêm các nghiệp vụ phức tạp.
