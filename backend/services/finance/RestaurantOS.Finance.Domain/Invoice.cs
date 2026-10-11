namespace RestaurantOS.Finance.Domain;

public enum InvoiceStatus
{
    Draft = 0,
    Paid = 1,
    Cancelled = 2
}

public class Invoice
{
    public Guid Id { get; private set; }
    public string InvoiceNumber { get; private set; } = string.Empty;
    public decimal TotalAmount { get; private set; }
    public string Currency { get; private set; } = "VND";
    public InvoiceStatus Status { get; private set; }
    public DateTime IssuedAtUtc { get; private set; }

    private Invoice() { }

    public Invoice(Guid id, string invoiceNumber, decimal totalAmount, string? currency = "VND")
    {
        if (string.IsNullOrWhiteSpace(invoiceNumber))
            throw new ArgumentException("InvoiceNumber is required.", nameof(invoiceNumber));

        if (totalAmount < 0)
            throw new ArgumentException("TotalAmount cannot be negative.", nameof(totalAmount));

        Id = id == Guid.Empty ? Guid.NewGuid() : id;
        InvoiceNumber = invoiceNumber.Trim().ToUpperInvariant();
        TotalAmount = totalAmount;
        Currency = string.IsNullOrWhiteSpace(currency) ? "VND" : currency.Trim().ToUpperInvariant();
        Status = InvoiceStatus.Draft;
        IssuedAtUtc = DateTime.UtcNow;
    }

    public void MarkAsPaid()
    {
        Status = InvoiceStatus.Paid;
    }

    public void Cancel()
    {
        Status = InvoiceStatus.Cancelled;
    }
}

