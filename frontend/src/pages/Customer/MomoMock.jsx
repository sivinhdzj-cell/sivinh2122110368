import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

export default function MomoMock() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId") || "N/A";
  const amount = searchParams.get("amount") || "0";

  const [scanning, setScanning] = useState(true);
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setScanning(false);
      handleSuccess();
    }
  }, [countdown]);

  // Mô phỏng việc quét mã thành công
  const handleSuccess = () => {
    // Chuyển hướng về trang kết quả với trạng thái thành công
    window.location.href = `/payment/result?orderId=${orderId}&resultCode=0&message=Success`;
  };

  // Mô phỏng việc hủy thanh toán
  const handleCancel = () => {
    window.location.href = `/payment/result?orderId=${orderId}&resultCode=1006&message=UserCancelled`;
  };

  return (
    <div style={{ background: "#f5f5f5", minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", fontFamily: "sans-serif" }}>
      <div style={{ background: "#fff", width: 400, borderRadius: 16, overflow: "hidden", boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}>
        {/* Header MoMo */}
        <div style={{ background: "#a50064", color: "#fff", padding: "16px 20px", display: "flex", alignItems: "center", gap: 12 }}>
          <img src="https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png" alt="MoMo" style={{ width: 36, height: 36, borderRadius: 8, background: "#fff", padding: 2 }} />
          <div style={{ fontSize: 18, fontWeight: 700 }}>Cổng Thanh Toán MoMo</div>
        </div>

        <div style={{ padding: 24, textAlign: "center" }}>
          <h3 style={{ fontSize: 18, color: "#1a1a2e", marginBottom: 8 }}>{scanning ? `Đang chờ quét mã... (${countdown}s)` : "Đã nhận diện thành công!"}</h3>
          <p style={{ fontSize: 14, color: "#666", marginBottom: 24 }}>{scanning ? "Vui lòng giữ điện thoại trước mã QR để hệ thống nhận diện" : "Giao dịch đang được xử lý, vui lòng không đóng trình duyệt"}</p>
          
          {/* Fake QR */}
          <div style={{ border: "2px solid #a50064", padding: 12, display: "inline-block", borderRadius: 12, marginBottom: 24 }}>
            <div style={{ width: 200, height: 200, background: "#fff", display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignContent: "space-between" }}>
              {/* Vẽ giả một QR Code */}
              <div style={{width: 60, height: 60, border: "6px solid #000", background: "#fff", position: "relative"}}><div style={{background: "#000", width: 30, height: 30, margin: "9px"}}/></div>
              <div style={{width: 60, height: 60, border: "6px solid #000", background: "#fff", position: "relative"}}><div style={{background: "#000", width: 30, height: 30, margin: "9px"}}/></div>
              <div style={{width: "100%", height: 60}} />
              <div style={{width: 60, height: 60, border: "6px solid #000", background: "#fff", position: "relative"}}><div style={{background: "#000", width: 30, height: 30, margin: "9px"}}/></div>
              <div style={{width: 60, height: 60, display: "flex", justifyContent: "center", alignItems: "center"}}>
                <img src="https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png" alt="momo" style={{width: 40, height: 40, borderRadius: 8}} />
              </div>
            </div>
          </div>

          <div style={{ background: "#f8f8fb", padding: 16, borderRadius: 8, textAlign: "left", marginBottom: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ color: "#666", fontSize: 14 }}>Mã đơn hàng</span>
              <strong style={{ fontSize: 14, color: "#1a1a2e" }}>{orderId}</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "#666", fontSize: 14 }}>Số tiền</span>
              <strong style={{ fontSize: 18, color: "#a50064" }}>{Number(amount).toLocaleString()}đ</strong>
            </div>
          </div>

          <div style={{ display: "flex", gap: 12 }}>
            <button onClick={handleCancel} style={{ flex: 1, padding: "12px", borderRadius: 8, border: "1px solid #ddd", background: "#fff", color: "#666", fontWeight: 600, cursor: "pointer" }}>
              Hủy bỏ
            </button>
            <button onClick={handleSuccess} style={{ flex: 1, padding: "12px", borderRadius: 8, border: "none", background: "#a50064", color: "#fff", fontWeight: 600, cursor: "pointer", boxShadow: "0 4px 12px rgba(165,0,100,0.3)" }}>
              Quét thành công
            </button>
          </div>
          
          <div style={{ marginTop: 24, fontSize: 12, color: "#999", borderTop: "1px solid #eee", paddingTop: 16 }}>
            Trang web giả lập (Mock) được tạo bởi AI. <br/>Dùng để quay video báo cáo/demo đồ án.
          </div>
        </div>
      </div>
    </div>
  );
}
