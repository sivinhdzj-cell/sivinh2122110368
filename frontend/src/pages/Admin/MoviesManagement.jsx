import { Button, Card, Space, Table, Typography } from "antd";

export default function MoviesManagement() {
  return (
    <Card>
      <Space style={{ width: "100%", justifyContent: "space-between", marginBottom: 16 }}>
        <Typography.Title level={4} style={{ margin: 0 }}>
          Quản lý phim
        </Typography.Title>
        <Button type="primary">Thêm phim</Button>
      </Space>
      <Table
        rowKey="movieId"
        dataSource={[]}
        columns={[
          { title: "ID", dataIndex: "movieId", key: "movieId" },
          { title: "Tên phim", dataIndex: "title", key: "title" },
          { title: "Thời lượng", dataIndex: "durationMin", key: "durationMin" },
          { title: "Trạng thái", dataIndex: "status", key: "status" },
          { title: "Thao tác", key: "actions", render: () => <Space><Button>Sửa</Button><Button danger>Xóa</Button></Space> },
        ]}
      />
    </Card>
  );
}
