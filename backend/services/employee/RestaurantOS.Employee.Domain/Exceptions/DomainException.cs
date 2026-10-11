namespace RestaurantOS.Employee.Domain.Exceptions;

/// <summary>
/// Ngoại lệ cơ sở cho toàn bộ vi phạm quy tắc kinh doanh (Business Rules) trong tầng Domain.
/// Kế thừa từ ArgumentException để duy trì tính tương thích và thể hiện rõ nguồn gốc lỗi.
/// </summary>
public class DomainException : ArgumentException
{
    public DomainException(string message) : base(message) { }

    public DomainException(string message, string paramName) : base(message, paramName) { }
}

public class EmployeeDomainException : DomainException
{
    public EmployeeDomainException(string message) : base(message) { }

    public EmployeeDomainException(string message, string paramName) : base(message, paramName) { }
}

