using Microsoft.AspNetCore.Http;
using RestaurantOS.Employee.Application.DTOs;
using RestaurantOS.Employee.Application.Interfaces;

namespace RestaurantOS.Employee.Api.Endpoints;

public static class EmployeeEndpoints
{
    public static void MapEmployeeEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/employees")
            .WithTags("Quản lý Nhân sự (Employees)");

        // 1. Lấy danh sách nhân viên
        group.MapGet("/", async (
            string? search, 
            string? role, 
            bool? isActive, 
            IEmployeeService service, 
            CancellationToken ct) =>
        {
            var result = await service.GetAllAsync(search, role, isActive, ct);
            return Results.Ok(result);
        })
        .WithName("GetEmployees")
        .WithSummary("Lấy danh sách nhân viên")
        .WithDescription("Hỗ trợ tìm kiếm theo tên/email/SĐT, lọc theo chức vụ (Quản lý, Đầu bếp, Thu ngân, Phục vụ) và trạng thái (Active/Inactive).")
        .Produces<IReadOnlyList<EmployeeDto>>(StatusCodes.Status200OK);

        // 2. Lấy chi tiết nhân viên theo Id
        group.MapGet("/{id:guid}", async (Guid id, IEmployeeService service, CancellationToken ct) =>
        {
            var employee = await service.GetByIdAsync(id, ct);
            if (employee is null)
            {
                return Results.NotFound(new { message = "Không tìm thấy thông tin nhân viên." });
            }

            return Results.Ok(employee);
        })
        .WithName("GetEmployeeById")
        .WithSummary("Xem chi tiết nhân viên theo ID")
        .WithDescription("Lấy đầy đủ thông tin hồ sơ của một nhân viên dựa trên mã định danh GUID.")
        .Produces<EmployeeDto>(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status404NotFound);

        // 3. Tạo hồ sơ nhân viên mới
        group.MapPost("/", async (CreateEmployeeRequest request, IEmployeeService service, CancellationToken ct) =>
        {
            try
            {
                var created = await service.CreateAsync(request, ct);
                return Results.Created($"/api/employees/{created.Id}", created);
            }
            catch (ArgumentException ex)
            {
                return Results.BadRequest(new { error = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return Results.Conflict(new { error = ex.Message });
            }
        })
        .WithName("CreateEmployee")
        .WithSummary("Thêm mới hồ sơ nhân viên")
        .WithDescription("Tạo một nhân sự mới với thông tin họ tên, email, chức vụ, mức lương giờ. Email phải là duy nhất.")
        .Produces<EmployeeDto>(StatusCodes.Status201Created)
        .Produces(StatusCodes.Status400BadRequest)
        .Produces(StatusCodes.Status409Conflict);

        // 4. Cập nhật thông tin nhân viên
        group.MapPut("/{id:guid}", async (Guid id, UpdateEmployeeRequest request, IEmployeeService service, CancellationToken ct) =>
        {
            try
            {
                var updated = await service.UpdateAsync(id, request, ct);
                if (updated is null)
                {
                    return Results.NotFound(new { message = "Không tìm thấy nhân viên cần cập nhật." });
                }

                return Results.Ok(updated);
            }
            catch (ArgumentException ex)
            {
                return Results.BadRequest(new { error = ex.Message });
            }
        })
        .WithName("UpdateEmployee")
        .WithSummary("Cập nhật thông tin nhân viên")
        .WithDescription("Cập nhật họ tên, số điện thoại, chức danh hoặc mức lương giờ của nhân viên theo GUID.")
        .Produces<EmployeeDto>(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status400BadRequest)
        .Produces(StatusCodes.Status404NotFound);

        // 5. Chuyển đổi trạng thái hoạt động (Active <-> Inactive)
        group.MapPatch("/{id:guid}/toggle-status", async (Guid id, IEmployeeService service, CancellationToken ct) =>
        {
            var newStatus = await service.ToggleStatusAsync(id, ct);
            if (!newStatus.HasValue)
            {
                return Results.NotFound(new { message = "Không tìm thấy nhân viên." });
            }

            return Results.Ok(new 
            { 
                id, 
                isActive = newStatus.Value, 
                message = newStatus.Value ? "Đã kích hoạt nhân viên làm việc trở lại." : "Đã tạm dừng trạng thái làm việc." 
            });
        })
        .WithName("ToggleEmployeeStatus")
        .WithSummary("Bật / Tắt trạng thái làm việc")
        .WithDescription("Chuyển đổi trạng thái làm việc của nhân viên giữa Đang làm việc (Active) và Tạm dừng (Inactive).")
        .Produces(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status404NotFound);

        // 6. Xóa nhân viên
        group.MapDelete("/{id:guid}", async (Guid id, IEmployeeService service, CancellationToken ct) =>
        {
            var success = await service.DeleteAsync(id, ct);
            if (!success)
            {
                return Results.NotFound(new { message = "Không tìm thấy nhân viên cần xóa." });
            }

            return Results.Ok(new { message = "Đã xóa hồ sơ nhân viên thành công." });
        })
        .WithName("DeleteEmployee")
        .WithSummary("Xóa nhân viên khỏi hệ thống")
        .WithDescription("Xóa vĩnh viễn hồ sơ nhân viên khỏi cơ sở dữ liệu theo mã định danh GUID.")
        .Produces(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status404NotFound);
    }
}
