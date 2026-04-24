import client, { getWithFallback } from "./client";

export const moviesAPI = {
  async getAll() {
    const response = await getWithFallback(["/movie", "/movies"]);
    return response.data?.data ?? response.data;
  },

  async getById(id) {
    const response = await getWithFallback([`/movie/${id}`, `/movies/${id}`]);
    return response.data?.data ?? response.data;
  },

  async getShowtimes() {
    const response = await getWithFallback(["/showtime", "/showtimes"]);
    return response.data?.data ?? response.data;
  },

  async getSeatsByShowtime(showtimeId) {
    try {
      const response = await client.get(`/booking/seatmap/${showtimeId}`);
      return response.data?.data ?? response.data;
    } catch (error) {
      if (error?.response?.status === 404) {
        const fallback = await client.get(`/showtimes/${showtimeId}/seats`);
        return fallback.data?.data ?? fallback.data;
      }
      throw error;
    }
  },

  async create(data) {
    const response = await client.post("/movie", data);
    return response.data?.data ?? response.data;
  },

  async update(id, data) {
    const response = await client.put(`/movie/${id}`, data);
    return response.data?.data ?? response.data;
  },

  async delete(id) {
    const response = await client.delete(`/movie/${id}`);
    return response.data?.data ?? response.data;
  }
};
