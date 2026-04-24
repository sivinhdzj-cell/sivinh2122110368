import client from "./client";

export const bookingsAPI = {
  async create(payload) {
    try {
      const response = await client.post("/booking", payload);
      return response.data?.data ?? response.data;
    } catch (error) {
      if (error?.response?.status === 404) {
        const fallback = await client.post("/bookings", payload);
        return fallback.data?.data ?? fallback.data;
      }
      throw error;
    }
  },

  async getMyBookings() {
    try {
      const response = await client.get("/booking/my");
      return response.data?.data ?? response.data;
    } catch (error) {
      if (error?.response?.status === 404) {
        const fallback = await client.get("/bookings/my");
        return fallback.data?.data ?? fallback.data;
      }
      throw error;
    }
  },
  
  async confirmPayment(code) {
    const response = await client.post(`/booking/confirm-payment/${code}`);
    return response.data;
  },

  async confirmMomo(payload) {
    const response = await client.post("/booking/confirm-momo", payload);
    return response.data?.data ?? response.data;
  },
  
  async getAll() {
    const response = await client.get("/booking/all");
    return response.data?.data ?? response.data ?? [];
  },

  async delete(id) {
    await client.delete(`/booking/${id}`);
  }
};
