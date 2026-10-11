# ADR-003: Sử Dụng YARP Làm API Gateway

## 1. Trạng Thái
**Đã phê duyệt (Accepted)** — Ngày 2026-10-11

## 2. Bối Cảnh (Context)
Các client (Web React, Mobile Flutter) cần một điểm truy cập duy nhất để giao tiếp với hệ thống backend phân tán. Nếu client phải gọi trực tiếp từng cổng mạng của từng service (5001, 5002, 5003, 5004), client sẽ bị phụ thuộc chặt vào kiến trúc nội bộ, gặp khó khăn khi thay đổi cổng, SSL, và cấu hình CORS.

## 3. Quyết Định (Decision)
Sử dụng **YARP (Yet Another Reverse Proxy)** — một thư viện Reverse Proxy chính thức được phát triển bởi Microsoft trên nền tảng .NET để xây dựng `RestaurantOS.Gateway`.

## 4. Lý Do & Lợi Ích (Consequences)
- **Hiệu năng cực cao**: YARP tận dụng tối đa pipeline ASP.NET Core Kestrel và HTTP/2, HTTP/3.
- **Tích hợp tự nhiên với .NET**: Viết cấu hình routing trực tiếp trong `appsettings.json` hoặc code C#.
- **Loại bỏ sự cồng kềnh**: Không cần cài đặt các gateway bên ngoài như Kong, Nginx hoặc Ocelot vốn đã cũ và ít cập nhật.
- **Ranh giới rõ ràng**: Gateway chỉ làm nhiệm vụ proxy, SSL termination, CORS và Central Health Check, không ôm đồm business logic.
