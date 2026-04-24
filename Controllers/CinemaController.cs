using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using sivinh_2122110368.Data;
using sivinh_2122110368.Models;

namespace sivinh_2122110368.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CinemaController : ControllerBase
    {
        private readonly CinemaDbContext _context;

        public CinemaController(CinemaDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult Get() => Ok(_context.Cinemas.ToList());

        [HttpGet("{id}")]
        public IActionResult Get(int id)
        {
            var item = _context.Cinemas.Find(id);
            return item == null ? NotFound() : Ok(item);
        }

        [HttpPost]
        public IActionResult Create([FromBody] Cinema obj)
        {
            _context.Cinemas.Add(obj);
            _context.SaveChanges();
            return Ok(obj);
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] Cinema obj)
        {
            var existing = _context.Cinemas.Find(id);
            if (existing == null) return NotFound();
            existing.Name = obj.Name ?? existing.Name;
            existing.Address = obj.Address ?? existing.Address;
            _context.Entry(existing).State = EntityState.Modified;
            _context.SaveChanges();
            return Ok(existing);
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var item = _context.Cinemas.Find(id);
            if (item == null) return NotFound();
            _context.Cinemas.Remove(item);
            _context.SaveChanges();
            return NoContent();
        }
    }
}