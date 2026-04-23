import client from "./client";

export const bookingsAPI = {
  async create(payload) {
    const response = await client.post("/bookings", payload);
    return response.data?.data ?? response.data;
  },

  async getMyBookings() {
    const response = await client.get("/booking/my");
    return response.data?.data ?? response.data;
  },
};
