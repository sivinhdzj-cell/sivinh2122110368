import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../../api/auth";
import "../../theme.css";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await authAPI.login({ email, password });
      if (res.role === "Admin" || res.role === "Manager" || res.role === "Cashier") {
        localStorage.setItem("accessToken", res.accessToken);
        localStorage.setItem("refreshToken", res.refreshToken || "");
        localStorage.setItem("role", res.role);
        localStorage.setItem("fullName", res.fullName);
        localStorage.setItem("email", res.email);
        localStorage.setItem("userId", res.userId);
        navigate("/admin/dashboard");
      } else {
        setError("Bạn không có quyền truy cập vào trang Quản trị");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: "100vh", 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center", 
      background: "linear-gradient(135deg, #1a1040 0%, #2d1b69 100%)",
      padding: "20px"
    }}>
      <div style={{ 
        width: "100%", 
        maxWidth: "420px", 
        background: "#fff", 
        borderRadius: "24px", 
        padding: "40px",
        boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
        animation: "fadeIn 0.6s ease"
      }}>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{ 
            width: "64px", 
            height: "64px", 
            background: "var(--momo-gradient)", 
            borderRadius: "18px", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center", 
            fontSize: "32px", 
            margin: "0 auto 16px",
            boxShadow: "0 8px 20px rgba(216,45,139,0.3)"
          }}>🎭</div>
          <h1 style={{ fontSize: "24px", fontWeight: 900, color: "#1a1a2e", marginBottom: "8px" }}>CinemaMS Admin</h1>
          <p style={{ color: "#6b6b8a", fontSize: "14px", fontWeight: 500 }}>Hệ thống quản trị rạp chiếu phim</p>
        </div>

        {error && (
          <div style={{ 
            background: "rgba(239,68,68,0.1)", 
            color: "#ef4444", 
            padding: "12px 16px", 
            borderRadius: "12px", 
            fontSize: "13px", 
            fontWeight: 600, 
            marginBottom: "24px",
            textAlign: "center",
            border: "1px solid rgba(239,68,68,0.2)"
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "#1a1a2e", marginBottom: "8px" }}>Email quản trị</label>
            <input 
              type="email" 
              required 
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="admin@cinemams.com"
              style={{ 
                width: "100%", padding: "12px 16px", borderRadius: "12px", border: "1.5px solid #e8e8f0",
                fontSize: "15px", outline: "none", fontFamily: "inherit", transition: "0.2s"
              }}
              onFocus={e => e.target.style.borderColor = "var(--momo-pink)"}
              onBlur={e => e.target.style.borderColor = "#e8e8f0"}
            />
          </div>

          <div style={{ marginBottom: "32px" }}>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "#1a1a2e", marginBottom: "8px" }}>Mật khẩu</label>
            <input 
              type="password" 
              required 
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{ 
                width: "100%", padding: "12px 16px", borderRadius: "12px", border: "1.5px solid #e8e8f0",
                fontSize: "15px", outline: "none", fontFamily: "inherit", transition: "0.2s"
              }}
              onFocus={e => e.target.style.borderColor = "var(--momo-pink)"}
              onBlur={e => e.target.style.borderColor = "#e8e8f0"}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              width: "100%", 
              background: "linear-gradient(135deg, #1a1040 0%, #2d1b69 100%)", 
              color: "#fff", 
              border: "none", 
              borderRadius: "14px", 
              padding: "14px", 
              fontSize: "16px", 
              fontWeight: 800, 
              cursor: "pointer", 
              transition: "0.3s",
              boxShadow: "0 10px 20px rgba(26,16,64,0.2)"
            }}
            onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
            onMouseLeave={e => e.currentTarget.style.transform = "none"}
          >
            {loading ? "Đang xác thực..." : "🚀 Đăng nhập hệ thống"}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: "32px" }}>
          <button 
            onClick={() => navigate("/home")}
            style={{ background: "none", border: "none", color: "#6b6b8a", fontSize: "13px", fontWeight: 600, cursor: "pointer", textDecoration: "underline" }}
          >
            Quay lại trang chủ
          </button>
        </div>
      </div>
    </div>
  );
}
