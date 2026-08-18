import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getApiKeys,
  getApiKey,
  createApiKey,
  revokeApiKey,
  rotateApiKey,
} from "../../../api/apiKeys.api";

export const useApiKeysList = () => {
  return useQuery({
    queryKey: ["apikeys"],
    queryFn: getApiKeys,
    staleTime: 30 * 1000,
  });
};

export const useApiKeyDetails = (id) => {
  return useQuery({
    queryKey: ["apikeys", id],
    queryFn: () => getApiKey(id),
    enabled: Boolean(id),
  });
};

export const useCreateApiKey = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createApiKey,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["apikeys"] });
    },
  });
};

export const useRevokeApiKey = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: revokeApiKey,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["apikeys"] });
    },
  });
};

export const useRotateApiKey = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: rotateApiKey,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["apikeys"] });
    },
  });
};
