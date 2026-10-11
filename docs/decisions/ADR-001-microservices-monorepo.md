# ADR-001: Lựa Chọn Kiến Trúc Microservices Với Mô Hình Monorepo

## 1. Trạng Thái
**Đã phê duyệt (Accepted)** — Ngày 2026-10-11

## 2. Bối Cảnh (Context)
Dự án RestaurantOS định hướng phát triển lâu dài phục vụ cả Web, Mobile, OCR và các nghiệp vụ mở rộng trong tương lai. Cần lựa chọn mô hình tổ chức source code và phân chia hệ thống sao cho vừa có ranh giới rõ ràng giữa các service, vừa dễ quản lý mã nguồn, build và kiểm thử đối với lập trình viên.

## 3. Quyết Định (Decision)
- Áp dụng kiến trúc **Microservices** ngay từ đầu.
- Quản lý mã nguồn tập trung bằng mô hình **Monorepo** trong một Git repository duy nhất.
- Mỗi service có cấu trúc Clean Architecture riêng và project riêng biệt.

## 4. Ưu Điểm & Lý Do Lựa Chọn (Consequences)
### Ưu điểm:
- **Dễ refactor và quản lý**: Toàn bộ dự án nằm trong 1 solution tổng `RestaurantOS.sln`, giúp developer mở IDE xem được toàn cảnh hệ thống mà không cần mở nhiều repo khác nhau.
- **Tính tự chủ của service**: Từng service có thể build, test độc lập thông qua command line hoặc Dockerfile riêng.
- **Dễ dàng thiết lập CI/CD**: Một pipeline duy nhất có thể xác thực tính toàn vẹn của tất cả các service trước khi merge code.

### Rủi ro & Cách khắc phục:
- *Rủi ro*: Lập trình viên có thể vô tình reference chéo project giữa các service.
- *Khắc phục*: Sử dụng `Directory.Build.props` và rà soát CI pipeline nghiêm ngặt ngăn chặn reference chéo service.

