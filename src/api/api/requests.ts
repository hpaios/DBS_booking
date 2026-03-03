import { dbsClient } from './dbsClient'

const DBS_ID=186414

export const getCategory = async () => {
  const { data } = await dbsClient.get(
    `api/booking/locations/${DBS_ID}/employees`
  );

  return data;
};
