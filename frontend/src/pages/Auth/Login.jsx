import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Input, Button, Typography, message, Space } from "antd";
import { UserOutlined, LockOutlined, ArrowRightOutlined } from "@ant-design/icons";
import { authAPI } from "../../api/auth";
import "../../styles.css";

const { Title, Text } = Typography;

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
      message.success("Chào mừng bạn trở lại, " + (data.fullName || "khách hàng") + "!");
      
      if (data.role === "Admin" || data.role === "Manager") {
        navigate("/admin/dashboard");
      } else {
        navigate("/home");
      }
    } catch (error) {
      message.error(error?.response?.data?.message || "Email hoặc mật khẩu không chính xác");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page-v2">
      <div className="login-bg-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>
      
      <div className="login-container-modern animate-momo">
        <div className="login-glass-card">
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <div className="login-logo-glow">
              <span style={{ fontSize: 40 }}>🎬</span>
            </div>
            <Title level={2} style={{ color: "#fff", marginTop: 16, marginBottom: 8, fontWeight: 900 }}>
              Cinema<span style={{ color: "var(--momo-pink)" }}>MS</span>
            </Title>
            <Text style={{ color: "rgba(255,255,255,0.6)", fontSize: 16 }}>Đăng nhập để đặt vé ngay</Text>
          </div>

          <Form layout="vertical" onFinish={onFinish} size="large">
            <Form.Item 
              name="email" 
              rules={[{ required: true, type: "email", message: "Vui lòng nhập email hợp lệ" }]}
            >
              <Input 
                prefix={<UserOutlined style={{ color: "rgba(255,255,255,0.4)" }} />} 
                placeholder="Email của bạn" 
                className="login-input-modern"
              />
            </Form.Item>

            <Form.Item 
              name="password" 
              rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}
            >
              <Input.Password 
                prefix={<LockOutlined style={{ color: "rgba(255,255,255,0.4)" }} />} 
                placeholder="Mật khẩu" 
                className="login-input-modern"
              />
            </Form.Item>

            <div style={{ textAlign: "right", marginBottom: 24 }}>
              <Link to="/forgot-password" style={{ color: "var(--momo-pink)", fontWeight: 500 }}>
                Quên mật khẩu?
              </Link>
            </div>

            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading} 
              block 
              className="btn-momo-login"
            >
              ĐĂNG NHẬP <ArrowRightOutlined />
            </Button>
          </Form>

          <div style={{ textAlign: "center", marginTop: 32 }}>
            <Text style={{ color: "rgba(255,255,255,0.6)" }}>
              Bạn chưa có tài khoản?{" "}
              <Link to="/register" style={{ color: "var(--momo-pink)", fontWeight: 700 }}>
                Đăng ký ngay
              </Link>
            </Text>
          </div>
        </div>
        
        <div style={{ marginTop: 24, textAlign: "center" }}>
          <Text style={{ color: "rgba(255,255,255,0.3)", fontSize: 12 }}>
            © 2026 CinemaMS - Trải nghiệm điện ảnh đỉnh cao
          </Text>
        </div>
      </div>
    </div>
  );
}
