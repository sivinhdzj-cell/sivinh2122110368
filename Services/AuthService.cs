// ============================================================
// CINEMAMS - AuthService.cs
// Copy vào folder Services/
// ============================================================

using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using sivinh_2122110368.Data;
using sivinh_2122110368.DTOs;
using sivinh_2122110368.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace sivinh_2122110368.Services
{
    public interface IAuthService
    {
        Task<AuthResultDto?> RegisterAsync(RegisterDto dto);
        Task<AuthResultDto?> LoginAsync(LoginDto dto);
        Task<AuthResultDto?> RefreshTokenAsync(string refreshToken);
        Task RevokeTokenAsync(string refreshToken);
    }

    public class AuthService : IAuthService
    {
        private readonly CinemaDbContext _db;
        private readonly IConfiguration _config;

        public AuthService(CinemaDbContext db, IConfiguration config)
        {
            _db = db;
            _config = config;
        }

        public async Task<AuthResultDto?> RegisterAsync(RegisterDto dto)
        {
            // Kiểm tra email đã tồn tại
            if (await _db.Users.AnyAsync(u => u.Email == dto.Email))
                return null;

            var user = new User
            {
                Email = dto.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                FullName = dto.FullName,
                Role = "Customer",
                IsActive = true,
                EmailVerified = false
            };
            _db.Users.Add(user);
            await _db.SaveChangesAsync();

            return await GenerateAuthResult(user);
        }

        public async Task<AuthResultDto?> LoginAsync(LoginDto dto)
        {
            Console.WriteLine($">>> Login attempt: {dto.Email}");
            var user = await _db.Users.FirstOrDefaultAsync(u => u.Email == dto.Email && u.IsActive);
            if (user == null) return null;

            // BYPASS CHO ADMIN ĐỂ TEST (Tối ưu: Bỏ qua hoa thường và khoảng trắng)
            bool isPasswordValid = false;
            string userRole = (user.Role ?? "").Trim().ToUpper();
            
            Console.WriteLine($">>> Found User Role: '{user.Role}' -> Normalized: '{userRole}'");

            if (userRole == "ADMIN" && dto.Password == "123") {
                Console.WriteLine(">>> Admin bypass SUCCESS");
                isPasswordValid = true;
            } else {
                isPasswordValid = BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash);
            }

            if (!isPasswordValid) return null;
            return await GenerateAuthResult(user);
        }

        public async Task<AuthResultDto?> RefreshTokenAsync(string refreshToken)
        {
            var token = await _db.RefreshTokens
                .Include(rt => rt.User)
                .FirstOrDefaultAsync(rt => rt.Token == refreshToken && !rt.IsRevoked && rt.ExpiresAt > DateTime.UtcNow);

            if (token == null) return null;

            // Revoke old token
            token.IsRevoked = true;
            await _db.SaveChangesAsync();

            return await GenerateAuthResult(token.User);
        }

        public async Task RevokeTokenAsync(string refreshToken)
        {
            var token = await _db.RefreshTokens.FirstOrDefaultAsync(rt => rt.Token == refreshToken);
            if (token != null)
            {
                token.IsRevoked = true;
                await _db.SaveChangesAsync();
            }
        }

        private async Task<AuthResultDto> GenerateAuthResult(User user)
        {
            var accessToken = GenerateJwtToken(user);
            var refreshToken = GenerateRefreshToken();
            var expiresAt = DateTime.UtcNow.AddMinutes(1440);

            // Lưu refresh token vào DB
            _db.RefreshTokens.Add(new RefreshToken
            {
                UserId = user.UserId,
                Token = refreshToken,
                ExpiresAt = DateTime.UtcNow.AddDays(7)
            });
            await _db.SaveChangesAsync();

            return new AuthResultDto
            {
                AccessToken = accessToken,
                RefreshToken = refreshToken,
                Email = user.Email,
                FullName = user.FullName,
                Role = user.Role,
                ExpiresAt = expiresAt
            };
        }

        private string GenerateJwtToken(User user)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
                _config["Jwt:Secret"] ?? "CinemaMS_SuperSecret_Key_2025!"));

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Name, user.FullName),
                new Claim(ClaimTypes.Role, user.Role),
                new Claim("userId", user.UserId.ToString()),
            };

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"] ?? "CinemaMS",
                audience: _config["Jwt:Audience"] ?? "CinemaMS",
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(1440),
                signingCredentials: new SigningCredentials(key, SecurityAlgorithms.HmacSha256)
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private static string GenerateRefreshToken()
        {
            var bytes = new byte[64];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(bytes);
            return Convert.ToBase64String(bytes);
        }
    }
}
