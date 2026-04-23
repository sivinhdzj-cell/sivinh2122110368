import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, Spin, Typography, Tag, Button, Row, Col, message } from "antd";
import { moviesAPI } from "../../api/movies";
import { bookingsAPI } from "../../api/bookings";

const seatColor = {
  AVAILABLE: "#52c41a",
  HOLD: "#faad14",
  BOOKED: "#ff4d4f",
  UNAVAILABLE: "#8c8c8c",
};

export default function SeatSelection() {
  const { showtimeId } = useParams();
  const routeShowtimeId = Number(showtimeId || 0);
  const [seatMap, setSeatMap] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadSeatMap = async () => {
      try {
        if (!routeShowtimeId) {
          message.warning("Thiếu showtimeId trong URL");
          return;
        }
        const data = await moviesAPI.getSeatsByShowtime(routeShowtimeId);
        setSeatMap(data);
      } catch (error) {
        const status = error?.response?.status;
        if (status === 401) {
          message.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
        } else if (status === 404) {
          message.error("Suất chiếu không tồn tại hoặc chưa được mở bán.");
        } else {
          message.error(error?.response?.data?.message || "Không thể tải sơ đồ ghế");
        }
      } finally {
        setLoading(false);
      }
    };
    loadSeatMap();
  }, [routeShowtimeId]);

  const availableSeats = useMemo(
    () => (seatMap?.seats || []).filter((x) => x.status === "AVAILABLE"),
    [seatMap]
  );

  const total = useMemo(() => selectedSeats.reduce((sum, s) => sum + (s.price || 0), 0), [selectedSeats]);

  const toggleSeat = (seat) => {
    if (seat.status !== "AVAILABLE") return;
    setSelectedSeats((prev) => {
      const exists = prev.some((x) => x.seatId === seat.seatId);
      return exists ? prev.filter((x) => x.seatId !== seat.seatId) : [...prev, seat];
    });
  };

  const createBooking = async () => {
    if (!routeShowtimeId || selectedSeats.length === 0) {
      message.warning("Vui lòng chọn ít nhất 1 ghế");
      return;
    }
    try {
      setSubmitting(true);
      const payload = {
        showtimeId: routeShowtimeId,
        seatIds: selectedSeats.map((x) => x.seatId),
        paymentMethod: "CASH",
      };
      const result = await bookingsAPI.create(payload);
      message.success(`Đặt vé thành công! Mã booking: ${result.bookingCode || "N/A"}`);
      const refreshed = await moviesAPI.getSeatsByShowtime(routeShowtimeId);
      setSeatMap(refreshed);
      setSelectedSeats([]);
    } catch (error) {
      message.error(error?.response?.data?.message || "Đặt vé thất bại");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Spin fullscreen />;

  return (
    <Row gutter={[20, 20]}>
      <Col xs={24} lg={16}>
        <Card title={`Sơ đồ ghế suất chiếu #${routeShowtimeId}`}>
          {!seatMap ? (
            <Typography.Text type="secondary">Không có dữ liệu sơ đồ ghế.</Typography.Text>
          ) : (
            <>
              <div className="seat-grid">
                {seatMap.seats?.map((seat) => {
                  const active = selectedSeats.some((x) => x.seatId === seat.seatId);
                  const bg = active ? "#722ed1" : seatColor[seat.status] || "#8c8c8c";
                  return (
                    <button
                      key={seat.seatId}
                      className={`seat-btn ${active ? "active" : ""}`}
                      style={{ background: bg }}
                      onClick={() => toggleSeat(seat)}
                      disabled={seat.status !== "AVAILABLE"}
                    >
                      {seat.rowLabel}
                      {seat.colNumber}
                    </button>
                  );
                })}
              </div>
              <div style={{ marginTop: 16 }}>
                <Tag color="green">AVAILABLE - Ghế trống</Tag>
                <Tag color="gold">HOLD - Đang giữ</Tag>
                <Tag color="red">BOOKED - Đã đặt</Tag>
                <Tag color="default">UNAVAILABLE - Không khả dụng</Tag>
                <Tag color="purple">Đang chọn</Tag>
              </div>
            </>
          )}
        </Card>
      </Col>

      <Col xs={24} lg={8}>
        <Card title="Thông tin đặt vé">
          <Typography.Paragraph>Số ghế khả dụng: {availableSeats.length}</Typography.Paragraph>
          <Typography.Paragraph>
            Ghế đã chọn: {selectedSeats.map((s) => `${s.rowLabel}${s.colNumber}`).join(", ") || "Chưa chọn"}
          </Typography.Paragraph>
          <Typography.Title level={4}>Tổng tiền: {total.toLocaleString("vi-VN")} đ</Typography.Title>
          <Button type="primary" block loading={submitting} onClick={createBooking}>
            Xác nhận đặt vé
          </Button>
        </Card>
      </Col>
    </Row>
  );
}
