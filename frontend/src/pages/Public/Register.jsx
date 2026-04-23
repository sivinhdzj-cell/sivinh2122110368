import { Card, Form, Input, Button, Typography } from "antd";
import { Link } from "react-router-dom";

export default function Register() {
  return (
    <div className="center-page">
      <Card style={{ width: 460 }}>
        <Typography.Title level={3}>Đăng ký tài khoản</Typography.Title>
        <Form layout="vertical">
          <Form.Item label="Họ tên">
            <Input placeholder="Nguyễn Văn A" />
          </Form.Item>
          <Form.Item label="Email">
            <Input placeholder="you@example.com" />
          </Form.Item>
          <Form.Item label="Mật khẩu">
            <Input.Password placeholder="Tối thiểu 6 ký tự" />
          </Form.Item>
          <Button type="primary" block>
            Đăng ký
          </Button>
          <Typography.Paragraph style={{ marginTop: 12 }}>
            Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
          </Typography.Paragraph>
        </Form>
      </Card>
    </div>
  );
}
