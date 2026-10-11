using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using RestaurantOS.Employee.Domain;
using RestaurantOS.Employee.Domain.Repositories;

namespace RestaurantOS.Employee.Infrastructure.Persistence.Repositories;

/// <summary>
/// Thực thi IEmployeeRepository bằng việc gọi trực tiếp Stored Procedures trên SQL Server.
/// Tối ưu hiệu năng thực thi, phân quyền bảo mật tầng CSDL và tách biệt logic truy vấn.
/// </summary>
public class EmployeeRepository : IEmployeeRepository
{
    private readonly EmployeeDbContext _dbContext;

    public EmployeeRepository(EmployeeDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    /// <summary>
    /// Gọi Stored Procedure: sp_GetAllEmployees
    /// </summary>
    public async Task<IReadOnlyList<Domain.Employee>> GetAllAsync(
        string? search = null, 
        string? role = null, 
        bool? isActive = null, 
        CancellationToken ct = default)
    {
        var pSearch = new SqlParameter("@Search", (object?)search ?? DBNull.Value);
        var pRole = new SqlParameter("@Role", (object?)role ?? DBNull.Value);
        var pIsActive = new SqlParameter("@IsActive", (object?)isActive ?? DBNull.Value);

        return await _dbContext.Employees
            .FromSqlRaw("EXEC sp_GetAllEmployees @Search, @Role, @IsActive", pSearch, pRole, pIsActive)
            .AsNoTracking()
            .ToListAsync(ct);
    }

    /// <summary>
    /// Gọi Stored Procedure: sp_GetEmployeeById
    /// </summary>
    public async Task<Domain.Employee?> GetByIdAsync(Guid id, CancellationToken ct = default)
    {
        var pId = new SqlParameter("@Id", id);

        var list = await _dbContext.Employees
            .FromSqlRaw("EXEC sp_GetEmployeeById @Id", pId)
            .AsNoTracking()
            .ToListAsync(ct);

        return list.FirstOrDefault();
    }

    /// <summary>
    /// Gọi Stored Procedure: sp_GetEmployeeByEmail
    /// </summary>
    public async Task<Domain.Employee?> GetByEmailAsync(string email, CancellationToken ct = default)
    {
        var pEmail = new SqlParameter("@Email", email.Trim());

        var list = await _dbContext.Employees
            .FromSqlRaw("EXEC sp_GetEmployeeByEmail @Email", pEmail)
            .AsNoTracking()
            .ToListAsync(ct);

        return list.FirstOrDefault();
    }

    /// <summary>
    /// Gọi Stored Procedure: sp_InsertEmployee
    /// </summary>
    public async Task AddAsync(Domain.Employee employee, CancellationToken ct = default)
    {
        var pId = new SqlParameter("@Id", employee.Id);
        var pFullName = new SqlParameter("@FullName", employee.FullName);
        var pEmail = new SqlParameter("@Email", employee.Email);
        var pPhoneNumber = new SqlParameter("@PhoneNumber", employee.PhoneNumber);
        var pRole = new SqlParameter("@Role", employee.Role);
        var pHourlyRate = new SqlParameter("@HourlyRate", employee.HourlyRate);
        var pIsActive = new SqlParameter("@IsActive", employee.IsActive);
        var pCreatedAtUtc = new SqlParameter("@CreatedAtUtc", employee.CreatedAtUtc);

        await _dbContext.Database.ExecuteSqlRawAsync(
            "EXEC sp_InsertEmployee @Id, @FullName, @Email, @PhoneNumber, @Role, @HourlyRate, @IsActive, @CreatedAtUtc",
            new[] { pId, pFullName, pEmail, pPhoneNumber, pRole, pHourlyRate, pIsActive, pCreatedAtUtc },
            ct);
    }

    /// <summary>
    /// Gọi Stored Procedure: sp_UpdateEmployee
    /// </summary>
    public async Task UpdateAsync(Domain.Employee employee, CancellationToken ct = default)
    {
        var pId = new SqlParameter("@Id", employee.Id);
        var pFullName = new SqlParameter("@FullName", employee.FullName);
        var pPhoneNumber = new SqlParameter("@PhoneNumber", employee.PhoneNumber);
        var pRole = new SqlParameter("@Role", employee.Role);
        var pHourlyRate = new SqlParameter("@HourlyRate", employee.HourlyRate);

        await _dbContext.Database.ExecuteSqlRawAsync(
            "EXEC sp_UpdateEmployee @Id, @FullName, @PhoneNumber, @Role, @HourlyRate",
            new[] { pId, pFullName, pPhoneNumber, pRole, pHourlyRate },
            ct);
    }

    /// <summary>
    /// Gọi Stored Procedure: sp_ToggleEmployeeStatus
    /// </summary>
    public async Task<bool> ToggleStatusAsync(Guid id, CancellationToken ct = default)
    {
        var pId = new SqlParameter("@Id", id);

        await _dbContext.Database.ExecuteSqlRawAsync(
            "EXEC sp_ToggleEmployeeStatus @Id",
            new[] { pId },
            ct);

        var employee = await GetByIdAsync(id, ct);
        return employee?.IsActive ?? false;
    }

    /// <summary>
    /// Gọi Stored Procedure: sp_DeleteEmployee
    /// </summary>
    public async Task DeleteAsync(Domain.Employee employee, CancellationToken ct = default)
    {
        var pId = new SqlParameter("@Id", employee.Id);

        await _dbContext.Database.ExecuteSqlRawAsync(
            "EXEC sp_DeleteEmployee @Id",
            new[] { pId },
            ct);
    }

    public async Task SaveChangesAsync(CancellationToken ct = default)
    {
        // Khi gọi Stored Procedure trực tiếp, các lệnh INSERT/UPDATE/DELETE
        // đã được thực thi và commit ngay trên SQL Server.
        await _dbContext.SaveChangesAsync(ct);
    }
}
