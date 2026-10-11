using Microsoft.EntityFrameworkCore;
using RestaurantOS.Ocr.Application;
using RestaurantOS.Ocr.Domain;

namespace RestaurantOS.Ocr.Infrastructure;

public class OcrDbContext : DbContext
{
    public OcrDbContext(DbContextOptions<OcrDbContext> options) : base(options) { }

    public DbSet<OcrDocument> Documents => Set<OcrDocument>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<OcrDocument>(entity =>
        {
            entity.HasKey(d => d.Id);
            entity.Property(d => d.FileName).IsRequired().HasMaxLength(255);
            entity.Property(d => d.ExtractedText).IsRequired();
        });
    }
}

public class OcrRepository : IOcrRepository
{
    private readonly OcrDbContext _dbContext;

    public OcrRepository(OcrDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<IReadOnlyList<OcrDocument>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await _dbContext.Documents.AsNoTracking().ToListAsync(cancellationToken);
    }

    public async Task<OcrDocument?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _dbContext.Documents.FindAsync(new object[] { id }, cancellationToken);
    }

    public async Task AddAsync(OcrDocument document, CancellationToken cancellationToken = default)
    {
        await _dbContext.Documents.AddAsync(document, cancellationToken);
    }

    public async Task SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        await _dbContext.SaveChangesAsync(cancellationToken);
    }
}

