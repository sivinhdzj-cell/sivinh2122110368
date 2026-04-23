import { useEffect, useState } from "react";
import { Card, Table, Tag, message, Typography } from "antd";
import { bookingsAPI } from "../../api/bookings";

export default function MyBookings() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await bookingsAPI.getMyBookings();
        setRows(Array.isArray(data) ? data : []);
      } catch (error) {
        message.error(error?.response?.data?.message || "Không thể tải danh sách booking");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <Card>
      <Typography.Title level={3}>Vé của tôi</Typography.Title>
      <Table
        rowKey={(record, index) => record.bookingId || index}
        loading={loading}
        dataSource={rows}
        columns={[
          { title: "Tên phim", dataIndex: "movieTitle", key: "movieTitle" },
          {
            title: "Rạp",
            key: "cinema",
            render: (_, row) => row.cinemaName || row.roomName || "Đang cập nhật",
          },
          {
            title: "Ghế",
            key: "seats",
            render: (_, row) =>
              Array.isArray(row.seatLabels) && row.seatLabels.length > 0
                ? row.seatLabels.join(", ")
                : row.seatLabel || "Đang cập nhật",
          },
          {
            title: "Thời gian",
            dataIndex: "showtimeStart",
            key: "showtimeStart",
            render: (v) => (v ? new Date(v).toLocaleString("vi-VN") : ""),
          },
          {
            title: "Trạng thái",
            dataIndex: "paymentStatus",
            key: "paymentStatus",
            render: (status) => {
              const isPaid = status === "SUCCESS";
              return <Tag color={isPaid ? "green" : "gold"}>{isPaid ? "Đã thanh toán" : "Đang chờ"}</Tag>;
            },
          },
        ]}
      />
    </Card>
  );
}
