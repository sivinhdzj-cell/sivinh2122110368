// ============================================================
// CINEMAMS - AllDTOs.cs
// Copy vào folder DTOs/ trong project của bạn
// ============================================================

using System.ComponentModel.DataAnnotations;

namespace sivinh_2122110368.DTOs
{
    // ================================
    // AUTH DTOs
    // ================================
    public class RegisterDto
    {
        [Required][EmailAddress] public string Email { get; set; } = "";
        [Required][MinLength(6)] public string Password { get; set; } = "";
        [Required] public string FullName { get; set; } = "";
    }

    public class LoginDto
    {
        [Required][EmailAddress] public string Email { get; set; } = "";
        [Required] public string Password { get; set; } = "";
    }

    public class AuthResultDto
    {
        public string AccessToken { get; set; } = "";
        public string RefreshToken { get; set; } = "";
        public string Email { get; set; } = "";
        public string FullName { get; set; } = "";
        public string Role { get; set; } = "";
        public DateTime ExpiresAt { get; set; }
    }

    public class RefreshTokenDto
    {
        [Required] public string RefreshToken { get; set; } = "";
    }

    // ================================
    // MOVIE DTOs
    // ================================
    public class MovieDto
    {
        public int MovieId { get; set; }
        public string Title { get; set; } = "";
        public int DurationMin { get; set; }
        public string? Genre { get; set; }
        public string Rating { get; set; } = "";
        public string? PosterUrl { get; set; }
        public string? Description { get; set; }
        public string Status { get; set; } = "";
        public DateTime? ReleaseDate { get; set; }
        public DateTime? EndDate { get; set; }
    }

    public class CreateMovieDto
    {
        [Required][MaxLength(255)] public string Title { get; set; } = "";
        [Required][Range(1, 500)] public int DurationMin { get; set; }
        [MaxLength(100)] public string? Genre { get; set; }
        [Required] public string Rating { get; set; } = "P";
        [MaxLength(500)] public string? PosterUrl { get; set; }
        [MaxLength(1000)] public string? Description { get; set; }
        public DateTime? ReleaseDate { get; set; }
        public DateTime? EndDate { get; set; }
    }

    public class UpdateMovieDto
    {
        [MaxLength(255)] public string? Title { get; set; }
        [Range(1, 500)] public int? DurationMin { get; set; }
        [MaxLength(100)] public string? Genre { get; set; }
        public string? Rating { get; set; }
        [MaxLength(500)] public string? PosterUrl { get; set; }
        [MaxLength(1000)] public string? Description { get; set; }
        public string? Status { get; set; }
        public DateTime? ReleaseDate { get; set; }
        public DateTime? EndDate { get; set; }
    }

    // ================================
    // CINEMA & ROOM DTOs
    // ================================
    public class CinemaDto
    {
        public int CinemaId { get; set; }
        public string Name { get; set; } = "";
        public string Address { get; set; } = "";
        public string City { get; set; } = "";
        public bool IsActive { get; set; }
    }

    public class RoomDto
    {
        public int RoomId { get; set; }
        public int CinemaId { get; set; }
        public string CinemaName { get; set; } = "";
        public string Name { get; set; } = "";
        public string RoomType { get; set; } = "";
        public int TotalSeats { get; set; }
        public int RowsCount { get; set; }
        public int ColsCount { get; set; }
    }

    // ================================
    // SHOWTIME DTOs
    // ================================
    public class ShowtimeDto
    {
        public int ShowtimeId { get; set; }
        public int MovieId { get; set; }
        public string MovieTitle { get; set; } = "";
        public int RoomId { get; set; }
        public string RoomName { get; set; } = "";
        public string CinemaName { get; set; } = "";
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public string Format { get; set; } = "";
        public decimal BasePrice { get; set; }
        public string Status { get; set; } = "";
    }

    public class CreateShowtimeDto
    {
        [Required] public int MovieId { get; set; }
        [Required] public int RoomId { get; set; }
        [Required] public DateTime StartTime { get; set; }
        [Required] public string Format { get; set; } = "2D";
        [Required][Range(1, 9999999)] public decimal BasePrice { get; set; }
    }

    // ================================
    // SEAT DTOs
    // ================================
    public class SeatStatusDto
    {
        public int SeatId { get; set; }
        public string RowLabel { get; set; } = "";
        public int ColNumber { get; set; }
        public string SeatType { get; set; } = "";
        public string Status { get; set; } = ""; // AVAILABLE/HOLD/BOOKED/UNAVAILABLE
        public decimal Price { get; set; }
    }

    public class SeatMapDto
    {
        public int ShowtimeId { get; set; }
        public string MovieTitle { get; set; } = "";
        public DateTime StartTime { get; set; }
        public string RoomName { get; set; } = "";
        public List<SeatStatusDto> Seats { get; set; } = new();
    }

    // ================================
    // BOOKING DTOs
    // ================================
    public class CreateBookingDto
    {
        [Required] public int ShowtimeId { get; set; }
        [Required][MinLength(1)] public List<int> SeatIds { get; set; } = new();
        public string? CouponCode { get; set; }
        [Required] public string PaymentMethod { get; set; } = "VNPAY"; // VNPAY/MOMO/CASH
        // Guest checkout fields
        public string? GuestEmail { get; set; }
        public string? GuestName { get; set; }
    }

    public class BookingResultDto
    {
        public int BookingId { get; set; }
        public string BookingCode { get; set; } = "";
        public string MovieTitle { get; set; } = "";
        public DateTime ShowtimeStart { get; set; }
        public string RoomName { get; set; } = "";
        public List<string> SeatLabels { get; set; } = new();
        public decimal TotalAmount { get; set; }
        public decimal DiscountAmount { get; set; }
        public string PaymentStatus { get; set; } = "";
        public string PaymentMethod { get; set; } = "";
        public List<TicketDto> Tickets { get; set; } = new();
        public DateTime CreatedAt { get; set; }
    }

    public class TicketDto
    {
        public int BookingSeatId { get; set; }
        public string SeatLabel { get; set; } = "";
        public string QrCodeData { get; set; } = "";
        public bool IsUsed { get; set; }
    }

    public class BookingListDto
    {
        public int BookingId { get; set; }
        public string BookingCode { get; set; } = "";
        public string MovieTitle { get; set; } = "";
        public DateTime ShowtimeStart { get; set; }
        public decimal TotalAmount { get; set; }
        public string PaymentStatus { get; set; } = "";
        public DateTime CreatedAt { get; set; }
    }

    // ================================
    // COUPON DTOs
    // ================================
    public class ValidateCouponDto
    {
        [Required] public string Code { get; set; } = "";
        [Required] public int ShowtimeId { get; set; }
        [Required] public decimal OrderAmount { get; set; }
    }

    public class CouponResultDto
    {
        public bool IsValid { get; set; }
        public string Message { get; set; } = "";
        public decimal DiscountAmount { get; set; }
        public decimal FinalAmount { get; set; }
    }

    public class CreateCouponDto
    {
        [Required][MaxLength(50)] public string Code { get; set; } = "";
        [MaxLength(200)] public string? Description { get; set; }
        [Required] public string DiscountType { get; set; } = "PERCENT";
        [Required][Range(1, 9999999)] public decimal DiscountValue { get; set; }
        public decimal? MinOrderAmount { get; set; }
        public decimal? MaxDiscountAmount { get; set; }
        public int? MaxUsageCount { get; set; }
        public DateTime? ValidFrom { get; set; }
        public DateTime? ValidTo { get; set; }
        public int? ApplicableMovieId { get; set; }
    }

    // ================================
    // QR VERIFY DTO
    // ================================
    public class VerifyTicketDto
    {
        [Required] public string QrData { get; set; } = "";
    }

    public class VerifyResultDto
    {
        public bool IsValid { get; set; }
        public string Message { get; set; } = "";
        public string? GuestName { get; set; }
        public string? MovieTitle { get; set; }
        public string? SeatLabel { get; set; }
        public DateTime? ShowtimeStart { get; set; }
    }

    // ================================
    // COMMON
    // ================================
    public class ApiResponse<T>
    {
        public bool Success { get; set; }
        public string Message { get; set; } = "";
        public T? Data { get; set; }

        public static ApiResponse<T> Ok(T data, string msg = "Thành công") =>
            new() { Success = true, Message = msg, Data = data };
        public static ApiResponse<T> Fail(string msg) =>
            new() { Success = false, Message = msg };
    }

    public class PagedResult<T>
    {
        public List<T> Items { get; set; } = new();
        public int TotalCount { get; set; }
        public int Page { get; set; }
        public int PageSize { get; set; }
        public int TotalPages => (int)Math.Ceiling((double)TotalCount / PageSize);
    }
}
