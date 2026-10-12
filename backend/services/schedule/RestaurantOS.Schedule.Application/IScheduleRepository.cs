using RestaurantOS.Schedule.Domain;

namespace RestaurantOS.Schedule.Application;

public interface IScheduleRepository
{
    Task<IReadOnlyList<Shift>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<IReadOnlyList<Shift>> GetByEmployeeIdAsync(Guid employeeId, CancellationToken cancellationToken = default);
    Task AddAsync(Shift shift, CancellationToken cancellationToken = default);
    Task SaveChangesAsync(CancellationToken cancellationToken = default);

    // Quản lý bản sao dữ liệu nhân viên (Read-Model nhận từ RabbitMQ)
    Task<IReadOnlyList<ScheduleEmployee>> GetActiveEmployeesAsync(CancellationToken cancellationToken = default);
    Task<ScheduleEmployee?> GetEmployeeByIdAsync(Guid employeeId, CancellationToken cancellationToken = default);
    Task UpsertEmployeeAsync(ScheduleEmployee employee, CancellationToken cancellationToken = default);
    Task DeleteEmployeeAsync(Guid employeeId, CancellationToken cancellationToken = default);
}

public record ShiftDto(
    Guid Id, 
    Guid EmployeeId, 
    string EmployeeName, 
    string EmployeeRole, 
    string ShiftName, 
    DateTime StartTimeUtc, 
    DateTime EndTimeUtc, 
    bool IsCancelled
);

public record CreateShiftRequest(Guid EmployeeId, string ShiftName, DateTime StartTimeUtc, DateTime EndTimeUtc);

public record ScheduleEmployeeDto(
    Guid Id,
    string FullName,
    string Email,
    string Role,
    string PhoneNumber,
    bool IsActive,
    DateTime LastSyncedAtUtc
);
