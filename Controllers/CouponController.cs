using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using sivinh_2122110368.Data;
using sivinh_2122110368.DTOs;
using sivinh_2122110368.Models;

namespace sivinh_2122110368.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CouponController : ControllerBase
    {
        private readonly CinemaDbContext _context;

        public CouponController(CinemaDbContext context)
        {
            _context = context;
        }

        // GET: api/coupon
        [HttpGet]
        public ActionResult<List<CouponDto>> GetAll()
        {
            var coupons = _context.Coupons
                .Select(c => new CouponDto
                {
                    CouponId = c.CouponId,             // CouponId thay cho Id
                    Code = c.Code,
                    DiscountValue = c.DiscountValue, // DiscountValue thay cho DiscountPercent
                    ExpiryDate = c.ValidTo       // ValidTo thay cho ExpiryDate
                }).ToList();

            return Ok(coupons);
        }

        // GET: api/coupon/{id}
        [HttpGet("{id}")]
        public ActionResult<CouponDto> GetById(int id)
        {
            var coupon = _context.Coupons
                .Where(c => c.CouponId == id)   // CouponId thay cho Id
                .Select(c => new CouponDto
                {
                    CouponId = c.CouponId,
                    Code = c.Code,
                    DiscountValue = c.DiscountValue,
                    ExpiryDate = c.ValidTo
                }).FirstOrDefault();

            if (coupon == null) return NotFound();
            return Ok(coupon);
        }

        // POST: api/coupon
        [HttpPost]
        public ActionResult<CouponDto> Create([FromBody] CouponDto dto)
        {
            var coupon = new Coupon
            {
                Code = dto.Code ?? "",
                DiscountValue = dto.DiscountValue,
                ValidTo = dto.ExpiryDate ?? DateTime.UtcNow.AddMonths(1)
            };

            _context.Coupons.Add(coupon);
            _context.SaveChanges();

            dto.CouponId = coupon.CouponId;
            return Ok(dto);
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] CouponDto dto)
        {
            var coupon = _context.Coupons.Find(id);
            if (coupon == null) return NotFound();

            coupon.Code = dto.Code;
            coupon.DiscountValue = dto.DiscountValue;
            coupon.ValidTo = dto.ExpiryDate;

            _context.Entry(coupon).State = EntityState.Modified;
            _context.SaveChanges();

            return Ok(dto);
        }

        // DELETE: api/coupon/{id}
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var coupon = _context.Coupons.Find(id); // Find nhận CouponId
            if (coupon == null) return NotFound();

            _context.Coupons.Remove(coupon);
            _context.SaveChanges();
            return NoContent();
        }
    }
}