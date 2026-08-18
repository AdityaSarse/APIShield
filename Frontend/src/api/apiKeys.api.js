import api from "./axios";

export const getApiKeys = async () => {
  const response = await api.get("/apikeys");
  return response.data;
};

export const getApiKey = async (id) => {
  const response = await api.get(`/apikeys/${id}`);
  return response.data;
};

export const createApiKey = async (data) => {
  const response = await api.post("/apikeys", data);
  return response.data;
};

export const revokeApiKey = async (id) => {
  const response = await api.patch(`/apikeys/${id}/revoke`);
  return response.data;
};

export const rotateApiKey = async (id) => {
  const response = await api.patch(`/apikeys/${id}/rotate`);
  return response.data;
};
