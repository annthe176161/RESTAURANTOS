namespace RestaurantOS.Schedule.Domain;

/// <summary>
/// Read-model / Bản sao thông tin nhân viên trong Schedule Service.
/// Dữ liệu này được tự động đồng bộ từ Employee Service qua RabbitMQ (Event-Driven).
/// </summary>
public class ScheduleEmployee
{
    public Guid Id { get; private set; }
    public string FullName { get; private set; } = string.Empty;
    public string Email { get; private set; } = string.Empty;
    public string Role { get; private set; } = string.Empty;
    public string PhoneNumber { get; private set; } = string.Empty;
    public bool IsActive { get; private set; }
    public DateTime LastSyncedAtUtc { get; private set; }

    private ScheduleEmployee() { }

    public ScheduleEmployee(
        Guid id, 
        string fullName, 
        string email, 
        string role, 
        string phoneNumber, 
        bool isActive, 
        DateTime lastSyncedAtUtc)
    {
        Id = id;
        FullName = fullName;
        Email = email;
        Role = role;
        PhoneNumber = phoneNumber;
        IsActive = isActive;
        LastSyncedAtUtc = lastSyncedAtUtc;
    }

    public void UpdateInfo(string fullName, string phoneNumber, string role, bool isActive)
    {
        FullName = fullName;
        PhoneNumber = phoneNumber;
        Role = role;
        IsActive = isActive;
        LastSyncedAtUtc = DateTime.UtcNow;
    }

    public void SetStatus(bool isActive)
    {
        IsActive = isActive;
        LastSyncedAtUtc = DateTime.UtcNow;
    }
}

