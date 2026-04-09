// ============================================================
// CINEMAMS - ALL DATABASE MODELS
// Copy file này vào folder Models trong project của bạn
// ============================================================

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace sivinh_2122110368.Models
{
    // ===========================
    // 1. CINEMA (Rạp chiếu phim)
    // ===========================
    [Table("cinemas")]
    public class Cinema
    {
        [Key] public int CinemaId { get; set; }
        [Required][MaxLength(200)] public string Name { get; set; } = "";
        [Required][MaxLength(500)] public string Address { get; set; } = "";
        [Required][MaxLength(100)] public string City { get; set; } = "";
        public bool IsActive { get; set; } = true;

        public ICollection<Room> Rooms { get; set; } = new List<Room>();
    }

    // ===========================
    // 2. ROOM (Phòng chiếu)
    // ===========================
    [Table("rooms")]
    public class Room
    {
        [Key] public int RoomId { get; set; }
        [Required] public int CinemaId { get; set; }
        [Required][MaxLength(100)] public string Name { get; set; } = "";
        [Required][MaxLength(20)] public string RoomType { get; set; } = "2D"; // 2D/3D/IMAX/4DX/Dolby
        [Required] public int TotalSeats { get; set; }
        [Required] public int RowsCount { get; set; }
        [Required] public int ColsCount { get; set; }

        [ForeignKey("CinemaId")] public Cinema Cinema { get; set; } = null!;
        public ICollection<Seat> Seats { get; set; } = new List<Seat>();
        public ICollection<Showtime> Showtimes { get; set; } = new List<Showtime>();
    }

    // ===========================
    // 3. SEAT (Ghế ngồi)
    // ===========================
    [Table("seats")]
    public class Seat
    {
        [Key] public int SeatId { get; set; }
        [Required] public int RoomId { get; set; }
        [Required][MaxLength(5)] public string RowLabel { get; set; } = ""; // A, B, C...
        [Required] public int ColNumber { get; set; }                        // 1, 2, 3...
        [Required][MaxLength(20)] public string SeatType { get; set; } = "NORMAL"; // NORMAL/VIP/COUPLE
        public bool IsActive { get; set; } = true;

        [ForeignKey("RoomId")] public Room Room { get; set; } = null!;
        public ICollection<ShowtimeSeat> ShowtimeSeats { get; set; } = new List<ShowtimeSeat>();
    }

    // ===========================
    // 4. MOVIE (Phim)
    // ===========================
    [Table("movies")]
    public class Movie
    {
        [Key] public int MovieId { get; set; }
        [Required][MaxLength(255)] public string Title { get; set; } = "";
        [Required] public int DurationMin { get; set; }
        [MaxLength(100)] public string? Genre { get; set; }
        [Required][MaxLength(5)] public string Rating { get; set; } = "P"; // P/C13/C16/C18
        [MaxLength(500)] public string? PosterUrl { get; set; }
        [MaxLength(1000)] public string? Description { get; set; }
        [Required][MaxLength(20)] public string Status { get; set; } = "DRAFT"; // DRAFT/ACTIVE/ENDED
        public DateTime? ReleaseDate { get; set; }
        public DateTime? EndDate { get; set; }

        public ICollection<Showtime> Showtimes { get; set; } = new List<Showtime>();
    }

    // ===========================
    // 5. SHOWTIME (Suất chiếu)
    // ===========================
    [Table("showtimes")]
    public class Showtime
    {
        [Key] public int ShowtimeId { get; set; }
        [Required] public int MovieId { get; set; }
        [Required] public int RoomId { get; set; }
        [Required] public DateTime StartTime { get; set; }
        [Required] public DateTime EndTime { get; set; }
        [Required][MaxLength(10)] public string Format { get; set; } = "2D"; // 2D/3D/IMAX/4DX
        [Required][Column(TypeName = "decimal(12,0)")] public decimal BasePrice { get; set; }
        [Required][MaxLength(20)] public string Status { get; set; } = "SCHEDULED"; // SCHEDULED/ONGOING/COMPLETED/CANCELLED

        [ForeignKey("MovieId")] public Movie Movie { get; set; } = null!;
        [ForeignKey("RoomId")] public Room Room { get; set; } = null!;
        public ICollection<ShowtimeSeat> ShowtimeSeats { get; set; } = new List<ShowtimeSeat>();
        public ICollection<Booking> Bookings { get; set; } = new List<Booking>();
    }

    // ===========================
    // 6. SHOWTIME_SEAT (Trạng thái ghế theo suất)
    // ===========================
    [Table("showtime_seats")]
    public class ShowtimeSeat
    {
        [Key] public int ShowtimeSeatId { get; set; }
        [Required] public int ShowtimeId { get; set; }
        [Required] public int SeatId { get; set; }
        [Required][MaxLength(20)] public string Status { get; set; } = "AVAILABLE";
        // AVAILABLE / HOLD / BOOKED / UNAVAILABLE
        public int? HeldByUserId { get; set; }
        public DateTime? HoldExpiresAt { get; set; }

        [ForeignKey("ShowtimeId")] public Showtime Showtime { get; set; } = null!;
        [ForeignKey("SeatId")] public Seat Seat { get; set; } = null!;
    }

    // ===========================
    // 7. USER (Tài khoản)
    // ===========================
    [Table("users")]
    public class User
    {
        [Key] public int UserId { get; set; }
        [Required][MaxLength(200)] public string Email { get; set; } = "";
        [Required] public string PasswordHash { get; set; } = "";
        [Required][MaxLength(200)] public string FullName { get; set; } = "";
        [Required][MaxLength(20)] public string Role { get; set; } = "Customer"; // Admin/Manager/Cashier/Customer
        public int LoyaltyPoints { get; set; } = 0;
        public bool EmailVerified { get; set; } = false;
        public bool IsActive { get; set; } = true;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public ICollection<Booking> Bookings { get; set; } = new List<Booking>();
    }

    // ===========================
    // 8. COUPON (Mã khuyến mãi)
    // ===========================
    [Table("coupons")]
    public class Coupon
    {
        [Key] public int CouponId { get; set; }
        [Required][MaxLength(50)] public string Code { get; set; } = "";
        [MaxLength(200)] public string? Description { get; set; }
        [Required][MaxLength(10)] public string DiscountType { get; set; } = "PERCENT"; // PERCENT / FIXED
        [Required][Column(TypeName = "decimal(12,0)")] public decimal DiscountValue { get; set; }
        [Column(TypeName = "decimal(12,0)")] public decimal? MinOrderAmount { get; set; }
        [Column(TypeName = "decimal(12,0)")] public decimal? MaxDiscountAmount { get; set; }
        public int? MaxUsageCount { get; set; }
        public int UsedCount { get; set; } = 0;
        public bool IsActive { get; set; } = true;
        public DateTime? ValidFrom { get; set; }
        public DateTime? ValidTo { get; set; }
        public int? ApplicableMovieId { get; set; }

        [ForeignKey("ApplicableMovieId")] public Movie? ApplicableMovie { get; set; }
        public ICollection<Booking> Bookings { get; set; } = new List<Booking>();
    }

    // ===========================
    // 9. BOOKING (Đơn đặt vé)
    // ===========================
    [Table("bookings")]
    public class Booking
    {
        [Key] public int BookingId { get; set; }
        public int? UserId { get; set; }                    // NULL nếu guest
        [Required] public int ShowtimeId { get; set; }
        [Required][Column(TypeName = "decimal(12,0)")] public decimal TotalAmount { get; set; }
        [Required][MaxLength(20)] public string PaymentMethod { get; set; } = "VNPAY"; // VNPAY/MOMO/CASH
        [Required][MaxLength(20)] public string PaymentStatus { get; set; } = "PENDING"; // PENDING/SUCCESS/FAILED/REFUNDED
        public int? CouponId { get; set; }
        [Required][MaxLength(20)] public string BookingCode { get; set; } = "";
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [ForeignKey("UserId")] public User? User { get; set; }
        [ForeignKey("ShowtimeId")] public Showtime Showtime { get; set; } = null!;
        [ForeignKey("CouponId")] public Coupon? Coupon { get; set; }
        public ICollection<BookingSeat> BookingSeats { get; set; } = new List<BookingSeat>();
    }

    // ===========================
    // 10. BOOKING_SEAT (Vé ghế)
    // ===========================
    [Table("booking_seats")]
    public class BookingSeat
    {
        [Key] public int BookingSeatId { get; set; }
        [Required] public int BookingId { get; set; }
        [Required] public int SeatId { get; set; }
        [Required] public int ShowtimeId { get; set; }
        [Required][Column(TypeName = "decimal(12,0)")] public decimal Price { get; set; }
        [MaxLength(500)] public string? QrCodeData { get; set; }
        [MaxLength(100)] public string? QrHash { get; set; }
        public bool IsUsed { get; set; } = false;
        public DateTime? UsedAt { get; set; }

        [ForeignKey("BookingId")] public Booking Booking { get; set; } = null!;
        [ForeignKey("SeatId")] public Seat Seat { get; set; } = null!;
    }

    // ===========================
    // 11. REFRESH_TOKEN (JWT)
    // ===========================
    [Table("refresh_tokens")]
    public class RefreshToken
    {
        [Key] public int Id { get; set; }
        [Required] public int UserId { get; set; }
        [Required] public string Token { get; set; } = "";
        public DateTime ExpiresAt { get; set; }
        public bool IsRevoked { get; set; } = false;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [ForeignKey("UserId")] public User User { get; set; } = null!;
    }
}
