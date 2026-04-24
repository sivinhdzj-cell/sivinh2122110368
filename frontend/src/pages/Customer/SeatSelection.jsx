import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Spin, Typography, Tag, Button, Row, Col, message, Space, Divider, Alert } from "antd";
import { moviesAPI } from "../../api/movies";
import { ArrowRightOutlined, InfoCircleOutlined, ClockCircleOutlined } from "@ant-design/icons";
import "../../styles.css";

const { Title, Text } = Typography;

// MÀU SẮC CHUẨN MOMO THEO YÊU CẦU
const SEAT_COLORS = {
  AVAILABLE: "#52c41a", // Xanh lá
  HOLD: "#faad14",      // Vàng
  BOOKED: "#ff4d4f",    // Đỏ
  UNAVAILABLE: "#8c8c8c" // Xám
};

export default function SeatSelection() {
  const { showtimeId } = useParams();
  const navigate = useNavigate();
  const routeShowtimeId = Number(showtimeId || 0);
  const [seatMap, setSeatMap] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(600); // 10 phút = 600 giây

  useEffect(() => {
    if (timeLeft <= 0) {
      message.error("Hết thời gian giữ ghế. Vui lòng chọn lại!");
      navigate("/movies");
      return;
    }
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, navigate]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  useEffect(() => {
    const loadSeatMap = async () => {
      try {
        if (!routeShowtimeId) return;
        const data = await moviesAPI.getSeatsByShowtime(routeShowtimeId);
        setSeatMap(data);
      } catch (error) {
        message.error("Không thể tải sơ đồ ghế.");
      } finally {
        setLoading(false);
      }
    };
    loadSeatMap();
  }, [routeShowtimeId]);

  const total = useMemo(() => selectedSeats.reduce((sum, s) => sum + (s.price || 0), 0), [selectedSeats]);

  const toggleSeat = (seat) => {
    if (seat.status !== "AVAILABLE") return;
    setSelectedSeats((prev) => {
      const exists = prev.some((x) => x.seatId === seat.seatId);
      if (!exists && prev.length >= 8) {
        message.warning("Bạn chỉ được chọn tối đa 8 ghế");
        return prev;
      }
      return exists ? prev.filter((x) => x.seatId !== seat.seatId) : [...prev, seat];
    });
  };

  const goToCombo = () => {
    if (selectedSeats.length === 0) {
      message.warning("Vui lòng chọn ghế trước khi tiếp tục");
      return;
    }
    navigate("/combo", { state: { selectedSeats, showtimeId: routeShowtimeId, totalPrice: total, timeLeft } });
  };

  if (loading) return <div className="center-page"><Spin size="large" /></div>;

  return (
    <div className="animate-momo" style={{ maxWidth: 1100, margin: "20px auto", padding: "0 16px" }}>
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <div className="booking-step-card" style={{ textAlign: "center" }}>
            <Alert 
              title={
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text strong>Ghế của bạn sẽ được giữ trong:</Text>
                  <Text strong style={{ color: timeLeft < 120 ? "#ff4d4f" : "var(--momo-pink)", fontSize: 18 }}>
                    {formatTime(timeLeft)}
                  </Text>
                </div>
              }
              type={timeLeft < 120 ? "error" : "warning"}
              showIcon 
              icon={<ClockCircleOutlined style={{ color: timeLeft < 120 ? "#ff4d4f" : "var(--momo-pink)" }} />}
              style={{ marginBottom: 32, borderRadius: 16, border: 'none', background: timeLeft < 120 ? 'rgba(255, 77, 79, 0.1)' : '#fff9fb' }}
            />
            
            <div style={{ 
              width: "80%", height: 8, background: "#ccc", margin: "0 auto 50px", 
              borderRadius: 10, position: "relative", boxShadow: "0 4px 15px rgba(0,0,0,0.1)" 
            }}>
              <span style={{ position: "absolute", top: 16, left: "50%", transform: "translateX(-50%)", fontSize: 13, color: "#888", fontWeight: 800, letterSpacing: 2 }}>MÀN HÌNH</span>
            </div>

            <div style={{ 
              display: "grid", 
              gridTemplateColumns: `repeat(${seatMap?.maxColumn || 10}, minmax(30px, 1fr))`, 
              gap: "10px", 
              justifyContent: "center",
              marginBottom: 40
            }}>
              {seatMap?.seats?.map((seat) => {
                const isSelected = selectedSeats.some((x) => x.seatId === seat.seatId);
                const status = seat.status; // AVAILABLE, HOLD, BOOKED, UNAVAILABLE
                const bgColor = isSelected ? "#d82d8b" : SEAT_COLORS[status] || "#8c8c8c";
                
                return (
                  <div
                    key={seat.seatId}
                    className={`seat-item`}
                    style={{ 
                      background: bgColor, 
                      color: isSelected || status === 'BOOKED' ? "#fff" : "#333",
                      borderColor: isSelected ? "#d82d8b" : "#ddd",
                      opacity: status === 'UNAVAILABLE' ? 0.4 : 1,
                      cursor: status === 'AVAILABLE' ? 'pointer' : 'not-allowed'
                    }}
                    onClick={() => toggleSeat(seat)}
                  >
                    {seat.rowLabel}{seat.colNumber}
                  </div>
                );
              })}
            </div>

            <Divider />
            
            <Space size={24} wrap justify="center" style={{ background: "#f9f9f9", padding: "16px 32px", borderRadius: 16 }}>
              <Space><div className="seat-item" style={{ background: SEAT_COLORS.AVAILABLE, cursor: "default" }} /> <Text strong>Trống</Text></Space>
              <Space><div className="seat-item" style={{ background: SEAT_COLORS.HOLD, cursor: "default" }} /> <Text strong>Đang giữ</Text></Space>
              <Space><div className="seat-item" style={{ background: SEAT_COLORS.BOOKED, cursor: "default" }} /> <Text strong>Đã đặt</Text></Space>
              <Space><div className="seat-item" style={{ background: SEAT_COLORS.UNAVAILABLE, cursor: "default" }} /> <Text strong>Hỏng/Bảo trì</Text></Space>
              <Space><div className="seat-item" style={{ background: "#d82d8b", cursor: "default" }} /> <Text strong>Bạn chọn</Text></Space>
            </Space>
          </div>
        </Col>

        <Col xs={24} lg={8}>
          <div className="booking-step-card">
            <Title level={4} style={{ marginBottom: 20 }}>Tóm tắt đơn hàng</Title>
            <Space direction="vertical" style={{ width: "100%" }} size={16}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Text type="secondary">Số ghế ({selectedSeats.length})</Text>
                <Text strong style={{ color: "var(--momo-pink)" }}>
                  {selectedSeats.map(s => `${s.rowLabel}${s.colNumber}`).join(", ") || "Chưa chọn"}
                </Text>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Text type="secondary">Tạm tính</Text>
                <Text strong style={{ color: "var(--momo-pink)", fontSize: 22 }}>{total.toLocaleString()} đ</Text>
              </div>
              
              <Divider style={{ margin: "12px 0" }} />

              <div style={{ background: "var(--momo-pink-light)", padding: 14, borderRadius: 14 }}>
                <Space align="start">
                  <InfoCircleOutlined style={{ color: "var(--momo-pink)", marginTop: 4 }} />
                  <Text style={{ fontSize: 13, color: "var(--momo-pink)", fontWeight: 500 }}>
                    Vui lòng hoàn tất đặt vé trong thời gian giữ ghế để tránh mất chỗ.
                  </Text>
                </Space>
              </div>

              <Button 
                type="primary" 
                block 
                size="large" 
                className="btn-momo" 
                icon={<ArrowRightOutlined />}
                onClick={goToCombo}
                style={{ marginTop: 12, height: 56, fontSize: 18 }}
              >
                TIẾP TỤC
              </Button>
            </Space>
          </div>
        </Col>
      </Row>
    </div>
  );
}
