import { useEffect, useState, useCallback } from "react";
import { Row, Col, Card, Typography, Space, Table, Tag, Spin, message, Badge, Tooltip } from "antd";
import { 
  RiseOutlined, 
  UserOutlined, 
  WalletOutlined, 
  SafetyOutlined,
  ArrowUpOutlined,
  BulbOutlined,
  ReloadOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined
} from "@ant-design/icons";
import { reportsAPI } from "../../api/reports";
import { usersAPI } from "../../api/users";
import "../../theme.css";

const { Title, Text, Paragraph } = Typography;

const StatCard = ({ title, value, icon, trend, color, subtitle }) => (
  <div className="stats-card-2026">
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
      <div style={{ 
        width: 48, height: 48, borderRadius: 14, background: color, 
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, color: '#fff' 
      }}>
        {icon}
      </div>
      <Tag color="success" icon={<ArrowUpOutlined />} style={{ borderRadius: 20, border: 'none', background: 'rgba(34, 197, 94, 0.1)', color: '#22c55e', height: 24 }}>
        {trend}
      </Tag>
    </div>
    <Text style={{ color: 'var(--text-muted)', fontSize: 14, fontWeight: 500 }}>{title}</Text>
    <div style={{ marginTop: 4 }}>
      <Title level={2} style={{ color: '#fff', margin: 0, fontWeight: 800 }}>{value}</Title>
    </div>
    {subtitle && <Text style={{ color: 'var(--text-muted)', fontSize: 12 }}>{subtitle}</Text>}
  </div>
);

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [userCount, setUserCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  const loadData = useCallback(async () => {
    try {
      const [statsData, bookingsData, usersData] = await Promise.all([
        reportsAPI.getDashboardStats(),
        reportsAPI.getRecentBookings(),
        usersAPI.getAll().catch(() => [])
      ]);
      setStats(statsData);
      setBookings(Array.isArray(bookingsData) ? bookingsData : []);
      if (Array.isArray(usersData)) setUserCount(usersData.length);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Dashboard error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
    // Refresh mỗi 10s để cập nhật đơn hàng mới từ người dùng
    const interval = setInterval(loadData, 10000);
    return () => clearInterval(interval);
  }, [loadData]);

  const columns = [
    { 
      title: 'Mã đơn', 
      dataIndex: 'bookingCode', 
      key: 'bookingCode',
      render: (text) => <Text strong style={{ color: '#ec4899', fontFamily: 'monospace' }}>{text}</Text>
    },
    { 
      title: 'Khách hàng', 
      dataIndex: 'userEmail', 
      key: 'userEmail',
      render: (email, record) => (
        <div>
          <Text style={{ color: '#fff', display: 'block' }}>{record.userFullName || 'Khách vãng lai'}</Text>
          <Text type="secondary" style={{ fontSize: 12 }}>{email}</Text>
        </div>
      )
    },
    { 
      title: 'Phim', 
      dataIndex: 'movieTitle', 
      key: 'movieTitle',
      render: (text) => <Text style={{ color: '#fff' }}>{text}</Text>
    },
    { 
      title: 'Doanh thu', 
      dataIndex: 'totalAmount', 
      key: 'totalAmount',
      render: (val) => <Text style={{ color: '#10b981', fontWeight: 700 }}>{val?.toLocaleString()} đ</Text>
    },
    { 
      title: 'Phương thức', 
      dataIndex: 'paymentMethod', 
      key: 'paymentMethod',
      render: (method) => {
        const colorMap = { MOMO: 'magenta', VNPAY: 'blue', CASH: 'green' };
        return <Tag color={colorMap[method] || 'default'}>{method}</Tag>;
      }
    },
    { 
      title: 'Trạng thái', 
      dataIndex: 'paymentStatus', 
      key: 'paymentStatus',
      render: (status) => (
        <Tag 
          color={status === 'SUCCESS' ? 'success' : 'processing'} 
          icon={status === 'SUCCESS' ? <CheckCircleOutlined /> : <ClockCircleOutlined />}
          style={{ borderRadius: 20 }}
        >
          {status === 'SUCCESS' ? 'Thành công' : 'Chờ xử lý'}
        </Tag>
      )
    },
    {
      title: 'Thời gian',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => (
        <Text type="secondary" style={{ fontSize: 12 }}>
          {new Date(date).toLocaleString('vi-VN')}
        </Text>
      )
    }
  ];

  if (loading) return (
    <div style={{ height: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Spin size="large" tip="Đang đồng bộ dữ liệu..." />
    </div>
  );

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
        <Title level={2} style={{ color: '#fff', margin: 0, fontWeight: 800 }}>Thống kê tổng quan</Title>
        <div style={{ textAlign: 'right' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Badge status="processing" color="#22c55e" />
            <Text style={{ color: 'var(--text-muted)', fontSize: 12 }}>Tự động cập nhật mỗi 10 giây</Text>
            <Tooltip title="Cập nhật ngay">
              <ReloadOutlined 
                style={{ color: 'var(--text-muted)', cursor: 'pointer' }} 
                onClick={loadData} 
              />
            </Tooltip>
          </div>
          {lastUpdated && (
            <Text style={{ color: 'var(--text-muted)', fontSize: 11 }}>
              Cập nhật lúc: {lastUpdated.toLocaleTimeString('vi-VN')}
            </Text>
          )}
        </div>
      </div>
      
      <Row gutter={[24, 24]}>
        <Col xs={24} sm={12} lg={6}>
          <StatCard 
            title="Doanh thu hôm nay" 
            value={`${(stats?.todayRevenue || 0).toLocaleString()} đ`} 
            icon={<WalletOutlined />} 
            trend={`+${stats?.revenueGrowth || 0}%`} 
            color="linear-gradient(135deg, #6366f1, #8b5cf6)"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard 
            title="Tổng vé đã bán" 
            value={`${stats?.totalTickets || 0} vé`} 
            icon={<RiseOutlined />} 
            trend={`+${stats?.ticketsGrowth || 0}%`} 
            color="linear-gradient(135deg, #ec4899, #f43f5e)"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard 
            title="Khách hàng đăng ký" 
            value={userCount || stats?.totalUsers || 0} 
            icon={<UserOutlined />} 
            trend="+5.0%" 
            color="linear-gradient(135deg, #f59e0b, #d97706)"
            subtitle="Tổng người dùng hệ thống"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <div className="stats-card-2026" style={{ background: 'rgba(168, 85, 247, 0.1)', border: '1px solid var(--admin-border)' }}>
            <Space align="center" style={{ marginBottom: 12 }}>
              <BulbOutlined style={{ color: '#a855f7', fontSize: 20 }} />
              <Text style={{ color: '#a855f7', fontWeight: 600 }}>AI INSIGHTS</Text>
            </Space>
            <Paragraph style={{ color: '#94a3b8', fontSize: 13, margin: 0 }}>
              Phim <Text strong style={{ color: '#fff' }}>Avengers: Endgame</Text> đang chiếm 60% doanh thu. Gợi ý tăng suất chiếu vào tối nay.
            </Paragraph>
            <div style={{ marginTop: 12 }}>
              <Text style={{ fontSize: 12, color: '#6d28d9' }}>
                📊 {bookings.filter(b => b.paymentStatus === 'SUCCESS').length} đơn thành công hôm nay
              </Text>
            </div>
          </div>
        </Col>
      </Row>

      <div style={{ marginTop: 48 }} className="stats-card-2026">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <Title level={4} style={{ color: '#fff', margin: 0 }}>Hoạt động đặt vé gần đây</Title>
          <Tag color="blue">{bookings.length} giao dịch gần nhất</Tag>
        </div>
        <Table 
          columns={columns} 
          dataSource={bookings} 
          rowKey="bookingId"
          pagination={false} 
          className="modern-table"
          scroll={{ x: 800 }}
        />
      </div>
    </div>
  );
}
