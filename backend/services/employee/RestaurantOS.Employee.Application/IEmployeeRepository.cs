using RestaurantOS.Employee.Domain;

namespace RestaurantOS.Employee.Application;

public interface IEmployeeRepository
{
    Task<IReadOnlyList<Domain.Employee>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<Domain.Employee?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task AddAsync(Domain.Employee employee, CancellationToken cancellationToken = default);
    Task SaveChangesAsync(CancellationToken cancellationToken = default);
}

public record EmployeeDto(Guid Id, string FullName, string Email, string Role, bool IsActive, DateTime CreatedAtUtc);

public record CreateEmployeeRequest(string FullName, string Email, string? Role);

