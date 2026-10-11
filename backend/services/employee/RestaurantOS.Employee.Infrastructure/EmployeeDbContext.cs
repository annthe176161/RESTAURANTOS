using Microsoft.EntityFrameworkCore;
using RestaurantOS.Employee.Application;
using RestaurantOS.Employee.Domain;

namespace RestaurantOS.Employee.Infrastructure;

public class EmployeeDbContext : DbContext
{
    public EmployeeDbContext(DbContextOptions<EmployeeDbContext> options) : base(options) { }

    public DbSet<Domain.Employee> Employees => Set<Domain.Employee>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Domain.Employee>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.FullName).IsRequired().HasMaxLength(150);
            entity.Property(e => e.Email).IsRequired().HasMaxLength(150);
            entity.Property(e => e.PhoneNumber).HasMaxLength(30);
            entity.Property(e => e.Role).IsRequired().HasMaxLength(50);
            entity.Property(e => e.HourlyRate).HasColumnType("TEXT"); // SQLite safe
            entity.HasIndex(e => e.Email).IsUnique();
        });
    }
}

public class EmployeeRepository : IEmployeeRepository
{
    private readonly EmployeeDbContext _dbContext;

    public EmployeeRepository(EmployeeDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<IReadOnlyList<Domain.Employee>> GetAllAsync(
        string? search = null, 
        string? role = null, 
        bool? isActive = null, 
        CancellationToken ct = default)
    {
        var query = _dbContext.Employees.AsNoTracking().AsQueryable();

        if (!string.IsNullOrWhiteSpace(search))
        {
            var term = search.Trim().ToLower();
            query = query.Where(e => e.FullName.ToLower().Contains(term) || e.Email.ToLower().Contains(term) || e.PhoneNumber.Contains(term));
        }

        if (!string.IsNullOrWhiteSpace(role) && role != "all")
        {
            query = query.Where(e => e.Role == role);
        }

        if (isActive.HasValue)
        {
            query = query.Where(e => e.IsActive == isActive.Value);
        }

        return await query.OrderByDescending(e => e.CreatedAtUtc).ToListAsync(ct);
    }

    public async Task<Domain.Employee?> GetByIdAsync(Guid id, CancellationToken ct = default)
    {
        return await _dbContext.Employees.FindAsync(new object[] { id }, ct);
    }

    public async Task<Domain.Employee?> GetByEmailAsync(string email, CancellationToken ct = default)
    {
        var normalized = email.Trim().ToLowerInvariant();
        return await _dbContext.Employees.FirstOrDefaultAsync(e => e.Email == normalized, ct);
    }

    public async Task AddAsync(Domain.Employee employee, CancellationToken ct = default)
    {
        await _dbContext.Employees.AddAsync(employee, ct);
    }

    public Task DeleteAsync(Domain.Employee employee, CancellationToken ct = default)
    {
        _dbContext.Employees.Remove(employee);
        return Task.CompletedTask;
    }

    public async Task SaveChangesAsync(CancellationToken ct = default)
    {
        await _dbContext.SaveChangesAsync(ct);
    }
}
