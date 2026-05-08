// ============================================================
// CINEMAMS - AuthController.cs
// ============================================================
using sivinh_2122110368.DTOs;
using sivinh_2122110368.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;


namespace sivinh_2122110368.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _auth;
        public AuthController(IAuthService auth) => _auth = auth;

        /// <summary>Đăng ký tài khoản mới (Customer)</summary>
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto dto)
        {
            var result = await _auth.RegisterAsync(dto);
            if (result == null)
                return BadRequest(ApiResponse<string>.Fail("Email đã tồn tại trong hệ thống"));
            return Ok(ApiResponse<AuthResultDto>.Ok(result, "Đăng ký thành công"));
        }

        /// <summary>Đăng nhập — trả về AccessToken (15 phút) và RefreshToken (7 ngày)</summary>
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            var result = await _auth.LoginAsync(dto);
            if (result == null)
                return Unauthorized(ApiResponse<string>.Fail("Email hoặc mật khẩu không đúng"));
            return Ok(ApiResponse<AuthResultDto>.Ok(result, "Đăng nhập thành công"));
        }

        /// <summary>Lấy AccessToken mới bằng RefreshToken</summary>
        [HttpPost("refresh")]
        public async Task<IActionResult> Refresh([FromBody] RefreshTokenDto dto)
        {
            var result = await _auth.RefreshTokenAsync(dto.RefreshToken);
            if (result == null)
                return Unauthorized(ApiResponse<string>.Fail("RefreshToken không hợp lệ hoặc đã hết hạn"));
            return Ok(ApiResponse<AuthResultDto>.Ok(result, "Token mới đã được cấp"));
        }

        /// <summary>Đăng xuất — thu hồi RefreshToken</summary>
        [HttpPost("logout")]
        [Authorize]
        public async Task<IActionResult> Logout([FromBody] RefreshTokenDto dto)
        {
            await _auth.RevokeTokenAsync(dto.RefreshToken);
            return Ok(ApiResponse<string>.Ok("", "Đăng xuất thành công"));
        }

        /// <summary>Kiểm tra token hiện tại có hợp lệ không</summary>
        [HttpGet("me")]
        [Authorize]
        public IActionResult Me()
        {
            var userId = User.FindFirst("userId")?.Value;
            var email = User.FindFirst(System.Security.Claims.ClaimTypes.Email)?.Value;
            var role = User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value;
            return Ok(ApiResponse<object>.Ok(new { userId, email, role }));
        }
    }
}
