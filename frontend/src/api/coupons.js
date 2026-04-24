import client, { getWithFallback } from "./client";

export const couponsAPI = {
  async getAll() {
    const response = await getWithFallback("/coupon");
    return response.data?.data ?? response.data ?? [];
  },
  async create(payload) {
    const response = await client.post("/coupon", payload);
    return response.data?.data ?? response.data;
  },
  async update(id, payload) {
    const response = await client.put(`/coupon/${id}`, payload);
    return response.data?.data ?? response.data;
  },
  async delete(id) {
    const response = await client.delete(`/coupon/${id}`);
    return response.data?.data ?? response.data;
  },
  async validate(payload) {
    const response = await client.post("/booking/coupon/validate", payload);
    return response.data?.data ?? response.data;
  },
};
