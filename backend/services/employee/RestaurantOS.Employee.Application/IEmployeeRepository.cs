using RestaurantOS.Employee.Domain;

namespace RestaurantOS.Employee.Application;

public interface IEmployeeRepository
{
    Task<IReadOnlyList<Domain.Employee>> GetAllAsync(
        string? search = null, 
        string? role = null, 
        bool? isActive = null, 
        CancellationToken ct = default);

    Task<Domain.Employee?> GetByIdAsync(Guid id, CancellationToken ct = default);

    Task<Domain.Employee?> GetByEmailAsync(string email, CancellationToken ct = default);

    Task AddAsync(Domain.Employee employee, CancellationToken ct = default);

    Task DeleteAsync(Domain.Employee employee, CancellationToken ct = default);

    Task SaveChangesAsync(CancellationToken ct = default);
}

public record EmployeeDto(
    Guid Id, 
    string FullName, 
    string Email, 
    string PhoneNumber, 
    string Role, 
    decimal HourlyRate, 
    bool IsActive, 
    DateTime CreatedAtUtc);

public record CreateEmployeeRequest(
    string FullName, 
    string Email, 
    string? PhoneNumber, 
    string? Role, 
    decimal? HourlyRate);

public record UpdateEmployeeRequest(
    string FullName, 
    string? PhoneNumber, 
    string? Role, 
    decimal? HourlyRate);
