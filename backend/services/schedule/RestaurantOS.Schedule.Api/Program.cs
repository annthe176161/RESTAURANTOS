using Microsoft.EntityFrameworkCore;
using RestaurantOS.Schedule.Application;
using RestaurantOS.Schedule.Domain;
using RestaurantOS.Schedule.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

var connectionString = builder.Configuration.GetConnectionString("ScheduleDb") ?? "Data Source=schedule.db";
builder.Services.AddDbContext<ScheduleDbContext>(options =>
    options.UseSqlite(connectionString));

builder.Services.AddScoped<IScheduleRepository, ScheduleRepository>();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddHealthChecks();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<ScheduleDbContext>();
    db.Database.EnsureCreated();
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.MapHealthChecks("/health");

app.MapGet("/api/schedules/shifts", async (Guid? employeeId, IScheduleRepository repository, CancellationToken ct) =>
{
    var list = employeeId.HasValue
        ? await repository.GetByEmployeeIdAsync(employeeId.Value, ct)
        : await repository.GetAllAsync(ct);

    var result = list.Select(s => new ShiftDto(s.Id, s.EmployeeId, s.ShiftName, s.StartTimeUtc, s.EndTimeUtc, s.IsCancelled));
    return Results.Ok(result);
});

app.MapPost("/api/schedules/shifts", async (CreateShiftRequest request, IScheduleRepository repository, CancellationToken ct) =>
{
    try
    {
        var shift = new Shift(Guid.NewGuid(), request.EmployeeId, request.ShiftName, request.StartTimeUtc, request.EndTimeUtc);
        await repository.AddAsync(shift, ct);
        await repository.SaveChangesAsync(ct);

        var dto = new ShiftDto(shift.Id, shift.EmployeeId, shift.ShiftName, shift.StartTimeUtc, shift.EndTimeUtc, shift.IsCancelled);
        return Results.Created($"/api/schedules/shifts/{shift.Id}", dto);
    }
    catch (ArgumentException ex)
    {
        return Results.BadRequest(new { error = ex.Message });
    }
});

app.Run();

namespace RestaurantOS.Schedule.Api
{
    public partial class ScheduleMarker { }
}
