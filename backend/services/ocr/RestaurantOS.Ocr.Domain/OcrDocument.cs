namespace RestaurantOS.Ocr.Domain;

public enum OcrStatus
{
    Pending = 0,
    Processed = 1,
    Failed = 2
}

public class OcrDocument
{
    public Guid Id { get; private set; }
    public string FileName { get; private set; } = string.Empty;
    public string ExtractedText { get; private set; } = string.Empty;
    public OcrStatus Status { get; private set; }
    public DateTime CreatedAtUtc { get; private set; }

    private OcrDocument() { }

    public OcrDocument(Guid id, string fileName)
    {
        if (string.IsNullOrWhiteSpace(fileName))
            throw new ArgumentException("FileName is required.", nameof(fileName));

        Id = id == Guid.Empty ? Guid.NewGuid() : id;
        FileName = fileName.Trim();
        ExtractedText = string.Empty;
        Status = OcrStatus.Pending;
        CreatedAtUtc = DateTime.UtcNow;
    }

    public void Complete(string extractedText)
    {
        ExtractedText = extractedText ?? string.Empty;
        Status = OcrStatus.Processed;
    }

    public void Fail()
    {
        Status = OcrStatus.Failed;
    }
}

