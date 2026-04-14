using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using sivinh_2122110368.Data;
using sivinh_2122110368.Models;

namespace sivinh_2122110368.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RefreshTokenController : ControllerBase
    {
        private readonly CinemaDbContext _context;

        public RefreshTokenController(CinemaDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult Get() => Ok(_context.RefreshTokens.ToList());

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var item = _context.RefreshTokens.Find(id);
            if (item == null) return NotFound();

            _context.RefreshTokens.Remove(item);
            _context.SaveChanges();
            return NoContent();
        }
    }
}