namespace RestaurantOS.Schedule.Domain;

public class Shift
{
    public Guid Id { get; private set; }
    public Guid EmployeeId { get; private set; }
    public string ShiftName { get; private set; } = string.Empty;
    public DateTime StartTimeUtc { get; private set; }
    public DateTime EndTimeUtc { get; private set; }
    public bool IsCancelled { get; private set; }

    private Shift() { }

    public Shift(Guid id, Guid employeeId, string shiftName, DateTime startTimeUtc, DateTime endTimeUtc)
    {
        if (employeeId == Guid.Empty)
            throw new ArgumentException("EmployeeId must not be empty.", nameof(employeeId));

        if (string.IsNullOrWhiteSpace(shiftName))
            throw new ArgumentException("ShiftName is required.", nameof(shiftName));

        if (endTimeUtc <= startTimeUtc)
            throw new ArgumentException("EndTimeUtc must be after StartTimeUtc.", nameof(endTimeUtc));

        Id = id == Guid.Empty ? Guid.NewGuid() : id;
        EmployeeId = employeeId;
        ShiftName = shiftName.Trim();
        StartTimeUtc = startTimeUtc;
        EndTimeUtc = endTimeUtc;
        IsCancelled = false;
    }

    public void Cancel()
    {
        IsCancelled = true;
    }
}

