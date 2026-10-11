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

// Cho phép CORS nội bộ cho Service
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod();
    });
});

var app = builder.Build();

app.UseCors("AllowAll");

// Khởi tạo CSDL SQLite & Tự động tạo dữ liệu mẫu nếu chưa có
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<EmployeeDbContext>();
    db.Database.EnsureCreated();

    if (!db.Employees.Any())
    {
        db.Employees.AddRange(
            new Employee(Guid.NewGuid(), "Nguyễn Văn An", "an.nguyen@restaurantos.vn", "Quản lý", "0901234567", 50000),
            new Employee(Guid.NewGuid(), "Trần Thị Bình", "binh.tran@restaurantos.vn", "Đầu bếp", "0912345678", 45000),
            new Employee(Guid.NewGuid(), "Lê Hoàng Cường", "cuong.le@restaurantos.vn", "Thu ngân", "0923456789", 30000),
            new Employee(Guid.NewGuid(), "Phạm Minh Dũng", "dung.pham@restaurantos.vn", "Phục vụ", "0934567890", 25000)
        );
        db.SaveChanges();
    }
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.MapHealthChecks("/health");

// 1. Lấy danh sách nhân viên (hỗ trợ tìm kiếm, lọc theo chức vụ và trạng thái)
app.MapGet("/api/employees", async (
    string? search, 
    string? role, 
    bool? isActive, 
    IEmployeeRepository repository, 
    CancellationToken ct) =>
{
    var list = await repository.GetAllAsync(search, role, isActive, ct);
    var result = list.Select(e => new EmployeeDto(
        e.Id, 
        e.FullName, 
        e.Email, 
        e.PhoneNumber, 
        e.Role, 
        e.HourlyRate, 
        e.IsActive, 
        e.CreatedAtUtc));

    return Results.Ok(result);
});

// 2. Lấy chi tiết nhân viên theo Id
app.MapGet("/api/employees/{id:guid}", async (Guid id, IEmployeeRepository repository, CancellationToken ct) =>
{
    var employee = await repository.GetByIdAsync(id, ct);
    if (employee is null)
    {
        return Results.NotFound(new { message = "Không tìm thấy thông tin nhân viên." });
    }

    return Results.Ok(new EmployeeDto(
        employee.Id, 
        employee.FullName, 
        employee.Email, 
        employee.PhoneNumber, 
        employee.Role, 
        employee.HourlyRate, 
        employee.IsActive, 
        employee.CreatedAtUtc));
});

// 3. Tạo hồ sơ nhân viên mới
app.MapPost("/api/employees", async (CreateEmployeeRequest request, IEmployeeRepository repository, CancellationToken ct) =>
{
    try
    {
        // Kiểm tra trùng lặp email
        var existing = await repository.GetByEmailAsync(request.Email, ct);
        if (existing is not null)
        {
            return Results.Conflict(new { error = "Địa chỉ email này đã được sử dụng cho một nhân viên khác." });
        }

        var employee = new Employee(
            Guid.NewGuid(), 
            request.FullName, 
            request.Email, 
            request.Role, 
            request.PhoneNumber, 
            request.HourlyRate ?? 25000);

        await repository.AddAsync(employee, ct);
        await repository.SaveChangesAsync(ct);

        var dto = new EmployeeDto(
            employee.Id, 
            employee.FullName, 
            employee.Email, 
            employee.PhoneNumber, 
            employee.Role, 
            employee.HourlyRate, 
            employee.IsActive, 
            employee.CreatedAtUtc);

        return Results.Created($"/api/employees/{employee.Id}", dto);
    }
    catch (ArgumentException ex)
    {
        return Results.BadRequest(new { error = ex.Message });
    }
});

// 4. Cập nhật thông tin nhân viên
app.MapPut("/api/employees/{id:guid}", async (Guid id, UpdateEmployeeRequest request, IEmployeeRepository repository, CancellationToken ct) =>
{
    try
    {
        var employee = await repository.GetByIdAsync(id, ct);
        if (employee is null)
        {
            return Results.NotFound(new { message = "Không tìm thấy nhân viên cần cập nhật." });
        }

        employee.UpdateInfo(
            request.FullName, 
            request.PhoneNumber, 
            request.Role, 
            request.HourlyRate ?? employee.HourlyRate);

        await repository.SaveChangesAsync(ct);

        var dto = new EmployeeDto(
            employee.Id, 
            employee.FullName, 
            employee.Email, 
            employee.PhoneNumber, 
            employee.Role, 
            employee.HourlyRate, 
            employee.IsActive, 
            employee.CreatedAtUtc);

        return Results.Ok(dto);
    }
    catch (ArgumentException ex)
    {
        return Results.BadRequest(new { error = ex.Message });
    }
});

// 5. Chuyển đổi trạng thái hoạt động (Active <-> Inactive)
app.MapPatch("/api/employees/{id:guid}/toggle-status", async (Guid id, IEmployeeRepository repository, CancellationToken ct) =>
{
    var employee = await repository.GetByIdAsync(id, ct);
    if (employee is null)
    {
        return Results.NotFound(new { message = "Không tìm thấy nhân viên." });
    }

    employee.ToggleStatus();
    await repository.SaveChangesAsync(ct);

    return Results.Ok(new { 
        id = employee.Id, 
        isActive = employee.IsActive, 
        message = employee.IsActive ? "Đã kích hoạt nhân viên làm việc trở lại." : "Đã tạm dừng trạng thái làm việc." 
    });
});

// 6. Xóa nhân viên khỏi hệ thống
app.MapDelete("/api/employees/{id:guid}", async (Guid id, IEmployeeRepository repository, CancellationToken ct) =>
{
    var employee = await repository.GetByIdAsync(id, ct);
    if (employee is null)
    {
        return Results.NotFound(new { message = "Không tìm thấy nhân viên cần xóa." });
    }

    await repository.DeleteAsync(employee, ct);
    await repository.SaveChangesAsync(ct);

    return Results.Ok(new { message = "Đã xóa hồ sơ nhân viên thành công." });
});

app.Run();

namespace RestaurantOS.Employee.Api
{
    public partial class EmployeeMarker { }
}
