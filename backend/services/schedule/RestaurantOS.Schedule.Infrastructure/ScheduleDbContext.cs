using Microsoft.EntityFrameworkCore;
using RestaurantOS.Schedule.Application;
using RestaurantOS.Schedule.Domain;

namespace RestaurantOS.Schedule.Infrastructure;

public class ScheduleDbContext : DbContext
{
    public ScheduleDbContext(DbContextOptions<ScheduleDbContext> options) : base(options) { }

    public DbSet<Shift> Shifts => Set<Shift>();

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
}

