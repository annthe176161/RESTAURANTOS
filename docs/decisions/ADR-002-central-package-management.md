# ADR-002: Áp Dụng Central Package Management (CPM)

## 1. Trạng Thái
**Đã phê duyệt (Accepted)** — Ngày 2026-10-11

## 2. Bối Cảnh (Context)
Trong một Monorepo có gần 20 project .NET, nếu từng file `.csproj` tự định nghĩa version thư viện NuGet (ví dụ Entity Framework Core, xUnit, Swashbuckle), việc nâng cấp hoặc đồng bộ phiên bản sẽ trở thành ác mộng, dễ xảy ra tình trạng "Dependency Hell" (Project A dùng EF 8.0.2, Project B dùng EF 8.0.8 gây xung đột assembly).

## 3. Quyết Định (Decision)
Kích hoạt tính năng **Central Package Management (CPM)** của MSBuild thông qua file `Directory.Packages.props` tại thư mục gốc.

## 4. Hệ Quả & Lợi Ích (Consequences)
### Lợi ích:
- **Quản lý phiên bản tập trung**: Toàn bộ version thư viện được khai báo duy nhất tại `Directory.Packages.props`.
- **File `.csproj` gọn gàng**: Các project con chỉ cần khai báo `<PackageReference Include="TênGói" />` mà không cần ghi số version.
- **Dễ dàng nâng cấp bảo mật**: Khi có bản vá lỗ hổng của thư viện, chỉ cần sửa 1 dòng trong file cấu hình gốc.

