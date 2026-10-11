# Hướng Dẫn Phát Triển Cho Junior Developer (Getting Started)

Chào bạn! Tài liệu này sẽ hướng dẫn bạn từng bước cách làm việc với codebase RestaurantOS hàng ngày.

---

## 1. Yêu Cầu Môi Trường Cần Chuẩn Bị

1. **.NET SDK 8.0**: Cài đặt bản 8.0.x LTS. Kiểm tra bằng lệnh:
   ```bash
   dotnet --version
   ```
2. **Editor Khuyến Nghị**:
   - Visual Studio 2022 (Community / Professional)
   - VS Code (kèm C# Dev Kit extension)
   - JetBrains Rider
3. **Git**: Kiểm tra bằng `git --version`.

---

## 2. Quy Trình Làm Việc Hàng Ngày (Workflow)

### Bước 1: Restore và Build toàn bộ Solution
Mỗi khi bạn pull code mới về, chạy lệnh:
```bash
dotnet restore backend/RestaurantOS.sln
dotnet build backend/RestaurantOS.sln
```

### Bước 2: Chạy bộ kiểm thử (Tests)
Trước khi commit bất kỳ thay đổi nào:
```bash
dotnet test backend/RestaurantOS.sln
```
Nếu có test failed, đọc kỹ thông báo lỗi ở màn hình terminal để debug trước khi commit.

### Bước 3: Chạy ứng dụng để test thủ công
Bạn có thể mở 2 cửa sổ terminal:
- **Terminal 1**: Chạy Gateway
  ```bash
  dotnet run --project backend/gateway/RestaurantOS.Gateway
  ```
- **Terminal 2**: Chạy service bạn đang phát triển (Ví dụ Employee Service)
  ```bash
  dotnet run --project backend/services/employee/RestaurantOS.Employee.Api
  ```

---

## 3. Hướng Dẫn Thêm Một Tính Năng Mới Vào Một Service

Khi bạn muốn thêm một tính năng nghiệp vụ (ví dụ: cập nhật số điện thoại nhân viên):

1. **Thêm logic vào Domain**:
   - Mở `RestaurantOS.Employee.Domain/Employee.cs`.
   - Thêm phương thức thay đổi trạng thái: `UpdatePhoneNumber(...)` có kiểm tra validation.
   - Viết **Unit Test** trong `RestaurantOS.UnitTests/DomainUnitTests.cs` để kiểm tra hàm này.
2. **Khai báo giao diện ở Application**:
   - Cập nhật DTO và phương thức trong `IEmployeeRepository.cs`.
3. **Cài đặt xử lý dữ liệu ở Infrastructure**:
   - Hiện thực hóa phương thức nếu cần truy vấn đặc biệt trong `EmployeeRepository.cs`.
4. **Expose API Endpoint ở Api**:
   - Mở `RestaurantOS.Employee.Api/Program.cs`.
   - Thêm endpoint `app.MapPut("/api/employees/{id:guid}/phone", ...)`.
5. **Chạy test xác minh**:
   - `dotnet test backend/RestaurantOS.sln`.

