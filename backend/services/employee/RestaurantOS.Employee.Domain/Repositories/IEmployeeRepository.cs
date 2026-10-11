namespace RestaurantOS.Employee.Domain.Repositories;

/// <summary>
/// Hợp đồng lưu trữ (Persistence Contract) cho Aggregate Root Employee.
/// Thuộc về Domain Layer theo chuẩn Domain-Driven Design (DDD):
/// Domain định nghĩa yêu cầu lưu trữ, Infrastructure sẽ thực thi.
/// </summary>
public interface IEmployeeRepository
{
    Task<IReadOnlyList<Employee>> GetAllAsync(
        string? search = null, 
        string? role = null, 
        bool? isActive = null, 
        CancellationToken ct = default);

    Task<Employee?> GetByIdAsync(Guid id, CancellationToken ct = default);

    Task<Employee?> GetByEmailAsync(string email, CancellationToken ct = default);

    Task AddAsync(Employee employee, CancellationToken ct = default);

    Task UpdateAsync(Employee employee, CancellationToken ct = default);

    Task<bool> ToggleStatusAsync(Guid id, CancellationToken ct = default);

    Task DeleteAsync(Employee employee, CancellationToken ct = default);

    Task SaveChangesAsync(CancellationToken ct = default);
}
