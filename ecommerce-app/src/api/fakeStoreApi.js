import axios from "axios";

// Base URL is injected at build/runtime via Vite env variable.
// Keeping it configurable avoids hardcoding endpoints in the bundle (12-factor config).
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://fakestoreapi.com";

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 8000,
});

// Attach the JWT (when present) to every outgoing request.
apiClient.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * Authenticate against POST /auth/login.
 * Fake Store API always accepts { username: "mor_2314", password: "83r5^_" } from its docs,
 * but we forward whatever the user typed so the flow is realistic.
 */
export async function login(username, password) {
  const { data } = await apiClient.post("/auth/login", { username, password });
  return data.token;
}

export async function getProducts() {
  const { data } = await apiClient.get("/products");
  return data;
}

export async function getProduct(id) {
  const { data } = await apiClient.get(`/products/${id}`);
  return data;
}

export async function getCategories() {
  const { data } = await apiClient.get("/products/categories");
  return data;
}
