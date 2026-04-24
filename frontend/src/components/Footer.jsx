import { Typography, Row, Col, Space, Divider, Button } from "antd";
import { 
  FacebookFilled, 
  InstagramFilled, 
  YoutubeFilled, 
  EnvironmentOutlined, 
  PhoneOutlined, 
  MailOutlined,
  AppleFilled,
  AndroidFilled
} from "@ant-design/icons";
import { Link } from "react-router-dom";

const { Title, Text } = Typography;

export default function ModernFooter() {
  return (
    <footer style={{ background: "#1a1a2e", color: "#fff", padding: "60px 0 30px", marginTop: 80 }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
        <Row gutter={[40, 40]}>
          <Col xs={24} md={8}>
            <Title level={3} style={{ color: "var(--momo-pink)", fontWeight: 900, marginBottom: 20 }}>CinemaMS</Title>
            <Paragraph style={{ color: "rgba(255,255,255,0.6)", fontSize: 15, lineHeight: 1.8 }}>
              Hệ thống rạp chiếu phim hiện đại hàng đầu Việt Nam, mang đến trải nghiệm điện ảnh chuẩn quốc tế với công nghệ hình ảnh và âm thanh tối tân nhất 2026.
            </Paragraph>
            <Space size={16} style={{ marginTop: 20 }}>
              <Button type="primary" shape="circle" icon={<FacebookFilled />} style={{ background: "#3b5998", border: "none" }} />
              <Button type="primary" shape="circle" icon={<InstagramFilled />} style={{ background: "#e1306c", border: "none" }} />
              <Button type="primary" shape="circle" icon={<YoutubeFilled />} style={{ background: "#ff0000", border: "none" }} />
            </Space>
          </Col>

          <Col xs={12} md={5}>
            <Title level={5} style={{ color: "#fff", marginBottom: 24 }}>DANH MỤC</Title>
            <Space direction="vertical" size={12}>
              <Link to="/movies" style={{ color: "rgba(255,255,255,0.6)" }}>Phim Đang Chiếu</Link>
              <Link to="/movies" style={{ color: "rgba(255,255,255,0.6)" }}>Phim Sắp Chiếu</Link>
              <Link to="/my-bookings" style={{ color: "rgba(255,255,255,0.6)" }}>Lịch Chiếu</Link>
              <Link to="/home" style={{ color: "rgba(255,255,255,0.6)" }}>Khuyến Mãi</Link>
            </Space>
          </Col>

          <Col xs={12} md={5}>
            <Title level={5} style={{ color: "#fff", marginBottom: 24 }}>HỖ TRỢ</Title>
            <Space direction="vertical" size={12}>
              <Text style={{ color: "rgba(255,255,255,0.6)" }}>Câu hỏi thường gặp</Text>
              <Text style={{ color: "rgba(255,255,255,0.6)" }}>Chính sách bảo mật</Text>
              <Text style={{ color: "rgba(255,255,255,0.6)" }}>Điều khoản sử dụng</Text>
              <Text style={{ color: "rgba(255,255,255,0.6)" }}>Liên hệ quảng cáo</Text>
            </Space>
          </Col>

          <Col xs={24} md={6}>
            <Title level={5} style={{ color: "#fff", marginBottom: 24 }}>TẢI ỨNG DỤNG</Title>
            <Space direction="vertical" style={{ width: "100%" }} size={16}>
              <Button 
                block 
                size="large" 
                icon={<AppleFilled />} 
                style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", height: 50, borderRadius: 12, textAlign: "left" }}
              >
                App Store
              </Button>
              <Button 
                block 
                size="large" 
                icon={<AndroidFilled />} 
                style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", height: 50, borderRadius: 12, textAlign: "left" }}
              >
                Google Play
              </Button>
            </Space>
          </Col>
        </Row>

        <Divider style={{ borderColor: "rgba(255,255,255,0.1)", margin: "40px 0" }} />

        <Row justify="space-between" align="middle">
          <Col>
            <Space size={24}>
              <Space><EnvironmentOutlined style={{ color: "var(--momo-pink)" }} /> <Text style={{ color: "rgba(255,255,255,0.4)" }}>CinemaMS Tân Phú, TP.HCM</Text></Space>
              <Space><PhoneOutlined style={{ color: "var(--momo-pink)" }} /> <Text style={{ color: "rgba(255,255,255,0.4)" }}>1900 1234</Text></Space>
              <Space><MailOutlined style={{ color: "var(--momo-pink)" }} /> <Text style={{ color: "rgba(255,255,255,0.4)" }}>support@cinemams.vn</Text></Space>
            </Space>
          </Col>
          <Col>
            <Text style={{ color: "rgba(255,255,255,0.4)" }}>© 2026 CinemaMS Corporation. All rights reserved.</Text>
          </Col>
        </Row>
      </div>
    </footer>
  );
}

const Paragraph = Typography.Paragraph;
