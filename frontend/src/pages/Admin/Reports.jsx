import { useEffect, useState } from "react";
import { Card, Table, DatePicker, Space, Button, message, Typography } from "antd";
import dayjs from "dayjs";
import { reportsAPI } from "../../api/reports";

export default function Reports() {
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState([]);
  const [fromDate, setFromDate] = useState(dayjs().startOf("month"));
  const [toDate, setToDate] = useState(dayjs());

  const load = async () => {
    try {
      setLoading(true);
      const data = await reportsAPI.getRevenueByDate({
        fromDate: fromDate.format("YYYY-MM-DD"),
        toDate: toDate.format("YYYY-MM-DD"),
      });
      setRows(Array.isArray(data) ? data : []);
    } catch (error) {
      message.error(
        error?.response?.data?.message ||
          "Không tải được báo cáo. Hãy kiểm tra endpoint /reports/revenue-by-date ở backend."
      );
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <Card>
      <Space direction="vertical" size={16} style={{ width: "100%" }}>
        <Typography.Title level={3} style={{ margin: 0 }}>
          Báo cáo doanh thu theo ngày
        </Typography.Title>
        <Space wrap>
          <DatePicker value={fromDate} onChange={(d) => d && setFromDate(d)} />
          <DatePicker value={toDate} onChange={(d) => d && setToDate(d)} />
          <Button type="primary" onClick={load} loading={loading}>
            Lọc báo cáo
          </Button>
        </Space>
        <Table
          rowKey={(record, index) => record.date || index}
          loading={loading}
          dataSource={rows}
          columns={[
            { title: "Ngày", dataIndex: "date", key: "date" },
            { title: "Số booking", dataIndex: "bookingCount", key: "bookingCount" },
            { title: "Số vé bán", dataIndex: "ticketsSold", key: "ticketsSold" },
            {
              title: "Doanh thu",
              dataIndex: "totalRevenue",
              key: "totalRevenue",
              render: (v) => Number(v || 0).toLocaleString("vi-VN") + " đ",
            },
          ]}
        />
      </Space>
    </Card>
  );
}
