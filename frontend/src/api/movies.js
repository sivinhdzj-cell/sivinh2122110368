import client, { getWithFallback } from "./client";

export const moviesAPI = {
  async getAll() {
    const response = await getWithFallback(["/movies", "/movie"]);
    return response.data?.data ?? response.data;
  },

  async getById(id) {
    const response = await getWithFallback([`/movies/${id}`, `/movie/${id}`]);
    return response.data?.data ?? response.data;
  },

  async getShowtimes() {
    const response = await getWithFallback(["/showtimes", "/showtime"]);
    return response.data?.data ?? response.data;
  },

  async getSeatsByShowtime(showtimeId) {
    try {
      const response = await client.get(`/showtimes/${showtimeId}/seats`);
      return response.data?.data ?? response.data;
    } catch (error) {
      if (error?.response?.status === 404) {
        const fallback = await client.get(`/booking/seatmap/${showtimeId}`);
        return fallback.data?.data ?? fallback.data;
      }
      throw error;
    }
  },
};
