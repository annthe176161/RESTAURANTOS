using Microsoft.EntityFrameworkCore;
using RestaurantOS.Employee.Application.Interfaces;
using RestaurantOS.Employee.Domain;

namespace RestaurantOS.Employee.Infrastructure.Persistence.Repositories;

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

