import { useQuery } from "@tanstack/react-query";
import {
  getAnalyticsSummary,
  getDailyRequestAnalytics,
  getErrorRateAnalytics,
  getStatusCodeAnalytics,
  getServiceAnalytics,
  getResponseTimeAnalytics,
  getTopApiKeysAnalytics,
  getEndpointAnalytics,
} from "../../../api/analytics.api";

export const useEndpointAnalytics = () => {
  return useQuery({
    queryKey: ["analytics", "endpoints"],
    queryFn: getEndpointAnalytics,
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

export const useTopApiKeysAnalytics = () => {
  return useQuery({
    queryKey: ["analytics", "top-api-keys"],
    queryFn: getTopApiKeysAnalytics,
    staleTime: 30 * 1000,
  });
};

export const useDailyRequestAnalytics = () => {
  return useQuery({
    queryKey: ["analytics", "daily"],
    queryFn: getDailyRequestAnalytics,
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

export const useAnalyticsSummary = () => {
  return useQuery({
    queryKey: ["analytics", "summary"],
    queryFn: getAnalyticsSummary,
    staleTime: 30 * 1000,
  });
};
