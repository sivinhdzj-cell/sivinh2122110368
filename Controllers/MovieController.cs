using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using sivinh_2122110368.Data;
using sivinh_2122110368.DTOs;
using sivinh_2122110368.Models;

namespace sivinh_2122110368.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MovieController : ControllerBase
    {
        private readonly CinemaDbContext _context;

        public MovieController(CinemaDbContext context)
        {
            _context = context;
        }

        // GET: api/movie
        [HttpGet]
        public async Task<ActionResult<List<MovieDto>>> GetAll()
        {
            // Sử dụng AsNoTracking để tăng hiệu suất và lấy dữ liệu mới nhất
            var movies = await _context.Movies
                .AsNoTracking()
                .Select(m => new MovieDto
                {
                    MovieId = m.MovieId,
                    Title = m.Title,
                    DurationMin = m.DurationMin,
                    Description = m.Description,
                    PosterUrl = m.PosterUrl // ĐÃ THÊM DÒNG NÀY ĐỂ FIX LỖI NULL
                }).ToListAsync();

            return Ok(movies);
        }

        // GET: api/movie/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<MovieDto>> GetById(int id)
        {
            var movie = await _context.Movies
                .AsNoTracking()
                .Where(m => m.MovieId == id)
                .Select(m => new MovieDto
                {
                    MovieId = m.MovieId,
                    Title = m.Title,
                    DurationMin = m.DurationMin,
                    Description = m.Description,
                    PosterUrl = m.PosterUrl // ĐÃ THÊM DÒNG NÀY
                }).FirstOrDefaultAsync();

            if (movie == null) return NotFound();
            return Ok(movie);
        }

        // POST: api/movie
        [HttpPost]
        public async Task<ActionResult<MovieDto>> Create(MovieDto dto)
        {
            var movie = new Movie
            {
                Title = dto.Title,
                DurationMin = dto.DurationMin,
                Description = dto.Description,
                PosterUrl = dto.PosterUrl, // Cho phép lưu link ảnh khi tạo mới
                Status = "ACTIVE" // Mặc định trạng thái để phim hiện lên Web
            };

            _context.Movies.Add(movie);
            await _context.SaveChangesAsync();

            dto.MovieId = movie.MovieId;
            return CreatedAtAction(nameof(GetById), new { id = dto.MovieId }, dto);
        }

        // DELETE: api/movie/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var movie = await _context.Movies.FindAsync(id);
            if (movie == null) return NotFound();

            _context.Movies.Remove(movie);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}