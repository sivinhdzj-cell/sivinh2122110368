import { Layout, Menu, Typography } from "antd";
import { Link, Outlet, useLocation } from "react-router-dom";
import { DashboardOutlined, VideoCameraOutlined, ScheduleOutlined, BarChartOutlined } from "@ant-design/icons";

const { Sider, Content, Header } = Layout;

export default function AdminLayout() {
  const location = useLocation();

  const items = [
    { key: "/admin/dashboard", icon: <DashboardOutlined />, label: <Link to="/admin/dashboard">Dashboard</Link> },
    { key: "/admin/movies", icon: <VideoCameraOutlined />, label: <Link to="/admin/movies">Quản lý phim</Link> },
    { key: "/admin/showtimes", icon: <ScheduleOutlined />, label: <Link to="/admin/showtimes">Quản lý suất chiếu</Link> },
    { key: "/admin/reports", icon: <BarChartOutlined />, label: <Link to="/admin/reports">Báo cáo</Link> },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider breakpoint="lg" collapsedWidth="0" className="admin-sider">
        <div style={{ padding: 16 }}>
          <Typography.Title level={4} style={{ color: "#fff", margin: 0 }}>
            Admin CinemaMS
          </Typography.Title>
        </div>
        <Menu theme="dark" mode="inline" selectedKeys={[location.pathname]} items={items} />
      </Sider>
      <Layout>
        <Header className="admin-header" style={{ borderBottom: "1px solid #f0f0f0", padding: "0 24px" }}>
          <Typography.Text strong>Khu vực quản trị</Typography.Text>
        </Header>
        <Content style={{ margin: 24 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
