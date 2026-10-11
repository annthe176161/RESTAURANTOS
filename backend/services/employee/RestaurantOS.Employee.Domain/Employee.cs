namespace RestaurantOS.Employee.Domain;

public class Employee
{
    public Guid Id { get; private set; }
    public string FullName { get; private set; } = string.Empty;
    public string Email { get; private set; } = string.Empty;
    public string PhoneNumber { get; private set; } = string.Empty;
    public string Role { get; private set; } = string.Empty;
    public decimal HourlyRate { get; private set; }
    public bool IsActive { get; private set; }
    public DateTime CreatedAtUtc { get; private set; }

    // Private constructor for EF Core
    private Employee() { }

    public Employee(Guid id, string fullName, string email, string? role = null)
        : this(id, fullName, email, role, null, 0)
    {
    }

    public Employee(Guid id, string fullName, string email, string? role, string? phoneNumber, decimal hourlyRate)
    {
        if (string.IsNullOrWhiteSpace(fullName))
            throw new ArgumentException("Họ và tên nhân viên không được để trống.", nameof(fullName));

        if (string.IsNullOrWhiteSpace(email))
            throw new ArgumentException("Email liên hệ không được để trống.", nameof(email));

        if (hourlyRate < 0)
            throw new ArgumentException("Mức lương theo giờ không thể là số âm.", nameof(hourlyRate));

        Id = id == Guid.Empty ? Guid.NewGuid() : id;
        FullName = fullName.Trim();
        Email = email.Trim().ToLowerInvariant();
        Role = string.IsNullOrWhiteSpace(role) ? "Phục vụ" : role.Trim();
        PhoneNumber = phoneNumber?.Trim() ?? string.Empty;
        HourlyRate = hourlyRate;
        IsActive = true;
        CreatedAtUtc = DateTime.UtcNow;
    }

    public void UpdateInfo(string fullName, string? phoneNumber, string? role, decimal hourlyRate)
    {
        if (string.IsNullOrWhiteSpace(fullName))
            throw new ArgumentException("Họ và tên nhân viên không được để trống.", nameof(fullName));

        if (hourlyRate < 0)
            throw new ArgumentException("Mức lương theo giờ không thể là số âm.", nameof(hourlyRate));

        FullName = fullName.Trim();
        PhoneNumber = phoneNumber?.Trim() ?? string.Empty;
        if (!string.IsNullOrWhiteSpace(role))
        {
            Role = role.Trim();
        }
        HourlyRate = hourlyRate;
    }

    public void ToggleStatus()
    {
        IsActive = !IsActive;
    }

    public void Deactivate()
    {
        IsActive = false;
    }

    public void Activate()
    {
        IsActive = true;
    }
}
