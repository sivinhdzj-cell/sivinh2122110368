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
        public ActionResult<ShowtimeDto> Create(ShowtimeDto dto)
        {
            var s = new Showtime
            {
                MovieId = dto.MovieId,
                RoomId = dto.RoomId,
                StartTime = dto.StartTime,
                EndTime = dto.EndTime,
                Format = dto.Format,
                BasePrice = dto.BasePrice,
                Status = dto.Status
            };

            _context.Showtimes.Add(s);
            _context.SaveChanges();

            dto.ShowtimeId = s.ShowtimeId; // Id -> ShowtimeId
            return CreatedAtAction(nameof(GetById), new { id = s.ShowtimeId }, dto);
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
    }
}