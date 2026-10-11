using Microsoft.EntityFrameworkCore;
using RestaurantOS.Employee.Domain;

namespace RestaurantOS.Employee.Infrastructure.Persistence;

public class EmployeeDbContext : DbContext
{
    public EmployeeDbContext(DbContextOptions<EmployeeDbContext> options) : base(options) { }

    public DbSet<Domain.Employee> Employees => Set<Domain.Employee>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(EmployeeDbContext).Assembly);
    }
}

