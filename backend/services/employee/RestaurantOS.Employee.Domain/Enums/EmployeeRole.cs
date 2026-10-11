namespace RestaurantOS.Employee.Domain.Enums;

/// <summary>
/// Chức danh / Vị trí làm việc của nhân sự trong nhà hàng.
/// </summary>
public enum EmployeeRole
{
    Waiter,     // Phục vụ
    Chef,       // Đầu bếp
    Cashier,    // Thu ngân
    Manager     // Quản lý
}

public static class EmployeeRoleExtensions
{
    public static string ToFriendlyName(this EmployeeRole role) => role switch
    {
        EmployeeRole.Manager => "Quản lý",
        EmployeeRole.Chef => "Đầu bếp",
        EmployeeRole.Cashier => "Thu ngân",
        _ => "Phục vụ"
    };

    public static EmployeeRole FromString(string? roleStr)
    {
        if (string.IsNullOrWhiteSpace(roleStr))
            return EmployeeRole.Waiter;

        return roleStr.Trim().ToLowerInvariant() switch
        {
            "quản lý" or "quan ly" or "manager" => EmployeeRole.Manager,
            "đầu bếp" or "dau bep" or "chef" or "cook" => EmployeeRole.Chef,
            "thu ngân" or "thu ngan" or "cashier" => EmployeeRole.Cashier,
            _ => EmployeeRole.Waiter
        };
    }
}

