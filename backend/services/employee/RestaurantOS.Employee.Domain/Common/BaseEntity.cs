namespace RestaurantOS.Employee.Domain.Common;

/// <summary>
/// Lớp cơ sở cho toàn bộ Aggregate Root và Entity trong hệ thống.
/// Đảm bảo tính nhất quán về định danh (Id), thời gian tạo/cập nhật và so sánh thực thể.
/// </summary>
public abstract class BaseEntity<TId> where TId : notnull
{
    public TId Id { get; protected set; } = default!;
    public DateTime CreatedAtUtc { get; protected set; }
    public DateTime? UpdatedAtUtc { get; protected set; }

    protected BaseEntity() { }

    protected BaseEntity(TId id)
    {
        Id = id;
        CreatedAtUtc = DateTime.UtcNow;
    }

    public override bool Equals(object? obj)
    {
        if (obj is not BaseEntity<TId> other)
            return false;

        if (ReferenceEquals(this, other))
            return true;

        if (GetType() != other.GetType())
            return false;

        return EqualityComparer<TId>.Default.Equals(Id, other.Id);
    }

    public override int GetHashCode()
    {
        return EqualityComparer<TId>.Default.GetHashCode(Id);
    }

    public static bool operator ==(BaseEntity<TId>? a, BaseEntity<TId>? b)
    {
        if (a is null && b is null) return true;
        if (a is null || b is null) return false;
        return a.Equals(b);
    }

    public static bool operator !=(BaseEntity<TId>? a, BaseEntity<TId>? b)
    {
        return !(a == b);
    }
}

