var builder = WebApplication.CreateBuilder(args);

// Cấu hình CORS để Web Frontend (Port 5173) gọi được vào Gateway (Port 5000)
builder.Services.AddCors(options =>
{
    options.AddPolicy("FrontendCorsPolicy", policy =>
    {
        policy.SetIsOriginAllowed(origin => true) // Cho phép local development
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

builder.Services.AddReverseProxy()
    .LoadFromConfig(builder.Configuration.GetSection("ReverseProxy"));

builder.Services.AddHealthChecks();

var app = builder.Build();

app.UseRouting();

app.UseCors("FrontendCorsPolicy");

app.MapHealthChecks("/health");

app.MapGet("/", () => Results.Ok(new
{
    service = "RestaurantOS.Gateway",
    status = "Online",
    version = "0.1.0"
}));

app.MapReverseProxy();

app.Run();

namespace RestaurantOS.Gateway
{
    public partial class GatewayMarker { }
}
