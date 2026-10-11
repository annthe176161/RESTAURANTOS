using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using RestaurantOS.Employee.Application.DTOs;
using RestaurantOS.Employee.Application.Services;

namespace RestaurantOS.Employee.Api.Controllers;

/// <summary>
/// Controller quản lý nhân viên nhà hàng (Chuẩn Controller-based ASP.NET Core 8.0).
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
[Tags("Quản lý Nhân sự (Employees)")]
public class EmployeesController : ControllerBase
{
    private readonly IEmployeeService _service;

    public EmployeesController(IEmployeeService service)
    {
        _service = service;
    }

    /// <summary>
    /// Lấy danh sách nhân viên (hỗ trợ tìm kiếm và lọc qua Stored Procedure sp_GetAllEmployees)
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(IReadOnlyList<EmployeeDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll(
        [FromQuery] string? search,
        [FromQuery] string? role,
        [FromQuery] bool? isActive,
        CancellationToken ct)
    {
        var result = await _service.GetAllAsync(search, role, isActive, ct);
        return Ok(result);
    }

    /// <summary>
    /// Xem chi tiết nhân viên theo ID (Gọi sp_GetEmployeeById)
    /// </summary>
    [HttpGet("{id:guid}")]
    [ProducesResponseType(typeof(EmployeeDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(Guid id, CancellationToken ct)
    {
        var employee = await _service.GetByIdAsync(id, ct);
        if (employee is null)
        {
            return NotFound(new { message = "Không tìm thấy thông tin nhân viên." });
        }

        return Ok(employee);
    }

    /// <summary>
    /// Thêm mới nhân viên (Gọi sp_InsertEmployee)
    /// </summary>
    [HttpPost]
    [ProducesResponseType(typeof(EmployeeDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public async Task<IActionResult> Create([FromBody] CreateEmployeeRequest request, CancellationToken ct)
    {
        try
        {
            var created = await _service.CreateAsync(request, ct);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { error = ex.Message });
        }
    }

    /// <summary>
    /// Cập nhật thông tin nhân viên (Gọi sp_UpdateEmployee)
    /// </summary>
    [HttpPut("{id:guid}")]
    [ProducesResponseType(typeof(EmployeeDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateEmployeeRequest request, CancellationToken ct)
    {
        try
        {
            var updated = await _service.UpdateAsync(id, request, ct);
            if (updated is null)
            {
                return NotFound(new { message = "Không tìm thấy nhân viên cần cập nhật." });
            }

            return Ok(updated);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    /// <summary>
    /// Bật / Tắt trạng thái làm việc (Gọi sp_ToggleEmployeeStatus)
    /// </summary>
    [HttpPatch("{id:guid}/toggle-status")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> ToggleStatus(Guid id, CancellationToken ct)
    {
        var newStatus = await _service.ToggleStatusAsync(id, ct);
        if (!newStatus.HasValue)
        {
            return NotFound(new { message = "Không tìm thấy nhân viên." });
        }

        return Ok(new 
        { 
            id, 
            isActive = newStatus.Value, 
            message = newStatus.Value ? "Đã kích hoạt nhân viên làm việc trở lại." : "Đã tạm dừng trạng thái làm việc." 
        });
    }

    /// <summary>
    /// Xóa nhân viên khỏi hệ thống (Gọi sp_DeleteEmployee)
    /// </summary>
    [HttpDelete("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(Guid id, CancellationToken ct)
    {
        var success = await _service.DeleteAsync(id, ct);
        if (!success)
        {
            return NotFound(new { message = "Không tìm thấy nhân viên cần xóa." });
        }

        return Ok(new { message = "Đã xóa hồ sơ nhân viên thành công." });
    }
}

