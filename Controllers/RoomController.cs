namespace sivinh_2122110368.Controllers
{
    using global::sivinh_2122110368.Data;
    using global::sivinh_2122110368.Models;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.EntityFrameworkCore;

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
            public IActionResult Get() => Ok(_context.Rooms.ToList());

            [HttpGet("{id}")]
            public IActionResult Get(int id)
            {
                var item = _context.Rooms.Find(id);
                return item == null ? NotFound() : Ok(item);
            }

            [HttpPost]
            public IActionResult Create(Room obj)
            {
                _context.Rooms.Add(obj);
                _context.SaveChanges();
                return Ok(obj);
            }

            [HttpPut("{id}")]
            public IActionResult Update(int id, Room obj)
            {
                if (id != obj.RoomId) return BadRequest();
                _context.Entry(obj).State = EntityState.Modified;
                _context.SaveChanges();
                return Ok(obj);
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
}