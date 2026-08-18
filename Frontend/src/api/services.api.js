import api from "./axios";

export const getServicesList = async () => {
  const response = await api.get("/analytics/services");
  return response.data;
};
