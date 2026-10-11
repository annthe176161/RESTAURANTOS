using Microsoft.EntityFrameworkCore;
using RestaurantOS.Ocr.Application;
using RestaurantOS.Ocr.Domain;
using RestaurantOS.Ocr.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

var connectionString = builder.Configuration.GetConnectionString("OcrDb") ?? "Data Source=ocr.db";
builder.Services.AddDbContext<OcrDbContext>(options =>
    options.UseSqlite(connectionString));

builder.Services.AddScoped<IOcrRepository, OcrRepository>();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddHealthChecks();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<OcrDbContext>();
    db.Database.EnsureCreated();
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.MapHealthChecks("/health");

app.MapGet("/api/ocr/documents", async (IOcrRepository repository, CancellationToken ct) =>
{
    var list = await repository.GetAllAsync(ct);
    var result = list.Select(d => new OcrDocumentDto(d.Id, d.FileName, d.ExtractedText, d.Status, d.CreatedAtUtc));
    return Results.Ok(result);
});

app.MapGet("/api/ocr/documents/{id:guid}", async (Guid id, IOcrRepository repository, CancellationToken ct) =>
{
    var doc = await repository.GetByIdAsync(id, ct);
    if (doc is null)
    {
        return Results.NotFound();
    }
    return Results.Ok(new OcrDocumentDto(doc.Id, doc.FileName, doc.ExtractedText, doc.Status, doc.CreatedAtUtc));
});

app.MapPost("/api/ocr/scan", async (ScanReceiptRequest request, IOcrRepository repository, CancellationToken ct) =>
{
    try
    {
        var doc = new OcrDocument(Guid.NewGuid(), request.FileName);
        // Foundation demo: simulate text extraction logic
        var simulatedExtractedText = request.MockRawContent ?? $"RECEIPT #{Random.Shared.Next(1000, 9999)} - TOTAL: 150000 VND";
        doc.Complete(simulatedExtractedText);

        await repository.AddAsync(doc, ct);
        await repository.SaveChangesAsync(ct);

        var dto = new OcrDocumentDto(doc.Id, doc.FileName, doc.ExtractedText, doc.Status, doc.CreatedAtUtc);
        return Results.Created($"/api/ocr/documents/{doc.Id}", dto);
    }
    catch (ArgumentException ex)
    {
        return Results.BadRequest(new { error = ex.Message });
    }
});

app.Run();

namespace RestaurantOS.Ocr.Api
{
    public partial class OcrMarker { }
}
