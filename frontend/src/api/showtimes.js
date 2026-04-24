import client from "./client";

export const showtimesAPI = {
  getAll: async () => {
    try {
      const response = await client.get("/showtime");
      return response.data?.data ?? response.data ?? [];
    } catch {
      return [];
    }
  },
  getByMovieId: async (movieId) => {
    try {
      const response = await client.get(`/showtime/movie/${movieId}`);
      return response.data?.data ?? response.data ?? [];
    } catch {
      return [];
    }
  },
  getById: async (id) => {
    const response = await client.get(`/showtime/${id}`);
    return response.data?.data ?? response.data;
  },
  create: async (data) => {
    const response = await client.post("/showtime", data);
    return response.data?.data ?? response.data;
  },
  update: async (id, data) => {
    const response = await client.put(`/showtime/${id}`, data);
    return response.data?.data ?? response.data;
  },
  delete: async (id) => {
    await client.delete(`/showtime/${id}`);
  }
};