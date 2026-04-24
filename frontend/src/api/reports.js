import client from "./client";

export const reportsAPI = {
  getDashboardStats: async () => {
    const response = await client.get("/reports/dashboard-stats");
    return response.data?.data ?? response.data;
  },
  getRecentBookings: async () => {
    const response = await client.get("/reports/recent-bookings");
    return response.data?.data ?? response.data;
  },
  getRevenueByDate: async (params) => {
    const response = await client.get("/reports/revenue-by-date", { params });
    return response.data?.data ?? response.data ?? [];
  }
};
