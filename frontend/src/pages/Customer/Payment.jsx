import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Card, Typography, Space, Divider, message, Radio, Badge, QRCode } from "antd";
import { 
  CheckCircleFilled, 
  WalletOutlined, 
  CreditCardOutlined, 
  ShopOutlined,
  QrcodeOutlined,
  DownloadOutlined,
  HomeOutlined
} from "@ant-design/icons";
import { bookingsAPI } from "../../api/bookings";
import "../../styles.css";

const { Title, Text } = Typography;

export default function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedSeats, showtimeId, selectedCombos, totalPrice } = location.state || { selectedSeats: [], selectedCombos: [], totalPrice: 0 };

  const [paying, setPaying] = useState(false);
  const [status, setStatus] = useState("IDLE"); // IDLE, PENDING, SUCCESS, FAILED
  const [paymentMethod, setPaymentMethod] = useState("MOMO");
  const [bookingResult, setBookingResult] = useState(null);

  useEffect(() => {
    if (!showtimeId || selectedSeats.length === 0) {
      navigate("/movies");
    }
  }, [showtimeId, selectedSeats, navigate]);

  const handlePayment = async () => {
    setPaying(true);
    setStatus("PENDING");
    try {
      const payload = {
        showtimeId: Number(showtimeId),
        seatIds: selectedSeats.map(s => s.seatId),
        paymentMethod: paymentMethod,
      };

      const result = await bookingsAPI.create(payload);
      setBookingResult(result);

      // NẾU CHỌN MOMO -> Chuyển đến trang MoMo mock
      if (paymentMethod === "MOMO") {
        const momoParams = new URLSearchParams({
          orderId: result.bookingCode,
          amount: result.totalAmount,
          orderInfo: `Thanh toán vé ${result.movieTitle}`
        });
        navigate(`/payment/momo?${momoParams.toString()}`);
        return;
      }

      // NẾU CHỌN VNPAY -> Chuyển đến trang VNPay mock
      if (paymentMethod === "VNPAY") {
        const vnpayParams = new URLSearchParams({
          orderId: result.bookingCode,
          amount: result.totalAmount,
          orderInfo: `Thanh toan ve xem phim ${result.movieTitle}`
        });
        navigate(`/payment/vnpay?${vnpayParams.toString()}`);
        return;
      }

      // NẾU TIỀN MẶT -> Xác nhận ngay
      await bookingsAPI.confirmPayment(result.bookingCode);
      setStatus("SUCCESS");
      message.success("Đặt vé thành công! Vui lòng thanh toán tại quầy.");
    } catch (error) {
      console.error("Payment error:", error);
      setStatus("FAILED");
      message.error(error.response?.data?.message || "Thanh toán thất bại. Vui lòng thử lại.");
    } finally {
      setPaying(false);
    }
  };

  if (status === "SUCCESS") {
    return (
      <div className="center-page animate-momo">
        <Card style={{ width: 450, textAlign: "center", borderRadius: 32, padding: "20px 0", border: "none", boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}>
          <div style={{ background: "var(--momo-pink)", padding: "32px 0", marginTop: -20, borderRadius: "32px 32px 0 0" }}>
            <CheckCircleFilled style={{ fontSize: 70, color: "#fff" }} />
            <Title level={3} style={{ color: "#fff", marginTop: 12 }}>ĐẶT VÉ THÀNH CÔNG</Title>
            <Text style={{ color: "rgba(255,255,255,0.8)" }}>Cảm ơn bạn đã tin dùng CinemaMS</Text>
          </div>
          
          <div style={{ padding: "24px" }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
              <div style={{ background: "#fff", border: "2px solid #f0f0f0", padding: 12, borderRadius: 20 }}>
                <QRCode value={bookingResult?.bookingCode || "CMS-SUCCESS"} size={180} color="var(--momo-pink)" />
              </div>
            </div>

            <Title level={4} style={{ margin: "0 0 16px 0" }}>{bookingResult?.movieTitle}</Title>
            
            <div style={{ background: "#f8f9fa", padding: 20, borderRadius: 20, textAlign: "left" }}>
              <Space direction="vertical" style={{ width: "100%" }} size={8}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <Text type="secondary">Mã đơn hàng:</Text>
                  <Text strong>{bookingResult?.bookingCode}</Text>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <Text type="secondary">Suất chiếu:</Text>
                  <Text strong>{new Date(bookingResult?.showtimeStart).toLocaleString("vi-VN")}</Text>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <Text type="secondary">Phòng:</Text>
                  <Text strong>{bookingResult?.roomName}</Text>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <Text type="secondary">Vị trí ghế:</Text>
                  <Text strong style={{ color: "var(--momo-pink)" }}>{bookingResult?.seatLabels?.join(", ")}</Text>
                </div>
                <Divider style={{ margin: "12px 0" }} />
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <Text type="secondary">Tổng thanh toán:</Text>
                  <Text strong style={{ fontSize: 18, color: "var(--momo-pink)" }}>{bookingResult?.totalAmount?.toLocaleString()} đ</Text>
                </div>
              </Space>
            </div>

            <Space direction="vertical" style={{ width: "100%", marginTop: 32 }} size={12}>
              <Button type="primary" size="large" className="btn-momo" block icon={<DownloadOutlined />}>TẢI VÉ XUỐNG</Button>
              <Button type="link" icon={<HomeOutlined />} onClick={() => navigate("/home")}>Về trang chủ</Button>
            </Space>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="animate-momo" style={{ maxWidth: 650, margin: "40px auto", padding: "0 16px" }}>
      <div className="booking-step-card">
        <Space align="center" style={{ marginBottom: 32 }}>
          <div style={{ width: 44, height: 44, background: "var(--momo-pink-light)", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <WalletOutlined style={{ color: "var(--momo-pink)", fontSize: 22 }} />
          </div>
          <Title level={3} style={{ margin: 0 }}>Thanh toán & Xuất vé</Title>
        </Space>

        <Title level={5} style={{ marginBottom: 16 }}>Phương thức thanh toán</Title>
        <Radio.Group 
          onChange={e => setPaymentMethod(e.target.value)} 
          value={paymentMethod} 
          style={{ width: "100%" }}
        >
          <Space direction="vertical" style={{ width: "100%" }} size={12}>
            <Card className={paymentMethod === "MOMO" ? "payment-active" : ""} style={{ borderRadius: 16, cursor: "pointer" }} onClick={() => setPaymentMethod("MOMO")}>
              <Radio value="MOMO">
                <Space>
                  <img src="https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png" alt="Momo" style={{ width: 24 }} />
                  <Text strong>Ví MoMo (Khuyên dùng)</Text>
                  <Badge count="Ưu đãi 20k" style={{ background: "#f50" }} />
                </Space>
              </Radio>
            </Card>
            <Card className={paymentMethod === "VNPAY" ? "payment-active" : ""} style={{ borderRadius: 16, cursor: "pointer" }} onClick={() => setPaymentMethod("VNPAY")}>
              <Radio value="VNPAY">
                <Space>
                  <CreditCardOutlined style={{ color: "#0055aa", fontSize: 20 }} />
                  <Text strong>Cổng VNPay (Thẻ ATM/QR-Bank)</Text>
                </Space>
              </Radio>
            </Card>
            <Card className={paymentMethod === "CASH" ? "payment-active" : ""} style={{ borderRadius: 16, cursor: "pointer" }} onClick={() => setPaymentMethod("CASH")}>
              <Radio value="CASH">
                <Space>
                  <ShopOutlined style={{ color: "#52c41a", fontSize: 20 }} />
                  <Text strong>Tiền mặt tại quầy (Thanh toán tại rạp)</Text>
                </Space>
              </Radio>
            </Card>
          </Space>
        </Radio.Group>

        <Divider style={{ margin: "32px 0" }} />

        <div style={{ background: "#f8f9fa", borderRadius: 20, padding: 24, marginBottom: 32 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <Text type="secondary">Số tiền cần thanh toán</Text>
              <div style={{ fontSize: 32, fontWeight: 900, color: "var(--momo-pink)" }}>{totalPrice.toLocaleString()} đ</div>
            </div>
            <QrcodeOutlined style={{ fontSize: 40, color: "#ccc" }} />
          </div>
        </div>

        <Button 
          type="primary" 
          block 
          size="large" 
          className="btn-momo" 
          loading={status === "PENDING"}
          onClick={handlePayment}
          style={{ height: 64, fontSize: 20, borderRadius: 22 }}
        >
          {status === "PENDING" ? "ĐANG XỬ LÝ GIAO DỊCH..." : "THANH TOÁN NGAY"}
        </Button>
        
        <div style={{ textAlign: "center", marginTop: 20 }}>
          <Text type="secondary">Nhấn thanh toán đồng nghĩa với việc bạn đồng ý <Text underline cursor="pointer">Điều khoản sử dụng</Text></Text>
        </div>
      </div>

      {status === "PENDING" && (
        <div style={{ 
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0, 
          background: "rgba(255,255,255,0.9)", zIndex: 9999,
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"
        }}>
          <div className="momo-spin" />
          <Title level={4} style={{ color: "var(--momo-pink)" }}>Đang chờ kết quả từ {paymentMethod}...</Title>
          <Text type="secondary">Giao dịch của bạn đang được bảo mật bởi hệ thống.</Text>
        </div>
      )}
    </div>
  );
}
