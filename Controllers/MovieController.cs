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
                    Genre = m.Genre,
                    Rating = m.Rating,
                    Description = m.Description,
                    PosterUrl = m.PosterUrl,
                    Status = m.Status,
                    ReleaseDate = m.ReleaseDate
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
                    Genre = m.Genre,
                    Rating = m.Rating,
                    Description = m.Description,
                    PosterUrl = m.PosterUrl,
                    Status = m.Status,
                    ReleaseDate = m.ReleaseDate
                }).FirstOrDefaultAsync();

            if (movie == null) return NotFound();
            return Ok(movie);
        }

        // POST: api/movie
        [HttpPost]
        public async Task<ActionResult<MovieDto>> Create([FromBody] MovieDto dto)
        {
            var movie = new Movie
            {
                Title = dto.Title ?? "New Movie",
                DurationMin = dto.DurationMin,
                Genre = dto.Genre ?? "",
                Rating = dto.Rating ?? "T13",
                Description = dto.Description ?? "",
                PosterUrl = dto.PosterUrl ?? "",
                Status = dto.Status ?? "ACTIVE",
                ReleaseDate = dto.ReleaseDate ?? DateTime.UtcNow
            };

            _context.Movies.Add(movie);
            await _context.SaveChangesAsync();

            dto.MovieId = movie.MovieId;
            return Ok(dto);
        }

        // PUT: api/movie/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] MovieDto dto)
        {
            var movie = await _context.Movies.FindAsync(id);
            if (movie == null) return NotFound();

            movie.Title = dto.Title;
            movie.DurationMin = dto.DurationMin;
            movie.Genre = dto.Genre;
            movie.Rating = dto.Rating;
            movie.Description = dto.Description;
            movie.PosterUrl = dto.PosterUrl;
            movie.Status = dto.Status ?? movie.Status;
            movie.ReleaseDate = dto.ReleaseDate ?? movie.ReleaseDate;

            _context.Entry(movie).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return Ok(dto);
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

        [HttpPost("normalize")]
        public async Task<IActionResult> NormalizeData()
        {
            var movies = await _context.Movies.ToListAsync();
            foreach (var m in movies)
            {
                if (m.Title.Contains("Avengers")) { m.DurationMin = 181; m.Genre = "Hành động, Phiêu lưu"; }
                else if (m.Title.Contains("Interstellar")) { m.DurationMin = 169; m.Genre = "Khoa học viễn tưởng"; }
                else if (m.Title.Contains("Spider-Man")) { m.DurationMin = 148; m.Genre = "Hành động, Giả tưởng"; }
                else if (m.Title.Contains("Joker")) { m.DurationMin = 122; m.Genre = "Tâm lý, Tội phạm"; }
                else if (m.Title.Contains("Inception")) { m.DurationMin = 148; m.Genre = "Hành động, Kịch tính"; }
                else if (m.Title.Contains("Dune")) { m.DurationMin = 155; m.Genre = "Hành động, Phiêu lưu"; }
                else if (m.Title.Contains("Top Gun")) { m.DurationMin = 130; m.Genre = "Hành động, Kịch tính"; }
                else if (m.DurationMin == 0) { m.DurationMin = 120; m.Genre = "Đa thể loại"; }
                
                if (m.Rating == "P" || string.IsNullOrEmpty(m.Rating)) m.Rating = "T13";
            }
            await _context.SaveChangesAsync();
            return Ok(new { Message = "Đã chuẩn hóa dữ liệu phim thành công" });
        }
    }
}