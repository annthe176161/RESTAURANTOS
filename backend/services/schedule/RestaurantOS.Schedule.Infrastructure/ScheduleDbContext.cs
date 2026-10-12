using Microsoft.EntityFrameworkCore;
using RestaurantOS.Schedule.Application;
using RestaurantOS.Schedule.Domain;

namespace RestaurantOS.Schedule.Infrastructure;

public class ScheduleDbContext : DbContext
{
    public ScheduleDbContext(DbContextOptions<ScheduleDbContext> options) : base(options) { }

    public DbSet<Shift> Shifts => Set<Shift>();
    public DbSet<ScheduleEmployee> Employees => Set<ScheduleEmployee>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Shift>(entity =>
        {
            entity.HasKey(s => s.Id);
            entity.Property(s => s.ShiftName).IsRequired().HasMaxLength(100);
            entity.Property(s => s.EmployeeId).IsRequired();
            entity.HasIndex(s => s.EmployeeId);
        });

        modelBuilder.Entity<ScheduleEmployee>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.FullName).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Email).HasMaxLength(100);
            entity.Property(e => e.Role).HasMaxLength(50);
            entity.Property(e => e.PhoneNumber).HasMaxLength(20);
        });
    }
}

public class ScheduleRepository : IScheduleRepository
{
    private readonly ScheduleDbContext _dbContext;

    public ScheduleRepository(ScheduleDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<IReadOnlyList<Shift>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await _dbContext.Shifts.AsNoTracking().ToListAsync(cancellationToken);
    }

    public async Task<IReadOnlyList<Shift>> GetByEmployeeIdAsync(Guid employeeId, CancellationToken cancellationToken = default)
    {
        return await _dbContext.Shifts
            .AsNoTracking()
            .Where(s => s.EmployeeId == employeeId)
            .ToListAsync(cancellationToken);
    }

    public async Task AddAsync(Shift shift, CancellationToken cancellationToken = default)
    {
        await _dbContext.Shifts.AddAsync(shift, cancellationToken);
    }

    public async Task SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        await _dbContext.SaveChangesAsync(cancellationToken);
    }

    public async Task<IReadOnlyList<ScheduleEmployee>> GetActiveEmployeesAsync(CancellationToken cancellationToken = default)
    {
        return await _dbContext.Employees
            .AsNoTracking()
            .Where(e => e.IsActive)
            .ToListAsync(cancellationToken);
    }

    public async Task<ScheduleEmployee?> GetEmployeeByIdAsync(Guid employeeId, CancellationToken cancellationToken = default)
    {
        return await _dbContext.Employees
            .FirstOrDefaultAsync(e => e.Id == employeeId, cancellationToken);
    }

    public async Task UpsertEmployeeAsync(ScheduleEmployee employee, CancellationToken cancellationToken = default)
    {
        var existing = await _dbContext.Employees.FindAsync(new object[] { employee.Id }, cancellationToken);
        if (existing is null)
        {
            await _dbContext.Employees.AddAsync(employee, cancellationToken);
        }
        else
        {
            existing.UpdateInfo(employee.FullName, employee.PhoneNumber, employee.Role, employee.IsActive);
        }
    }

    public async Task DeleteEmployeeAsync(Guid employeeId, CancellationToken cancellationToken = default)
    {
        var existing = await _dbContext.Employees.FindAsync(new object[] { employeeId }, cancellationToken);
        if (existing is not null)
        {
            _dbContext.Employees.Remove(existing);
        }
    }
}
