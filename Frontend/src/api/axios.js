import axios from "axios";

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL ||
    "http://localhost:5000/api/v1",

  headers: {
    "Content-Type": "application/json",
  },

  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const isAuthRequest =
      config.url?.startsWith("/auth/login") ||
      config.url?.startsWith("/auth/register") ||
      config.url?.startsWith("/auth/refresh");

    if (!isAuthRequest) {
      const token = localStorage.getItem("accessToken");

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    // Don't treat failed login as an expired session.
    const requestUrl = error.config?.url || "";

    const isAuthRequest =
      requestUrl.startsWith("/auth/login") ||
      requestUrl.startsWith("/auth/register");

    if (error.response?.status === 401 && !isAuthRequest) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
    }

    return Promise.reject(error);
  }
);

export default api;
