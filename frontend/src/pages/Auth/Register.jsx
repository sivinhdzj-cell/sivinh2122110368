import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Input, Button, Typography, message, Space } from "antd";
import { UserOutlined, MailOutlined, LockOutlined, ArrowRightOutlined } from "@ant-design/icons";
import { authAPI } from "../../api/auth";
import "../../styles.css";

const { Title, Text } = Typography;

export default function Register() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      setLoading(true);
      await authAPI.register({
        fullName: values.fullName,
        email: values.email,
        password: values.password,
      });
      message.success("Chào mừng bạn! Đăng ký thành công, hãy đăng nhập để bắt đầu.");
      navigate("/login");
    } catch (error) {
      message.error(error?.response?.data?.message || "Đăng ký thất bại. Vui lòng kiểm tra lại thông tin.");
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
        <div className="login-glass-card" style={{ padding: "40px" }}>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <Title level={2} style={{ color: "#fff", margin: 0, fontWeight: 900 }}>
              Tạo <span style={{ color: "var(--momo-pink)" }}>Tài Khoản</span>
            </Title>
            <Text style={{ color: "rgba(255,255,255,0.6)", fontSize: 14 }}>Khám phá thế giới điện ảnh cùng CinemaMS</Text>
          </div>

          <Form layout="vertical" onFinish={onFinish} size="large">
            <Form.Item 
              name="fullName" 
              rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
            >
              <Input 
                prefix={<UserOutlined style={{ color: "rgba(255,255,255,0.4)" }} />} 
                placeholder="Họ và tên" 
                className="login-input-modern"
              />
            </Form.Item>

            <Form.Item 
              name="email" 
              rules={[
                { required: true, message: "Vui lòng nhập email" },
                { type: "email", message: "Email không hợp lệ" }
              ]}
            >
              <Input 
                prefix={<MailOutlined style={{ color: "rgba(255,255,255,0.4)" }} />} 
                placeholder="Email cá nhân" 
                className="login-input-modern"
              />
            </Form.Item>

            <Form.Item 
              name="password" 
              rules={[
                { required: true, message: "Vui lòng tạo mật khẩu" },
                { min: 6, message: "Tối thiểu 6 ký tự" }
              ]}
            >
              <Input.Password 
                prefix={<LockOutlined style={{ color: "rgba(255,255,255,0.4)" }} />} 
                placeholder="Mật khẩu" 
                className="login-input-modern"
              />
            </Form.Item>

            <Form.Item 
              name="confirmPassword" 
              dependencies={["password"]}
              rules={[
                { required: true, message: "Vui lòng xác nhận mật khẩu" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("Mật khẩu xác nhận chưa khớp"));
                  },
                }),
              ]}
            >
              <Input.Password 
                prefix={<LockOutlined style={{ color: "rgba(255,255,255,0.4)" }} />} 
                placeholder="Xác nhận mật khẩu" 
                className="login-input-modern"
              />
            </Form.Item>

            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading} 
              block 
              className="btn-momo-login"
              style={{ marginTop: 12 }}
            >
              TẠO TÀI KHOẢN <ArrowRightOutlined />
            </Button>
          </Form>

          <div style={{ textAlign: "center", marginTop: 32 }}>
            <Text style={{ color: "rgba(255,255,255,0.6)" }}>
              Bạn đã có tài khoản?{" "}
              <Link to="/login" style={{ color: "var(--momo-pink)", fontWeight: 700 }}>
                Đăng nhập ngay
              </Link>
            </Text>
          </div>
        </div>
      </div>
    </div>
  );
}
