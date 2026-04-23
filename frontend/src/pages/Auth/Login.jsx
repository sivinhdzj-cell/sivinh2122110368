import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, Form, Input, Button, Typography, message } from "antd";
import { authAPI } from "../../api/auth";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const data = await authAPI.login(values);
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      localStorage.setItem("role", data.role || "Customer");
      localStorage.setItem("fullName", data.fullName || "");
      message.success("Đăng nhập thành công");
      navigate("/home");
    } catch (error) {
      message.error(error?.response?.data?.message || "Đăng nhập thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="center-page">
      <Card style={{ width: 420 }}>
        <Typography.Title level={3}>Đăng nhập CinemaMS</Typography.Title>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item label="Email" name="email" rules={[{ required: true, type: "email" }]}>
            <Input placeholder="email@cinemams.com" />
          </Form.Item>
          <Form.Item label="Mật khẩu" name="password" rules={[{ required: true }]}>
            <Input.Password placeholder="Nhập mật khẩu" />
          </Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Đăng nhập
          </Button>
          <Typography.Paragraph style={{ marginTop: 12, marginBottom: 0 }}>
            Bạn chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
          </Typography.Paragraph>
        </Form>
      </Card>
    </div>
  );
}
