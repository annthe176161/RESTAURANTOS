using RestaurantOS.Schedule.Domain;

namespace RestaurantOS.Schedule.Application;

public interface IScheduleRepository
{
    Task<IReadOnlyList<Shift>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<IReadOnlyList<Shift>> GetByEmployeeIdAsync(Guid employeeId, CancellationToken cancellationToken = default);
    Task AddAsync(Shift shift, CancellationToken cancellationToken = default);
    Task SaveChangesAsync(CancellationToken cancellationToken = default);
}

public record ShiftDto(Guid Id, Guid EmployeeId, string ShiftName, DateTime StartTimeUtc, DateTime EndTimeUtc, bool IsCancelled);

public record CreateShiftRequest(Guid EmployeeId, string ShiftName, DateTime StartTimeUtc, DateTime EndTimeUtc);
