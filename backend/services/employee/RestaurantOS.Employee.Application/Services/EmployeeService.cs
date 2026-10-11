using RestaurantOS.Employee.Application.DTOs;
using RestaurantOS.Employee.Application.Interfaces;
using RestaurantOS.Employee.Domain;

namespace RestaurantOS.Employee.Application.Services;

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
        // 1. Kiểm tra tính hợp lệ
        if (string.IsNullOrWhiteSpace(request.FullName))
            throw new ArgumentException("Họ và tên nhân viên không được để trống.", nameof(request.FullName));

        if (string.IsNullOrWhiteSpace(request.Email))
            throw new ArgumentException("Email liên hệ không được để trống.", nameof(request.Email));

        // 2. Kiểm tra trùng lặp email
        var existing = await _repository.GetByEmailAsync(request.Email, ct);
        if (existing is not null)
        {
            throw new InvalidOperationException($"Địa chỉ email '{request.Email}' đã được sử dụng bởi một nhân viên khác.");
        }

        // 3. Khởi tạo Entity từ Domain
        var employee = new Domain.Employee(
            Guid.NewGuid(),
            request.FullName,
            request.Email,
            request.Role,
            request.PhoneNumber,
            request.HourlyRate ?? 25000);

        // 4. Lưu qua Repository
        await _repository.AddAsync(employee, ct);
        await _repository.SaveChangesAsync(ct);

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

        await _repository.SaveChangesAsync(ct);
        return MapToDto(employee);
    }

    public async Task<bool?> ToggleStatusAsync(Guid id, CancellationToken ct = default)
    {
        var employee = await _repository.GetByIdAsync(id, ct);
        if (employee is null)
        {
            return null;
        }

        employee.ToggleStatus();
        await _repository.SaveChangesAsync(ct);
        return employee.IsActive;
    }

    public async Task<bool> DeleteAsync(Guid id, CancellationToken ct = default)
    {
        var employee = await _repository.GetByIdAsync(id, ct);
        if (employee is null)
        {
            return false;
        }

        await _repository.DeleteAsync(employee, ct);
        await _repository.SaveChangesAsync(ct);
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

