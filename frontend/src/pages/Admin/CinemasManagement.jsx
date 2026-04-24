import { useEffect, useState } from "react";
import { cinemasAPI } from "../../api/cinemas";
import "../../theme.css";

export default function CinemasManagement() {
  const [cinemas, setCinemas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({ name: "", address: "", city: "", isActive: true });
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };

  const load = async () => {
    try { setLoading(true); const d = await cinemasAPI.getAll(); setCinemas(Array.isArray(d) ? d : []); }
    catch { showToast("Không tải được danh sách rạp", "error"); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await cinemasAPI.update(editing.cinemaId, formData);
        showToast("Cập nhật rạp thành công");
      } else {
        await cinemasAPI.create(formData);
        showToast("Thêm rạp mới thành công");
      }
      setShowModal(false);
      load();
    } catch { showToast("Thao tác thất bại", "error"); }
  };

  return (
    <div style={{ animation: "fadeIn 0.5s ease" }}>
      {toast && (
        <div style={{ 
          position: "fixed", top: 24, right: 24, zIndex: 9999, 
          background: toast.type === "success" ? "linear-gradient(135deg, #00b69b, #00d2ff)" : "linear-gradient(135deg, #ef4444, #f59e0b)", 
          color: "#fff", borderRadius: 16, padding: "14px 24px", fontSize: 14, fontWeight: 700, 
          boxShadow: "0 10px 30px rgba(0,0,0,0.15)", display: "flex", alignItems: "center", gap: 10 
        }}>
          {toast.type === "success" ? "✅" : "❌"} {toast.msg}
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
        <div>
          <h2 style={{ fontWeight: 900, fontSize: 28, color: "#1a1a2e", marginBottom: 6, letterSpacing: "-0.5px" }}>🏛️ Quản lý Rạp chiếu</h2>
          <p style={{ color: "#6b6b8a", fontSize: 14, fontWeight: 500 }}>Quản lý hệ thống các cụm rạp CinemaMS</p>
        </div>
        <button 
          onClick={() => { setEditing(null); setFormData({ name: "", address: "", city: "", isActive: true }); setShowModal(true); }}
          style={{ 
            padding: "12px 24px", borderRadius: 14, border: "none", 
            background: "var(--momo-gradient)", color: "#fff", 
            fontWeight: 800, fontSize: 14, cursor: "pointer", 
            boxShadow: "0 8px 20px rgba(216,45,139,0.3)",
            transition: "all 0.2s"
          }}
          onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
          onMouseLeave={e => e.currentTarget.style.transform = "none"}
        >
          + Thêm rạp mới
        </button>
      </div>

      <div style={{ 
        background: "#fff", borderRadius: 24, overflow: "hidden", 
        boxShadow: "0 4px 20px rgba(0,0,0,0.04)", border: "1px solid #f0f0f5" 
      }}>
        {loading ? (
          <div style={{ padding: "100px", textAlign: "center" }}>
            <div className="momo-spin-inner" style={{ margin: "0 auto 16px" }} />
            <div style={{ color: "#aaa", fontSize: 14, fontWeight: 500 }}>Đang tải dữ liệu...</div>
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0 }}>
            <thead>
              <tr style={{ background: "#f8f9fc" }}>
                {["Tên rạp", "Địa chỉ", "Thành phố", "Trạng thái", "Hành động"].map(h => (
                  <th key={h} style={{ 
                    padding: "16px 24px", textAlign: "left", fontWeight: 800, 
                    color: "#6b6b8a", fontSize: 12, textTransform: "uppercase", letterSpacing: "1px" 
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {cinemas.map((c, idx) => (
                <tr key={c.cinemaId} style={{ borderBottom: "1px solid #f5f5f8" }}>
                  <td style={{ padding: "16px 24px", fontWeight: 800, color: "#1a1a2e" }}>{c.name}</td>
                  <td style={{ padding: "16px 24px", color: "#6b6b8a", fontSize: 13 }}>{c.address}</td>
                  <td style={{ padding: "16px 24px", fontWeight: 600 }}>{c.city}</td>
                  <td style={{ padding: "16px 24px" }}>
                    <span style={{ 
                      background: c.isActive ? "rgba(0,182,155,0.1)" : "#f5f5f8", 
                      color: c.isActive ? "#00b69b" : "#aaa", 
                      padding: "6px 12px", borderRadius: 10, fontSize: 11, fontWeight: 800 
                    }}>{c.isActive ? "Hoạt động" : "Tạm dừng"}</span>
                  </td>
                  <td style={{ padding: "16px 24px" }}>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button 
                        onClick={() => { setEditing(c); setFormData(c); setShowModal(true); }}
                        style={{ padding: "8px 16px", borderRadius: 10, border: "1px solid #e8e8f0", background: "#fff", color: "#1a1a2e", fontSize: 12, fontWeight: 700, cursor: "pointer" }}
                      >Sửa</button>
                      <button 
                        onClick={async () => {
                          if (window.confirm(`Xóa rạp ${c.name}?`)) {
                            try {
                              await cinemasAPI.delete(c.cinemaId);
                              showToast("Đã xóa rạp");
                              load();
                            } catch {
                              showToast("Không thể xóa rạp này", "error");
                            }
                          }
                        }}
                        style={{ padding: "8px 12px", borderRadius: 10, border: "1px solid #fee2e2", background: "#fef2f2", color: "#ef4444", fontSize: 12, fontWeight: 700, cursor: "pointer" }}
                      >🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box" style={{ maxWidth: 480 }}>
            <div style={{ padding: "24px", borderBottom: "1px solid #eee", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ fontWeight: 800, fontSize: 18, margin: 0 }}>{editing ? "Sửa thông tin rạp" : "Thêm rạp mới"}</h3>
              <button onClick={() => setShowModal(false)} style={{ background: "none", border: "none", fontSize: 24, cursor: "pointer", color: "#aaa" }}>&times;</button>
            </div>
            <form onSubmit={handleSubmit} style={{ padding: "24px" }}>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", fontSize: 13, fontWeight: 700, marginBottom: 8 }}>Tên rạp</label>
                <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="input-momo" placeholder="VD: CinemaMS Vincom" />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", fontSize: 13, fontWeight: 700, marginBottom: 8 }}>Địa chỉ</label>
                <input required value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="input-momo" placeholder="Số 123 Đường ABC..." />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", fontSize: 13, fontWeight: 700, marginBottom: 8 }}>Thành phố</label>
                <input required value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="input-momo" placeholder="VD: Hà Nội" />
              </div>
              <div style={{ marginBottom: 24 }}>
                <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                  <input type="checkbox" checked={formData.isActive} onChange={e => setFormData({...formData, isActive: e.target.checked})} />
                  <span style={{ fontSize: 13, fontWeight: 700 }}>Đang hoạt động</span>
                </label>
              </div>
              <button type="submit" className="ss-btn primary" style={{ width: "100%", padding: 14 }}>{editing ? "Cập nhật" : "Lưu rạp"}</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
