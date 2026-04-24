using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using sivinh_2122110368.Data;
using sivinh_2122110368.Models;

namespace sivinh_2122110368.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly CinemaDbContext _context;

        public UserController(CinemaDbContext context)
        {
            _context = context;
        }

        // GET: api/user
        [HttpGet]
        public IActionResult GetAll()
        {
            return Ok(_context.Users.ToList());
        }

        // GET: api/user/1
        [HttpGet("{id}")]
        public IActionResult Get(int id)
        {
            var user = _context.Users.Find(id);
            if (user == null) return NotFound();
            return Ok(user);
        }

        // POST: api/user
        [HttpPost]
        public IActionResult Create([FromBody] User user)
        {
            _context.Users.Add(user);
            _context.SaveChanges();
            return Ok(user);
        }

        // PUT: api/user/1  (update isActive)
        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] ToggleActiveDto dto)
        {
            var user = _context.Users.Find(id);
            if (user == null) return NotFound();
            user.IsActive = dto.IsActive;
            _context.SaveChanges();
            return Ok(user);
        }

        // PUT: api/user/1/role
        [HttpPut("{id}/role")]
        public IActionResult UpdateRole(int id, [FromBody] UpdateRoleDto dto)
        {
            var user = _context.Users.Find(id);
            if (user == null) return NotFound();
            user.Role = dto.Role;
            _context.SaveChanges();
            return Ok(user);
        }

        // DELETE: api/user/1
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var user = _context.Users.Find(id);
            if (user == null) return NotFound();
            _context.Users.Remove(user);
            _context.SaveChanges();
            return NoContent();
        }
    }

    public class UpdateRoleDto
    {
        public string Role { get; set; } = "";
    }

    public class ToggleActiveDto
    {
        public bool IsActive { get; set; }
    }
}