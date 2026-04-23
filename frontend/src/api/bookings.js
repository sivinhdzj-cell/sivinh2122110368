import client from "./client";

export const bookingsAPI = {
  async create(payload) {
    try {
      const response = await client.post("/bookings", payload);
      return response.data?.data ?? response.data;
    } catch (error) {
      if (error?.response?.status === 404) {
        const fallback = await client.post("/booking", payload);
        return fallback.data?.data ?? fallback.data;
      }
      throw error;
    }
  },

  async getMyBookings() {
    try {
      const response = await client.get("/bookings/my");
      return response.data?.data ?? response.data;
    } catch (error) {
      if (error?.response?.status === 404) {
        const fallback = await client.get("/booking/my");
        return fallback.data?.data ?? fallback.data;
      }
      throw error;
    }
  },
};
