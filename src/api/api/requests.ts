import { dbsClient } from './dbsClient'

const DBS_ID=186414

export const getCategory = async () => {
  const { data } = await dbsClient.get(
    `api/booking/locations/${DBS_ID}/employees`
  );

  return data;
};

type Service = {
  id: number;
  title: string;
  description: string;
  durationMinutes: number;
  price: number;
};

type ServicesResponse = {
  count: number;
  page: number;
  pageSize: number;
  totalPages: number;
  data: Service[];
};

export const getServices = async (
  categoryId: number
): Promise<ServicesResponse> => {
  const { data } = await dbsClient.get(
    `api/booking/locations/${DBS_ID}/services?page=1&pageSize=50&employee_id=${categoryId}`
  );

  return data;
};