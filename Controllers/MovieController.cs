using Microsoft.AspNetCore.Mvc;
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
        public ActionResult<List<MovieDto>> GetAll()
        {
            var movies = _context.Movies
                .Select(m => new MovieDto
                {
                    MovieId = m.MovieId,      // MovieId thay cho Id
                    Title = m.Title,
                    DurationMin = m.DurationMin, // DurationMin thay cho Duration
                    Description = m.Description
                }).ToList();

            return Ok(movies);
        }

        // GET: api/movie/{id}
        [HttpGet("{id}")]
        public ActionResult<MovieDto> GetById(int id)
        {
            var movie = _context.Movies
                .Where(m => m.MovieId == id)
                .Select(m => new MovieDto
                {
                    MovieId = m.MovieId,
                    Title = m.Title,
                    DurationMin = m.DurationMin,
                    Description = m.Description
                }).FirstOrDefault();

            if (movie == null) return NotFound();
            return Ok(movie);
        }

        // POST: api/movie
        [HttpPost]
        public ActionResult<MovieDto> Create(MovieDto dto)
        {
            var movie = new Movie
            {
                Title = dto.Title,
                DurationMin = dto.DurationMin,
                Description = dto.Description
            };

            _context.Movies.Add(movie);
            _context.SaveChanges();

            dto.MovieId = movie.MovieId;
            return CreatedAtAction(nameof(GetById), new { id = dto.MovieId}, dto);
        }

        // DELETE: api/movie/{id}
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var movie = _context.Movies.Find(id);
            if (movie == null) return NotFound();

            _context.Movies.Remove(movie);
            _context.SaveChanges();
            return NoContent();
        }
    }
}