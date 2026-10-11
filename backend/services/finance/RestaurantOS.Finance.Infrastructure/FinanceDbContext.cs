using Microsoft.EntityFrameworkCore;
using RestaurantOS.Finance.Application;
using RestaurantOS.Finance.Domain;

namespace RestaurantOS.Finance.Infrastructure;

public class FinanceDbContext : DbContext
{
    public FinanceDbContext(DbContextOptions<FinanceDbContext> options) : base(options) { }

    public DbSet<Invoice> Invoices => Set<Invoice>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Invoice>(entity =>
        {
            entity.HasKey(i => i.Id);
            entity.Property(i => i.InvoiceNumber).IsRequired().HasMaxLength(50);
            entity.Property(i => i.Currency).IsRequired().HasMaxLength(10);
            entity.Property(i => i.TotalAmount).HasColumnType("TEXT"); // SQLite safe
            entity.HasIndex(i => i.InvoiceNumber).IsUnique();
        });
    }
}

public class FinanceRepository : IFinanceRepository
{
    private readonly FinanceDbContext _dbContext;

    public FinanceRepository(FinanceDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<IReadOnlyList<Invoice>> GetAllInvoicesAsync(CancellationToken cancellationToken = default)
    {
        return await _dbContext.Invoices.AsNoTracking().ToListAsync(cancellationToken);
    }

    public async Task<Invoice?> GetInvoiceByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _dbContext.Invoices.FindAsync(new object[] { id }, cancellationToken);
    }

    public async Task AddInvoiceAsync(Invoice invoice, CancellationToken cancellationToken = default)
    {
        await _dbContext.Invoices.AddAsync(invoice, cancellationToken);
    }

    public async Task SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        await _dbContext.SaveChangesAsync(cancellationToken);
    }
}
