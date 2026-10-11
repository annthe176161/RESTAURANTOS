namespace RestaurantOS.Employee.Application.DTOs;

public record EmployeeDto(
    Guid Id, 
    string FullName, 
    string Email, 
    string PhoneNumber, 
    string Role, 
    decimal HourlyRate, 
    bool IsActive, 
    DateTime CreatedAtUtc);

public record CreateEmployeeRequest(
    string FullName, 
    string Email, 
    string? PhoneNumber, 
    string? Role, 
    decimal? HourlyRate);

public record UpdateEmployeeRequest(
    string FullName, 
    string? PhoneNumber, 
    string? Role, 
    decimal? HourlyRate);

