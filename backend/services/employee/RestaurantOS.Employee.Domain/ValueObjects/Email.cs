using System.Text.RegularExpressions;
using RestaurantOS.Employee.Domain.Common;
using RestaurantOS.Employee.Domain.Exceptions;

namespace RestaurantOS.Employee.Domain.ValueObjects;

/// <summary>
/// Value Object đại diện cho Địa chỉ Email hợp lệ theo chuẩn RFC.
/// Tự động chuẩn hóa viết thường, loại bỏ khoảng trắng và kiểm tra định dạng.
/// </summary>
public sealed class Email : ValueObject
{
    private static readonly Regex EmailRegex = new(
        @"^[^@\s]+@[^@\s]+\.[^@\s]+$", 
        RegexOptions.Compiled | RegexOptions.IgnoreCase);

    public string Value { get; }

    private Email() { Value = string.Empty; } // For EF Core

    private Email(string value)
    {
        Value = value;
    }

    public static Email Create(string? email)
    {
        if (string.IsNullOrWhiteSpace(email))
            throw new EmployeeDomainException("Email liên hệ không được để trống.", nameof(email));

        var normalized = email.Trim().ToLowerInvariant();

        if (!EmailRegex.IsMatch(normalized))
            throw new EmployeeDomainException($"Định dạng email '{email}' không hợp lệ.", nameof(email));

        return new Email(normalized);
    }

    protected override IEnumerable<object?> GetAtomicValues()
    {
        yield return Value;
    }

    public override string ToString() => Value;

    public static implicit operator string(Email email) => email.Value;
}

