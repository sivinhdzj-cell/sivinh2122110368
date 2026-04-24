import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { QRCode } from "antd";

export default function VnpayMock() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId") || "N/A";
  const amount = searchParams.get("amount") || "0";
  const orderInfo = searchParams.get("orderInfo") || "Thanh toán vé xem phim";

  const [countdown, setCountdown] = useState(10);
  const [step, setStep] = useState("scanning"); // scanning | confirming | done

  // Số tài khoản giả lập nhà trường / rạp phim
  const BANK_INFO = {
    bankName: "Ngân hàng TMCP Ngoại thương VN (Vietcombank)",
    bankCode: "VCB",
    accountNo: "0123456789",
    accountName: "CONG TY CINEMAMS VIET NAM",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Vietcombank_logo.svg/120px-Vietcombank_logo.svg.png"
  };

  // QR nội dung theo chuẩn VietQR
  const qrValue = `00020101021238580010A00000072701270006970436011300${BANK_INFO.accountNo}0208QRIBFTTA5303704540${Number(amount)}5802VN5913${BANK_INFO.accountName}6005HANOI62130109${orderId}6304`;

  useEffect(() => {
    if (step === "scanning" && countdown > 0) {
      const t = setTimeout(() => setCountdown(c => c - 1), 1000);
      return () => clearTimeout(t);
    }
    if (step === "scanning" && countdown === 0) {
      setStep("confirming");
      setTimeout(() => {
        setStep("done");
        handleSuccess();
      }, 2000);
    }
  }, [countdown, step]);

  const handleSuccess = () => {
    window.location.href = `/payment/result?orderId=${orderId}&resultCode=0&message=Success`;
  };

  const handleCancel = () => {
    window.location.href = `/payment/result?orderId=${orderId}&resultCode=24&message=UserCancelled`;
  };

  return (
    <div style={{
      background: "linear-gradient(135deg, #005BAA 0%, #003d7a 100%)",
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontFamily: "'Inter', sans-serif",
      padding: "16px"
    }}>
      <div style={{
        background: "#fff",
        width: 420,
        borderRadius: 24,
        overflow: "hidden",
        boxShadow: "0 30px 80px rgba(0,0,0,0.35)"
      }}>
        {/* Header */}
        <div style={{
          background: "linear-gradient(135deg, #005BAA, #0077cc)",
          padding: "20px 24px",
          display: "flex",
          alignItems: "center",
          gap: 14
        }}>
          <div style={{
            width: 44, height: 44, background: "#fff", borderRadius: 12,
            display: "flex", alignItems: "center", justifyContent: "center"
          }}>
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/VNPay-Logo.png/240px-VNPay-Logo.png"
              alt="VNPay" style={{ width: 36 }} />
          </div>
          <div>
            <div style={{ color: "#fff", fontWeight: 800, fontSize: 18 }}>Cổng thanh toán VNPAY</div>
            <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 12 }}>Quét mã QR để thanh toán</div>
          </div>
        </div>

        <div style={{ padding: "24px 24px 20px" }}>
          {/* Status message */}
          <div style={{
            textAlign: "center",
            marginBottom: 20,
            padding: "12px 16px",
            background: step === "done" ? "#f0fff4" : step === "confirming" ? "#fff7e6" : "#f0f7ff",
            borderRadius: 12,
            border: `1px solid ${step === "done" ? "#52c41a" : step === "confirming" ? "#faad14" : "#1890ff"}`
          }}>
            <div style={{
              fontSize: 16, fontWeight: 700,
              color: step === "done" ? "#52c41a" : step === "confirming" ? "#d46b08" : "#005BAA"
            }}>
              {step === "scanning"
                ? `📱 Đang chờ quét mã QR... (${countdown}s)`
                : step === "confirming"
                  ? "⏳ Đang xác nhận giao dịch..."
                  : "✅ Thanh toán thành công!"}
            </div>
            <div style={{ fontSize: 12, color: "#666", marginTop: 4 }}>
              {step === "scanning"
                ? "Dùng ứng dụng ngân hàng hoặc VNPay để quét"
                : step === "confirming"
                  ? "Vui lòng không đóng trình duyệt"
                  : "Đang chuyển về trang vé của bạn..."}
            </div>
          </div>

          {/* QR Code */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
            <div style={{
              border: "3px solid #005BAA",
              borderRadius: 20,
              padding: 16,
              background: "#fff",
              boxShadow: "0 4px 20px rgba(0,91,170,0.15)",
              position: "relative"
            }}>
              {step !== "scanning" && (
                <div style={{
                  position: "absolute", inset: 0, background: "rgba(255,255,255,0.9)",
                  borderRadius: 17, display: "flex", alignItems: "center",
                  justifyContent: "center", flexDirection: "column", gap: 8, zIndex: 10
                }}>
                  <div style={{ fontSize: 48 }}>{step === "confirming" ? "⏳" : "✅"}</div>
                  <div style={{ fontWeight: 700, color: "#005BAA" }}>
                    {step === "confirming" ? "Đang xử lý..." : "Thành công!"}
                  </div>
                </div>
              )}
              <QRCode
                value={qrValue}
                size={200}
                color="#005BAA"
                icon="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/VNPay-Logo.png/240px-VNPay-Logo.png"
                iconSize={40}
              />
            </div>
          </div>

          {/* Bank info */}
          <div style={{
            background: "#f8faff",
            borderRadius: 16,
            padding: 16,
            marginBottom: 20,
            border: "1px solid #e6f0ff"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <img src={BANK_INFO.logo} alt={BANK_INFO.bankCode} style={{ height: 28 }} />
              <div style={{ fontWeight: 700, color: "#003d7a", fontSize: 13 }}>{BANK_INFO.bankName}</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {[
                { label: "Số tài khoản", value: BANK_INFO.accountNo, highlight: true },
                { label: "Chủ tài khoản", value: BANK_INFO.accountName },
                { label: "Số tiền", value: `${Number(amount).toLocaleString("vi-VN")} đ`, highlight: true },
                { label: "Nội dung CK", value: orderId },
              ].map(({ label, value, highlight }) => (
                <div key={label} style={{ background: "#fff", padding: "8px 12px", borderRadius: 10, border: "1px solid #e0eaff" }}>
                  <div style={{ fontSize: 11, color: "#888" }}>{label}</div>
                  <div style={{ fontWeight: 700, color: highlight ? "#005BAA" : "#1a1a2e", fontSize: 13, wordBreak: "break-all" }}>{value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Mã đơn */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", background: "#f5f5f5", borderRadius: 10, marginBottom: 20 }}>
            <span style={{ color: "#666", fontSize: 13 }}>Mã giao dịch:</span>
            <strong style={{ color: "#005BAA", fontFamily: "monospace", fontSize: 14 }}>{orderId}</strong>
          </div>

          {/* Buttons */}
          <div style={{ display: "flex", gap: 12 }}>
            <button
              onClick={handleCancel}
              style={{
                flex: 1, padding: "13px", borderRadius: 12,
                border: "2px solid #ddd", background: "#fff",
                color: "#666", fontWeight: 700, cursor: "pointer",
                fontSize: 14, transition: "all 0.2s"
              }}
            >
              Hủy giao dịch
            </button>
            <button
              onClick={() => { setStep("confirming"); setTimeout(handleSuccess, 1500); }}
              style={{
                flex: 2, padding: "13px", borderRadius: 12, border: "none",
                background: "linear-gradient(135deg, #005BAA, #0077cc)",
                color: "#fff", fontWeight: 800, cursor: "pointer",
                fontSize: 14, boxShadow: "0 4px 15px rgba(0,91,170,0.4)"
              }}
            >
              ✓ Xác nhận đã chuyển khoản
            </button>
          </div>

          <div style={{ textAlign: "center", marginTop: 16, fontSize: 11, color: "#aaa" }}>
            🔒 Giao dịch được bảo mật bởi VNPAY & SSL 256-bit
            <br />
            <span style={{ color: "#ccc" }}>Môi trường Demo - Dành cho báo cáo/đồ án</span>
          </div>
        </div>
      </div>
    </div>
  );
}
