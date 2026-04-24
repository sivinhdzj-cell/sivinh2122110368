import { useEffect, useState } from "react";
import { couponsAPI } from "../../api/coupons";
import "../../theme.css";

const EMPTY = { code: "", description: "", discountType: "PERCENT", discountValue: 10, minOrderAmount: null, maxDiscountAmount: null, maxUsageCount: null, isActive: true, validFrom: "", validTo: "" };

export default function CouponsManagement() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal]     = useState(null);
  const [form, setForm]       = useState(EMPTY);
  const [saving, setSaving]   = useState(false);
  const [toast, setToast]     = useState(null);

  const showToast = (msg, type = "success") => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };

  const load = async () => {
    try { setLoading(true); const d = await couponsAPI.getAll(); setCoupons(Array.isArray(d) ? d : []); }
    catch { showToast("Không tải được danh sách coupon", "error"); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));
  const openAdd  = () => { setForm(EMPTY); setModal("add"); };
  const openEdit = (c) => { setForm({ ...c, validFrom: c.validFrom?.slice(0,10) || "", validTo: c.validTo?.slice(0,10) || "" }); setModal("edit"); };
  const closeModal = () => { setModal(null); };

  const save = async () => {
    if (!form.code.trim() || !form.discountValue) { showToast("Vui lòng điền đủ thông tin", "error"); return; }
    try {
      setSaving(true);
      const payload = {
        ...form,
        discountValue: Number(form.discountValue),
        minOrderAmount: form.minOrderAmount ? Number(form.minOrderAmount) : null,
        maxDiscountAmount: form.maxDiscountAmount ? Number(form.maxDiscountAmount) : null,
        maxUsageCount: form.maxUsageCount ? Number(form.maxUsageCount) : null,
        validFrom: form.validFrom || null,
        validTo: form.validTo || null,
      };
      if (modal === "add") await couponsAPI.create(payload);
      else                  await couponsAPI.update(form.couponId, payload);
      showToast(modal === "add" ? "Thêm coupon thành công" : "Cập nhật thành công");
      closeModal(); await load();
    } catch (err) { showToast(err?.response?.data?.message || "Lỗi, thử lại", "error"); }
    finally { setSaving(false); }
  };

  const del = async (id) => {
    if (!window.confirm("Xóa mã giảm giá này?")) return;
    try { await couponsAPI.delete(id); showToast("Đã xóa coupon"); await load(); }
    catch { showToast("Không thể xóa", "error"); }
  };

  const inputStyle = { width: "100%", padding: "10px 14px", border: "1.5px solid #e8e8f0", borderRadius: 10, fontSize: 14, outline: "none", fontFamily: "inherit" };

  return (
    <div>
      {toast && <div style={{ position: "fixed", top: 20, right: 20, zIndex: 9999, background: toast.type === "success" ? "#00b69b" : "#ef4444", color: "#fff", borderRadius: 12, padding: "12px 20px", fontSize: 14, fontWeight: 600, boxShadow: "0 4px 20px rgba(0,0,0,0.2)" }}>{toast.msg}</div>}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <h2 style={{ fontWeight: 800, fontSize: 20, marginBottom: 2 }}>🎫 Quản lý mã giảm giá</h2>
          <p style={{ color: "#6b6b8a", fontSize: 13 }}>{coupons.length} mã</p>
        </div>
        <button onClick={openAdd} style={{
          background: "linear-gradient(135deg,#d82d8b,#7b2ff7)", color: "#fff", border: "none",
          borderRadius: 12, padding: "11px 22px", fontSize: 14, fontWeight: 700,
          cursor: "pointer", fontFamily: "inherit", boxShadow: "0 4px 16px rgba(216,45,139,0.35)",
        }}>+ Tạo mã giảm giá</button>
      </div>

      <div style={{ background: "#fff", borderRadius: 20, overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
        {loading ? <div style={{ padding: "40px", textAlign: "center", color: "#bbb" }}>Đang tải...</div> : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
              <thead>
                <tr style={{ background: "#fafafa", borderBottom: "2px solid #f0f0f5" }}>
                  {["Mã code", "Loại", "Giá trị", "Đã dùng", "Hiệu lực đến", "Trạng thái", "Thao tác"].map(h => (
                    <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontWeight: 700, color: "#6b6b8a", fontSize: 12, whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {coupons.length === 0 ? (
                  <tr><td colSpan={7} style={{ padding: "40px", textAlign: "center", color: "#bbb" }}>Chưa có mã giảm giá nào</td></tr>
                ) : coupons.map(c => (
                  <tr key={c.couponId} style={{ borderBottom: "1px solid #f5f5f8" }}
                    onMouseEnter={e => e.currentTarget.style.background = "#fafafa"}
                    onMouseLeave={e => e.currentTarget.style.background = "#fff"}>
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ background: "rgba(216,45,139,0.08)", border: "1px dashed rgba(216,45,139,0.4)", color: "#d82d8b", padding: "4px 12px", borderRadius: 8, fontWeight: 800, fontSize: 13, letterSpacing: 1 }}>{c.code}</span>
                      </div>
                      {c.description && <div style={{ fontSize: 12, color: "#aaa", marginTop: 3 }}>{c.description}</div>}
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <span style={{ background: c.discountType === "PERCENT" ? "rgba(123,47,247,0.1)" : "rgba(245,158,11,0.1)", color: c.discountType === "PERCENT" ? "#7b2ff7" : "#f59e0b", padding: "3px 8px", borderRadius: 6, fontSize: 12, fontWeight: 700 }}>
                        {c.discountType === "PERCENT" ? "%" : "Cố định"}
                      </span>
                    </td>
                    <td style={{ padding: "14px 16px", fontWeight: 700, color: "#d82d8b" }}>
                      {c.discountType === "PERCENT" ? `${c.discountValue}%` : `${Number(c.discountValue).toLocaleString()}đ`}
                    </td>
                    <td style={{ padding: "14px 16px", color: "#6b6b8a" }}>{c.usedCount || 0}{c.maxUsageCount ? `/${c.maxUsageCount}` : ""}</td>
                    <td style={{ padding: "14px 16px", color: "#6b6b8a", fontSize: 12 }}>{c.validTo ? new Date(c.validTo).toLocaleDateString("vi-VN") : "Không giới hạn"}</td>
                    <td style={{ padding: "14px 16px" }}>
                      <span style={{ background: c.isActive ? "rgba(0,182,155,0.1)" : "#f5f5f8", color: c.isActive ? "#00b69b" : "#aaa", padding: "4px 10px", borderRadius: 100, fontSize: 11, fontWeight: 700 }}>
                        {c.isActive ? "Đang dùng" : "Vô hiệu"}
                      </span>
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button onClick={() => openEdit(c)} style={{ background: "rgba(123,47,247,0.1)", color: "#7b2ff7", border: "none", borderRadius: 8, padding: "6px 12px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>✏️ Sửa</button>
                        <button onClick={() => del(c.couponId)} style={{ background: "rgba(239,68,68,0.1)", color: "#ef4444", border: "none", borderRadius: 8, padding: "6px 12px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 16 }}>
          <div style={{ background: "#fff", borderRadius: 24, padding: 32, width: "100%", maxWidth: 500, maxHeight: "90vh", overflowY: "auto" }}>
            <h3 style={{ fontWeight: 800, fontSize: 18, marginBottom: 24 }}>{modal === "add" ? "➕ Tạo mã giảm giá" : "✏️ Sửa mã giảm giá"}</h3>
            <div style={{ display: "grid", gap: 14 }}>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: "#6b6b8a", display: "block", marginBottom: 6 }}>Mã code *</label>
                <input value={form.code} onChange={set("code")} placeholder="SAVE30" style={{ ...inputStyle, textTransform: "uppercase", fontWeight: 700, letterSpacing: 2 }}
                  onFocus={e => e.target.style.borderColor = "#d82d8b"} onBlur={e => e.target.style.borderColor = "#e8e8f0"} />
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: "#6b6b8a", display: "block", marginBottom: 6 }}>Mô tả</label>
                <input value={form.description || ""} onChange={set("description")} placeholder="Giảm 30% cho đơn từ 200k" style={inputStyle}
                  onFocus={e => e.target.style.borderColor = "#d82d8b"} onBlur={e => e.target.style.borderColor = "#e8e8f0"} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: "#6b6b8a", display: "block", marginBottom: 6 }}>Loại giảm giá</label>
                  <select value={form.discountType} onChange={set("discountType")} style={{ ...inputStyle, appearance: "none" }}>
                    <option value="PERCENT">Phần trăm (%)</option>
                    <option value="FIXED">Cố định (đ)</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: "#6b6b8a", display: "block", marginBottom: 6 }}>Giá trị *</label>
                  <input type="number" value={form.discountValue} onChange={set("discountValue")} style={inputStyle} min={0} />
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: "#6b6b8a", display: "block", marginBottom: 6 }}>Hiệu lực từ</label>
                  <input type="date" value={form.validFrom || ""} onChange={set("validFrom")} style={inputStyle} />
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: "#6b6b8a", display: "block", marginBottom: 6 }}>Hiệu lực đến</label>
                  <input type="date" value={form.validTo || ""} onChange={set("validTo")} style={inputStyle} />
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: "#6b6b8a", display: "block", marginBottom: 6 }}>Đơn hàng tối thiểu (đ)</label>
                  <input type="number" value={form.minOrderAmount || ""} onChange={set("minOrderAmount")} placeholder="Không giới hạn" style={inputStyle} min={0} />
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: "#6b6b8a", display: "block", marginBottom: 6 }}>Số lần dùng tối đa</label>
                  <input type="number" value={form.maxUsageCount || ""} onChange={set("maxUsageCount")} placeholder="Không giới hạn" style={inputStyle} min={1} />
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
              <button onClick={closeModal} style={{ flex: 1, background: "#f0f0f5", color: "#6b6b8a", border: "none", borderRadius: 12, padding: "13px", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Hủy</button>
              <button onClick={save} disabled={saving} style={{ flex: 2, background: "linear-gradient(135deg,#d82d8b,#7b2ff7)", color: "#fff", border: "none", borderRadius: 12, padding: "13px", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", opacity: saving ? 0.7 : 1 }}>
                {saving ? "Đang lưu..." : (modal === "add" ? "Tạo mã" : "Lưu thay đổi")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
