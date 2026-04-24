import client, { getWithFallback } from "./client";

export const usersAPI = {
  async getAll() {
    try {
      const response = await client.get("/user");
      return response.data?.data ?? response.data ?? [];
    } catch {
      try {
        const fallback = await client.get("/users");
        return fallback.data?.data ?? fallback.data ?? [];
      } catch {
        return [];
      }
    }
  },
  async getById(id) {
    const response = await client.get(`/user/${id}`);
    return response.data?.data ?? response.data;
  },
  async updateRole(id, role) {
    const response = await client.put(`/user/${id}/role`, { role });
    return response.data?.data ?? response.data;
  },
  async delete(id) {
    await client.delete(`/user/${id}`);
  },
  async toggleActive(id, isActive) {
    const response = await client.put(`/user/${id}`, { isActive });
    return response.data?.data ?? response.data;
  },
};
