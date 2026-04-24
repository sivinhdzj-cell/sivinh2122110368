import { useEffect, useState } from "react";
import { Table, Tag, Space, Button, Input, Select, Typography, Card, message, Avatar, Popconfirm } from "antd";
import { SearchOutlined, UserOutlined, LockOutlined, UnlockOutlined, EditOutlined, DeleteOutlined, ReloadOutlined } from "@ant-design/icons";
import { usersAPI } from "../../api/users";
import "../../theme.css";

const { Title, Text } = Typography;
const { Option } = Select;

const ROLE_COLORS = {
  Admin: "magenta",
  Manager: "purple",
  Cashier: "cyan",
  Customer: "blue",
};

export default function UsersManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("Tất cả");
  const [updating, setUpdating] = useState(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await usersAPI.getAll();
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      message.error("Không thể tải danh sách người dùng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggleActive = async (userId, currentStatus) => {
    setUpdating(userId);
    try {
      await usersAPI.toggleActive(userId, !currentStatus);
      message.success(currentStatus ? "Đã khóa tài khoản" : "Đã mở khóa tài khoản");
      loadData();
    } catch (error) {
      message.error("Thao tác thất bại");
    } finally {
      setUpdating(null);
    }
  };

  const handleChangeRole = async (userId, newRole) => {
    setUpdating(userId);
    try {
      await usersAPI.updateRole(userId, newRole);
      message.success("Cập nhật vai trò thành công");
      loadData();
    } catch (error) {
      message.error("Cập nhật thất bại");
    } finally {
      setUpdating(null);
    }
  };

  const handleDelete = async (userId) => {
    try {
      await usersAPI.delete(userId);
      message.success("Đã xóa tài khoản người dùng");
      loadData();
    } catch {
      message.error("Không thể xóa tài khoản này");
    }
  };

  const filteredUsers = users.filter(u => 
    (u.fullName?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase())) &&
    (roleFilter === "Tất cả" || u.role === roleFilter)
  );

  const columns = [
    {
      title: "Người dùng",
      key: "userInfo",
      render: (_, record) => (
        <Space size={12}>
          <Avatar 
            src={`https://i.pravatar.cc/150?u=${record.userId}`} 
            icon={<UserOutlined />} 
            size={44}
            style={{ border: "2px solid var(--accent-pink)" }}
          />
          <div>
            <Text strong style={{ color: "#fff", display: "block" }}>{record.fullName || "N/A"}</Text>
            <Text type="secondary" style={{ fontSize: 12 }}>{record.email}</Text>
          </div>
        </Space>
      ),
    },
    {
      title: "Vai trò",
      dataIndex: "role",
      key: "role",
      render: (role) => (
        <Tag color={ROLE_COLORS[role] || "default"} style={{ borderRadius: 6, fontWeight: 700 }}>
          {role?.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Điểm thưởng",
      dataIndex: "loyaltyPoints",
      key: "loyaltyPoints",
      render: (points) => (
        <Text style={{ color: "var(--accent-pink)", fontWeight: 700 }}>
          ⭐ {points || 0}
        </Text>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive) => (
        <Tag color={isActive ? "success" : "error"} style={{ borderRadius: 6 }}>
          {isActive ? "Hoạt động" : "Bị khóa"}
        </Tag>
      ),
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Select 
            value={record.role} 
            style={{ width: 120 }} 
            size="small"
            onChange={(val) => handleChangeRole(record.userId, val)}
            loading={updating === record.userId}
          >
            <Option value="Customer">Khách hàng</Option>
            <Option value="Cashier">Thu ngân</Option>
            <Option value="Manager">Quản lý</Option>
            <Option value="Admin">Admin</Option>
          </Select>
          <Button 
            size="small"
            danger={record.isActive}
            type={record.isActive ? "primary" : "default"}
            onClick={() => handleToggleActive(record.userId, record.isActive)}
            loading={updating === record.userId}
            icon={record.isActive ? <LockOutlined /> : <UnlockOutlined />}
            style={{ borderRadius: 6 }}
          >
            {record.isActive ? "Khóa" : "Mở"}
          </Button>
          <Popconfirm title="Xóa tài khoản này?" description="Không thể hoàn tác." onConfirm={() => handleDelete(record.userId)} okText="Xóa" cancelText="Hủy" okButtonProps={{ danger: true }}>
            <Button danger ghost icon={<DeleteOutlined />} size="small" style={{ borderRadius: 6 }} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="animate-fade">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
        <Space size={12}>
          <div style={{ width: 48, height: 48, background: "rgba(236, 72, 153, 0.1)", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <UserOutlined style={{ color: "var(--accent-pink)", fontSize: 24 }} />
          </div>
          <div>
            <Title level={2} style={{ margin: 0, fontWeight: 800 }}>Quản lý người dùng</Title>
            <Text type="secondary">Phân quyền và kiểm soát hoạt động của thành viên</Text>
          </div>
        </Space>
        
        <Space size={12}>
          <Input 
            prefix={<SearchOutlined style={{ color: "var(--text-muted)" }} />}
            placeholder="Tìm theo tên hoặc email..."
            style={{ width: 300, borderRadius: 12, height: 44 }}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Select 
            defaultValue="Tất cả" 
            style={{ width: 150, height: 44 }}
            onChange={(val) => setRoleFilter(val)}
          >
            <Option value="Tất cả">Tất cả vai trò</Option>
            <Option value="Admin">Admin</Option>
            <Option value="Manager">Quản lý</Option>
            <Option value="Customer">Khách hàng</Option>
          </Select>
          <Button 
            icon={<EditOutlined />} 
            onClick={loadData}
            style={{ height: 44, borderRadius: 12 }}
          >
            Làm mới
          </Button>
        </Space>
      </div>

      <Card className="stats-card-2026" styles={{ body: { padding: 0 } }}>
        <Table 
          columns={columns} 
          dataSource={filteredUsers} 
          rowKey="userId"
          loading={loading}
          pagination={{ pageSize: 8 }}
          className="modern-table"
        />
      </Card>
    </div>
  );
}
