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
        public class SeatController : ControllerBase
        {
            private readonly CinemaDbContext _context;

            public SeatController(CinemaDbContext context)
            {
                _context = context;
            }

            [HttpGet]
            public IActionResult Get() => Ok(_context.Seats.ToList());

            [HttpGet("{id}")]
            public IActionResult Get(int id)
            {
                var item = _context.Seats.Find(id);
                return item == null ? NotFound() : Ok(item);
            }

            [HttpPost]
            public IActionResult Create(Seat obj)
            {
                _context.Seats.Add(obj);
                _context.SaveChanges();
                return Ok(obj);
            }

            [HttpPut("{id}")]
            public IActionResult Update(int id, Seat obj)
            {
                if (id != obj.SeatId) return BadRequest();
                _context.Entry(obj).State = EntityState.Modified;
                _context.SaveChanges();
                return Ok(obj);
            }

            [HttpDelete("{id}")]
            public IActionResult Delete(int id)
            {
                var item = _context.Seats.Find(id);
                if (item == null) return NotFound();
                _context.Seats.Remove(item);
                _context.SaveChanges();
                return NoContent();
            }
        }
    }
}