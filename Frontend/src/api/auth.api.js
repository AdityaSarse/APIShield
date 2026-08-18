import api from "./axios";

export async function login(credentials) {
  const response = await api.post("/auth/login", credentials);
  return response.data;
}

export async function logout() {
  try {
    await api.post("/auth/logout");
  } finally {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
  }
}
