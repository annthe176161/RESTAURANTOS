namespace RestaurantOS.Shared.Contracts.Events;

public record EmployeeCreatedEvent(
    Guid Id,
    string FullName,
    string Email,
    string Role,
    string PhoneNumber,
    decimal HourlyRate,
    bool IsActive,
    DateTime CreatedAtUtc
);

public record EmployeeUpdatedEvent(
    Guid Id,
    string FullName,
    string PhoneNumber,
    string Role,
    decimal HourlyRate,
    bool IsActive
);

public record EmployeeStatusToggledEvent(
    Guid Id,
    bool IsActive
);

public record EmployeeDeletedEvent(
    Guid Id
);

