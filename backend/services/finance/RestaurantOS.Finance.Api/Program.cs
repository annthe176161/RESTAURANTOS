using Microsoft.EntityFrameworkCore;
using RestaurantOS.Finance.Application;
using RestaurantOS.Finance.Domain;
using RestaurantOS.Finance.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

var connectionString = builder.Configuration.GetConnectionString("FinanceDb") ?? "Data Source=finance.db";
builder.Services.AddDbContext<FinanceDbContext>(options =>
    options.UseSqlite(connectionString));

builder.Services.AddScoped<IFinanceRepository, FinanceRepository>();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddHealthChecks();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<FinanceDbContext>();
    db.Database.EnsureCreated();
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.MapHealthChecks("/health");

app.MapGet("/api/finance/invoices", async (IFinanceRepository repository, CancellationToken ct) =>
{
    var list = await repository.GetAllInvoicesAsync(ct);
    var result = list.Select(i => new InvoiceDto(i.Id, i.InvoiceNumber, i.TotalAmount, i.Currency, i.Status, i.IssuedAtUtc));
    return Results.Ok(result);
});

app.MapGet("/api/finance/invoices/{id:guid}", async (Guid id, IFinanceRepository repository, CancellationToken ct) =>
{
    var invoice = await repository.GetInvoiceByIdAsync(id, ct);
    if (invoice is null)
    {
        return Results.NotFound();
    }
    return Results.Ok(new InvoiceDto(invoice.Id, invoice.InvoiceNumber, invoice.TotalAmount, invoice.Currency, invoice.Status, invoice.IssuedAtUtc));
});

app.MapPost("/api/finance/invoices", async (CreateInvoiceRequest request, IFinanceRepository repository, CancellationToken ct) =>
{
    try
    {
        var invoice = new Invoice(Guid.NewGuid(), request.InvoiceNumber, request.TotalAmount, request.Currency);
        await repository.AddInvoiceAsync(invoice, ct);
        await repository.SaveChangesAsync(ct);

        var dto = new InvoiceDto(invoice.Id, invoice.InvoiceNumber, invoice.TotalAmount, invoice.Currency, invoice.Status, invoice.IssuedAtUtc);
        return Results.Created($"/api/finance/invoices/{invoice.Id}", dto);
    }
    catch (ArgumentException ex)
    {
        return Results.BadRequest(new { error = ex.Message });
    }
});

app.Run();

namespace RestaurantOS.Finance.Api
{
    public partial class FinanceMarker { }
}
