using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using sivinh_2122110368.Data;
using sivinh_2122110368.Models;

namespace sivinh_2122110368.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RoomController : ControllerBase
    {
        private readonly CinemaDbContext _context;

        public RoomController(CinemaDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult Get() => Ok(_context.Rooms.Include(r => r.Cinema).ToList());

        [HttpGet("{id}")]
        public IActionResult Get(int id)
        {
            var item = _context.Rooms.Include(r => r.Cinema).FirstOrDefault(r => r.RoomId == id);
            return item == null ? NotFound() : Ok(item);
        }

        [HttpPost]
        public IActionResult Create([FromBody] Room obj)
        {
            _context.Rooms.Add(obj);
            _context.SaveChanges();
            return Ok(obj);
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] Room obj)
        {
            var existing = _context.Rooms.Find(id);
            if (existing == null) return NotFound();
            existing.Name = obj.Name ?? existing.Name;
            existing.TotalSeats = obj.TotalSeats > 0 ? obj.TotalSeats : existing.TotalSeats;
            existing.CinemaId = obj.CinemaId > 0 ? obj.CinemaId : existing.CinemaId;
            existing.RoomType = obj.RoomType ?? existing.RoomType;
            _context.Entry(existing).State = EntityState.Modified;
            _context.SaveChanges();
            return Ok(existing);
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var item = _context.Rooms.Find(id);
            if (item == null) return NotFound();
            _context.Rooms.Remove(item);
            _context.SaveChanges();
            return NoContent();
        }
    }
}