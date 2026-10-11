using RestaurantOS.Employee.Application.DTOs;
using RestaurantOS.Employee.Domain;
using RestaurantOS.Employee.Domain.Repositories;

namespace RestaurantOS.Employee.Application.Services;

/// <summary>
/// Triển khai Use Cases quản lý nhân viên (Application Layer).
/// Điều phối giữa Repository và Domain Model, kiểm tra tính hợp lệ và ánh xạ DTO.
/// </summary>
public class EmployeeService : IEmployeeService
{
    private readonly IEmployeeRepository _repository;

    public EmployeeService(IEmployeeRepository repository)
    {
        _repository = repository;
    }

    public async Task<IReadOnlyList<EmployeeDto>> GetAllAsync(
        string? search = null, 
        string? role = null, 
        bool? isActive = null, 
        CancellationToken ct = default)
    {
        var employees = await _repository.GetAllAsync(search, role, isActive, ct);
        return employees.Select(MapToDto).ToList();
    }

    public async Task<EmployeeDto?> GetByIdAsync(Guid id, CancellationToken ct = default)
    {
        var employee = await _repository.GetByIdAsync(id, ct);
        return employee is null ? null : MapToDto(employee);
    }

    public async Task<EmployeeDto> CreateAsync(CreateEmployeeRequest request, CancellationToken ct = default)
    {
        // 1. Kiểm tra nghiệp vụ: Email đã tồn tại chưa
        var existing = await _repository.GetByEmailAsync(request.Email, ct);
        if (existing is not null)
        {
            throw new InvalidOperationException($"Địa chỉ email '{request.Email}' đã được sử dụng bởi một nhân viên khác.");
        }

        // 2. Khởi tạo Aggregate Root qua Factory Method
        var employee = Domain.Employee.Create(
            request.FullName,
            request.Email,
            request.Role,
            request.PhoneNumber,
            request.HourlyRate ?? 25000);

        // 3. Lưu thông qua Repository (gọi Stored Procedure sp_InsertEmployee)
        await _repository.AddAsync(employee, ct);

        return MapToDto(employee);
    }

    public async Task<EmployeeDto?> UpdateAsync(Guid id, UpdateEmployeeRequest request, CancellationToken ct = default)
    {
        var employee = await _repository.GetByIdAsync(id, ct);
        if (employee is null)
        {
            return null;
        }

        employee.UpdateInfo(
            request.FullName,
            request.PhoneNumber,
            request.Role,
            request.HourlyRate ?? employee.HourlyRate);

        // Gọi Stored Procedure sp_UpdateEmployee
        await _repository.UpdateAsync(employee, ct);
        return MapToDto(employee);
    }

    public async Task<bool?> ToggleStatusAsync(Guid id, CancellationToken ct = default)
    {
        var employee = await _repository.GetByIdAsync(id, ct);
        if (employee is null)
        {
            return null;
        }

        // Gọi Stored Procedure sp_ToggleEmployeeStatus
        var updatedStatus = await _repository.ToggleStatusAsync(id, ct);
        return updatedStatus;
    }

    public async Task<bool> DeleteAsync(Guid id, CancellationToken ct = default)
    {
        var employee = await _repository.GetByIdAsync(id, ct);
        if (employee is null)
        {
            return false;
        }

        // Gọi Stored Procedure sp_DeleteEmployee
        await _repository.DeleteAsync(employee, ct);
        return true;
    }

    private static EmployeeDto MapToDto(Domain.Employee e) =>
        new(
            e.Id,
            e.FullName,
            e.Email,
            e.PhoneNumber,
            e.Role,
            e.HourlyRate,
            e.IsActive,
            e.CreatedAtUtc);
}
