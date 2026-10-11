using RestaurantOS.Employee.Application.DTOs;

namespace RestaurantOS.Employee.Application.Services;

/// <summary>
/// Hợp đồng xử lý nghiệp vụ (Use Case Contract) cho quản lý nhân sự.
/// Phục vụ tầng ngoài (API Controller / Minimal API).
/// </summary>
public interface IEmployeeService
{
    Task<IReadOnlyList<EmployeeDto>> GetAllAsync(
        string? search = null, 
        string? role = null, 
        bool? isActive = null, 
        CancellationToken ct = default);

    Task<EmployeeDto?> GetByIdAsync(Guid id, CancellationToken ct = default);

    Task<EmployeeDto> CreateAsync(CreateEmployeeRequest request, CancellationToken ct = default);

    Task<EmployeeDto?> UpdateAsync(Guid id, UpdateEmployeeRequest request, CancellationToken ct = default);

    Task<bool?> ToggleStatusAsync(Guid id, CancellationToken ct = default);

    Task<bool> DeleteAsync(Guid id, CancellationToken ct = default);
}

