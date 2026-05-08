// ============================================================
// CINEMAMS - BookingService.cs
// Copy vào folder Services/
// ============================================================

using System.Security.Cryptography;
using System.Text;
using sivinh_2122110368.Data;
using sivinh_2122110368.DTOs;
using sivinh_2122110368.Models;
using Microsoft.EntityFrameworkCore;

namespace sivinh_2122110368.Services
{
    public interface IBookingService
    {
        Task<SeatMapDto?> GetSeatMapAsync(int showtimeId);
        Task<(BookingResultDto? result, string error)> CreateBookingAsync(CreateBookingDto dto, int? userId);
        Task<BookingResultDto?> GetBookingByCodeAsync(string code);
        Task<List<BookingListDto>> GetUserBookingsAsync(int userId);
        Task<CouponResultDto> ValidateCouponAsync(ValidateCouponDto dto);
        Task<VerifyResultDto> VerifyTicketAsync(string qrData);
    }

    public class BookingService : IBookingService
    {
        private readonly CinemaDbContext _db;
        private const string SecretKey = "CinemaMSSecretKey123!";
        private const int HoldMinutes = 10;

        public BookingService(CinemaDbContext db) => _db = db;

        // ---- SƠ ĐỒ GHẾ ----
        public async Task<SeatMapDto?> GetSeatMapAsync(int showtimeId)
        {
            var showtime = await _db.Showtimes
                .Include(s => s.Movie)
                .Include(s => s.Room)
                .FirstOrDefaultAsync(s => s.ShowtimeId == showtimeId);
            if (showtime == null) return null;

            // Giải phóng ghế hết hạn HOLD
            await ReleaseExpiredHolds(showtimeId);

            var seatStatuses = await _db.ShowtimeSeats
                .Include(ss => ss.Seat)
                .Where(ss => ss.ShowtimeId == showtimeId)
                .ToListAsync();

            return new SeatMapDto
            {
                ShowtimeId = showtimeId,
                MovieTitle = showtime.Movie.Title,
                StartTime = showtime.StartTime,
                RoomName = showtime.Room.Name,
                Seats = seatStatuses.Select(ss => new SeatStatusDto
                {
                    SeatId = ss.SeatId,
                    RowLabel = ss.Seat.RowLabel,
                    ColNumber = ss.Seat.ColNumber,
                    SeatType = ss.Seat.SeatType,
                    Status = ss.Status,
                    Price = CalculateSeatPrice(showtime.BasePrice, ss.Seat.SeatType)
                }).OrderBy(s => s.RowLabel).ThenBy(s => s.ColNumber).ToList()
            };
        }

        // ---- TẠO BOOKING ----
        public async Task<(BookingResultDto? result, string error)> CreateBookingAsync(CreateBookingDto dto, int? userId)
        {
            using var transaction = await _db.Database.BeginTransactionAsync();
            try
            {
                var showtime = await _db.Showtimes
                    .Include(s => s.Movie)
                    .Include(s => s.Room).ThenInclude(r => r.Cinema)
                    .FirstOrDefaultAsync(s => s.ShowtimeId == dto.ShowtimeId);

                if (showtime == null) return (null, "Suất chiếu không tồn tại");
                if (showtime.Status == "CANCELLED") return (null, "Suất chiếu đã bị hủy");

                // Giải phóng ghế hết hạn trước
                await ReleaseExpiredHolds(dto.ShowtimeId);

                // Kiểm tra và LOCK ghế (dùng row-level lock)
                var seats = await _db.ShowtimeSeats
                    .Include(ss => ss.Seat)
                    .Where(ss => ss.ShowtimeId == dto.ShowtimeId && dto.SeatIds.Contains(ss.SeatId))
                    .ToListAsync();

                if (seats.Count != dto.SeatIds.Count)
                    return (null, "Một số ghế không tồn tại trong suất chiếu này");

                var unavailable = seats.Where(s => s.Status != "AVAILABLE").ToList();
                if (unavailable.Any())
                {
                    var labels = unavailable.Select(s => $"{s.Seat.RowLabel}{s.Seat.ColNumber}");
                    return (null, $"Ghế {string.Join(", ", labels)} đã được đặt hoặc đang được giữ");
                }

                // Tính giá
                decimal subtotal = seats.Sum(s => CalculateSeatPrice(showtime.BasePrice, s.Seat.SeatType));
                decimal discountAmount = 0;
                Coupon? coupon = null;

                // Validate coupon
                if (!string.IsNullOrEmpty(dto.CouponCode))
                {
                    var couponCheck = await ValidateCouponAsync(new ValidateCouponDto
                    {
                        Code = dto.CouponCode,
                        ShowtimeId = dto.ShowtimeId,
                        OrderAmount = subtotal
                    });
                    if (!couponCheck.IsValid)
                        return (null, couponCheck.Message);

                    discountAmount = couponCheck.DiscountAmount;
                    coupon = await _db.Coupons.FirstAsync(c => c.Code == dto.CouponCode);
                    coupon.UsedCount++;
                }

                decimal totalAmount = subtotal - discountAmount;

                // Tạo booking code
                string bookingCode = GenerateBookingCode();

                // Tạo Booking
                var booking = new Booking
                {
                    UserId = userId,
                    ShowtimeId = dto.ShowtimeId,
                    TotalAmount = totalAmount,
                    PaymentMethod = dto.PaymentMethod,
                    PaymentStatus = dto.PaymentMethod == "CASH" ? "SUCCESS" : "PENDING",
                    CouponId = coupon?.CouponId,
                    BookingCode = bookingCode,
                    CreatedAt = DateTime.UtcNow
                };
                _db.Bookings.Add(booking);
                await _db.SaveChangesAsync();

                // Tạo BookingSeats + QR + cập nhật ShowtimeSeats
                var bookingSeats = new List<BookingSeat>();
                foreach (var ss in seats)
                {
                    var qrHash = GenerateHash(booking.BookingId, ss.SeatId);
                    var qrData = $"{{\"bookingId\":{booking.BookingId},\"seatId\":{ss.SeatId},\"showtimeId\":{dto.ShowtimeId},\"hash\":\"{qrHash}\"}}";

                    bookingSeats.Add(new BookingSeat
                    {
                        BookingId = booking.BookingId,
                        SeatId = ss.SeatId,
                        ShowtimeId = dto.ShowtimeId,
                        Price = CalculateSeatPrice(showtime.BasePrice, ss.Seat.SeatType),
                        QrCodeData = qrData,
                        QrHash = qrHash,
                        IsUsed = false
                    });

                    // Cập nhật trạng thái ghế
                    ss.Status = booking.PaymentStatus == "SUCCESS" ? "BOOKED" : "HOLD";
                    ss.HeldByUserId = userId;
                    ss.HoldExpiresAt = DateTime.UtcNow.AddMinutes(HoldMinutes);
                }
                _db.BookingSeats.AddRange(bookingSeats);
                await _db.SaveChangesAsync();
                await transaction.CommitAsync();

                var result = new BookingResultDto
                {
                    BookingId = booking.BookingId,
                    BookingCode = bookingCode,
                    MovieTitle = showtime.Movie.Title,
                    ShowtimeStart = showtime.StartTime,
                    RoomName = $"{showtime.Room.Name} - {showtime.Room.Cinema.Name}",
                    SeatLabels = seats.Select(s => $"{s.Seat.RowLabel}{s.Seat.ColNumber}").ToList(),
                    TotalAmount = totalAmount,
                    DiscountAmount = discountAmount,
                    PaymentStatus = booking.PaymentStatus,
                    PaymentMethod = booking.PaymentMethod,
                    CreatedAt = booking.CreatedAt,
                    Tickets = bookingSeats.Select(bs => new TicketDto
                    {
                        BookingSeatId = bs.BookingSeatId,
                        SeatLabel = $"{seats.First(s => s.SeatId == bs.SeatId).Seat.RowLabel}{seats.First(s => s.SeatId == bs.SeatId).Seat.ColNumber}",
                        QrCodeData = bs.QrCodeData ?? "",
                        IsUsed = false
                    }).ToList()
                };

                return (result, "");
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return (null, $"Lỗi hệ thống: {ex.Message}");
            }
        }

        // ---- XEM BOOKING ----
        public async Task<BookingResultDto?> GetBookingByCodeAsync(string code)
        {
            var booking = await _db.Bookings
                .Include(b => b.Showtime).ThenInclude(s => s.Movie)
                .Include(b => b.Showtime).ThenInclude(s => s.Room).ThenInclude(r => r.Cinema)
                .Include(b => b.BookingSeats).ThenInclude(bs => bs.Seat)
                .FirstOrDefaultAsync(b => b.BookingCode == code);

            if (booking == null) return null;

            return new BookingResultDto
            {
                BookingId = booking.BookingId,
                BookingCode = booking.BookingCode,
                MovieTitle = booking.Showtime.Movie.Title,
                ShowtimeStart = booking.Showtime.StartTime,
                RoomName = $"{booking.Showtime.Room.Name} - {booking.Showtime.Room.Cinema.Name}",
                SeatLabels = booking.BookingSeats.Select(bs => $"{bs.Seat.RowLabel}{bs.Seat.ColNumber}").ToList(),
                TotalAmount = booking.TotalAmount,
                DiscountAmount = 0,
                PaymentStatus = booking.PaymentStatus,
                PaymentMethod = booking.PaymentMethod,
                CreatedAt = booking.CreatedAt,
                Tickets = booking.BookingSeats.Select(bs => new TicketDto
                {
                    BookingSeatId = bs.BookingSeatId,
                    SeatLabel = $"{bs.Seat.RowLabel}{bs.Seat.ColNumber}",
                    QrCodeData = bs.QrCodeData ?? "",
                    IsUsed = bs.IsUsed
                }).ToList()
            };
        }

        public async Task<List<BookingListDto>> GetUserBookingsAsync(int userId)
        {
            return await _db.Bookings
                .Include(b => b.Showtime).ThenInclude(s => s.Movie)
                .Where(b => b.UserId == userId)
                .OrderByDescending(b => b.CreatedAt)
                .Select(b => new BookingListDto
                {
                    BookingId = b.BookingId,
                    BookingCode = b.BookingCode,
                    MovieTitle = b.Showtime.Movie.Title,
                    ShowtimeStart = b.Showtime.StartTime,
                    TotalAmount = b.TotalAmount,
                    PaymentStatus = b.PaymentStatus,
                    CreatedAt = b.CreatedAt
                }).ToListAsync();
        }

        // ---- VALIDATE COUPON (6 điều kiện theo tài liệu) ----
        public async Task<CouponResultDto> ValidateCouponAsync(ValidateCouponDto dto)
        {
            // 1. Tồn tại
            var coupon = await _db.Coupons
                .Include(c => c.ApplicableMovie)
                .FirstOrDefaultAsync(c => c.Code == dto.Code);
            if (coupon == null)
                return new CouponResultDto { IsValid = false, Message = "Mã khuyến mãi không hợp lệ" };

            // 2. Đang kích hoạt
            if (!coupon.IsActive)
                return new CouponResultDto { IsValid = false, Message = "Mã khuyến mãi đã bị vô hiệu hóa" };

            // 3. Trong thời hạn
            var now = DateTime.UtcNow;
            if ((coupon.ValidFrom.HasValue && now < coupon.ValidFrom) ||
                (coupon.ValidTo.HasValue && now > coupon.ValidTo))
                return new CouponResultDto { IsValid = false, Message = "Mã khuyến mãi chưa hoạt động hoặc đã hết hạn" };

            // 4. Còn lượt dùng
            if (coupon.MaxUsageCount.HasValue && coupon.UsedCount >= coupon.MaxUsageCount)
                return new CouponResultDto { IsValid = false, Message = "Mã khuyến mãi đã hết lượt sử dụng" };

            // 5. Đủ giá trị đơn hàng
            if (coupon.MinOrderAmount.HasValue && dto.OrderAmount < coupon.MinOrderAmount)
                return new CouponResultDto { IsValid = false, Message = "Đơn hàng chưa đạt giá trị tối thiểu để áp dụng" };

            // 6. Phim hợp lệ
            if (coupon.ApplicableMovieId.HasValue)
            {
                var showtime = await _db.Showtimes.FindAsync(dto.ShowtimeId);
                if (showtime == null || showtime.MovieId != coupon.ApplicableMovieId)
                    return new CouponResultDto { IsValid = false, Message = "Mã khuyến mãi không áp dụng cho phim này" };
            }

            // Tính discount
            decimal discount = coupon.DiscountType == "PERCENT"
                ? Math.Min(dto.OrderAmount * coupon.DiscountValue / 100,
                    coupon.MaxDiscountAmount ?? decimal.MaxValue)
                : coupon.DiscountValue;

            discount = Math.Min(discount, dto.OrderAmount);

            return new CouponResultDto
            {
                IsValid = true,
                Message = $"Áp dụng thành công! Giảm {(coupon.DiscountType == "PERCENT" ? coupon.DiscountValue + "%" : coupon.DiscountValue.ToString("N0") + "đ")}",
                DiscountAmount = discount,
                FinalAmount = dto.OrderAmount - discount
            };
        }

        // ---- VERIFY QR ----
        public async Task<VerifyResultDto> VerifyTicketAsync(string qrData)
        {
            try
            {
                // Parse QR: {"bookingId":1,"seatId":1,"showtimeId":1,"hash":"..."}
                var obj = System.Text.Json.JsonSerializer.Deserialize<Dictionary<string, System.Text.Json.JsonElement>>(qrData);
                if (obj == null) return new VerifyResultDto { IsValid = false, Message = "QR không hợp lệ" };

                int bookingId = obj["bookingId"].GetInt32();
                int seatId = obj["seatId"].GetInt32();
                string hash = obj["hash"].GetString() ?? "";

                // Kiểm tra hash
                if (GenerateHash(bookingId, seatId) != hash)
                    return new VerifyResultDto { IsValid = false, Message = "KHÔNG HỢP LỆ - QR bị giả mạo" };

                var bookingSeat = await _db.BookingSeats
                    .Include(bs => bs.Booking).ThenInclude(b => b.Showtime).ThenInclude(s => s.Movie)
                    .Include(bs => bs.Seat)
                    .FirstOrDefaultAsync(bs => bs.BookingId == bookingId && bs.SeatId == seatId);

                if (bookingSeat == null)
                    return new VerifyResultDto { IsValid = false, Message = "KHÔNG HỢP LỆ - Vé không tồn tại" };

                if (bookingSeat.Booking.PaymentStatus != "SUCCESS")
                    return new VerifyResultDto { IsValid = false, Message = "KHÔNG HỢP LỆ - Chưa thanh toán" };

                if (bookingSeat.IsUsed)
                    return new VerifyResultDto { IsValid = false, Message = "KHÔNG HỢP LỆ - Vé đã được sử dụng" };

                // Đánh dấu đã dùng
                bookingSeat.IsUsed = true;
                bookingSeat.UsedAt = DateTime.UtcNow;
                await _db.SaveChangesAsync();

                return new VerifyResultDto
                {
                    IsValid = true,
                    Message = "✅ OK - Cho vào",
                    MovieTitle = bookingSeat.Booking.Showtime.Movie.Title,
                    SeatLabel = $"{bookingSeat.Seat.RowLabel}{bookingSeat.Seat.ColNumber}",
                    ShowtimeStart = bookingSeat.Booking.Showtime.StartTime
                };
            }
            catch
            {
                return new VerifyResultDto { IsValid = false, Message = "KHÔNG HỢP LỆ - Lỗi đọc QR" };
            }
        }

        // ---- HELPERS ----
        private async Task ReleaseExpiredHolds(int showtimeId)
        {
            var expired = await _db.ShowtimeSeats
                .Where(ss => ss.ShowtimeId == showtimeId
                    && ss.Status == "HOLD"
                    && ss.HoldExpiresAt < DateTime.UtcNow)
                .ToListAsync();

            foreach (var ss in expired)
            {
                ss.Status = "AVAILABLE";
                ss.HeldByUserId = null;
                ss.HoldExpiresAt = null;
            }
            if (expired.Any()) await _db.SaveChangesAsync();
        }

        private static decimal CalculateSeatPrice(decimal basePrice, string seatType) =>
            seatType switch
            {
                "VIP" => basePrice * 1.5m,
                "COUPLE" => basePrice * 2.0m,
                _ => basePrice
            };

        private static string GenerateHash(int bookingId, int seatId)
        {
            string input = $"{bookingId}:{seatId}:{SecretKey}";
            using var sha = SHA256.Create();
            var bytes = sha.ComputeHash(Encoding.UTF8.GetBytes(input));
            return Convert.ToHexString(bytes)[..16]; // lấy 16 ký tự đầu
        }

        private static string GenerateBookingCode()
        {
            return "BK" + DateTime.UtcNow.ToString("yyMMdd") + Random.Shared.Next(1000, 9999);
        }
    }
}
