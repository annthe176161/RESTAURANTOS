using MassTransit;
using Microsoft.Extensions.Logging;
using RestaurantOS.Schedule.Domain;
using RestaurantOS.Shared.Contracts.Events;

namespace RestaurantOS.Schedule.Application.Consumers;

public class EmployeeCreatedConsumer : IConsumer<EmployeeCreatedEvent>
{
    private readonly IScheduleRepository _repository;
    private readonly ILogger<EmployeeCreatedConsumer> _logger;

    public EmployeeCreatedConsumer(IScheduleRepository repository, ILogger<EmployeeCreatedConsumer> logger)
    {
        _repository = repository;
        _logger = logger;
    }

    public async Task Consume(ConsumeContext<EmployeeCreatedEvent> context)
    {
        var message = context.Message;
        _logger.LogInformation("Đã nhận sự kiện EmployeeCreatedEvent từ RabbitMQ: {Id} - {FullName}", message.Id, message.FullName);

        var employee = new ScheduleEmployee(
            message.Id,
            message.FullName,
            message.Email,
            message.Role,
            message.PhoneNumber,
            message.IsActive,
            DateTime.UtcNow
        );

        await _repository.UpsertEmployeeAsync(employee, context.CancellationToken);
        await _repository.SaveChangesAsync(context.CancellationToken);

        _logger.LogInformation("Đã đồng bộ nhân viên {FullName} vào Schedule Database thành công.", message.FullName);
    }
}

public class EmployeeUpdatedConsumer : IConsumer<EmployeeUpdatedEvent>
{
    private readonly IScheduleRepository _repository;
    private readonly ILogger<EmployeeUpdatedConsumer> _logger;

    public EmployeeUpdatedConsumer(IScheduleRepository repository, ILogger<EmployeeUpdatedConsumer> logger)
    {
        _repository = repository;
        _logger = logger;
    }

    public async Task Consume(ConsumeContext<EmployeeUpdatedEvent> context)
    {
        var message = context.Message;
        _logger.LogInformation("Đã nhận sự kiện EmployeeUpdatedEvent từ RabbitMQ: {Id} - {FullName}", message.Id, message.FullName);

        var employee = await _repository.GetEmployeeByIdAsync(message.Id, context.CancellationToken);
        if (employee is not null)
        {
            employee.UpdateInfo(message.FullName, message.PhoneNumber, message.Role, message.IsActive);
            await _repository.UpsertEmployeeAsync(employee, context.CancellationToken);
            await _repository.SaveChangesAsync(context.CancellationToken);
            _logger.LogInformation("Đã cập nhật nhân viên {FullName} trong Schedule Database.", message.FullName);
        }
    }
}

public class EmployeeStatusToggledConsumer : IConsumer<EmployeeStatusToggledEvent>
{
    private readonly IScheduleRepository _repository;
    private readonly ILogger<EmployeeStatusToggledConsumer> _logger;

    public EmployeeStatusToggledConsumer(IScheduleRepository repository, ILogger<EmployeeStatusToggledConsumer> logger)
    {
        _repository = repository;
        _logger = logger;
    }

    public async Task Consume(ConsumeContext<EmployeeStatusToggledEvent> context)
    {
        var message = context.Message;
        _logger.LogInformation("Đã nhận sự kiện EmployeeStatusToggledEvent từ RabbitMQ: {Id} - Status: {IsActive}", message.Id, message.IsActive);

        var employee = await _repository.GetEmployeeByIdAsync(message.Id, context.CancellationToken);
        if (employee is not null)
        {
            employee.SetStatus(message.IsActive);
            await _repository.UpsertEmployeeAsync(employee, context.CancellationToken);
            await _repository.SaveChangesAsync(context.CancellationToken);
            _logger.LogInformation("Đã cập nhật trạng thái nhân viên {Id} -> {IsActive}", message.Id, message.IsActive);
        }
    }
}

public class EmployeeDeletedConsumer : IConsumer<EmployeeDeletedEvent>
{
    private readonly IScheduleRepository _repository;
    private readonly ILogger<EmployeeDeletedConsumer> _logger;

    public EmployeeDeletedConsumer(IScheduleRepository repository, ILogger<EmployeeDeletedConsumer> logger)
    {
        _repository = repository;
        _logger = logger;
    }

    public async Task Consume(ConsumeContext<EmployeeDeletedEvent> context)
    {
        var message = context.Message;
        _logger.LogInformation("Đã nhận sự kiện EmployeeDeletedEvent từ RabbitMQ: {Id}", message.Id);

        await _repository.DeleteEmployeeAsync(message.Id, context.CancellationToken);
        await _repository.SaveChangesAsync(context.CancellationToken);

        _logger.LogInformation("Đã xóa bản sao nhân viên {Id} trong Schedule Database.", message.Id);
    }
}

