using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using sivinh_2122110368.Data;
using System.Linq;

namespace sivinh_2122110368.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReportsController : ControllerBase
    {
        private readonly CinemaDbContext _context;

        public ReportsController(CinemaDbContext context)
        {
            _context = context;
        }

        // GET: api/reports/dashboard-stats
        [HttpGet("dashboard-stats")]
        public async Task<IActionResult> GetDashboardStats()
        {
            var today = DateTime.UtcNow.Date;
            var yesterday = today.AddDays(-1);

            var todayRevenue = await _context.Bookings
                .Where(b => b.PaymentStatus == "SUCCESS" && b.CreatedAt >= today)
                .SumAsync(b => b.TotalAmount);

            var yesterdayRevenue = await _context.Bookings
                .Where(b => b.PaymentStatus == "SUCCESS" && b.CreatedAt >= yesterday && b.CreatedAt < today)
                .SumAsync(b => b.TotalAmount);

            var revenueGrowth = yesterdayRevenue > 0 
                ? (double)(todayRevenue - yesterdayRevenue) / (double)yesterdayRevenue * 100 
                : 0;

            var totalTickets = await _context.BookingSeats
                .CountAsync(bs => bs.Booking.PaymentStatus == "SUCCESS");

            var totalUsers = await _context.Users.CountAsync(u => u.Role == "Customer");

            return Ok(new
            {
                todayRevenue,
                revenueGrowth = Math.Round(revenueGrowth, 1),
                totalTickets,
                ticketsGrowth = 5.2, // Giả lập tỷ lệ tăng trưởng vé
                totalUsers
            });
        }

        // GET: api/reports/recent-bookings
        [HttpGet("recent-bookings")]
        public async Task<IActionResult> GetRecentBookings()
        {
            var list = await _context.Bookings
                .Include(b => b.Showtime).ThenInclude(s => s.Movie)
                .Include(b => b.User)
                .OrderByDescending(b => b.CreatedAt)
                .Take(10)
                .Select(b => new
                {
                    b.BookingId,
                    b.BookingCode,
                    movieTitle = b.Showtime.Movie.Title,
                    b.TotalAmount,
                    b.PaymentMethod,
                    b.PaymentStatus,
                    b.CreatedAt,
                    userEmail = b.User != null ? b.User.Email : "Khách vãng lai",
                    userFullName = b.User != null ? b.User.FullName : "Guest"
                })
                .ToListAsync();

            return Ok(list);
        }

        // GET: api/reports/revenue-by-date
        [HttpGet("revenue-by-date")]
        public async Task<IActionResult> GetRevenueByDate([FromQuery] DateTime fromDate, [FromQuery] DateTime toDate)
        {
            var data = await _context.Bookings
                .Where(b => b.PaymentStatus == "SUCCESS" && b.CreatedAt >= fromDate && b.CreatedAt <= toDate)
                .GroupBy(b => b.CreatedAt.Date)
                .Select(g => new
                {
                    Date = g.Key,
                    BookingCount = g.Count(),
                    TicketCount = _context.BookingSeats.Count(bs => bs.Booking.PaymentStatus == "SUCCESS" && bs.Booking.CreatedAt.Date == g.Key),
                    Revenue = g.Sum(b => b.TotalAmount)
                })
                .OrderBy(x => x.Date)
                .ToListAsync();

            return Ok(data);
        }
    }
}
