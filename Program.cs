// ============================================================
// CINEMAMS - Program.cs (THAY TOÀN BỘ file Program.cs cũ)
// ============================================================

using System.Text;
using sivinh_2122110368.Data;
using sivinh_2122110368.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// ---- 1. DATABASE ----
builder.Services.AddDbContext<CinemaDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// ---- 2. SERVICES ----
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<sivinh_2122110368.Services.IBookingService, sivinh_2122110368.Services.BookingService>();

// ---- 3. JWT AUTH ----
var jwtSecret = builder.Configuration["Jwt:Secret"] ?? "CinemaMS_SuperSecret_Key_2025!";
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret)),
            ValidateIssuer = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"] ?? "CinemaMS",
            ValidateAudience = true,
            ValidAudience = builder.Configuration["Jwt:Audience"] ?? "CinemaMS",
            ValidateLifetime = true,
            ClockSkew = TimeSpan.Zero
        };
    });
builder.Services.AddAuthorization();

// ---- 4. CONTROLLERS ----
builder.Services.AddControllers();

// ---- 5. SWAGGER với JWT support ----
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "CinemaMS API",
        Version = "v1",
        Description = "Hệ thống Quản lý Bán Vé Xem Phim — CinemaMS"
    });

    // Thêm nút Authorize trong Swagger để nhập JWT token
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Nhập token theo format: Bearer {your_token}"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" }
            },
            Array.Empty<string>()
        }
    });

    // Group endpoints theo Tag (Controller name)
    c.TagActionsBy(api => new[] { api.GroupName ?? api.ActionDescriptor.RouteValues["controller"] });
});

// ---- 6. CORS (cho phép frontend kết nối) ----
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
        policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
});

var app = builder.Build();

// ---- 7. AUTO MIGRATE + SEED DATA ----
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<CinemaDbContext>();
    await db.Database.MigrateAsync(); // Tự migrate khi start
    await DataSeeder.SeedAsync(db);   // Seed dữ liệu mẫu
}

// ---- 8. MIDDLEWARE PIPELINE ----
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "CinemaMS API v1");
    c.RoutePrefix = "swagger"; // Truy cập tại /swagger
    c.DocExpansion(Swashbuckle.AspNetCore.SwaggerUI.DocExpansion.List);
    c.DefaultModelsExpandDepth(-1); // Ẩn schema models
});

app.UseCors("AllowAll");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();
