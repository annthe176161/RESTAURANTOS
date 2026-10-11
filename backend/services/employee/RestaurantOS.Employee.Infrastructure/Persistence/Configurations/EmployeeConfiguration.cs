using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using RestaurantOS.Employee.Domain;

namespace RestaurantOS.Employee.Infrastructure.Persistence.Configurations;

public class EmployeeConfiguration : IEntityTypeConfiguration<Domain.Employee>
{
    public void Configure(EntityTypeBuilder<Domain.Employee> builder)
    {
        builder.ToTable("Employees");

        builder.HasKey(e => e.Id);

        builder.Property(e => e.FullName)
            .IsRequired()
            .HasMaxLength(150);

        builder.Property(e => e.Email)
            .IsRequired()
            .HasMaxLength(150);

        builder.Property(e => e.PhoneNumber)
            .HasMaxLength(30);

        builder.Property(e => e.Role)
            .IsRequired()
            .HasMaxLength(50);

        builder.Property(e => e.HourlyRate)
            .HasColumnType("decimal(18,2)")
            .IsRequired();

        builder.Property(e => e.IsActive)
            .IsRequired();

        builder.Property(e => e.CreatedAtUtc)
            .IsRequired();

        builder.Property(e => e.UpdatedAtUtc)
            .IsRequired(false);

        builder.HasIndex(e => e.Email)
            .IsUnique();
    }
}

