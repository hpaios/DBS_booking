import { apiClient } from "./client";

export const getCategory = async (locationId: number) => {
  const { data } = await apiClient.get(
    `/booking/locations/${locationId}/employees`
  );

  return data;
};
