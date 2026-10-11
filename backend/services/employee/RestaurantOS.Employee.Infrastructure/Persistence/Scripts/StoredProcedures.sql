-- ============================================================================
-- RestaurantOS - Employee Service Stored Procedures
-- Database: RestaurantOS_Employee
-- ============================================================================

USE [RestaurantOS_Employee];
GO

-- 1. Lấy danh sách nhân viên (hỗ trợ tìm kiếm, lọc theo chức vụ và trạng thái)
CREATE OR ALTER PROCEDURE sp_GetAllEmployees
    @Search NVARCHAR(150) = NULL,
    @Role NVARCHAR(50) = NULL,
    @IsActive BIT = NULL
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        Id, 
        FullName, 
        Email, 
        PhoneNumber, 
        Role, 
        HourlyRate, 
        IsActive, 
        CreatedAtUtc,
        UpdatedAtUtc
    FROM Employees
    WHERE 
        (@Search IS NULL OR LTRIM(RTRIM(@Search)) = '' OR 
         FullName LIKE N'%' + @Search + N'%' OR 
         Email LIKE N'%' + @Search + N'%' OR 
         PhoneNumber LIKE N'%' + @Search + N'%')
        AND (@Role IS NULL OR @Role = 'all' OR Role = @Role)
        AND (@IsActive IS NULL OR IsActive = @IsActive)
    ORDER BY CreatedAtUtc DESC;
END;
GO

-- 2. Lấy thông tin chi tiết nhân viên theo ID
CREATE OR ALTER PROCEDURE sp_GetEmployeeById
    @Id UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        Id, 
        FullName, 
        Email, 
        PhoneNumber, 
        Role, 
        HourlyRate, 
        IsActive, 
        CreatedAtUtc,
        UpdatedAtUtc
    FROM Employees
    WHERE Id = @Id;
END;
GO

-- 3. Lấy thông tin nhân viên theo Email (phục vụ kiểm tra trùng lặp)
CREATE OR ALTER PROCEDURE sp_GetEmployeeByEmail
    @Email NVARCHAR(150)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        Id, 
        FullName, 
        Email, 
        PhoneNumber, 
        Role, 
        HourlyRate, 
        IsActive, 
        CreatedAtUtc,
        UpdatedAtUtc
    FROM Employees
    WHERE LOWER(Email) = LOWER(LTRIM(RTRIM(@Email)));
END;
GO

-- 4. Thêm mới hồ sơ nhân viên
CREATE OR ALTER PROCEDURE sp_InsertEmployee
    @Id UNIQUEIDENTIFIER,
    @FullName NVARCHAR(150),
    @Email NVARCHAR(150),
    @PhoneNumber NVARCHAR(30),
    @Role NVARCHAR(50),
    @HourlyRate DECIMAL(18, 2),
    @IsActive BIT,
    @CreatedAtUtc DATETIME2,
    @UpdatedAtUtc DATETIME2 = NULL
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO Employees (
        Id, 
        FullName, 
        Email, 
        PhoneNumber, 
        Role, 
        HourlyRate, 
        IsActive, 
        CreatedAtUtc,
        UpdatedAtUtc
    )
    VALUES (
        @Id, 
        @FullName, 
        @Email, 
        @PhoneNumber, 
        @Role, 
        @HourlyRate, 
        @IsActive, 
        @CreatedAtUtc,
        @UpdatedAtUtc
    );
END;
GO

-- 5. Cập nhật thông tin nhân viên
CREATE OR ALTER PROCEDURE sp_UpdateEmployee
    @Id UNIQUEIDENTIFIER,
    @FullName NVARCHAR(150),
    @PhoneNumber NVARCHAR(30),
    @Role NVARCHAR(50),
    @HourlyRate DECIMAL(18, 2),
    @UpdatedAtUtc DATETIME2 = NULL
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE Employees
    SET 
        FullName = @FullName,
        PhoneNumber = @PhoneNumber,
        Role = @Role,
        HourlyRate = @HourlyRate,
        UpdatedAtUtc = COALESCE(@UpdatedAtUtc, SYSUTCDATETIME())
    WHERE Id = @Id;
END;
GO

-- 6. Đổi trạng thái làm việc (Toggle Active <-> Inactive)
CREATE OR ALTER PROCEDURE sp_ToggleEmployeeStatus
    @Id UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE Employees
    SET 
        IsActive = CASE WHEN IsActive = 1 THEN 0 ELSE 1 END,
        UpdatedAtUtc = SYSUTCDATETIME()
    WHERE Id = @Id;
END;
GO

-- 7. Xóa nhân viên khỏi hệ thống
CREATE OR ALTER PROCEDURE sp_DeleteEmployee
    @Id UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;

    DELETE FROM Employees
    WHERE Id = @Id;
END;
GO

