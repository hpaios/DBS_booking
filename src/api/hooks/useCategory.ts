import { useQuery } from "@tanstack/react-query";
import { getCategory } from "../api/requests";

export const useCategory = () => {
  return useQuery({
    queryKey: ["employees"],
    queryFn: getCategory,
    staleTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
    retry: 1, 
  });
};
