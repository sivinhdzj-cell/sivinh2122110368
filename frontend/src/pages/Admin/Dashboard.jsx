import { Card, Col, Row, Statistic, Table, Typography } from "antd";

export default function Dashboard() {
  const kpi = {
    revenueToday: 24500000,
    totalBookings: 312,
    occupancyRate: 78,
  };

  const recentRows = [
    { key: 1, movieTitle: "Avengers", room: "Room 1", ticketsSold: 120, revenue: 8400000, status: "SUCCESS" },
    { key: 2, movieTitle: "Dune 2", room: "Room IMAX", ticketsSold: 96, revenue: 11520000, status: "SUCCESS" },
    { key: 3, movieTitle: "Kẻ Ẩn Danh", room: "Room 3", ticketsSold: 64, revenue: 4600000, status: "PENDING" },
  ];

  return (
    <>
      <Typography.Title level={3}>Admin Dashboard</Typography.Title>
      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Card>
            <Statistic title="Doanh thu hôm nay" value={kpi.revenueToday} suffix="đ" />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card>
            <Statistic title="Tổng booking" value={kpi.totalBookings} />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card>
            <Statistic title="Tỉ lệ lấp đầy ghế" value={kpi.occupancyRate} suffix="%" />
          </Card>
        </Col>
      </Row>
      <Card style={{ marginTop: 16 }}>
        <Typography.Title level={4}>Bảng thống kê gần đây</Typography.Title>
        <Table
          rowKey="key"
          dataSource={recentRows}
          columns={[
            { title: "Phim", dataIndex: "movieTitle", key: "movieTitle" },
            { title: "Phòng", dataIndex: "room", key: "room" },
            { title: "Vé đã bán", dataIndex: "ticketsSold", key: "ticketsSold" },
            {
              title: "Doanh thu",
              dataIndex: "revenue",
              key: "revenue",
              render: (v) => Number(v || 0).toLocaleString("vi-VN") + " đ",
            },
            { title: "Trạng thái", dataIndex: "status", key: "status" },
          ]}
          pagination={false}
        />
      </Card>
    </>
  );
}
