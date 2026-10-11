using Microsoft.EntityFrameworkCore;
using RestaurantOS.Employee.Application;
using RestaurantOS.Employee.Domain;
using RestaurantOS.Employee.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

var connectionString = builder.Configuration.GetConnectionString("EmployeeDb") ?? "Data Source=employee.db";
builder.Services.AddDbContext<EmployeeDbContext>(options =>
    options.UseSqlite(connectionString));

builder.Services.AddScoped<IEmployeeRepository, EmployeeRepository>();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddHealthChecks();

var app = builder.Build();

// Auto ensure database created for local foundation development
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<EmployeeDbContext>();
    db.Database.EnsureCreated();
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.MapHealthChecks("/health");

app.MapGet("/api/employees", async (IEmployeeRepository repository, CancellationToken ct) =>
{
    var list = await repository.GetAllAsync(ct);
    var result = list.Select(e => new EmployeeDto(e.Id, e.FullName, e.Email, e.Role, e.IsActive, e.CreatedAtUtc));
    return Results.Ok(result);
});

app.MapGet("/api/employees/{id:guid}", async (Guid id, IEmployeeRepository repository, CancellationToken ct) =>
{
    var employee = await repository.GetByIdAsync(id, ct);
    if (employee is null)
    {
        return Results.NotFound();
    }
    return Results.Ok(new EmployeeDto(employee.Id, employee.FullName, employee.Email, employee.Role, employee.IsActive, employee.CreatedAtUtc));
});

app.MapPost("/api/employees", async (CreateEmployeeRequest request, IEmployeeRepository repository, CancellationToken ct) =>
{
    try
    {
        var employee = new Employee(Guid.NewGuid(), request.FullName, request.Email, request.Role ?? "Staff");
        await repository.AddAsync(employee, ct);
        await repository.SaveChangesAsync(ct);

        var dto = new EmployeeDto(employee.Id, employee.FullName, employee.Email, employee.Role, employee.IsActive, employee.CreatedAtUtc);
        return Results.Created($"/api/employees/{employee.Id}", dto);
    }
    catch (ArgumentException ex)
    {
        return Results.BadRequest(new { error = ex.Message });
    }
});

app.Run();

namespace RestaurantOS.Employee.Api
{
    public partial class EmployeeMarker { }
}
