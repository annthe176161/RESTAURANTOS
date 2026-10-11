# Kiến Trúc Tổng Thể — RestaurantOS (Architecture Overview)

## 1. Triết lý Thiết kế

RestaurantOS được xây dựng ngay từ đầu theo mô hình **Microservices Architecture** quản lý tập trung qua **Monorepo**.

### Nguyên tắc bất biến:
1. **Business-Driven Boundaries**: Phân tách service theo năng lực nghiệp vụ (Business Capabilities), không phân tách máy móc theo kiểu kỹ thuật.
2. **Database-per-Service**: Mỗi service là chủ nhân duy nhất của cơ sở dữ liệu mà nó phụ thuộc. Không một service nào khác được phép đọc hoặc ghi trực tiếp vào DB của service khác.
3. **Autonomous & Deployable**: Mỗi service có thể biên dịch, chạy thử, chạy test và deploy độc lập.
4. **Không dùng Shared Business Project**: Không tạo một project `Shared` chứa chung Domain Model, Entity hay Business DTOs. Chia sẻ kiểu này biến Microservices thành "Distributed Monolith" (nguy hiểm nhất trong thiết kế phân tán).

---

## 2. Mô hình Kiến trúc Chi tiết

```text
                  +-----------------------------------+
                  |  Clients: Web (React) / Flutter   |
                  +-----------------+-----------------+
                                    |
                                    | HTTP / HTTPS (Port 5000)
                                    v
                  +-----------------------------------+
                  |        API Gateway (YARP)         |
                  |  - Reverse Proxy                  |
                  |  - Request Routing                |
                  |  - CORS & Central Health Check    |
                  +-----------------+-----------------+
                                    |
         +--------------------------+--------------------------+
         |                          |                          |
         v (Port 5001)              v (Port 5002)              v (Port 5003)
+------------------+       +------------------+       +------------------+
| Employee Service |       | Schedule Service |       | Finance Service  |
|  - Staff profile |       |  - Shifts        |       |  - Invoices      |
|  - Role / Status |       |  - Time tracking |       |  - Revenue / Pay |
+--------+---------+       +--------+---------+       +--------+---------+
         |                          |                          |
         v                          v                          v
   [employee.db]              [schedule.db]              [finance.db]
                                                               ^
                                                               | (Draft Data)
                                                      +--------+---------+
                                                      |   OCR Service    |
                                                      |  - Receipt Scan  |
                                                      |  - Text Extract  |
                                                      +--------+---------+
                                                               |
                                                               v
                                                           [ocr.db]
```

---

## 3. Vai trò của từng thành phần

### 3.1. API Gateway (YARP)
- Được phát triển bởi Microsoft trên nền tảng ASP.NET Core hiệu năng cực cao.
- Client chỉ cần giao tiếp với Gateway qua địa chỉ `http://localhost:5000`.
- Gateway định tuyến đường dẫn:
  - `/api/employees/**` -> `http://localhost:5001`
  - `/api/schedules/**` -> `http://localhost:5002`
  - `/api/finance/**` -> `http://localhost:5003`
  - `/api/ocr/**` -> `http://localhost:5004`
- Gateway không chứa nghiệp vụ nhà hàng (không tính tiền, không chấm công).

### 3.2. Clean Architecture bên trong mỗi Service
Mỗi service được tổ chức nhất quán theo 4 tầng:
1. **Domain**:
   - Trọng tâm nghiệp vụ. Chứa Entity, Value Object, Business Rule.
   - Hoàn toàn độc lập, không reference bất kỳ thư viện hoặc framework nào của bên thứ ba.
2. **Application**:
   - Chứa interface hợp đồng (Repository contracts), DTOs, Use Case workflows.
   - Reference `Domain`.
3. **Infrastructure**:
   - Hiện thực hóa việc truy xuất dữ liệu: Entity Framework Core DbContext, SQLite mapping, gọi adapter bên ngoài.
   - Reference `Domain` và `Application`.
4. **Api**:
   - Cung cấp HTTP Endpoints, cấu hình Dependency Injection, Middleware, Health Check.
   - Reference `Application` và `Infrastructure`.

