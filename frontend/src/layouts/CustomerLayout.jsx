import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Layout, Menu, Button, Typography, Space } from "antd";
import { HomeOutlined, VideoCameraOutlined, CalendarOutlined, LogoutOutlined } from "@ant-design/icons";

const { Header, Content, Footer } = Layout;

export default function CustomerLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");

  const items = [
    { key: "/home", icon: <HomeOutlined />, label: <Link to="/home">Trang chủ</Link> },
    { key: "/movies", icon: <VideoCameraOutlined />, label: <Link to="/movies">Phim</Link> },
    { key: "/my-bookings", icon: <CalendarOutlined />, label: <Link to="/my-bookings">Vé của tôi</Link> },
  ];

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("role");
    localStorage.removeItem("fullName");
    navigate("/login");
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header className="customer-header">
        <div className="customer-header-inner">
          <Typography.Title level={4} style={{ color: "#fff", margin: 0 }}>
            CinemaMS
          </Typography.Title>
          <Menu
            mode="horizontal"
            theme="dark"
            selectedKeys={[location.pathname]}
            items={items}
            style={{ flex: 1, borderBottom: "none", minWidth: 0 }}
          />
          <Space>
            {token ? (
              <Button icon={<LogoutOutlined />} onClick={logout}>
                Đăng xuất
              </Button>
            ) : (
              <Button type="primary" onClick={() => navigate("/login")}>
                Đăng nhập
              </Button>
            )}
          </Space>
        </div>
      </Header>
      <Content style={{ maxWidth: 1280, margin: "0 auto", width: "100%", padding: 24 }}>
        <Outlet />
      </Content>
      <Footer style={{ textAlign: "center" }}>CinemaMS © 2026 - Đặt vé nhanh, trải nghiệm hiện đại</Footer>
    </Layout>
  );
}
