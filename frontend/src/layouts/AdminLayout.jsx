import { Layout, Menu, Typography, Avatar, Badge, Space, Button } from "antd";
const { Title, Text } = Typography;
import { Link, Outlet, useLocation } from "react-router-dom";
import { 
  DashboardOutlined, 
  VideoCameraOutlined, 
  ScheduleOutlined, 
  BarChartOutlined,
  UserOutlined,
  EnvironmentOutlined,
  AppstoreOutlined,
  GiftOutlined,
  BellOutlined,
  LogoutOutlined,
  ShoppingOutlined
} from "@ant-design/icons";
import "../theme.css";

const { Sider, Content, Header } = Layout;

export default function AdminLayout() {
  const location = useLocation();

  const menuItems = [
    { key: "/admin/dashboard", icon: <DashboardOutlined />, label: <Link to="/admin/dashboard">Bảng điều khiển</Link> },
    { key: "/admin/movies", icon: <VideoCameraOutlined />, label: <Link to="/admin/movies">Quản lý phim</Link> },
    { key: "/admin/showtimes", icon: <ScheduleOutlined />, label: <Link to="/admin/showtimes">Suất chiếu</Link> },
    { key: "/admin/cinemas", icon: <EnvironmentOutlined />, label: <Link to="/admin/cinemas">Rạp chiếu</Link> },
    { key: "/admin/rooms", icon: <AppstoreOutlined />, label: <Link to="/admin/rooms">Phòng chiếu</Link> },
    { key: "/admin/users", icon: <UserOutlined />, label: <Link to="/admin/users">Người dùng</Link> },
    { key: "/admin/bookings", icon: <ShoppingOutlined />, label: <Link to="/admin/bookings">Quản lý đơn hàng</Link> },
    { key: "/admin/coupons", icon: <GiftOutlined />, label: <Link to="/admin/coupons">Mã giảm giá</Link> },
    { key: "/admin/reports", icon: <BarChartOutlined />, label: <Link to="/admin/reports">Báo cáo & Thống kê</Link> },
  ];

  return (
    <Layout className="admin-layout-wrapper" style={{ minHeight: "100vh", background: "var(--admin-bg)" }}>
      <Sider 
        width={280} 
        breakpoint="lg" 
        collapsedWidth="0" 
        className="admin-sider-2026"
        style={{ background: "rgba(15, 23, 42, 0.95)" }}
      >
        <div style={{ marginBottom: 40, padding: '24px 12px 0' }}>
          <Space align="center" size={12}>
            <div style={{ 
              width: 44, height: 44, background: 'var(--primary-gradient)', 
              borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 22, boxShadow: '0 8px 20px rgba(139, 92, 246, 0.4)'
            }}>🎬</div>
            <Title level={4} style={{ color: '#fff', margin: 0, fontWeight: 900, letterSpacing: '-0.5px' }}>
              CinemaMS <span style={{ color: 'var(--accent-pink)', fontWeight: 800 }}>PRO</span>
            </Title>
          </Space>
        </div>

        <Menu 
          theme="dark" 
          mode="inline" 
          selectedKeys={[location.pathname]} 
          items={menuItems.map(item => ({
            ...item,
            className: `nav-item-2026 ${location.pathname === item.key ? 'nav-item-selected-2026' : ''}`
          }))} 
          style={{ background: 'transparent', border: 'none', padding: '0 8px' }}
        />

        <div style={{ position: 'absolute', bottom: 24, left: 16, right: 16 }}>
          <div style={{ 
            padding: "16px", 
            background: 'rgba(255,255,255,0.05)', 
            borderRadius: 20, 
            display: 'flex', 
            alignItems: 'center', 
            gap: 12, 
            border: '1px solid var(--admin-border)',
            backdropFilter: "blur(10px)"
          }}>
            <Avatar src="https://i.pravatar.cc/150?u=admin" size="large" style={{ border: "2px solid var(--accent-pink)" }} />
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <Text strong style={{ color: '#fff', display: 'block' }}>Admin MS</Text>
              <Text type="secondary" style={{ fontSize: 11, color: "var(--text-muted)" }}>Quản trị viên hệ thống</Text>
            </div>
            <Button type="text" icon={<LogoutOutlined style={{ color: '#ef4444' }} />} />
          </div>
        </div>
      </Sider>

      <Layout style={{ background: 'transparent' }}>
        <Header className="admin-header-2026" style={{ background: "rgba(15, 23, 42, 0.6)", backdropFilter: "blur(12px)" }}>
          <div style={{ flex: 1 }}>
            <Title level={4} style={{ color: '#fff', margin: 0, fontWeight: 800 }}>
              Chào buổi sáng, Admin! <span style={{ fontSize: 24 }}>👋</span>
            </Title>
            <Text style={{ color: "var(--text-muted)", fontSize: 12 }}>Hệ thống rạp phim đang vận hành ổn định</Text>
          </div>
          <Space size={24}>
            <Badge count={5} overflowCount={9} style={{ boxShadow: "none" }}>
              <Button type="text" icon={<BellOutlined style={{ fontSize: 20, color: '#fff' }} />} />
            </Badge>
            <div style={{ width: 1, height: 32, background: 'var(--admin-border)' }} />
            <div style={{ textAlign: "right" }}>
              <Text strong style={{ color: '#fff', display: "block" }}>24 Tháng 4, 2026</Text>
              <Text type="secondary" style={{ fontSize: 11, color: "var(--text-muted)" }}>Hôm nay</Text>
            </div>
          </Space>
        </Header>

        <Content style={{ padding: '32px', overflowY: 'auto', background: "var(--admin-bg)" }}>
          <div className="animate-fade">
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}
