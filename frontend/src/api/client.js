import axios from "axios";

const client = axios.create({
  baseURL: "http://localhost:5269/api",
  timeout: 15000,
});

client.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export async function getWithFallback(paths, config) {
  let lastError;
  for (const path of paths) {
    try {
      return await client.get(path, config);
    } catch (error) {
      lastError = error;
      if (error?.response?.status !== 404) {
        throw error;
      }
    }
  }
  throw lastError;
}

export default client;
