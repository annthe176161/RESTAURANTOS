using RestaurantOS.Employee.Domain.Common;
using RestaurantOS.Employee.Domain.Enums;
using RestaurantOS.Employee.Domain.Exceptions;

namespace RestaurantOS.Employee.Domain;

/// <summary>
/// Aggregate Root đại diện cho Nhân sự trong nhà hàng.
/// Đảm bảo tính đóng gói (Encapsulation), bất biến dữ liệu, và quy tắc nghiệp vụ kinh doanh.
/// </summary>
public class Employee : BaseEntity<Guid>
{
    public string FullName { get; private set; } = string.Empty;
    public string Email { get; private set; } = string.Empty;
    public string PhoneNumber { get; private set; } = string.Empty;
    public string Role { get; private set; } = string.Empty;
    public decimal HourlyRate { get; private set; }
    public bool IsActive { get; private set; }

    // Constructor phục vụ EF Core
    private Employee() : base() { }

    /// <summary>
    /// Static Factory Method: Cách tạo Aggregate Root chuẩn trong DDD, thể hiện rõ ý định nghiệp vụ
    /// và đảm bảo Entity luôn ở trạng thái hợp lệ ngay từ lúc sinh ra (Always-Valid).
    /// </summary>
    public static Employee Create(
        string fullName, 
        string email, 
        string? role = null, 
        string? phoneNumber = null, 
        decimal hourlyRate = 0, 
        Guid? id = null)
    {
        return new Employee(
            id ?? Guid.NewGuid(),
            fullName,
            email,
            role,
            phoneNumber,
            hourlyRate);
    }

    public Employee(Guid id, string fullName, string email, string? role = null)
        : this(id, fullName, email, role, null, 0)
    {
    }

    public Employee(
        Guid id, 
        string fullName, 
        string email, 
        string? role, 
        string? phoneNumber, 
        decimal hourlyRate) 
        : base(id == Guid.Empty ? Guid.NewGuid() : id)
    {
        ValidateFullName(fullName);
        ValidateEmail(email);
        ValidateHourlyRate(hourlyRate);

        FullName = fullName.Trim();
        Email = email.Trim().ToLowerInvariant();
        Role = string.IsNullOrWhiteSpace(role) ? EmployeeRole.Waiter.ToFriendlyName() : role.Trim();
        PhoneNumber = phoneNumber?.Trim() ?? string.Empty;
        HourlyRate = hourlyRate;
        IsActive = true;
    }

    /// <summary>
    /// Cập nhật thông tin hồ sơ nhân viên và ghi nhận thời điểm cập nhật (Audit Trail).
    /// </summary>
    public void UpdateInfo(string fullName, string? phoneNumber, string? role, decimal hourlyRate)
    {
        ValidateFullName(fullName);
        ValidateHourlyRate(hourlyRate);

        FullName = fullName.Trim();
        PhoneNumber = phoneNumber?.Trim() ?? string.Empty;
        
        if (!string.IsNullOrWhiteSpace(role))
        {
            Role = role.Trim();
        }

        HourlyRate = hourlyRate;
        UpdatedAtUtc = DateTime.UtcNow;
    }

    /// <summary>
    /// Kích hoạt trạng thái làm việc (Ubiquitous Language chuẩn nghiệp vụ).
    /// </summary>
    public void Activate()
    {
        if (IsActive) return;

        IsActive = true;
        UpdatedAtUtc = DateTime.UtcNow;
    }

    /// <summary>
    /// Tạm dừng trạng thái làm việc (Ubiquitous Language chuẩn nghiệp vụ).
    /// </summary>
    public void Deactivate()
    {
        if (!IsActive) return;

        IsActive = false;
        UpdatedAtUtc = DateTime.UtcNow;
    }

    /// <summary>
    /// Chuyển đổi trạng thái hoạt động (phục vụ toggle action từ client).
    /// </summary>
    public void ToggleStatus()
    {
        if (IsActive)
            Deactivate();
        else
            Activate();
    }

    #region Business Validation Invariants (DRY)

    private static void ValidateFullName(string fullName)
    {
        if (string.IsNullOrWhiteSpace(fullName))
            throw new EmployeeDomainException("Họ và tên nhân viên không được để trống.", nameof(fullName));
        
        if (fullName.Trim().Length < 2)
            throw new EmployeeDomainException("Họ và tên nhân viên phải có ít nhất 2 ký tự.", nameof(fullName));
    }

    private static void ValidateEmail(string email)
    {
        if (string.IsNullOrWhiteSpace(email))
            throw new EmployeeDomainException("Email liên hệ không được để trống.", nameof(email));
        
        if (!email.Contains('@') || !email.Contains('.'))
            throw new EmployeeDomainException("Định dạng email không hợp lệ.", nameof(email));
    }

    private static void ValidateHourlyRate(decimal hourlyRate)
    {
        if (hourlyRate < 0)
            throw new EmployeeDomainException("Mức lương theo giờ không thể là số âm.", nameof(hourlyRate));
    }

    #endregion
}
