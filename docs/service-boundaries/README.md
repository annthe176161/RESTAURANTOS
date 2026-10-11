# Ranh Giới Dịch Vụ & Quyền Sở Hữu Dữ Liệu (Service Boundaries & Data Ownership)

Tài liệu này định nghĩa rõ ranh giới trách nhiệm và quyền sở hữu dữ liệu của 4 Microservices ban đầu trong RestaurantOS.

---

## 1. Employee Service

- **Trách nhiệm chính**:
  - Quản lý thông tin hồ sơ nhân viên nhà hàng (Đầu bếp, Phục vụ, Thu ngân, Quản lý).
  - Trạng thái làm việc (Đang làm việc, Đã nghỉ việc).
- **Dữ liệu sở hữu**:
  - Bảng `Employees` (Id, FullName, Email, Role, IsActive, CreatedAtUtc).
- **Quyền hạn**:
  - Là **nguồn sự thật duy nhất (Single Source of Truth)** về danh tính và thông tin nhân viên.

---

## 2. Schedule Service

- **Trách nhiệm chính**:
  - Quản lý phân ca làm việc (Ca sáng, Ca chiều, Ca đêm).
  - Ghi nhận lịch làm việc và giờ công thực tế.
- **Dữ liệu sở hữu**:
  - Bảng `Shifts` (Id, EmployeeId, ShiftName, StartTimeUtc, EndTimeUtc, IsCancelled).
- **Quy tắc giao tiếp với Employee Service**:
  - **KHÔNG** tạo Foreign Key từ `Shifts.EmployeeId` sang bảng `Employees` của Employee Service.
  - Khi cần hiển thị ca làm việc kèm tên nhân viên, Schedule Service lưu trữ `EmployeeId` (UUID) và giao tiếp qua HTTP API nội bộ hoặc Event/Cache, không truy vấn chéo DB.

---

## 3. Finance Service

- **Trách nhiệm chính**:
  - Quản lý hóa đơn bán hàng (Invoices), thu - chi hàng ngày.
  - Báo cáo doanh số và theo dõi trạng thái thanh toán.
- **Dữ liệu sở hữu**:
  - Bảng `Invoices` (Id, InvoiceNumber, TotalAmount, Currency, Status, IssuedAtUtc).
- **Quyền hạn**:
  - Là nguồn sự thật duy nhất ghi nhận tiền bạc và tài chính của nhà hàng.

---

## 4. OCR Service

- **Trách nhiệm chính**:
  - Nhận diện và bóc tách chữ từ ảnh chụp hóa đơn nhập hàng / phiếu thu chi.
  - Tạo ra bản nháp trích xuất (Draft Receipt Extraction).
- **Dữ liệu sở hữu**:
  - Bảng `Documents` (Id, FileName, ExtractedText, Status, CreatedAtUtc).
- **Quy tắc phối hợp với Finance Service (Human-in-the-loop)**:
  - OCR Service **KHÔNG** tự ý ghi dữ liệu trực tiếp vào sổ cái của Finance Service.
  - Quá trình diễn ra như sau:
    1. Người dùng tải ảnh hóa đơn lên OCR Service.
    2. OCR Service bóc tách dữ liệu và trả về bản nháp (Draft).
    3. Người dùng trên Web/Mobile xem lại, chỉnh sửa các thông tin bóc tách sai (số tiền, tên mặt hàng).
    4. Sau khi người dùng xác nhận, Client gửi request sang Finance Service để tạo Hóa đơn chính thức.

---

## 5. Bảng Tổng Hợp Quyền Sở Hữu Dữ Liệu

| Service | Cơ sở dữ liệu | Bảng chính | Không được truy cập |
| :--- | :--- | :--- | :--- |
| **Employee** | `employee.db` | `Employees` | DB của Schedule, Finance, OCR |
| **Schedule** | `schedule.db` | `Shifts` | DB của Employee, Finance, OCR |
| **Finance** | `finance.db` | `Invoices` | DB của Employee, Schedule, OCR |
| **OCR** | `ocr.db` | `Documents` | DB của Employee, Schedule, Finance |
