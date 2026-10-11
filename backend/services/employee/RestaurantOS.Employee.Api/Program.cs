using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using RestaurantOS.Employee.Api.Endpoints;
using RestaurantOS.Employee.Application.Interfaces;
using RestaurantOS.Employee.Application.Services;
using RestaurantOS.Employee.Infrastructure.Persistence;
using RestaurantOS.Employee.Infrastructure.Persistence.Repositories;

var builder = WebApplication.CreateBuilder(args);

// 1. Cấu hình DbContext kết nối SQL Server (Code First)
var connectionString = builder.Configuration.GetConnectionString("EmployeeDb");
builder.Services.AddDbContext<EmployeeDbContext>(options =>
{
    options.UseSqlServer(connectionString);
});

// 2. Đăng ký Dependency Injection: Repository & Service
builder.Services.AddScoped<IEmployeeRepository, EmployeeRepository>();
builder.Services.AddScoped<IEmployeeService, EmployeeService>();

builder.Services.AddEndpointsApiExplorer();

// 3. Cấu hình Swagger OpenAPI chi tiết và trực quan
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "RestaurantOS - Employee Service API",
        Version = "v1",
        Description = "API Quản lý Hồ sơ & Đội ngũ Nhân sự Nhà hàng (Clean Architecture .NET 8, SQL Server Code-First).",
        Contact = new OpenApiContact
        {
            Name = "RestaurantOS Engineering",
            Email = "support@restaurantos.vn"
        }
    });
});

builder.Services.AddHealthChecks();

// 4. Cho phép CORS kết nối từ Web Frontend & API Gateway
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod();
    });
});

var app = builder.Build();

app.UseCors("AllowAll");

// 5. Bật Swagger UI ở môi trường Development hoặc khi chạy trực tiếp
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "RestaurantOS Employee API v1");
        c.RoutePrefix = "swagger";
        c.DocumentTitle = "RestaurantOS - Employee API Documentation";
        c.DefaultModelsExpandDepth(-1); // Thu gọn phần Schemas cho giao diện thoáng gọn
    });

    // Tự động chuyển hướng từ gốc (/) sang trang tài liệu (/swagger)
    app.MapGet("/", () => Results.Redirect("/swagger"))
       .ExcludeFromDescription();
}

app.MapHealthChecks("/health");

// 6. Đăng ký các API Endpoints cho Employee Service
app.MapEmployeeEndpoints();

app.Run();

namespace RestaurantOS.Employee.Api
{
    public partial class EmployeeMarker { }
}
