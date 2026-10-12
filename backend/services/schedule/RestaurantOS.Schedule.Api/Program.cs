using MassTransit;
using Microsoft.EntityFrameworkCore;
using RestaurantOS.Schedule.Application;
using RestaurantOS.Schedule.Application.Consumers;
using RestaurantOS.Schedule.Domain;
using RestaurantOS.Schedule.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

// 1. Cấu hình SQLite cho Schedule Service
var connectionString = builder.Configuration.GetConnectionString("ScheduleDb") ?? "Data Source=schedule.db";
builder.Services.AddDbContext<ScheduleDbContext>(options =>
    options.UseSqlite(connectionString));

builder.Services.AddScoped<IScheduleRepository, ScheduleRepository>();

// 2. Cấu hình MassTransit RabbitMQ lắng nghe sự kiện từ Employee Service
builder.Services.AddMassTransit(x =>
{
    x.AddConsumer<EmployeeCreatedConsumer>();
    x.AddConsumer<EmployeeUpdatedConsumer>();
    x.AddConsumer<EmployeeStatusToggledConsumer>();
    x.AddConsumer<EmployeeDeletedConsumer>();

    var rabbitHost = builder.Configuration["RabbitMQ:Host"];

    if (builder.Environment.IsEnvironment("Testing") || string.Equals(rabbitHost, "in-memory", StringComparison.OrdinalIgnoreCase))
    {
        x.UsingInMemory((context, cfg) =>
        {
            cfg.ConfigureEndpoints(context);
        });
    }
    else
    {
        x.UsingRabbitMq((context, cfg) =>
        {
            var host = string.IsNullOrWhiteSpace(rabbitHost) ? "localhost" : rabbitHost;
            var rabbitUser = builder.Configuration["RabbitMQ:Username"] ?? "guest";
            var rabbitPass = builder.Configuration["RabbitMQ:Password"] ?? "guest";

            cfg.Host(host, "/", h =>
            {
                h.Username(rabbitUser);
                h.Password(rabbitPass);
            });

            // Cấu hình Queue chuyên biệt nhận sự kiện nhân sự
            cfg.ReceiveEndpoint("schedule-service-employee-events", e =>
            {
                e.ConfigureConsumer<EmployeeCreatedConsumer>(context);
                e.ConfigureConsumer<EmployeeUpdatedConsumer>(context);
                e.ConfigureConsumer<EmployeeStatusToggledConsumer>(context);
                e.ConfigureConsumer<EmployeeDeletedConsumer>(context);
            });
        });
    }
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod();
    });
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddHealthChecks();

var app = builder.Build();

app.UseCors("AllowAll");

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

app.MapHealthChecks("/health", new Microsoft.AspNetCore.Diagnostics.HealthChecks.HealthCheckOptions
{
    Predicate = check => !check.Name.Contains("masstransit", StringComparison.OrdinalIgnoreCase)
});

// API 1: Lấy danh sách nhân viên đồng bộ sẵn trong DB riêng của Schedule
app.MapGet("/api/schedules/employees", async (IScheduleRepository repository, CancellationToken ct) =>
{
    var employees = await repository.GetActiveEmployeesAsync(ct);
    var result = employees.Select(e => new ScheduleEmployeeDto(
        e.Id,
        e.FullName,
        e.Email,
        e.Role,
        e.PhoneNumber,
        e.IsActive,
        e.LastSyncedAtUtc
    ));
    return Results.Ok(result);
});

// API 2: Lấy danh sách ca làm việc (đã tự động ghép Tên & Chức vụ từ bảng bản sao nội bộ)
app.MapGet("/api/schedules/shifts", async (Guid? employeeId, IScheduleRepository repository, CancellationToken ct) =>
{
    var shifts = employeeId.HasValue
        ? await repository.GetByEmployeeIdAsync(employeeId.Value, ct)
        : await repository.GetAllAsync(ct);

    var employees = (await repository.GetActiveEmployeesAsync(ct)).ToDictionary(e => e.Id);

    var result = shifts.Select(s =>
    {
        var hasEmp = employees.TryGetValue(s.EmployeeId, out var emp);
        var empName = hasEmp ? emp!.FullName : "Nhân viên chưa định danh";
        var empRole = hasEmp ? emp!.Role : "Chưa rõ";
        return new ShiftDto(s.Id, s.EmployeeId, empName, empRole, s.ShiftName, s.StartTimeUtc, s.EndTimeUtc, s.IsCancelled);
    });

    return Results.Ok(result);
});

// API 3: Phân ca làm việc mới (Kiểm tra nhân viên trực tiếp trong DB riêng)
app.MapPost("/api/schedules/shifts", async (CreateShiftRequest request, IScheduleRepository repository, CancellationToken ct) =>
{
    try
    {
        var employee = await repository.GetEmployeeByIdAsync(request.EmployeeId, ct);
        if (employee is null)
        {
            return Results.BadRequest(new { error = $"Không tìm thấy nhân viên ID '{request.EmployeeId}' trong hệ thống xếp lịch." });
        }

        if (!employee.IsActive)
        {
            return Results.BadRequest(new { error = $"Nhân viên '{employee.FullName}' hiện đang tạm ngừng làm việc, không thể phân ca." });
        }

        var shift = new Shift(Guid.NewGuid(), request.EmployeeId, request.ShiftName, request.StartTimeUtc, request.EndTimeUtc);
        await repository.AddAsync(shift, ct);
        await repository.SaveChangesAsync(ct);

        var dto = new ShiftDto(
            shift.Id, 
            shift.EmployeeId, 
            employee.FullName, 
            employee.Role, 
            shift.ShiftName, 
            shift.StartTimeUtc, 
            shift.EndTimeUtc, 
            shift.IsCancelled
        );
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
