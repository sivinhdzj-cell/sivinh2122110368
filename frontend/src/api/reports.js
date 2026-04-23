import client from "./client";

export const reportsAPI = {
  async getRevenueByDate(params = {}) {
    const response = await client.get("/reports/revenue-by-date", { params });
    return response.data?.data ?? response.data;
  },

  async getMoviePerformance(params = {}) {
    const response = await client.get("/reports/movie-performance", { params });
    return response.data?.data ?? response.data;
  },
};
