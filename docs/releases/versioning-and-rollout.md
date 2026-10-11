# Quy Trình Quản Lý Phiên Bản & Phát Hành (Versioning & Rollout)

## 1. Nguyên Tắc Semantic Versioning (SemVer 2.0)

Phiên bản có dạng: `MAJOR.MINOR.PATCH`

- **MAJOR**: Tăng khi có thay đổi phá vỡ tương thích (Breaking Changes, ví dụ đổi cấu trúc API bắt buộc client phải sửa code).
- **MINOR**: Tăng khi bổ sung tính năng mới nhưng vẫn tương thích ngược (Backward-compatible feature).
- **PATCH**: Tăng khi sửa lỗi hoặc vá bảo mật (Bug fixes, Security patches).

---

## 2. Phiên Bản Độc Lập Giữa Các Service

- Trong hệ thống Microservices, **không bắt buộc tất cả service phải cùng số version**.
- Ví dụ trong thực tế:
  - `RestaurantOS.Gateway`: `v1.2.0`
  - `RestaurantOS.Employee`: `v2.0.1`
  - `RestaurantOS.Finance`: `v1.5.0`
- Việc này cho phép team phát triển deploy một tính năng nhỏ cho Employee Service mà không cần release lại toàn bộ Finance Service hay Gateway.

---

## 3. Quản Lý Docker Image Tags

Khi build image trên CI/CD:
- Không sử dụng tag `:latest` trên môi trường Production (vì `:latest` không thể hiện rõ bản build nào đang chạy).
- Sử dụng tag kết hợp giữa Git commit SHA và SemVer:
  - `restaurantos-employee:0.1.0-sha-a1b2c3d`

---

## 4. Chiến Lược Rollback Khi Có Sự Cố

1. **Rollback Code / Container**:
   - Nếu bản release `0.1.1` gặp sự cố, chỉ cần điều chỉnh cấu hình container trỏ lại image trước đó `0.1.0`.
2. **Rollback Cơ Sở Dữ Liệu**:
   - Tuân thủ nguyên tắc Expand/Contract (chỉ thêm cột mới, không xóa cột cũ ngay).
   - Nhờ đó, việc rollback code về phiên bản cũ sẽ không gây sập ứng dụng do thiếu cột trong CSDL.
