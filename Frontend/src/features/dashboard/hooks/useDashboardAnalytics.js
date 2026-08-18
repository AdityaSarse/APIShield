import { useQuery } from "@tanstack/react-query";

import {
  getAnalyticsSummary,
  getGatewayMonitoring,
  getDailyRequestAnalytics,
  getServiceAnalytics,
  getStatusCodeAnalytics,
  getTopApiKeysAnalytics,
  getResponseTimeAnalytics,
  getErrorRateAnalytics,
  getRateLimitAnalytics,
  getRecentRequests,
} from "../../../api/analytics.api";

export const useDashboardSummary = () => {
  return useQuery({
    queryKey: ["analytics", "summary"],
    queryFn: getAnalyticsSummary,
    staleTime: 30 * 1000,
  });
};

export const useGatewayMonitoring = () => {
  return useQuery({
    queryKey: ["analytics", "monitoring"],
    queryFn: getGatewayMonitoring,
    staleTime: 10 * 1000,
    refetchInterval: 10 * 1000,
  });
};

export const useDailyRequestAnalytics = () => {
  return useQuery({
    queryKey: ["analytics", "daily"],
    queryFn: getDailyRequestAnalytics,
    staleTime: 30 * 1000,
  });
};

export const useServiceAnalytics = () => {
  return useQuery({
    queryKey: ["analytics", "services"],
    queryFn: getServiceAnalytics,
    staleTime: 30 * 1000,
  });
};

export const useStatusCodeAnalytics = () => {
  return useQuery({
    queryKey: ["analytics", "status-codes"],
    queryFn: getStatusCodeAnalytics,
    staleTime: 30 * 1000,
  });
};

export const useTopApiKeysAnalytics = () => {
  return useQuery({
    queryKey: ["analytics", "top-api-keys"],
    queryFn: getTopApiKeysAnalytics,
    staleTime: 30 * 1000,
  });
};

export const useResponseTimeAnalytics = () => {
  return useQuery({
    queryKey: ["analytics", "response-times"],
    queryFn: getResponseTimeAnalytics,
    staleTime: 30 * 1000,
  });
};

export const useErrorRateAnalytics = () => {
  return useQuery({
    queryKey: ["analytics", "error-rate"],
    queryFn: getErrorRateAnalytics,
    staleTime: 30 * 1000,
  });
};

export const useRateLimitAnalytics = () => {
  return useQuery({
    queryKey: ["analytics", "rate-limits"],
    queryFn: getRateLimitAnalytics,
    staleTime: 10 * 1000,
    refetchInterval: 10 * 1000,
  });
};

export const useRecentRequests = () => {
  return useQuery({
    queryKey: ["analytics", "recent-requests"],
    queryFn: getRecentRequests,
    staleTime: 10 * 1000,
    refetchInterval: 10 * 1000,
  });
};
