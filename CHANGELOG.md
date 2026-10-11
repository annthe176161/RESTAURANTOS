# Changelog

Tất cả các thay đổi đáng chú ý của dự án RestaurantOS sẽ được ghi lại trong tài liệu này theo chuẩn [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) và tuân thủ [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [0.1.0] - 2026-10-11
### Khởi tạo - Phase 1: Project Foundation & Microservices Architecture

#### Added
- **Monorepo Foundation**:
  - `global.json` khóa SDK .NET `8.0.204` với cơ chế `rollForward: latestFeature`.
  - `Directory.Build.props` chuẩn hóa C# 12, Nullable Reference Types, và quy tắc biên dịch chung.
  - `Directory.Packages.props` kích hoạt Central Package Management (CPM) cho toàn bộ giải pháp.
  - `.editorconfig`, `.gitignore`, `.dockerignore`, `.env.example`.
- **API Gateway**:
  - Tích hợp YARP (Yet Another Reverse Proxy) định tuyến request động tới 4 dịch vụ backend.
  - Cấu hình Health Check endpoint `/health`.
- **Backend Microservices**:
  - `Employee Service`: Quản lý hồ sơ nhân viên, trạng thái hoạt động và CSDL SQLite riêng.
  - `Schedule Service`: Quản lý phân ca làm việc, ca kíp theo `EmployeeId` không phụ thuộc DB nhân viên.
  - `Finance Service`: Quản lý hóa đơn thu chi, trạng thái thanh toán và CSDL riêng.
  - `OCR Service`: Quản lý tài liệu bóc tách hóa đơn, mô phỏng quá trình OCR và kết quả draft.
- **Testing**:
  - `RestaurantOS.UnitTests`: Bộ kiểm thử đơn vị cho toàn bộ Domain logic của 4 service (11 tests passed).
  - `RestaurantOS.IntegrationTests`: Bộ kiểm thử tích hợp kiểm tra endpoint Health Check của Gateway và 4 services (6 tests passed).
- **Deployment & Infrastructure**:
  - Multi-stage `Dockerfile` cho Gateway và từng service.
  - `docker-compose.yml` hỗ trợ cấu hình mạng nội bộ và persistent volumes.
  - GitHub Actions CI workflow tự động kiểm thử và build.
- **Tài liệu**:
  - Tài liệu kiến trúc tổng thể, ranh giới dịch vụ, API contracts, chiến lược database, và bộ tài liệu quyết định kiến trúc ADR (001 - 004).
