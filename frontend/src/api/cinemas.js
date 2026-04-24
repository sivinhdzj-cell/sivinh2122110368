import client, { getWithFallback } from "./client";

export const cinemasAPI = {
  async getAll() {
    const response = await getWithFallback("/cinema");
    return response.data?.data ?? response.data ?? [];
  },
  async getById(id) {
    const response = await getWithFallback(`/cinema/${id}`);
    return response.data?.data ?? response.data;
  },
  async create(payload) {
    const response = await client.post("/cinema", payload);
    return response.data?.data ?? response.data;
  },
  async update(id, payload) {
    const response = await client.put(`/cinema/${id}`, payload);
    return response.data?.data ?? response.data;
  },
  async delete(id) {
    const response = await client.delete(`/cinema/${id}`);
    return response.data?.data ?? response.data;
  },
};
