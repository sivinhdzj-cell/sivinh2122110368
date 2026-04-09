namespace sivinh_2122110368.DTOs
{
    public class CouponDto
    {
        public int CouponId { get; set; }          // ID của coupon
        public string Code { get; set; } = "";     // Mã coupon
        public decimal DiscountValue { get; set; } // Giá trị giảm
        public DateTime? ValidFrom { get; set; }   // Bắt đầu hiệu lực
        public DateTime? ValidTo { get; set; }     // Kết thúc hiệu lực
        public string DiscountType { get; set; } = "PERCENT"; // Loại giảm giá
        public int? ApplicableMovieId { get; set; } // Nếu áp dụng cho phim cụ thể
     
        public DateTime? ExpiryDate { get; internal set; }
    }
}
