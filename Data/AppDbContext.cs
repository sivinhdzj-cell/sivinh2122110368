using Microsoft.EntityFrameworkCore;
using sivinh_2122110368.Models;

namespace sivinh_2122110368.Data
{
    public class AppDbContext : DbContext
    {
        // Constructor nhận connection string từ Program.cs
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        public DbSet<Student> Students { get; set; } = null !;
    }
} 