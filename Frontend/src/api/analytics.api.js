import api from "./axios";

export const getAnalyticsSummary = async () => {
  const response = await api.get("/analytics/summary");
  return response.data;
};

export const getStatusCodeAnalytics = async () => {
  const response = await api.get("/analytics/status-codes");
  return response.data;
};

export const getServiceAnalytics = async () => {
  const response = await api.get("/analytics/services");
  return response.data;
};

export const getTopApiKeysAnalytics = async () => {
  const response = await api.get("/analytics/top-api-keys");
  return response.data;
};

export const getResponseTimeAnalytics = async () => {
  const response = await api.get("/analytics/response-times");
  return response.data;
};

export const getDailyRequestAnalytics = async () => {
  const response = await api.get("/analytics/daily");
  return response.data;
};

export const getErrorRateAnalytics = async () => {
  const response = await api.get("/analytics/error-rate");
  return response.data;
};

export const getGatewayMonitoring = async () => {
  const response = await api.get("/analytics/monitoring");
  return response.data;
};

export const getRateLimitAnalytics = async () => {
  const response = await api.get("/analytics/rate-limits");
  return response.data;
};

export const getRecentRequests = async () => {
  const response = await api.get("/analytics/recent-requests");
  return response.data;
};

export const getEndpointAnalytics = async () => {
  const response = await api.get("/analytics/endpoints");
  return response.data;
};

