using System.Net;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc.Testing;
using RestaurantOS.Employee.Api;
using RestaurantOS.Finance.Api;
using RestaurantOS.Gateway;
using RestaurantOS.Ocr.Api;
using RestaurantOS.Schedule.Api;
using Xunit;

namespace RestaurantOS.IntegrationTests;

public class GatewayIntegrationTests : IClassFixture<WebApplicationFactory<GatewayMarker>>
{
    private readonly WebApplicationFactory<GatewayMarker> _factory;

    public GatewayIntegrationTests(WebApplicationFactory<GatewayMarker> factory)
    {
        _factory = factory;
    }

    [Fact]
    public async Task Gateway_HealthEndpoint_ShouldReturnHealthy()
    {
        var client = _factory.CreateClient();
        var response = await client.GetAsync("/health");

        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var content = await response.Content.ReadAsStringAsync();
        content.Should().Be("Healthy");
    }

    [Fact]
    public async Task Gateway_RootEndpoint_ShouldReturnServiceInfo()
    {
        var client = _factory.CreateClient();
        var response = await client.GetAsync("/");

        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var content = await response.Content.ReadAsStringAsync();
        content.Should().Contain("RestaurantOS.Gateway");
    }
}

public class EmployeeServiceIntegrationTests : IClassFixture<WebApplicationFactory<EmployeeMarker>>
{
    private readonly WebApplicationFactory<EmployeeMarker> _factory;

    public EmployeeServiceIntegrationTests(WebApplicationFactory<EmployeeMarker> factory)
    {
        _factory = factory;
    }

    [Fact]
    public async Task EmployeeService_HealthEndpoint_ShouldReturnHealthy()
    {
        var client = _factory.CreateClient();
        var response = await client.GetAsync("/health");

        response.StatusCode.Should().Be(HttpStatusCode.OK);
    }
}

public class ScheduleServiceIntegrationTests : IClassFixture<WebApplicationFactory<ScheduleMarker>>
{
    private readonly WebApplicationFactory<ScheduleMarker> _factory;

    public ScheduleServiceIntegrationTests(WebApplicationFactory<ScheduleMarker> factory)
    {
        _factory = factory;
    }

    [Fact]
    public async Task ScheduleService_HealthEndpoint_ShouldReturnHealthy()
    {
        var client = _factory.CreateClient();
        var response = await client.GetAsync("/health");

        response.StatusCode.Should().Be(HttpStatusCode.OK);
    }
}

public class FinanceServiceIntegrationTests : IClassFixture<WebApplicationFactory<FinanceMarker>>
{
    private readonly WebApplicationFactory<FinanceMarker> _factory;

    public FinanceServiceIntegrationTests(WebApplicationFactory<FinanceMarker> factory)
    {
        _factory = factory;
    }

    [Fact]
    public async Task FinanceService_HealthEndpoint_ShouldReturnHealthy()
    {
        var client = _factory.CreateClient();
        var response = await client.GetAsync("/health");

        response.StatusCode.Should().Be(HttpStatusCode.OK);
    }
}

public class OcrServiceIntegrationTests : IClassFixture<WebApplicationFactory<OcrMarker>>
{
    private readonly WebApplicationFactory<OcrMarker> _factory;

    public OcrServiceIntegrationTests(WebApplicationFactory<OcrMarker> factory)
    {
        _factory = factory;
    }

    [Fact]
    public async Task OcrService_HealthEndpoint_ShouldReturnHealthy()
    {
        var client = _factory.CreateClient();
        var response = await client.GetAsync("/health");

        response.StatusCode.Should().Be(HttpStatusCode.OK);
    }
}

