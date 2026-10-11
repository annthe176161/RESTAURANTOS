using RestaurantOS.Finance.Domain;

namespace RestaurantOS.Finance.Application;

public interface IFinanceRepository
{
    Task<IReadOnlyList<Invoice>> GetAllInvoicesAsync(CancellationToken cancellationToken = default);
    Task<Invoice?> GetInvoiceByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task AddInvoiceAsync(Invoice invoice, CancellationToken cancellationToken = default);
    Task SaveChangesAsync(CancellationToken cancellationToken = default);
}

public record InvoiceDto(Guid Id, string InvoiceNumber, decimal TotalAmount, string Currency, InvoiceStatus Status, DateTime IssuedAtUtc);

public record CreateInvoiceRequest(string InvoiceNumber, decimal TotalAmount, string? Currency);

