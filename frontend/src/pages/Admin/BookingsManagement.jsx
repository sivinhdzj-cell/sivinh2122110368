import { useEffect, useState } from "react";
import { Button, Card, Space, Table, Typography, Tag, message, Popconfirm, Input, Tooltip } from "antd";
import { 
  ShoppingOutlined, 
  DeleteOutlined, 
  SearchOutlined, 
  UserOutlined,
  CalendarOutlined,
  DollarCircleOutlined
} from "@ant-design/icons";
import { bookingsAPI } from "../../api/bookings";
import dayjs from "dayjs";
import "../../theme.css";

const { Title, Text } = Typography;

export default function BookingsManagement() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");

  const loadBookings = async () => {
    setLoading(true);
    try {
      const data = await bookingsAPI.getAll();
      setBookings(data);
    } catch (error) {
      console.error(error);
      message.error("Không thể tải danh sách đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handleDelete = async (id) => {
    try {
      await bookingsAPI.delete(id);
      message.success("Đã xóa đơn hàng và giải phóng ghế");
      loadBookings();
    } catch (error) {
      message.error("Lỗi khi xóa đơn hàng");
    }
  };

  const filteredBookings = bookings.filter(b => 
    b.bookingCode.toLowerCase().includes(searchText.toLowerCase()) ||
    b.userEmail.toLowerCase().includes(searchText.toLowerCase()) ||
    b.movieTitle.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: "Mã đơn",
      dataIndex: "bookingCode",
      key: "bookingCode",
      render: (code) => <Text strong style={{ color: "#8b5cf6" }}>{code}</Text>,
    },
    {
      title: "Người dùng",
      dataIndex: "userEmail",
      key: "userEmail",
      render: (email) => (
        <Space>
          <UserOutlined style={{ color: "var(--text-muted)" }} />
          <Text style={{ color: "#fff" }}>{email}</Text>
        </Space>
      ),
    },
    {
      title: "Phim",
      dataIndex: "movieTitle",
      key: "movieTitle",
      render: (title) => <Text style={{ color: "#fff" }}>{title}</Text>,
    },
    {
      title: "Suất chiếu",
      dataIndex: "showtimeStart",
      key: "showtimeStart",
      render: (date) => (
        <Space direction="vertical" size={0}>
          <Text style={{ color: "#cbd5e1" }}>{dayjs(date).format("DD/MM/YYYY")}</Text>
          <Text type="secondary" style={{ fontSize: 12 }}>{dayjs(date).format("HH:mm")}</Text>
        </Space>
      ),
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (amount) => (
        <Text strong style={{ color: "#10b981" }}>
          {amount?.toLocaleString()} đ
        </Text>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
      render: (status) => (
        <Tag color={status === "SUCCESS" ? "success" : "warning"} style={{ borderRadius: 6 }}>
          {status === "SUCCESS" ? "Đã thanh toán" : "Chờ xử lý"}
        </Tag>
      ),
    },
    {
      title: "Thao tác",
      key: "actions",
      render: (_, record) => (
        <Popconfirm 
          title="Xác nhận xóa đơn hàng?" 
          description="Hành động này sẽ xóa đơn hàng và giải phóng ghế đã đặt."
          onConfirm={() => handleDelete(record.bookingId)} 
          okText="Xóa ngay" 
          cancelText="Hủy"
          okButtonProps={{ danger: true }}
        >
          <Tooltip title="Xóa & Giải phóng ghế">
            <Button 
              danger 
              ghost 
              icon={<DeleteOutlined />} 
              style={{ borderRadius: 8 }}
            />
          </Tooltip>
        </Popconfirm>
      ),
    },
  ];

  return (
    <div className="animate-fade">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
        <Space size={12}>
          <div style={{ width: 48, height: 48, background: "rgba(236, 72, 153, 0.1)", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <ShoppingOutlined style={{ color: "var(--accent-pink)", fontSize: 24 }} />
          </div>
          <div>
            <Title level={2} style={{ margin: 0, color: "#fff", fontWeight: 800 }}>Quản lý đơn hàng</Title>
            <Text type="secondary">Danh sách các giao dịch đặt vé trên toàn hệ thống</Text>
          </div>
        </Space>

        <Input
          placeholder="Tìm kiếm mã đơn, email, phim..."
          prefix={<SearchOutlined style={{ color: "var(--text-muted)" }} />}
          style={{ width: 300, borderRadius: 12, height: 40, background: "rgba(255,255,255,0.05)", border: "1px solid var(--admin-border)", color: "#fff" }}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, marginBottom: 32 }}>
        <Card className="stats-card-2026">
          <Space direction="vertical">
            <Text type="secondary">Tổng đơn hàng</Text>
            <Title level={3} style={{ color: "#fff", margin: 0 }}>{bookings.length}</Title>
          </Space>
        </Card>
        <Card className="stats-card-2026">
          <Space direction="vertical">
            <Text type="secondary">Doanh thu tổng</Text>
            <Title level={3} style={{ color: "#10b981", margin: 0 }}>
              {bookings.filter(b => b.paymentStatus === "SUCCESS").reduce((acc, curr) => acc + curr.totalAmount, 0).toLocaleString()} đ
            </Title>
          </Space>
        </Card>
        <Card className="stats-card-2026">
          <Space direction="vertical">
            <Text type="secondary">Giao dịch hôm nay</Text>
            <Title level={3} style={{ color: "var(--accent-pink)", margin: 0 }}>
              {bookings.filter(b => dayjs(b.createdAt).isAfter(dayjs().startOf('day'))).length}
            </Title>
          </Space>
        </Card>
      </div>

      <Card className="stats-card-2026" styles={{ body: { padding: 0 } }}>
        <Table
          loading={loading}
          dataSource={filteredBookings}
          columns={columns}
          rowKey="bookingId"
          className="modern-table"
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  );
}
