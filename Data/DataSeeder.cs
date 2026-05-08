// ============================================================
// CINEMAMS - DataSeeder.cs
// Copy vào folder Data/ — gọi trong Program.cs để seed dữ liệu mẫu
// ============================================================

using sivinh_2122110368.Models;
using Microsoft.EntityFrameworkCore;

namespace sivinh_2122110368.Data
{
    public static class DataSeeder
    {
        public static async Task SeedAsync(CinemaDbContext db)
        {
            // Chỉ seed nếu chưa có dữ liệu
            if (await db.Users.AnyAsync()) return;

            // ---- USERS ----
            var users = new List<User>
            {
                new() { Email = "admin@cinemams.vn",   PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin@123"),   FullName = "Quản trị viên",  Role = "Admin",    IsActive = true, EmailVerified = true },
                new() { Email = "manager@cinemams.vn", PasswordHash = BCrypt.Net.BCrypt.HashPassword("Manager@123"), FullName = "Quản lý rạp",    Role = "Manager",  IsActive = true, EmailVerified = true },
                new() { Email = "cashier@cinemams.vn", PasswordHash = BCrypt.Net.BCrypt.HashPassword("Cashier@123"), FullName = "Thu ngân",       Role = "Cashier",  IsActive = true, EmailVerified = true },
                new() { Email = "customer@gmail.com",  PasswordHash = BCrypt.Net.BCrypt.HashPassword("Customer@123"),FullName = "Nguyễn Văn A",   Role = "Customer", IsActive = true, EmailVerified = true },
            };
            db.Users.AddRange(users);
            await db.SaveChangesAsync();

            // ---- CINEMAS ----
            var cinema = new Cinema { Name = "CGV Vincom Bà Triệu", Address = "191 Bà Triệu, Hai Bà Trưng", City = "Hà Nội", IsActive = true };
            db.Cinemas.Add(cinema);
            await db.SaveChangesAsync();

            // ---- ROOMS ----
            var room2D = new Room { CinemaId = cinema.CinemaId, Name = "Phòng 1 - 2D", RoomType = "2D", TotalSeats = 50, RowsCount = 5, ColsCount = 10 };
            var roomImax = new Room { CinemaId = cinema.CinemaId, Name = "IMAX Hall", RoomType = "IMAX", TotalSeats = 30, RowsCount = 3, ColsCount = 10 };
            db.Rooms.AddRange(room2D, roomImax);
            await db.SaveChangesAsync();

            // ---- SEATS for room2D (5 hàng A-E, 10 ghế/hàng) ----
            var seats = new List<Seat>();
            string[] rows = { "A", "B", "C", "D", "E" };
            foreach (var row in rows)
            {
                for (int col = 1; col <= 10; col++)
                {
                    seats.Add(new Seat
                    {
                        RoomId = room2D.RoomId,
                        RowLabel = row,
                        ColNumber = col,
                        SeatType = (row == "D" || row == "E") ? "VIP" : "NORMAL",
                        IsActive = true
                    });
                }
            }
            db.Seats.AddRange(seats);
            await db.SaveChangesAsync();

            // ---- MOVIES ----
            var movies = new List<Movie>
            {
                new() {
                    Title = "Avengers: Endgame",
                    DurationMin = 181,
                    Genre = "Hành động",
                    Rating = "C13",
                    PosterUrl = "https://example.com/avengers.jpg",
                    Description = "Siêu anh hùng tập hợp lần cuối",
                    Status = "ACTIVE",
                    ReleaseDate = DateTime.Today.AddDays(-30),
                    EndDate = DateTime.Today.AddDays(30)
                },
                new() {
                    Title = "Lật Mặt 7",
                    DurationMin = 128,
                    Genre = "Hài - Gia đình",
                    Rating = "P",
                    PosterUrl = "https://example.com/latmat7.jpg",
                    Description = "Phim hài Việt Nam",
                    Status = "ACTIVE",
                    ReleaseDate = DateTime.Today.AddDays(-10),
                    EndDate = DateTime.Today.AddDays(60)
                },
                new() {
                    Title = "Phim Sắp Ra Mắt",
                    DurationMin = 110,
                    Genre = "Khoa học viễn tưởng",
                    Rating = "C16",
                    Status = "DRAFT",
                    ReleaseDate = DateTime.Today.AddDays(30)
                }
            };
            db.Movies.AddRange(movies);
            await db.SaveChangesAsync();

            // ---- SHOWTIMES ----
            var showtimes = new List<Showtime>
            {
                new() {
                    MovieId = movies[0].MovieId,
                    RoomId = room2D.RoomId,
                    StartTime = DateTime.Today.AddHours(9),
                    EndTime = DateTime.Today.AddHours(9).AddMinutes(181 + 30),
                    Format = "2D",
                    BasePrice = 85000,
                    Status = "SCHEDULED"
                },
                new() {
                    MovieId = movies[0].MovieId,
                    RoomId = room2D.RoomId,
                    StartTime = DateTime.Today.AddHours(14),
                    EndTime = DateTime.Today.AddHours(14).AddMinutes(181 + 30),
                    Format = "2D",
                    BasePrice = 95000,
                    Status = "SCHEDULED"
                },
                new() {
                    MovieId = movies[1].MovieId,
                    RoomId = room2D.RoomId,
                    StartTime = DateTime.Today.AddHours(19),
                    EndTime = DateTime.Today.AddHours(19).AddMinutes(128 + 30),
                    Format = "2D",
                    BasePrice = 90000,
                    Status = "SCHEDULED"
                }
            };
            db.Showtimes.AddRange(showtimes);
            await db.SaveChangesAsync();

            // ---- SHOWTIME_SEATS (tất cả ghế = AVAILABLE) ----
            var showtimeSeats = new List<ShowtimeSeat>();
            var allSeats = await db.Seats.Where(s => s.RoomId == room2D.RoomId).ToListAsync();
            foreach (var showtime in showtimes)
            {
                foreach (var seat in allSeats)
                {
                    showtimeSeats.Add(new ShowtimeSeat
                    {
                        ShowtimeId = showtime.ShowtimeId,
                        SeatId = seat.SeatId,
                        Status = "AVAILABLE"
                    });
                }
            }
            db.ShowtimeSeats.AddRange(showtimeSeats);

            // ---- COUPONS ----
            db.Coupons.AddRange(
                new Coupon {
                    Code = "GIAM10",
                    Description = "Giảm 10% cho mọi đơn",
                    DiscountType = "PERCENT",
                    DiscountValue = 10,
                    MinOrderAmount = 50000,
                    MaxDiscountAmount = 50000,
                    MaxUsageCount = 100,
                    IsActive = true,
                    ValidFrom = DateTime.Today,
                    ValidTo = DateTime.Today.AddMonths(3)
                },
                new Coupon {
                    Code = "GIAM50K",
                    Description = "Giảm 50,000đ cho đơn từ 200K",
                    DiscountType = "FIXED",
                    DiscountValue = 50000,
                    MinOrderAmount = 200000,
                    MaxUsageCount = 50,
                    IsActive = true,
                    ValidFrom = DateTime.Today,
                    ValidTo = DateTime.Today.AddMonths(1)
                }
            );

            await db.SaveChangesAsync();
            Console.WriteLine("✅ Seed data hoàn thành!");
        }
    }
}
