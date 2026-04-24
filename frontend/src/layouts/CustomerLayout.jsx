import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Button, Typography, Space, Dropdown } from "antd";
import { 
  HomeOutlined, VideoCameraOutlined, CarryOutOutlined,
  LogoutOutlined, UserOutlined, DownOutlined, BellOutlined
} from "@ant-design/icons";
import ModernFooter from "../components/Footer";

const { Text } = Typography;

export default function CustomerLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");
  const fullName = localStorage.getItem("fullName");

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("role");
    localStorage.removeItem("fullName");
    navigate("/login");
  };

  const navLinks = [
    { path: "/home", icon: <HomeOutlined />, label: "Trang chủ" },
    { path: "/movies", icon: <VideoCameraOutlined />, label: "Phim" },
    { path: "/my-bookings", icon: <CarryOutOutlined />, label: "Đặt vé" },
  ];

  const userMenuItems = [
    { key: "bookings", label: "Vé của tôi", icon: <CarryOutOutlined />, onClick: () => navigate("/my-bookings") },
    { type: "divider" },
    { key: "logout", label: "Đăng xuất", icon: <LogoutOutlined />, danger: true, onClick: logout },
  ];

  return (
    <div style={{ background: "#f5f7fb", minHeight: "100vh" }}>
      {/* ── NAVBAR ─────────────────────────────────────────────────── */}
      <header style={{
        position: "sticky", top: 0, zIndex: 1000, height: 72,
        background: "#fff",
        boxShadow: "0 2px 20px rgba(0,0,0,0.06)",
        borderBottom: "1px solid #f0f0f5",
        display: "flex", alignItems: "center",
        padding: "0 24px"
      }}>
        <div style={{
          maxWidth: 1280, width: "100%", margin: "0 auto",
          display: "flex", alignItems: "center"
        }}>
          {/* Logo */}
          <div onClick={() => navigate("/home")} style={{ cursor: "pointer", marginRight: 48, flexShrink: 0 }}>
            <span style={{
              fontWeight: 900, fontSize: 24, letterSpacing: "-1px",
              background: "linear-gradient(135deg, #ae2070, #d82d8b)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
            }}>
              CinemaMS
            </span>
          </div>

          {/* Nav links */}
          <nav style={{ display: "flex", alignItems: "center", gap: 4, flex: 1 }}>
            {navLinks.map(link => {
              const active = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  style={{
                    display: "flex", alignItems: "center", gap: 7,
                    padding: "8px 18px", borderRadius: 12, fontWeight: 600,
                    fontSize: 14, textDecoration: "none",
                    color: active ? "#ae2070" : "#6b6b8a",
                    background: active ? "#fce8f3" : "transparent",
                    borderBottom: active ? "2px solid #ae2070" : "2px solid transparent",
                    transition: "all 0.2s ease"
                  }}
                >
                  {link.icon} {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right side */}
          <Space size={12}>
            {token ? (
              <>
                <Button
                  shape="circle" icon={<BellOutlined />}
                  style={{ border: "1px solid #f0f0f5", boxShadow: "none" }}
                />
                <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" trigger={["click"]}>
                  <div style={{
                    display: "flex", alignItems: "center", gap: 10, cursor: "pointer",
                    background: "#fce8f3", border: "1px solid #f8c8df",
                    borderRadius: 100, padding: "6px 16px 6px 8px",
                    transition: "all 0.2s ease"
                  }}>
                    <div style={{
                      width: 32, height: 32,
                      background: "linear-gradient(135deg, #ae2070, #d82d8b)",
                      borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center"
                    }}>
                      <UserOutlined style={{ color: "#fff", fontSize: 14 }} />
                    </div>
                    <Text style={{ color: "#ae2070", fontWeight: 700, fontSize: 14, maxWidth: 100 }} ellipsis>
                      {fullName || "Tài khoản"}
                    </Text>
                    <DownOutlined style={{ color: "#ae2070", fontSize: 10 }} />
                  </div>
                </Dropdown>
              </>
            ) : (
              <Button
                type="primary"
                onClick={() => navigate("/login")}
                style={{
                  background: "linear-gradient(135deg, #ae2070, #d82d8b)",
                  border: "none", borderRadius: 14, fontWeight: 700,
                  height: 44, padding: "0 28px",
                  boxShadow: "0 8px 20px rgba(174,32,112,0.3)"
                }}
              >
                ĐĂNG NHẬP
              </Button>
            )}
          </Space>
        </div>
      </header>

      {/* ── CONTENT ─────────────────────────────────────────────── */}
      <main style={{ minHeight: "calc(100vh - 72px - 200px)" }}>
        <Outlet />
      </main>

      <ModernFooter />
    </div>
  );
}
