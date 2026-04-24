using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using sivinh_2122110368.Services;
using sivinh_2122110368.DTOs;

namespace CinemaMS.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
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
        [HttpGet("seatmap/{showtimeId:int}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetSeatMap(int showtimeId)
        {
            var map = await _booking.GetSeatMapAsync(showtimeId);
            if (map == null) return NotFound(new { message = "Suất chiếu không tồn tại" });
            return Ok(map);
        }

        /// <summary>
        /// Lấy tất cả booking (Admin)
        /// </summary>
        [HttpGet("all")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAllBookings()
        {
            var list = await _booking.GetAllBookingsAsync();
            return Ok(list);
        }

        /// <summary>
        /// Xem danh sách booking của user
        /// </summary>
        [HttpGet("my")]
        [Authorize]
        public async Task<IActionResult> GetMyBookings()
        {
            int userId = int.Parse(User.Claims.First(c => c.Type == "userId").Value);
            var list = await _booking.GetUserBookingsAsync(userId);
            return Ok(list);
        }

        /// <summary>
        /// Xem booking theo code
        /// </summary>
        [HttpGet("code/{bookingCode}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetBooking(string bookingCode)
        {
            var result = await _booking.GetBookingByCodeAsync(bookingCode);
            if (result == null) return NotFound(new { message = "Booking không tồn tại" });
            return Ok(result);
        }

        /// <summary>
        /// Tạo booking mới
        /// </summary>
        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> CreateBooking([FromBody] CreateBookingDto dto)
        {
            int? userId = null;
            try
            {
                var claim = User.Claims.FirstOrDefault(c => c.Type == "userId");
                if (claim != null) userId = int.Parse(claim.Value);
            }
            catch { }

            var (result, error) = await _booking.CreateBookingAsync(dto, userId);
            if (result == null) return BadRequest(new { message = error });
            return Ok(result);
        }

        /// <summary>
        /// Xác nhận thanh toán
        /// </summary>
        [HttpPost("confirm-payment/{code}")]
        [AllowAnonymous]
        public async Task<IActionResult> ConfirmPayment(string code)
        {
            var success = await _booking.MarkAsPaidAsync(code);
            if (!success) return NotFound(new { message = "Không tìm thấy mã đặt vé" });
            return Ok(new { Success = true, Message = "Thanh toán đã được xác nhận" });
        }

        /// <summary>
        /// Xử lý callback sau khi thanh toán MoMo/VNPay thành công
        /// </summary>
        [HttpPost("confirm-momo")]
        [AllowAnonymous]
        public async Task<IActionResult> ConfirmMomo([FromBody] Dictionary<string, string> body)
        {
            if (!body.TryGetValue("orderId", out var orderId))
                return BadRequest(new { message = "orderId missing" });

            var success = await _booking.MarkAsPaidAsync(orderId);
            if (!success) return NotFound(new { message = "Không tìm thấy mã đơn hàng" });

            var booking = await _booking.GetBookingByCodeAsync(orderId);
            return Ok(booking);
        }

        /// <summary>
        /// Verify QR ticket
        /// </summary>
        [HttpPost("verify")]
        [AllowAnonymous]
        public async Task<IActionResult> VerifyTicket([FromBody] Dictionary<string, string> body)
        {
            body.TryGetValue("qrData", out var qrData);
            body.TryGetValue("bookingCode", out var bookingCode);
            var result = await _booking.VerifyTicketAsync(qrData ?? bookingCode ?? "");
            return Ok(result);
        }

        /// <summary>
        /// Validate coupon
        /// </summary>
        [HttpPost("coupon/validate")]
        [AllowAnonymous]
        public async Task<IActionResult> ValidateCoupon([FromBody] ValidateCouponDto dto)
        {
            var result = await _booking.ValidateCouponAsync(dto);
            return Ok(result);
        }

        /// <summary>
        /// Xóa booking & giải phóng ghế
        /// </summary>
        [HttpDelete("{id:int}")]
        [AllowAnonymous]
        public async Task<IActionResult> DeleteBooking(int id)
        {
            var success = await _booking.DeleteBookingAsync(id);
            if (!success) return NotFound(new { message = "Không tìm thấy booking để xóa" });
            return NoContent();
        }
    }
}