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
builder.Services.AddScoped<IBookingService, BookingService>();

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

// ---- 5. SWAGGER ----
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "CinemaMS API", Version = "v1" });
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Nhập: Bearer {your_token}"
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
});

// ---- 6. CORS (FIX LỖI CORB TRÊN TRÌNH DUYỆT) ----
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader());
});

var app = builder.Build();

// ---- 7. AUTO MIGRATE + SEED DATA ----
using (var scope = app.Services.CreateScope())
{
    try
    {
        var db = scope.ServiceProvider.GetRequiredService<CinemaDbContext>();
        await db.Database.MigrateAsync();
        await DataSeeder.SeedAsync(db);
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Lỗi Seed Data: {ex.Message}");
    }
}

// ---- 8. MIDDLEWARE PIPELINE ----

// Cấu hình Swagger cho cả môi trường Development và Production (nếu cần xem API)
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "CinemaMS API v1");
    c.RoutePrefix = "swagger"; // Truy cập tại /swagger
});
builder.Services.AddCors(options => {
    options.AddDefaultPolicy(policy => policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod());
});
// app.UseHttpsRedirection(); // Tạm thời comment nếu bạn test local với HTTP để tránh lỗi SSL

// QUAN TRỌNG NHẤT: Thứ tự Middleware để fix lỗi CORB
app.UseRouting(); // Thêm dòng này để định tuyến rõ ràng

app.UseCors("AllowAll"); // Phải nằm SAU UseRouting và TRƯỚC Authentication

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();