using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using sivinh_2122110368.Services;
using sivinh_2122110368.DTOs;

namespace CinemaMS.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class BookingController : ControllerBase
    {
        private readonly IBookingService _booking;

        public BookingController(IBookingService booking)
        {
            _booking = booking;
        }

        /// <summary>
        /// Lấy sơ đồ ghế của suất chiếu
        /// </summary>
        [HttpGet("seatmap/{showtimeId}")]
        public async Task<IActionResult> GetSeatMap(int showtimeId)
        {
            var map = await _booking.GetSeatMapAsync(showtimeId);
            if (map == null) return NotFound(new { message = "Suất chiếu không tồn tại" });
            return Ok(map);
        }

        /// <summary>
        /// Tạo booking mới
        /// </summary>
        [HttpPost]
        public async Task<IActionResult> CreateBooking([FromBody] CreateBookingDto dto)
        {
            int userId = int.Parse(User.Claims.First(c => c.Type == "userId").Value);
            var (result, error) = await _booking.CreateBookingAsync(dto, userId);
            if (result == null) return BadRequest(new { message = error });
            return Ok(result);
        }

        /// <summary>
        /// Xem booking theo code
        /// </summary>
        [HttpGet("{bookingCode}")]
        public async Task<IActionResult> GetBooking(string bookingCode)
        {
            var result = await _booking.GetBookingByCodeAsync(bookingCode);
            if (result == null) return NotFound(new { message = "Booking không tồn tại" });
            return Ok(result);
        }

        /// <summary>
        /// Xem danh sách booking của user
        /// </summary>
        [HttpGet("my")]
        public async Task<IActionResult> GetMyBookings()
        {
            int userId = int.Parse(User.Claims.First(c => c.Type == "userId").Value);
            var list = await _booking.GetUserBookingsAsync(userId);
            return Ok(list);
        }

        /// <summary>
        /// Verify QR ticket
        /// </summary>
        [HttpPost("verify")]
        public async Task<IActionResult> VerifyTicket([FromBody] Dictionary<string, string> body)
        {
            if (!body.TryGetValue("qrData", out var qrData))
                return BadRequest(new { message = "qrData missing" });

            var result = await _booking.VerifyTicketAsync(qrData);
            return Ok(result);
        }

        /// <summary>
        /// Validate coupon
        /// </summary>
        [HttpPost("coupon/validate")]
        public async Task<IActionResult> ValidateCoupon([FromBody] ValidateCouponDto dto)
        {
            var result = await _booking.ValidateCouponAsync(dto);
            return Ok(result);
        }
    }
}