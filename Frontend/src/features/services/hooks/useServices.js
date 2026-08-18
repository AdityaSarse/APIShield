import { useQuery } from "@tanstack/react-query";
import { getServicesList } from "../../../api/services.api";

export const useServices = () => {
  return useQuery({
    queryKey: ["services", "list"],
    queryFn: getServicesList,
    staleTime: 10 * 1000,
  });
};
