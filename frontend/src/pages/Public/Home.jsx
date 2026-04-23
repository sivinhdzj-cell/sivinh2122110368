import { Button, Card, Col, Row, Typography } from "antd";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <Card style={{ borderRadius: 16 }}>
      <Row gutter={[24, 24]} align="middle">
        <Col xs={24} md={16}>
          <Typography.Title>Đặt vé phim nhanh chóng tại CinemaMS</Typography.Title>
          <Typography.Paragraph type="secondary">
            Giao diện được thiết kế theo phong cách hiện đại, ưu tiên thao tác nhanh như các nền tảng rạp phim lớn.
          </Typography.Paragraph>
          <Button type="primary" size="large">
            <Link to="/movies">Xem phim đang chiếu</Link>
          </Button>
        </Col>
      </Row>
    </Card>
  );
}
