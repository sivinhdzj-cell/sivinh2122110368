import { useState, useEffect } from "react";
import { Card, Table, Typography, Tag, Space, Button, message, Modal, Form, Input, InputNumber, Select, DatePicker, Popconfirm } from "antd";
import { PlusOutlined, ReloadOutlined, ScheduleOutlined, EditOutlined, DeleteOutlined, CalendarOutlined, BankOutlined } from "@ant-design/icons";
import { showtimesAPI } from "../../api/showtimes";
import { moviesAPI } from "../../api/movies";
import { cinemasAPI } from "../../api/cinemas";
import { roomsAPI } from "../../api/rooms";
import dayjs from "dayjs";
import "../../theme.css";

const { Title, Text } = Typography;

export default function ShowtimesManagement() {
  const [data, setData] = useState([]);
  const [movies, setMovies] = useState([]);
  const [allRooms, setAllRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form] = Form.useForm();

  const loadData = async () => {
    setLoading(true);
    try {
      const [shows, movieList, roomList] = await Promise.all([
        showtimesAPI.getAll(),
        moviesAPI.getAll(),
        roomsAPI.getAll().catch(() => [])
      ]);
      setData(Array.isArray(shows) ? shows : []);
      setMovies(Array.isArray(movieList) ? movieList : []);
      setAllRooms(Array.isArray(roomList) ? roomList : []);
    } catch (error) {
      message.error("Không thể tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleAdd = () => {
    setEditing(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEdit = (record) => {
    setEditing(record);
    form.setFieldsValue({
      ...record,
      startTime: record.startTime ? dayjs(record.startTime) : null,
      endTime: record.endTime ? dayjs(record.endTime) : null,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await showtimesAPI.delete(id);
      message.success("Đã xóa suất chiếu");
      loadData();
    } catch {
      message.error("Lỗi khi xóa suất chiếu");
    }
  };

  const handleSubmit = async (values) => {
    try {
      const payload = {
        ...values,
        startTime: values.startTime?.toISOString(),
        endTime: values.endTime?.toISOString(),
      };
      if (editing) {
        await showtimesAPI.update(editing.showtimeId, payload);
        message.success("Cập nhật suất chiếu thành công");
      } else {
        await showtimesAPI.create(payload);
        message.success("Thêm suất chiếu thành công");
      }
      setIsModalOpen(false);
      loadData();
    } catch (err) {
      console.error(err);
      message.error("Lỗi khi lưu suất chiếu");
    }
  };

  const columns = [
    {
      title: "Phim & Suất chiếu", key: "movie",
      render: (_, record) => (
        <Space size={12}>
          <div style={{ width: 40, height: 40, background: "rgba(236,72,153,0.1)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <CalendarOutlined style={{ color: "var(--accent-pink)", fontSize: 20 }} />
          </div>
          <div>
            <Text strong style={{ color: "#fff", display: "block", fontSize: 15 }}>{record.movieTitle}</Text>
            <Text type="secondary" style={{ fontSize: 12 }}>ID: {record.showtimeId}</Text>
          </div>
        </Space>
      )
    },
    {
      title: "Rạp / Phòng", key: "location",
      render: (_, record) => (
        <div>
          <Space><BankOutlined style={{ color: "#8b5cf6" }} /><Text style={{ color: "#fff" }}>{record.cinemaName}</Text></Space>
          <br />
          <Tag color="geekblue" style={{ borderRadius: 4, marginTop: 4 }}>{record.roomName}</Tag>
        </div>
      )
    },
    {
      title: "Thời gian", dataIndex: "startTime", key: "startTime",
      render: (date) => (
        <div>
          <Text strong style={{ color: "#fff" }}>{dayjs(date).format("HH:mm")}</Text>
          <div style={{ fontSize: 12, color: "#94a3b8" }}>{dayjs(date).format("DD/MM/YYYY")}</div>
        </div>
      )
    },
    {
      title: "Giá vé", dataIndex: "basePrice", key: "basePrice",
      render: (p) => <Text style={{ color: "var(--accent-pink)", fontWeight: 800 }}>{p?.toLocaleString()} đ</Text>
    },
    {
      title: "Trạng thái", dataIndex: "status", key: "status",
      render: (s) => (
        <Tag color={s === "SCHEDULED" ? "cyan" : s === "ACTIVE" ? "green" : "default"} style={{ borderRadius: 6 }}>
          {s || "SCHEDULED"}
        </Tag>
      )
    },
    {
      title: "Thao tác", key: "actions",
      render: (_, record) => (
        <Space>
          <Button type="primary" ghost icon={<EditOutlined />} onClick={() => handleEdit(record)}
            style={{ borderRadius: 8, borderColor: "#8b5cf6", color: "#8b5cf6" }} />
          <Popconfirm title="Xóa suất chiếu này?" onConfirm={() => handleDelete(record.showtimeId)} okText="Xóa" cancelText="Hủy" okButtonProps={{ danger: true }}>
            <Button danger ghost icon={<DeleteOutlined />} style={{ borderRadius: 8 }} />
          </Popconfirm>
        </Space>
      )
    },
  ];

  return (
    <div className="animate-fade">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
        <Space size={12}>
          <div style={{ width: 48, height: 48, background: "rgba(236,72,153,0.1)", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <ScheduleOutlined style={{ color: "var(--accent-pink)", fontSize: 24 }} />
          </div>
          <div>
            <Title level={2} style={{ margin: 0, color: "#fff", fontWeight: 800 }}>Lịch trình suất chiếu</Title>
            <Text type="secondary">Quản lý thời gian và giá vé cho các bộ phim</Text>
          </div>
        </Space>
        <Space>
          <Button icon={<ReloadOutlined />} onClick={loadData} style={{ borderRadius: 12, height: 44 }}>Làm mới</Button>
          <Button type="primary" size="large" icon={<PlusOutlined />} onClick={handleAdd}
            style={{ background: "var(--primary-gradient)", border: "none", height: 48, padding: "0 24px", borderRadius: 14, boxShadow: "0 10px 20px rgba(139,92,246,0.3)" }}>
            Thêm suất chiếu
          </Button>
        </Space>
      </div>

      <Card className="stats-card-2026" styles={{ body: { padding: 0 } }}>
        <Table rowKey="showtimeId" dataSource={data} columns={columns} loading={loading} pagination={{ pageSize: 8 }} className="modern-table" />
      </Card>

      <Modal
        title={<Title level={4} style={{ margin: 0 }}>{editing ? "Cập nhật suất chiếu" : "Thêm suất chiếu mới"}</Title>}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        okText={editing ? "Cập nhật" : "Thêm ngay"}
        cancelText="Hủy"
        width={600}
        centered
        styles={{ body: { paddingTop: 20 } }}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="movieId" label="Phim" rules={[{ required: true, message: "Chọn phim" }]}>
            <Select placeholder="Chọn phim" showSearch optionFilterProp="children">
              {movies.map(m => <Select.Option key={m.movieId} value={m.movieId}>{m.title}</Select.Option>)}
            </Select>
          </Form.Item>
          <Form.Item name="roomId" label="Phòng chiếu" rules={[{ required: true, message: "Chọn phòng" }]}>
            <Select placeholder="Chọn phòng chiếu">
              {allRooms.map(r => <Select.Option key={r.roomId} value={r.roomId}>{r.name}</Select.Option>)}
            </Select>
          </Form.Item>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <Form.Item name="startTime" label="Bắt đầu" rules={[{ required: true }]}>
              <DatePicker showTime style={{ width: "100%" }} format="DD/MM/YYYY HH:mm" />
            </Form.Item>
            <Form.Item name="endTime" label="Kết thúc" rules={[{ required: true }]}>
              <DatePicker showTime style={{ width: "100%" }} format="DD/MM/YYYY HH:mm" />
            </Form.Item>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <Form.Item name="basePrice" label="Giá vé (VNĐ)" rules={[{ required: true }]}>
              <InputNumber min={0} style={{ width: "100%" }} formatter={v => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")} />
            </Form.Item>
            <Form.Item name="format" label="Định dạng" initialValue="2D">
              <Select>
                <Select.Option value="2D">2D</Select.Option>
                <Select.Option value="3D">3D</Select.Option>
                <Select.Option value="IMAX">IMAX</Select.Option>
              </Select>
            </Form.Item>
          </div>
          <Form.Item name="status" label="Trạng thái" initialValue="SCHEDULED">
            <Select>
              <Select.Option value="SCHEDULED">Sắp chiếu</Select.Option>
              <Select.Option value="ACTIVE">Đang chiếu</Select.Option>
              <Select.Option value="COMPLETED">Đã xong</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
