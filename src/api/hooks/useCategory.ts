import { useQuery } from "@tanstack/react-query";
import { getCategory } from "../api/requests";

export const useCategory = (locationId?: number) => {
  return useQuery({
    queryKey: ["employees", locationId],
    queryFn: () => getCategory(locationId!),
    enabled: !!locationId, // запит тільки якщо є id
  });
};
