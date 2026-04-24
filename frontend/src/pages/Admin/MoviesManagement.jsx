import { useEffect, useState } from "react";
import { Button, Card, Space, Table, Typography, Tag, message, Modal, Form, Input, InputNumber, Popconfirm, Image } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, VideoCameraOutlined } from "@ant-design/icons";
import { moviesAPI } from "../../api/movies";
import { getSafePosterUrl } from "../../utils/image";
import "../../theme.css";

const { Title, Text } = Typography;

export default function MoviesManagement() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);
  const [form] = Form.useForm();

  const loadMovies = async () => {
    setLoading(true);
    try {
      const data = await moviesAPI.getAll();
      setMovies(data);
    } catch (error) {
      message.error("Không thể tải danh sách phim");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMovies();
  }, []);

  const handleAdd = () => {
    setEditingMovie(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEdit = (movie) => {
    setEditingMovie(movie);
    form.setFieldsValue(movie);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await moviesAPI.delete(id);
      message.success("Xóa phim thành công");
      loadMovies();
    } catch (error) {
      message.error("Lỗi khi xóa phim");
    }
  };

  const handleSubmit = async (values) => {
    try {
      if (editingMovie) {
        await moviesAPI.update(editingMovie.movieId, values);
        message.success("Cập nhật phim thành công");
      } else {
        await moviesAPI.create(values);
        message.success("Thêm phim mới thành công");
      }
      setIsModalOpen(false);
      loadMovies();
    } catch (error) {
      message.error("Lỗi khi lưu thông tin");
    }
  };

  const columns = [
    {
      title: "Phim",
      key: "movieInfo",
      render: (_, record) => (
        <Space size={16}>
          <Image
            src={getSafePosterUrl(record.posterUrl)}
            width={60}
            style={{ borderRadius: 8, objectFit: "cover" }}
            fallback="https://placehold.co/400x600?text=No+Poster"
          />
          <div>
            <Text strong style={{ fontSize: 16, color: "#fff", display: "block" }}>{record.title}</Text>
            <Tag color="blue" style={{ marginTop: 4 }}>{record.genre || "N/A"}</Tag>
          </div>
        </Space>
      ),
    },
    { 
      title: "Thời lượng", 
      dataIndex: "durationMin", 
      key: "durationMin",
      render: (min) => <Text style={{ color: "#cbd5e1" }}>{min} phút</Text>
    },
    { 
      title: "Trạng thái", 
      dataIndex: "status", 
      key: "status",
      render: (status) => (
        <Tag color={status === "Đang chiếu" ? "success" : "warning"} style={{ borderRadius: 6 }}>
          {status || "Đang chiếu"}
        </Tag>
      )
    },
    { 
      title: "Thao tác", 
      key: "actions", 
      render: (_, record) => (
        <Space>
          <Button 
            type="primary" 
            ghost 
            icon={<EditOutlined />} 
            onClick={() => handleEdit(record)}
            style={{ borderRadius: 8, borderColor: "#8b5cf6", color: "#8b5cf6" }}
          />
          <Popconfirm title="Xóa phim này?" onConfirm={() => handleDelete(record.movieId)} okText="Xóa" cancelText="Hủy">
            <Button 
              danger 
              ghost 
              icon={<DeleteOutlined />} 
              style={{ borderRadius: 8 }}
            />
          </Popconfirm>
        </Space>
      ) 
    },
  ];

  return (
    <div className="animate-fade">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
        <Space size={12}>
          <div style={{ width: 48, height: 48, background: "rgba(139, 92, 246, 0.1)", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <VideoCameraOutlined style={{ color: "#8b5cf6", fontSize: 24 }} />
          </div>
          <div>
            <Title level={2} style={{ margin: 0, color: "#fff", fontWeight: 800 }}>Quản lý phim</Title>
            <Text type="secondary">Cập nhật và điều chỉnh danh sách phim trong hệ thống</Text>
          </div>
        </Space>
        <Button 
          type="primary" 
          size="large" 
          icon={<PlusOutlined />} 
          onClick={handleAdd}
          style={{ 
            background: "var(--primary-gradient)", 
            border: "none", 
            height: 48, 
            padding: "0 24px", 
            borderRadius: 14,
            boxShadow: "0 10px 20px rgba(139, 92, 246, 0.3)"
          }}
        >
          Thêm phim mới
        </Button>
      </div>

      <Card className="stats-card-2026" styles={{ body: { padding: 0 } }}>
        <Table
          loading={loading}
          dataSource={movies}
          columns={columns}
          rowKey="movieId"
          className="modern-table"
          pagination={{ pageSize: 8 }}
        />
      </Card>

      <Modal
        title={
          <Title level={4} style={{ margin: 0 }}>
            {editingMovie ? "Cập nhật thông tin phim" : "Thêm phim mới vào rạp"}
          </Title>
        }
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        okText={editingMovie ? "Cập nhật" : "Thêm ngay"}
        cancelText="Hủy"
        width={600}
        centered
        styles={{ body: { paddingTop: 20 } }}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="title" label="Tên phim" rules={[{ required: true, message: "Vui lòng nhập tên phim" }]}>
            <Input placeholder="Ví dụ: Avengers: Endgame" />
          </Form.Item>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <Form.Item name="genre" label="Thể loại" rules={[{ required: true }]}>
              <Input placeholder="Hành động, Phiêu lưu..." />
            </Form.Item>
            <Form.Item name="durationMin" label="Thời lượng (phút)" rules={[{ required: true }]}>
              <InputNumber min={1} style={{ width: "100%" }} />
            </Form.Item>
          </div>

          <Form.Item name="posterUrl" label="Đường dẫn Poster (URL)">
            <Input placeholder="https://..." />
          </Form.Item>

          <Form.Item name="description" label="Mô tả phim">
            <Input.TextArea rows={4} placeholder="Tóm tắt nội dung phim..." />
          </Form.Item>
          
          <Form.Item name="status" label="Trạng thái" initialValue="Đang chiếu">
            <Input placeholder="Đang chiếu / Ngừng chiếu" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
