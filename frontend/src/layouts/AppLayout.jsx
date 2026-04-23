import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Layout, Menu, Button, Typography, Space } from "antd";
import {
  VideoCameraOutlined,
  AppstoreOutlined,
  CalendarOutlined,
  BarChartOutlined,
  LoginOutlined,
  LogoutOutlined,
} from "@ant-design/icons";

const { Header, Content } = Layout;

export default function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("accessToken");

  const items = [
    { key: "/", label: <Link to="/">Phim đang chiếu</Link>, icon: <VideoCameraOutlined /> },
    { key: "/seat-selection", label: <Link to="/seat-selection">Chọn ghế</Link>, icon: <AppstoreOutlined /> },
    { key: "/my-bookings", label: <Link to="/my-bookings">Vé của tôi</Link>, icon: <CalendarOutlined /> },
    ...(role === "Admin" || role === "Manager"
      ? [
          {
            key: "/admin/reports",
            label: <Link to="/admin/reports">Báo cáo</Link>,
            icon: <BarChartOutlined />,
          },
        ]
      : []),
  ];

  const onLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("role");
    localStorage.removeItem("fullName");
    navigate("/login");
  };

  return (
    <Layout style={{ minHeight: "100vh", background: "#f5f7fb" }}>
      <Header className="app-header">
        <div className="header-inner">
          <Typography.Title level={4} style={{ color: "#fff", margin: 0 }}>
            CinemaMS
          </Typography.Title>
          <Menu
            theme="dark"
            mode="horizontal"
            selectedKeys={[location.pathname]}
            items={items}
            style={{ flex: 1, minWidth: 0, borderBottom: "none" }}
          />
          <Space>
            {token ? (
              <Button icon={<LogoutOutlined />} onClick={onLogout}>
                Đăng xuất
              </Button>
            ) : (
              <Button icon={<LoginOutlined />} onClick={() => navigate("/login")}>
                Đăng nhập
              </Button>
            )}
          </Space>
        </div>
      </Header>
      <Content style={{ padding: 24, maxWidth: 1280, margin: "0 auto", width: "100%" }}>
        <Outlet />
      </Content>
    </Layout>
  );
}
