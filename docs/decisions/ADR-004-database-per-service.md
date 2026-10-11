# ADR-004: Áp Dụng Mô Hình Database-per-Service

## 1. Trạng Thái
**Đã phê duyệt (Accepted)** — Ngày 2026-10-11

## 2. Bối Cảnh (Context)
Khi xây dựng hệ thống quản lý nhà hàng, việc dùng chung một database cho tất cả các service là cám dỗ rất lớn đối với lập trình viên vì dễ viết câu lệnh JOIN SQL. Tuy nhiên, điều này sẽ phá hủy hoàn toàn khả năng mở rộng độc lập, dễ tạo ra khóa bảng lan truyền, và làm các service gắn chặt với nhau.

## 3. Quyết Định (Decision)
- Mỗi microservice sở hữu cơ sở dữ liệu riêng của mình (`employee.db`, `schedule.db`, `finance.db`, `ocr.db`).
- Tuyệt đối không cho phép Service A truy cập chuỗi kết nối (connection string) hoặc bảng DB của Service B.
- Mọi trao đổi dữ liệu bắt buộc thông qua API Endpoint hoặc Message/Event Contract.

## 4. Lý Do & Lợi Ích (Consequences)
- **Độc lập triển khai (Decoupling)**: Thay đổi cấu trúc bảng của Employee Service không bao giờ làm sập Finance Service.
- **Tối ưu hóa công nghệ**: Mỗi service có thể tự do lựa chọn loại CSDL phù hợp nhất với nhu cầu của mình trong tương lai (Quan hệ, Document, Time-series, Cache).
- **Hạn chế**: Không thể dùng khóa ngoại (Foreign Key) xuyên DB hoặc giao dịch SQL ACID bao quát toàn hệ thống. Việc này được xử lý bằng cách lưu ID tham chiếu và áp dụng tính nhất quán cuối cùng (Eventual Consistency).
