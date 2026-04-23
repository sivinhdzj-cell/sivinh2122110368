import client from "./client";

export const authAPI = {
  async register(userData) {
    const response = await client.post("/auth/register", userData);
    return response.data?.data ?? response.data;
  },

  async login(credentials) {
    const response = await client.post("/auth/login", credentials);
    return response.data?.data ?? response.data;
  },
};
