import { Card, Table, Typography } from "antd";

export default function ShowtimesManagement() {
  return (
    <Card>
      <Typography.Title level={4}>Quản lý suất chiếu</Typography.Title>
      <Table
        rowKey="showtimeId"
        dataSource={[]}
        columns={[
          { title: "ID", dataIndex: "showtimeId", key: "showtimeId" },
          { title: "Phim", dataIndex: "movieTitle", key: "movieTitle" },
          { title: "Phòng", dataIndex: "roomName", key: "roomName" },
          { title: "Bắt đầu", dataIndex: "startTime", key: "startTime" },
        ]}
      />
    </Card>
  );
}
