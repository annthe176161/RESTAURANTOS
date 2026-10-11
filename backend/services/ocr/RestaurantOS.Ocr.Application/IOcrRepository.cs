using RestaurantOS.Ocr.Domain;

namespace RestaurantOS.Ocr.Application;

public interface IOcrRepository
{
    Task<IReadOnlyList<OcrDocument>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<OcrDocument?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task AddAsync(OcrDocument document, CancellationToken cancellationToken = default);
    Task SaveChangesAsync(CancellationToken cancellationToken = default);
}

public record OcrDocumentDto(Guid Id, string FileName, string ExtractedText, OcrStatus Status, DateTime CreatedAtUtc);

public record ScanReceiptRequest(string FileName, string? MockRawContent);
