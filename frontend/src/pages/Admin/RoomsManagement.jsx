import { useEffect, useState } from "react";
import { roomsAPI } from "../../api/rooms";
import { cinemasAPI } from "../../api/cinemas";
import "../../theme.css";

const ROOM_TYPES = ["2D", "3D", "IMAX", "4DX", "Dolby"];

export default function RoomsManagement() {
  const [rooms, setRooms] = useState([]);
  const [cinemas, setCinemas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({ name: "", cinemaId: "", roomType: "2D", totalSeats: 100, rowsCount: 10, colsCount: 10 });
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };

  const load = async () => {
    try { 
      setLoading(true); 
      const [r, c] = await Promise.all([roomsAPI.getAll(), cinemasAPI.getAll()]); 
      setRooms(Array.isArray(r) ? r : []); 
      setCinemas(Array.isArray(c) ? c : []);
      if (c.length > 0 && !formData.cinemaId) setFormData(p => ({ ...p, cinemaId: c[0].cinemaId }));
    }
    catch { showToast("Không tải được danh sách phòng", "error"); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData, cinemaId: Number(formData.cinemaId), totalSeats: Number(formData.rowsCount) * Number(formData.colsCount) };
      if (editing) {
        await roomsAPI.update(editing.roomId, payload);
        showToast("Cập nhật phòng thành công");
      } else {
        await roomsAPI.create(payload);
        showToast("Thêm phòng mới thành công");
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
          <h2 style={{ fontWeight: 900, fontSize: 28, color: "#1a1a2e", marginBottom: 6, letterSpacing: "-0.5px" }}>📽️ Quản lý Phòng chiếu</h2>
          <p style={{ color: "#6b6b8a", fontSize: 14, fontWeight: 500 }}>Thiết lập sơ đồ ghế và loại phòng cho từng cụm rạp</p>
        </div>
        <button 
          onClick={() => { setEditing(null); setShowModal(true); }}
          style={{ 
            padding: "12px 24px", borderRadius: 14, border: "none", 
            background: "var(--momo-gradient)", color: "#fff", 
            fontWeight: 800, fontSize: 14, cursor: "pointer", 
            boxShadow: "0 8px 20px rgba(216,45,139,0.3)"
          }}
        >+ Thêm phòng mới</button>
      </div>

      <div style={{ background: "#fff", borderRadius: 24, overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.04)", border: "1px solid #f0f0f5" }}>
        {loading ? (
          <div style={{ padding: "100px", textAlign: "center" }}>
            <div className="momo-spin-inner" style={{ margin: "0 auto 16px" }} />
            <div style={{ color: "#aaa", fontSize: 14, fontWeight: 500 }}>Đang tải dữ liệu...</div>
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0 }}>
            <thead>
              <tr style={{ background: "#f8f9fc" }}>
                {["Phòng chiếu", "Thuộc rạp", "Loại phòng", "Sơ đồ ghế", "Tổng ghế", "Hành động"].map(h => (
                  <th key={h} style={{ padding: "16px 24px", textAlign: "left", fontWeight: 800, color: "#6b6b8a", fontSize: 12 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rooms.map(r => (
                <tr key={r.roomId} style={{ borderBottom: "1px solid #f5f5f8" }}>
                  <td style={{ padding: "16px 24px", fontWeight: 800, color: "#1a1a2e" }}>{r.name}</td>
                  <td style={{ padding: "16px 24px", fontWeight: 600 }}>{cinemas.find(c => c.cinemaId === r.cinemaId)?.name || "N/A"}</td>
                  <td style={{ padding: "16px 24px" }}>
                    <span style={{ background: "rgba(123,47,247,0.1)", color: "#7b2ff7", padding: "4px 10px", borderRadius: 8, fontSize: 11, fontWeight: 800 }}>{r.roomType}</span>
                  </td>
                  <td style={{ padding: "16px 24px", color: "#666", fontSize: 13 }}>{r.rowsCount} hàng x {r.colsCount} cột</td>
                  <td style={{ padding: "16px 24px", fontWeight: 700, color: "#d82d8b" }}>{r.totalSeats} ghế</td>
                  <td style={{ padding: "16px 24px" }}>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button onClick={() => { setEditing(r); setFormData(r); setShowModal(true); }} style={{ padding: "8px 16px", borderRadius: 10, border: "1px solid #e8e8f0", background: "#fff", cursor: "pointer", fontSize: 12, fontWeight: 700 }}>Sửa</button>
                      <button 
                        onClick={async () => {
                          if (window.confirm(`Xóa phòng ${r.name}?`)) {
                            try {
                              await roomsAPI.delete(r.roomId);
                              showToast("Đã xóa phòng");
                              load();
                            } catch {
                              showToast("Không thể xóa phòng này", "error");
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
          <div className="modal-box" style={{ maxWidth: 520 }}>
            <div style={{ padding: "24px", borderBottom: "1px solid #eee", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ fontWeight: 800, fontSize: 18, margin: 0 }}>{editing ? "Sửa phòng chiếu" : "Thêm phòng mới"}</h3>
              <button onClick={() => setShowModal(false)} style={{ background: "none", border: "none", fontSize: 24, cursor: "pointer", color: "#aaa" }}>&times;</button>
            </div>
            <form onSubmit={handleSubmit} style={{ padding: "24px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 700, marginBottom: 6 }}>Tên phòng</label>
                  <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="input-momo" placeholder="VD: Phòng 1" />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 700, marginBottom: 6 }}>Loại phòng</label>
                  <select value={formData.roomType} onChange={e => setFormData({...formData, roomType: e.target.value})} className="input-momo">
                    {ROOM_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, marginBottom: 6 }}>Cụm rạp</label>
                <select value={formData.cinemaId} onChange={e => setFormData({...formData, cinemaId: e.target.value})} className="input-momo">
                  {cinemas.map(c => <option key={c.cinemaId} value={c.cinemaId}>{c.name}</option>)}
                </select>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 700, marginBottom: 6 }}>Số hàng ghế</label>
                  <input type="number" required value={formData.rowsCount} onChange={e => setFormData({...formData, rowsCount: e.target.value})} className="input-momo" />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 700, marginBottom: 6 }}>Số cột mỗi hàng</label>
                  <input type="number" required value={formData.colsCount} onChange={e => setFormData({...formData, colsCount: e.target.value})} className="input-momo" />
                </div>
              </div>
              <div style={{ padding: "12px", background: "#f8f9fc", borderRadius: 12, marginBottom: 24, textAlign: "center" }}>
                <span style={{ fontSize: 13, color: "#666" }}>Tổng cộng: <strong style={{ color: "var(--momo-pink)" }}>{formData.rowsCount * formData.colsCount}</strong> ghế</span>
              </div>
              <button type="submit" className="ss-btn primary" style={{ width: "100%", padding: 14 }}>Lưu phòng chiếu</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
