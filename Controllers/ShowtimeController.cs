using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using sivinh_2122110368.Data;
using sivinh_2122110368.DTOs;
using sivinh_2122110368.Models;

namespace sivinh_2122110368.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ShowtimeController : ControllerBase
    {
        private readonly CinemaDbContext _context;

        public ShowtimeController(CinemaDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public ActionResult<List<ShowtimeDto>> GetAll()
        {
            var showtimes = _context.Showtimes
                .Include(s => s.Movie)
                .Include(s => s.Room)
                .Select(s => new ShowtimeDto
                {
                    ShowtimeId = s.ShowtimeId,         // đúng tên DTO
                    MovieTitle = s.Movie.Title,        // đổi MovieName -> MovieTitle
                    RoomName = s.Room.Name,
                    CinemaName = s.Room.Cinema.Name,   // lấy luôn tên rạp
                    StartTime = s.StartTime,
                    EndTime = s.EndTime,
                    Format = s.Format,
                    BasePrice = s.BasePrice,
                    Status = s.Status,
                    MovieId = s.MovieId,
                    RoomId = s.RoomId
                }).ToList();

            return Ok(showtimes);
        }

        [HttpGet("{id}")]
        public ActionResult<ShowtimeDto> GetById(int id)
        {
            var s = _context.Showtimes
                .Include(x => x.Movie)
                .Include(x => x.Room)
                .ThenInclude(r => r.Cinema)
                .FirstOrDefault(x => x.ShowtimeId == id);

            if (s == null) return NotFound();

            var dto = new ShowtimeDto
            {
                ShowtimeId = s.ShowtimeId,
                MovieTitle = s.Movie.Title,
                RoomName = s.Room.Name,
                CinemaName = s.Room.Cinema.Name,
                StartTime = s.StartTime,
                EndTime = s.EndTime,
                Format = s.Format,
                BasePrice = s.BasePrice,
                Status = s.Status,
                MovieId = s.MovieId,
                RoomId = s.RoomId
            };
            return Ok(dto);
        }

        [HttpPost]
        public ActionResult<ShowtimeDto> Create([FromBody] ShowtimeDto dto)
        {
            var s = new Showtime
            {
                MovieId = dto.MovieId,
                RoomId = dto.RoomId,
                StartTime = dto.StartTime,
                EndTime = dto.EndTime,
                Format = dto.Format ?? "2D",
                BasePrice = dto.BasePrice,
                Status = dto.Status ?? "ACTIVE"
            };

            _context.Showtimes.Add(s);
            _context.SaveChanges();

            dto.ShowtimeId = s.ShowtimeId;
            return Ok(dto);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] ShowtimeDto dto)
        {
            var s = await _context.Showtimes.FindAsync(id);
            if (s == null) return NotFound();

            s.MovieId = dto.MovieId;
            s.RoomId = dto.RoomId;
            s.StartTime = dto.StartTime;
            s.EndTime = dto.EndTime;
            s.Format = dto.Format;
            s.BasePrice = dto.BasePrice;
            s.Status = dto.Status;

            _context.Entry(s).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return Ok(dto);
        }

        [HttpPost("seed")]
        public async Task<IActionResult> SeedShowtimes()
        {
            var movies = await _context.Movies.ToListAsync();
            var rooms = await _context.Rooms.ToListAsync();
            if (!movies.Any() || !rooms.Any()) return BadRequest("Cần có Phim và Phòng trước khi Seed");

            var count = 0;
            foreach (var movie in movies)
            {
                // Luôn tạo 2 suất chiếu mẫu cho tối nay (để đảm bảo không bị trống lịch)
                _context.Showtimes.Add(new Showtime {
                    MovieId = movie.MovieId,
                    RoomId = rooms.First().RoomId,
                    StartTime = DateTime.UtcNow.Date.AddHours(19),
                    EndTime = DateTime.UtcNow.Date.AddHours(21),
                    Format = "2D",
                    BasePrice = 85000,
                    Status = "SCHEDULED"
                });
                _context.Showtimes.Add(new Showtime {
                    MovieId = movie.MovieId,
                    RoomId = rooms.First().RoomId,
                    StartTime = DateTime.UtcNow.Date.AddHours(21).AddMinutes(30),
                    EndTime = DateTime.UtcNow.Date.AddHours(23).AddMinutes(30),
                    Format = "2D",
                    BasePrice = 95000,
                    Status = "SCHEDULED"
                });
                count += 2;
            }

            await _context.SaveChangesAsync();
            return Ok(new { Message = $"Đã tạo thành công {count} suất chiếu mẫu." });
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var s = _context.Showtimes.Find(id);
            if (s == null) return NotFound();

            _context.Showtimes.Remove(s);
            _context.SaveChanges();
            return NoContent();
        }

        [HttpGet("movie/{movieId}")]
        public ActionResult<List<ShowtimeDto>> GetByMovie(int movieId)
        {
            var showtimes = _context.Showtimes
                .Include(s => s.Movie)
                .Include(s => s.Room).ThenInclude(r => r.Cinema)
                .Where(s => s.MovieId == movieId && s.StartTime >= DateTime.UtcNow.AddHours(-2))
                .Select(s => new ShowtimeDto
                {
                    ShowtimeId = s.ShowtimeId,
                    MovieTitle = s.Movie.Title,
                    RoomName = s.Room.Name,
                    CinemaName = s.Room.Cinema.Name,
                    StartTime = s.StartTime,
                    EndTime = s.EndTime,
                    Format = s.Format,
                    BasePrice = s.BasePrice,
                    Status = s.Status,
                    MovieId = s.MovieId,
                    RoomId = s.RoomId
                }).ToList();

            return Ok(showtimes);
        }
    }
}