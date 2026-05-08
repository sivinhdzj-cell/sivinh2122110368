// ============================================================
// CINEMAMS - CinemaDbContext.cs
// Copy vào folder Data/ trong project của bạn
// Thay thế CinemaDbContext cũ (nếu có)
// ============================================================

using Microsoft.EntityFrameworkCore;
using sivinh_2122110368.Models;

namespace sivinh_2122110368.Data
{
    public class CinemaDbContext : DbContext
    {
        public CinemaDbContext(DbContextOptions<CinemaDbContext> options) : base(options) { }

        // DbSets
        public DbSet<Cinema> Cinemas { get; set; } = null!;
        public DbSet<Room> Rooms { get; set; } = null!;
        public DbSet<Seat> Seats { get; set; } = null!;
        public DbSet<Movie> Movies { get; set; } = null!;
        public DbSet<Showtime> Showtimes { get; set; } = null!;
        public DbSet<ShowtimeSeat> ShowtimeSeats { get; set; } = null!;
        public DbSet<User> Users { get; set; } = null!;
        public DbSet<Coupon> Coupons { get; set; } = null!;
        public DbSet<Booking> Bookings { get; set; } = null!;
        public DbSet<BookingSeat> BookingSeats { get; set; } = null!;
        public DbSet<RefreshToken> RefreshTokens { get; set; } = null!;
        public DbSet<Student> Students { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // ---- CINEMA ----
            modelBuilder.Entity<Cinema>(e => {
                e.HasIndex(c => c.Name);
            });

            // ---- ROOM ----
            modelBuilder.Entity<Room>(e => {
                e.HasOne(r => r.Cinema)
                 .WithMany(c => c.Rooms)
                 .HasForeignKey(r => r.CinemaId)
                 .OnDelete(DeleteBehavior.Restrict);
            });

            // ---- SEAT ----
            modelBuilder.Entity<Seat>(e => {
                e.HasOne(s => s.Room)
                 .WithMany(r => r.Seats)
                 .HasForeignKey(s => s.RoomId)
                 .OnDelete(DeleteBehavior.Restrict);
                // Unique: một phòng không có 2 ghế cùng hàng+cột
                e.HasIndex(s => new { s.RoomId, s.RowLabel, s.ColNumber }).IsUnique();
            });

            // ---- MOVIE ----
            modelBuilder.Entity<Movie>(e => {
                e.HasIndex(m => m.Status);
                e.HasIndex(m => m.Title);
            });

            // ---- SHOWTIME ----
            modelBuilder.Entity<Showtime>(e => {
                e.HasOne(s => s.Movie)
                 .WithMany(m => m.Showtimes)
                 .HasForeignKey(s => s.MovieId)
                 .OnDelete(DeleteBehavior.Restrict);
                e.HasOne(s => s.Room)
                 .WithMany(r => r.Showtimes)
                 .HasForeignKey(s => s.RoomId)
                 .OnDelete(DeleteBehavior.Restrict);
                e.HasIndex(s => new { s.RoomId, s.StartTime });
            });

            // ---- SHOWTIME_SEAT ----
            modelBuilder.Entity<ShowtimeSeat>(e => {
                e.HasOne(ss => ss.Showtime)
                 .WithMany(s => s.ShowtimeSeats)
                 .HasForeignKey(ss => ss.ShowtimeId)
                 .OnDelete(DeleteBehavior.Cascade);
                e.HasOne(ss => ss.Seat)
                 .WithMany(s => s.ShowtimeSeats)
                 .HasForeignKey(ss => ss.SeatId)
                 .OnDelete(DeleteBehavior.Restrict);
                // Unique: mỗi ghế chỉ có 1 trạng thái per suất chiếu
                e.HasIndex(ss => new { ss.ShowtimeId, ss.SeatId }).IsUnique();
            });

            // ---- USER ----
            modelBuilder.Entity<User>(e => {
                e.HasIndex(u => u.Email).IsUnique();
            });

            // ---- COUPON ----
            modelBuilder.Entity<Coupon>(e => {
                e.HasIndex(c => c.Code).IsUnique();
            });

            // ---- BOOKING ----
            modelBuilder.Entity<Booking>(e => {
                e.HasOne(b => b.User)
                 .WithMany(u => u.Bookings)
                 .HasForeignKey(b => b.UserId)
                 .OnDelete(DeleteBehavior.SetNull);
                e.HasOne(b => b.Showtime)
                 .WithMany(s => s.Bookings)
                 .HasForeignKey(b => b.ShowtimeId)
                 .OnDelete(DeleteBehavior.Restrict);
                e.HasOne(b => b.Coupon)
                 .WithMany(c => c.Bookings)
                 .HasForeignKey(b => b.CouponId)
                 .OnDelete(DeleteBehavior.SetNull);
                e.HasIndex(b => b.BookingCode).IsUnique();
            });

            // ---- BOOKING_SEAT ----
            modelBuilder.Entity<BookingSeat>(e => {
                e.HasOne(bs => bs.Booking)
                 .WithMany(b => b.BookingSeats)
                 .HasForeignKey(bs => bs.BookingId)
                 .OnDelete(DeleteBehavior.Cascade);
                e.HasOne(bs => bs.Seat)
                 .WithMany()
                 .HasForeignKey(bs => bs.SeatId)
                 .OnDelete(DeleteBehavior.Restrict);
            });

            // ---- REFRESH_TOKEN ----
            modelBuilder.Entity<RefreshToken>(e => {
                e.HasOne(rt => rt.User)
                 .WithMany()
                 .HasForeignKey(rt => rt.UserId)
                 .OnDelete(DeleteBehavior.Cascade);
            });
        }
    }
}
