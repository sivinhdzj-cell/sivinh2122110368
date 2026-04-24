import client, { getWithFallback } from "./client";

export const roomsAPI = {
  async getAll() {
    const response = await getWithFallback("/room");
    return response.data?.data ?? response.data ?? [];
  },
  async getByCinemaId(cinemaId) {
    const all = await this.getAll();
    return all.filter(r => r.cinemaId === cinemaId);
  },
  async getById(id) {
    const response = await getWithFallback(`/room/${id}`);
    return response.data?.data ?? response.data;
  },
  async create(payload) {
    const response = await client.post("/room", payload);
    return response.data?.data ?? response.data;
  },
  async update(id, payload) {
    const response = await client.put(`/room/${id}`, payload);
    return response.data?.data ?? response.data;
  },
  async delete(id) {
    const response = await client.delete(`/room/${id}`);
    return response.data?.data ?? response.data;
  },
};
