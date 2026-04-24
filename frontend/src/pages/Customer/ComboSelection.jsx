import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Card, Col, Row, Typography, Space, InputNumber, Badge, Tag } from "antd";
import { ShopOutlined, ArrowRightOutlined, ArrowLeftOutlined, FireOutlined, StarFilled, ClockCircleOutlined } from "@ant-design/icons";
import "../../styles.css";

const { Title, Text, Paragraph } = Typography;

const COMBOS = [
  { id: 1, name: "Combo Solo Pro", desc: "1 Bắp lớn + 1 Nước ngọt size L. Tiết kiệm 15%.", price: 85000, img: "https://images.unsplash.com/photo-1585647347384-2593bc35786b?auto=format&fit=crop&q=60&w=600", tag: "Bán chạy" },
  { id: 2, name: "Combo Couple Luxury", desc: "1 Bắp khổng lồ + 2 Nước ngọt + 1 Snack. Cho cặp đôi.", price: 145000, img: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=60&w=600", tag: "Phổ biến" },
  { id: 3, name: "Family Mega Pack", desc: "2 Bắp lớn + 4 Nước ngọt + 2 Snack đặc biệt. Cho cả gia đình.", price: 280000, img: "https://images.unsplash.com/photo-1513106580091-1d82408b8cd6?auto=format&fit=crop&q=60&w=600", tag: "Tiết kiệm" },
  { id: 4, name: "MoMo Infinity", desc: "1 Bắp lớn + 1 Ly giữ nhiệt CinemaMS (Refill nước miễn phí).", price: 199000, img: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=60&w=600", tag: "Limited" },
  { id: 5, name: "Snack Party Box", desc: "Tổng hợp 5 loại Snack hot nhất: Khoai tây, Nachos, Hotdog...", price: 120000, img: "https://images.unsplash.com/photo-1610614819513-58e34989848b?auto=format&fit=crop&q=60&w=600", tag: "Mới" },
];

export default function ComboSelection() {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedSeats, showtimeId, totalPrice: seatPrice, timeLeft: initialTime } = location.state || { selectedSeats: [], totalPrice: 0, timeLeft: 600 };

  const [quantities, setQuantities] = useState({});
  const [timeLeft, setTimeLeft] = useState(initialTime || 600);

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

  const handleQtyChange = (id, delta) => {
    setQuantities(prev => {
      const current = prev[id] || 0;
      const next = Math.max(0, Math.min(10, current + delta));
      return { ...prev, [id]: next };
    });
  };

  const comboTotal = COMBOS.reduce((acc, c) => acc + (c.price * (quantities[c.id] || 0)), 0);
  const finalTotal = seatPrice + comboTotal;

  const handleNext = () => {
    const selectedCombos = COMBOS.filter(c => quantities[c.id] > 0).map(c => ({
      ...c,
      qty: quantities[c.id]
    }));
    navigate("/payment", { 
      state: { 
        selectedSeats, 
        showtimeId, 
        selectedCombos,
        totalPrice: finalTotal,
        timeLeft
      } 
    });
  };

  return (
    <div className="animate-momo" style={{ maxWidth: 1100, margin: "20px auto", padding: "0 16px", paddingBottom: 120 }}>
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <Title level={2} style={{ fontWeight: 900, marginBottom: 8 }}>Bắp nước ngon - Xem phim trọn vẹn</Title>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 8, color: timeLeft < 120 ? "#ff4d4f" : "var(--momo-pink)" }}>
          <ClockCircleOutlined />
          <Text strong style={{ color: "inherit", fontSize: 16 }}>Thời gian giữ ghế còn: {formatTime(timeLeft)}</Text>
        </div>
        <Text type="secondary" style={{ fontSize: 16 }}>Tiết kiệm đến 20% khi mua theo Combo</Text>
      </div>

      <Row gutter={[24, 32]}>
        {COMBOS.map(combo => {
          const qty = quantities[combo.id] || 0;
          return (
            <Col xs={24} sm={12} md={8} key={combo.id}>
              <Badge.Ribbon text={combo.tag} color={combo.id === 1 ? "red" : "blue"}>
                <Card 
                  hoverable
                  className="movie-card-2026"
                  styles={{ body: { padding: "20px" } }}
                  style={{ 
                    borderRadius: 32, 
                    border: qty > 0 ? "2px solid var(--momo-pink)" : "1px solid #f0f0f5",
                    boxShadow: qty > 0 ? "0 10px 30px rgba(216, 45, 139, 0.2)" : "none"
                  }}
                  cover={
                    <div style={{ height: 220, overflow: "hidden", borderRadius: "32px 32px 0 0" }}>
                      <img alt={combo.name} src={combo.img} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                  }
                >
                  <div style={{ minHeight: 90 }}>
                    <Title level={4} style={{ marginBottom: 4, fontSize: 18 }}>{combo.name}</Title>
                    <Paragraph type="secondary" style={{ fontSize: 13, marginBottom: 0 }}>{combo.desc}</Paragraph>
                  </div>
                  
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 20 }}>
                    <div>
                      <div style={{ fontSize: 20, fontWeight: 900, color: "var(--momo-pink)" }}>
                        {combo.price.toLocaleString()} đ
                      </div>
                    </div>
                    
                    <div style={{ display: "flex", alignItems: "center", gap: 14, background: "#f5f5f7", padding: "4px 8px", borderRadius: 20 }}>
                      <Button 
                        size="small" 
                        shape="circle" 
                        icon={<span style={{ fontWeight: 900 }}>-</span>}
                        disabled={qty === 0}
                        onClick={() => handleQtyChange(combo.id, -1)}
                        style={{ border: "none", background: qty > 0 ? "#fff" : "transparent" }}
                      />
                      <Text strong style={{ minWidth: 20, textAlign: "center", fontSize: 16 }}>{qty}</Text>
                      <Button 
                        size="small" 
                        shape="circle" 
                        type="primary"
                        icon={<span style={{ fontWeight: 900 }}>+</span>}
                        onClick={() => handleQtyChange(combo.id, 1)}
                        style={{ background: "var(--momo-pink)", border: "none" }}
                      />
                    </div>
                  </div>
                </Card>
              </Badge.Ribbon>
            </Col>
          );
        })}
      </Row>

      {/* STICKY BOTTOM SUMMARY */}
      <div style={{ 
        position: "fixed", bottom: 20, left: "50%", transform: "translateX(-50%)",
        width: "min(95%, 1100px)",
        background: "rgba(255,255,255,0.85)", backdropFilter: "blur(20px)",
        padding: "16px 32px", borderRadius: 32, zIndex: 1000,
        boxShadow: "0 20px 50px rgba(0,0,0,0.15)",
        border: "1px solid rgba(255,255,255,0.3)",
        display: "flex", justifyContent: "space-between", alignItems: "center"
      }}>
        <Space direction="vertical" size={0}>
          <Text type="secondary" style={{ fontSize: 13 }}>Tạm tính ({selectedSeats.length} Ghế + {Object.values(quantities).reduce((a,b)=>a+b, 0)} Combo)</Text>
          <div style={{ fontSize: 32, fontWeight: 900, color: "var(--momo-pink)", lineHeight: 1 }}>
            {finalTotal.toLocaleString()} đ
          </div>
        </Space>
        <Space size={16}>
          <Button 
            size="large" 
            onClick={() => navigate(-1)} 
            style={{ borderRadius: 20, height: 56, padding: "0 24px", fontWeight: 700, border: "2px solid #f0f0f5" }}
          >
            QUAY LẠI
          </Button>
          <Button 
            size="large" 
            type="primary" 
            className="btn-momo" 
            onClick={handleNext}
            style={{ minWidth: 220, height: 56, fontSize: 18, borderRadius: 20 }}
          >
            TIẾP TỤC <ArrowRightOutlined />
          </Button>
        </Space>
      </div>
    </div>
  );
}
