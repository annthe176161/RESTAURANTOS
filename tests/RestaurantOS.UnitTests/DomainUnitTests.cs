using FluentAssertions;
using EmployeeEntity = RestaurantOS.Employee.Domain.Employee;
using RestaurantOS.Finance.Domain;
using RestaurantOS.Ocr.Domain;
using RestaurantOS.Schedule.Domain;
using Xunit;

namespace RestaurantOS.UnitTests;

public class EmployeeDomainTests
{
    [Fact]
    public void CreateEmployee_WithValidData_ShouldSucceed()
    {
        var employee = new EmployeeEntity(Guid.NewGuid(), "Nguyen Van A", "a.nguyen@restaurantos.local", "Chef");

        employee.FullName.Should().Be("Nguyen Van A");
        employee.Email.Should().Be("a.nguyen@restaurantos.local");
        employee.Role.Should().Be("Chef");
        employee.IsActive.Should().BeTrue();
    }

    [Theory]
    [InlineData("", "test@local.com")]
    [InlineData("   ", "test@local.com")]
    public void CreateEmployee_WithInvalidName_ShouldThrowArgumentException(string name, string email)
    {
        var act = () => new EmployeeEntity(Guid.NewGuid(), name, email, "Staff");
        act.Should().Throw<ArgumentException>();
    }

    [Fact]
    public void DeactivateEmployee_ShouldSetIsActiveToFalse()
    {
        var employee = new EmployeeEntity(Guid.NewGuid(), "Tran B", "b.tran@restaurantos.local", "Cashier");
        employee.Deactivate();

        employee.IsActive.Should().BeFalse();
    }
}

public class ScheduleDomainTests
{
    [Fact]
    public void CreateShift_WithValidInterval_ShouldSucceed()
    {
        var empId = Guid.NewGuid();
        var start = DateTime.UtcNow;
        var end = start.AddHours(8);

        var shift = new Shift(Guid.NewGuid(), empId, "Morning Shift", start, end);

        shift.EmployeeId.Should().Be(empId);
        shift.ShiftName.Should().Be("Morning Shift");
        shift.IsCancelled.Should().BeFalse();
    }

    [Fact]
    public void CreateShift_WithEndBeforeStart_ShouldThrowArgumentException()
    {
        var empId = Guid.NewGuid();
        var start = DateTime.UtcNow;
        var end = start.AddHours(-1);

        var act = () => new Shift(Guid.NewGuid(), empId, "Invalid Shift", start, end);
        act.Should().Throw<ArgumentException>();
    }
}

public class FinanceDomainTests
{
    [Fact]
    public void CreateInvoice_WithValidData_ShouldBeDraft()
    {
        var invoice = new Invoice(Guid.NewGuid(), "INV-2026-001", 500000m, "VND");

        invoice.InvoiceNumber.Should().Be("INV-2026-001");
        invoice.TotalAmount.Should().Be(500000m);
        invoice.Status.Should().Be(InvoiceStatus.Draft);
    }

    [Fact]
    public void CreateInvoice_WithNegativeAmount_ShouldThrowArgumentException()
    {
        var act = () => new Invoice(Guid.NewGuid(), "INV-002", -100m, "VND");
        act.Should().Throw<ArgumentException>();
    }

    [Fact]
    public void MarkAsPaid_ShouldUpdateStatusToPaid()
    {
        var invoice = new Invoice(Guid.NewGuid(), "INV-003", 250000m);
        invoice.MarkAsPaid();

        invoice.Status.Should().Be(InvoiceStatus.Paid);
    }
}

public class OcrDomainTests
{
    [Fact]
    public void CreateOcrDocument_ShouldInitializeAsPending()
    {
        var doc = new OcrDocument(Guid.NewGuid(), "receipt_20261011.jpg");

        doc.FileName.Should().Be("receipt_20261011.jpg");
        doc.Status.Should().Be(OcrStatus.Pending);
        doc.ExtractedText.Should().BeEmpty();
    }

    [Fact]
    public void CompleteProcessing_ShouldUpdateStatusAndText()
    {
        var doc = new OcrDocument(Guid.NewGuid(), "receipt.jpg");
        doc.Complete("Extracted receipt data 200k");

        doc.Status.Should().Be(OcrStatus.Processed);
        doc.ExtractedText.Should().Be("Extracted receipt data 200k");
    }
}

