import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, Typography, Button, Space, Divider, message, QRCode } from "antd";
import { CheckCircleFilled, CloseCircleFilled, ArrowRightOutlined, HistoryOutlined } from "@ant-design/icons";
import { bookingsAPI } from "../../api/bookings";
import "../../styles.css";

const { Title, Text } = Typography;

export default function PaymentResult() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("PROCESSING"); // PROCESSING, SUCCESS, FAILED
  const [bookingData, setBookingData] = useState(null);

  const orderId = searchParams.get("orderId");
  const resultCode = searchParams.get("resultCode"); // 0 = success for both momo and vnpay

  useEffect(() => {
    const confirm = async () => {
      if (resultCode === "0") {
        try {
          // Dùng confirmMomo endpoint cho cả MoMo và VNPay (đều trả về bookingCode là orderId)
          const result = await bookingsAPI.confirmMomo({ orderId, resultCode });
          setBookingData(result);
          setStatus("SUCCESS");
          message.success("Thanh toán thành công! Vé đã được gửi vào mục Đặt vé.");
        } catch (error) {
          // Nếu API lỗi, thử confirmPayment trực tiếp
          try {
            await bookingsAPI.confirmPayment(orderId);
            setBookingData({ bookingCode: orderId, totalAmount: 0 });
            setStatus("SUCCESS");
            message.success("Đặt vé thành công!");
          } catch {
            setStatus("FAILED");
          }
        }
      } else {
        setStatus("FAILED");
      }
    };
    confirm();
  }, [orderId, resultCode]);

  return (
    <div className="center-page animate-momo" style={{ minHeight: "100vh", background: "var(--bg-main)", padding: "40px 0" }}>
      <Card 
        style={{ width: 500, borderRadius: 32, overflow: "hidden", border: "none", boxShadow: "0 25px 80px rgba(0,0,0,0.12)" }}
        bodyStyle={{ padding: 0 }}
      >
        {status === "PROCESSING" ? (
          <div style={{ padding: 60, textAlign: "center" }}>
            <div className="momo-spin" />
            <Title level={3} style={{ color: "var(--momo-pink)", marginTop: 24 }}>Đang xử lý thanh toán...</Title>
            <Text type="secondary">Hệ thống đang xác nhận giao dịch của bạn với MoMo.</Text>
          </div>
        ) : status === "SUCCESS" ? (
          <div>
            <div style={{ background: "var(--momo-pink)", padding: "40px 20px", textAlign: "center" }}>
              <CheckCircleFilled style={{ fontSize: 80, color: "#fff", marginBottom: 16 }} />
              <Title level={2} style={{ color: "#fff", margin: 0, fontWeight: 900 }}>THANH TOÁN THÀNH CÔNG</Title>
              <Text style={{ color: "rgba(255,255,255,0.9)", fontSize: 16 }}>Giao dịch của bạn đã được Admin xác nhận</Text>
            </div>

            <div style={{ padding: "32px" }}>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 32 }}>
                <div style={{ background: "#fff", padding: 12, borderRadius: 24, border: "2px solid #f0f0f5" }}>
                  <QRCode value={bookingData?.bookingCode || "SUCCESS"} size={160} color="var(--momo-pink)" />
                </div>
              </div>

              <Space direction="vertical" style={{ width: "100%" }} size={16}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <Text type="secondary">Mã vé:</Text>
                  <Text strong style={{ fontSize: 16 }}>{bookingData?.bookingCode || orderId}</Text>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <Text type="secondary">Tổng tiền:</Text>
                  <Text strong style={{ fontSize: 20, color: "var(--momo-pink)" }}>
                    {bookingData?.totalAmount?.toLocaleString() || "0"} đ
                  </Text>
                </div>
                <Divider style={{ margin: "8px 0" }} />
                <Text type="secondary" style={{ textAlign: "center", display: "block" }}>
                  Dữ liệu đã được đồng bộ trực tiếp tới Admin Dashboard.
                </Text>
              </Space>

              <div style={{ marginTop: 40, display: "flex", gap: 16 }}>
                <Button 
                  type="primary" 
                  size="large" 
                  className="btn-momo" 
                  block 
                  style={{ height: 56, borderRadius: 18, fontSize: 16 }}
                  onClick={() => navigate("/my-bookings")}
                  icon={<HistoryOutlined />}
                >
                  XEM VÉ ĐÃ ĐẶT
                </Button>
                <Button 
                  size="large" 
                  block 
                  style={{ height: 56, borderRadius: 18, fontWeight: 700 }}
                  onClick={() => navigate("/home")}
                >
                  TRANG CHỦ
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ padding: "60px 40px", textAlign: "center" }}>
            <CloseCircleFilled style={{ fontSize: 80, color: "#ff4d4f", marginBottom: 20 }} />
            <Title level={2} style={{ fontWeight: 900 }}>THANH TOÁN THẤT BẠI</Title>
            <Text type="secondary" style={{ fontSize: 16, display: "block", marginBottom: 40 }}>
              Giao dịch của bạn đã bị hủy hoặc gặp lỗi kỹ thuật. Vui lòng thử lại.
            </Text>
            <Button 
              type="primary" 
              size="large" 
              block 
              danger
              style={{ height: 56, borderRadius: 18, fontWeight: 700 }}
              onClick={() => navigate("/payment")}
            >
              QUAY LẠI THANH TOÁN
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
