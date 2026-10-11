var builder = WebApplication.CreateBuilder(args);

builder.Services.AddReverseProxy()
    .LoadFromConfig(builder.Configuration.GetSection("ReverseProxy"));

builder.Services.AddHealthChecks();

var app = builder.Build();

app.UseRouting();

app.MapHealthChecks("/health");

app.MapGet("/", () => Results.Ok(new
{
    service = "RestaurantOS.Gateway",
    status = "Online",
    version = "0.1.0",
    docs = "/health"
}));

app.MapReverseProxy();

app.Run();

namespace RestaurantOS.Gateway
{
    public partial class GatewayMarker { }
}
