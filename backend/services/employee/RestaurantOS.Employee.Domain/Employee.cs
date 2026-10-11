namespace RestaurantOS.Employee.Domain;

public class Employee
{
    public Guid Id { get; private set; }
    public string FullName { get; private set; } = string.Empty;
    public string Email { get; private set; } = string.Empty;
    public string Role { get; private set; } = string.Empty;
    public bool IsActive { get; private set; }
    public DateTime CreatedAtUtc { get; private set; }

    // Private constructor for EF Core
    private Employee() { }

    public Employee(Guid id, string fullName, string email, string role)
    {
        if (string.IsNullOrWhiteSpace(fullName))
            throw new ArgumentException("Full name is required.", nameof(fullName));

        if (string.IsNullOrWhiteSpace(email))
            throw new ArgumentException("Email is required.", nameof(email));

        Id = id == Guid.Empty ? Guid.NewGuid() : id;
        FullName = fullName.Trim();
        Email = email.Trim().ToLowerInvariant();
        Role = string.IsNullOrWhiteSpace(role) ? "Staff" : role.Trim();
        IsActive = true;
        CreatedAtUtc = DateTime.UtcNow;
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

