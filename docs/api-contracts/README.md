# Quy Ước Thiết Kế API & Hợp Đồng Dữ Liệu (API Contracts)

## 1. Nguyên Tắc Thiết Kế RESTful

1. **Định dạng dữ liệu**: Toàn bộ Request và Response sử dụng JSON (`application/json`), mã hóa `UTF-8`.
2. **Quy tắc đặt tên Endpoint**:
   - Sử dụng danh từ số nhiều: `/api/employees`, `/api/schedules/shifts`, `/api/finance/invoices`.
   - Chữ thường, phân cách bằng dấu gạch ngang (kebab-case) nếu có nhiều từ: `/api/finance/payment-methods`.
3. **HTTP Methods chuẩn**:
   - `GET`: Lấy dữ liệu (Idempotent, Safe).
   - `POST`: Tạo mới tài nguyên.
   - `PUT`: Cập nhật toàn bộ tài nguyên.
   - `PATCH`: Cập nhật một phần tài nguyên.
   - `DELETE`: Xóa hoặc vô hiệu hóa tài nguyên.

---

## 2. Chuẩn Mã Phản Hồi (HTTP Status Codes)

| Mã | Tên | Ý nghĩa áp dụng |
| :--- | :--- | :--- |
| **200** | OK | Request thành công, trả về dữ liệu. |
| **201** | Created | Tạo mới thành công, kèm header `Location`. |
| **204** | No Content | Xử lý thành công nhưng không có body trả về (vd: Delete). |
| **400** | Bad Request | Dữ liệu đầu vào sai validation hoặc logic không hợp lệ. |
| **404** | Not Found | Không tìm thấy tài nguyên theo Id. |
| **409** | Conflict | Trùng lặp dữ liệu (vd: Email đã tồn tại). |
| **500** | Internal Error | Lỗi hệ thống chưa được kiểm soát. |

---

## 3. Định dạng Phản hồi Lỗi Chuẩn

Khi có lỗi `400` hoặc `422`, các service trả về format nhất quán:

```json
{
  "type": "https://restaurantos.local/errors/validation-error",
  "title": "Bad Request",
  "status": 400,
  "detail": "Email is required and must be valid format.",
  "instance": "/api/employees"
}
```

---

## 4. Chiến lược Phiên Bản Hóa API (API Versioning)

- **Giai đoạn hiện tại (Foundation)**: Sử dụng URL base `/api/{service}/*`.
- **Khi có Breaking Changes trong tương lai**:
  - Áp dụng URL Path Versioning: `/api/v1/employees` -> `/api/v2/employees`.
  - Giữ lại API cũ tối thiểu 6 tháng trước khi ngừng hỗ trợ (Deprecation Policy).
  - Khuyến khích các thay đổi không phá vỡ (Non-breaking changes): Thêm trường mới tùy chọn (optional field), không xóa hoặc đổi tên trường đang có.
