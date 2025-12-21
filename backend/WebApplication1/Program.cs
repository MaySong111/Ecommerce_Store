using API.core.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using WebApplication1.Core.AppContext;
using WebApplication1.Core.AutoMappingConfig;
using WebApplication1.Core.Entities;
using WebApplication1.Core.Service;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddDbContext<StoreContext>(options =>
{
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"));
});

builder.Services.AddIdentity<User, IdentityRole>()
    .AddEntityFrameworkStores<StoreContext>()
    .AddDefaultTokenProviders();

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins("http://localhost:3000")
              .AllowAnyMethod()
              .AllowCredentials()
              .AllowAnyHeader();
    });
});
builder.Services.AddScoped<JwtTokenCreator>();
builder.Services.AddScoped<PaymentsService>();

if (builder.Environment.IsDevelopment())
{
    builder.Services.AddSwaggerGen();
    builder.Services.AddEndpointsApiExplorer();
}
builder.Services.AddAutoMapper(typeof(AutoMapping));
var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();

// Configure the HTTP request pipeline.
// app.UseHttpsRedirection();
app.UseCors();
app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.Run();