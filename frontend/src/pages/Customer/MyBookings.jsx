import { useEffect, useState } from "react";
import { Spin, Typography, message, Empty, Row, Col, Tag, Button, Modal, QRCode, Space, Divider, Card, Popconfirm, Tooltip } from "antd";
import {
  HistoryOutlined,
  QrcodeOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
  CarryOutOutlined,
  ClockCircleOutlined,
  ArrowLeftOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined
} from "@ant-design/icons";
import { bookingsAPI } from "../../api/bookings";
import { useNavigate } from "react-router-dom";
import "../../styles.css";

const { Title, Text } = Typography;

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const navigate = useNavigate();

  const loadBookings = async () => {
    try {
      const data = await bookingsAPI.getMyBookings();
      setBookings(Array.isArray(data) ? data : []);
    } catch (error) {
      message.error("Không thể tải danh sách vé.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handleDeleteBooking = async (bookingId) => {
    setDeletingId(bookingId);
    try {
      await bookingsAPI.delete(bookingId);
      message.success("Đã hủy vé thành công! Ghế đã được giải phóng.");
      loadBookings();
    } catch (error) {
      console.error(error);
      message.error("Không thể hủy vé. Vui lòng thử lại.");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return <div className="center-page"><Spin size="large" /></div>;

  return (
    <div className="animate-momo" style={{ maxWidth: 1000, margin: "20px auto", padding: "0 16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
        <Space align="center">
          <div style={{ width: 48, height: 48, background: "var(--momo-pink-light)", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <CarryOutOutlined style={{ color: "var(--momo-pink)", fontSize: 24 }} />
          </div>
          <div>
            <Title level={2} style={{ margin: 0 }}>Đặt vé của tôi</Title>
            <Text type="secondary" style={{ fontSize: 13 }}>{bookings.length} vé trong lịch sử</Text>
          </div>
        </Space>
        <Button icon={<HistoryOutlined />} style={{ borderRadius: 12 }}>Lịch sử GD</Button>
      </div>

      {bookings.length === 0 ? (
        <Empty
          description="Bạn chưa có vé nào. Hãy đặt vé ngay để trải nghiệm nhé!"
          style={{ marginTop: 100 }}
        >
          <Button type="primary" className="btn-momo" size="large" onClick={() => navigate("/movies")}>
            ĐẶT VÉ NGAY
          </Button>
        </Empty>
      ) : (
        <Row gutter={[24, 32]}>
          {bookings.map((booking) => {
            const isSuccess = booking.paymentStatus === "SUCCESS";
            const isPending = booking.paymentStatus === "PENDING";
            const isDeleting = deletingId === booking.bookingId;

            return (
              <Col xs={24} md={12} key={booking.bookingId}>
                <Card
                  className="ticket-card-momo"
                  onClick={() => setSelectedTicket(booking)}
                  styles={{ body: { padding: 0 } }}
                  variant="none"
                  style={{ position: "relative", opacity: isDeleting ? 0.5 : 1, transition: "opacity 0.3s" }}
                >
                  <div style={{ display: "flex", height: "100%" }}>
                    <div className="ticket-edge-left" />
                    <div style={{ flex: 1, padding: "20px 16px", position: "relative" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <Tag
                          color={isSuccess ? "green" : "orange"}
                          icon={isSuccess ? <CheckCircleOutlined /> : <ExclamationCircleOutlined />}
                          style={{ borderRadius: 6 }}
                        >
                          {isSuccess ? "ĐÃ XÁC NHẬN" : "CHỜ THANH TOÁN"}
                        </Tag>
                        <Space size={6}>
                          <Text type="secondary" style={{ fontSize: 12 }}>#{booking.bookingCode}</Text>
                          {/* NÚT HỦY VÉ */}
                          <Popconfirm
                            title="Xác nhận hủy vé?"
                            description="Ghế sẽ được giải phóng và không thể hoàn tiền."
                            onConfirm={() => handleDeleteBooking(booking.bookingId)}
                            okText="Hủy vé"
                            cancelText="Không"
                            okButtonProps={{ danger: true }}
                            icon={<ExclamationCircleOutlined style={{ color: "red" }} />}
                          >
                            <Tooltip title="Hủy vé này">
                              <Button
                                size="small"
                                danger
                                ghost
                                icon={<DeleteOutlined />}
                                loading={isDeleting}
                                onClick={(e) => e.stopPropagation()}
                                style={{
                                  borderRadius: 8,
                                  borderColor: "#ff4d4f",
                                  fontSize: 12,
                                  height: 26,
                                  width: 26,
                                  padding: 0
                                }}
                              />
                            </Tooltip>
                          </Popconfirm>
                        </Space>
                      </div>

                      <Title level={4} style={{ margin: "12px 0 8px", color: "var(--text-dark)" }}>{booking.movieTitle}</Title>

                      <Space direction="vertical" size={4} style={{ width: "100%" }}>
                        <div className="ticket-info-mini">
                          <CalendarOutlined /> <Text>{new Date(booking.showtimeStart).toLocaleDateString("vi-VN")}</Text>
                          <ClockCircleOutlined style={{ marginLeft: 12 }} /> <Text>{new Date(booking.showtimeStart).toLocaleTimeString("vi-VN", { hour: '2-digit', minute: '2-digit' })}</Text>
                        </div>
                        <div className="ticket-info-mini">
                          <EnvironmentOutlined /> <Text strong>{booking.cinemaName || "CinemaMS Toàn Quốc"}</Text>
                        </div>
                        <div style={{ marginTop: 4 }}>
                          <Text type="secondary" style={{ fontSize: 12 }}>Ghế: </Text>
                          <Text strong style={{ color: "var(--text-dark)", fontSize: 14 }}>
                            {booking.seatLabels?.join(", ") || booking.seatLabel}
                          </Text>
                        </div>
                        <div style={{ marginTop: 8, display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                          <Text type="secondary" style={{ fontSize: 12 }}>Tổng tiền: </Text>
                          <Text strong style={{ color: "var(--momo-pink)", fontSize: 18 }}>
                            {booking.totalAmount?.toLocaleString()} đ
                          </Text>
                        </div>
                      </Space>

                      <div className="ticket-divider-dash" />

                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12 }}>
                        <Text type="secondary" style={{ fontSize: 12 }}>Nhấn để xem mã vé</Text>
                        <QrcodeOutlined style={{ fontSize: 24, color: "var(--momo-pink)" }} />
                      </div>
                    </div>
                  </div>
                </Card>
              </Col>
            );
          })}
        </Row>
      )}

      {/* QR MODAL */}
      <Modal
        open={!!selectedTicket}
        footer={null}
        onCancel={() => setSelectedTicket(null)}
        centered
        width={400}
        styles={{ body: { padding: 0 } }}
      >
        <div style={{ textAlign: "center", padding: "40px 24px" }}>
          <div style={{ background: "var(--momo-pink)", padding: 20, margin: "-40px -24px 24px", borderRadius: "8px 8px 0 0" }}>
            <Title level={3} style={{ color: "#fff", margin: 0 }}>VÉ XEM PHIM</Title>
          </div>

          <QRCode
            value={selectedTicket?.bookingCode || "TICKET-CMS-2026"}
            size={220}
            color="var(--momo-pink)"
            style={{ margin: "0 auto" }}
          />

          <Divider>CHI TIẾT VÉ</Divider>

          <Space direction="vertical" style={{ width: "100%", textAlign: "left" }} size={12}>
            <div>
              <Text type="secondary">Phim: </Text>
              <Text strong style={{ fontSize: 18 }}>{selectedTicket?.movieTitle}</Text>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Text type="secondary">Suất chiếu: </Text>
              <Text strong>{new Date(selectedTicket?.showtimeStart).toLocaleString("vi-VN")}</Text>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Text type="secondary">Số ghế: </Text>
              <Text strong style={{ color: "var(--momo-pink)", fontSize: 18 }}>{selectedTicket?.seatLabels?.join(", ") || selectedTicket?.seatLabel}</Text>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Text type="secondary">Rạp: </Text>
              <Text strong>{selectedTicket?.cinemaName || "CinemaMS Tân Phú"}</Text>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Text type="secondary">Mã vé: </Text>
              <Text strong style={{ fontFamily: "monospace", color: "var(--momo-pink)" }}>#{selectedTicket?.bookingCode}</Text>
            </div>
          </Space>

          <div style={{ display: "flex", gap: 12, marginTop: 32 }}>
            <Popconfirm
              title="Xác nhận hủy vé?"
              description="Hành động này không thể hoàn tác."
              onConfirm={async () => {
                const id = selectedTicket?.bookingId;
                setSelectedTicket(null);
                await handleDeleteBooking(id);
              }}
              okText="Hủy vé"
              cancelText="Không"
              okButtonProps={{ danger: true }}
            >
              <Button
                danger
                size="large"
                style={{ flex: 1, height: 50, borderRadius: 16, fontWeight: 700 }}
                icon={<DeleteOutlined />}
              >
                HỦY VÉ
              </Button>
            </Popconfirm>
            <Button
              type="primary"
              size="large"
              className="btn-momo"
              style={{ flex: 2, height: 50, borderRadius: 16 }}
              onClick={() => setSelectedTicket(null)}
            >
              ĐÓNG
            </Button>
          </div>
        </div>
      </Modal>

      <Button
        icon={<ArrowLeftOutlined />}
        type="link"
        onClick={() => navigate("/movies")}
        style={{ color: "var(--text-grey)", marginTop: 40 }}
      >
        Quay lại trang chủ
      </Button>
    </div>
  );
}
