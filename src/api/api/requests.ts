import type { ServicesResponse, TimeSlotsResponse } from '../../interfaces'
import { getToday } from '../../utils'
import { dbsClient } from './dbsClient'

const DBS_ID=186414

export const getCategory = async () => {
  const { data } = await dbsClient.get(
    `api/booking/locations/${DBS_ID}/employees`
  );

  return data;
};

export const getLocation = async () => {
  const { data } = await dbsClient.get(
    `api/booking/locations`
  );

  return data;
};

export const getServices = async (
  categoryId: number
): Promise<ServicesResponse> => {
  const { data } = await dbsClient.get(
    `api/booking/locations/${DBS_ID}/services?page=1&pageSize=50&employee_id=${categoryId}`
  );

  return data;
};

export const getTimeSlots = async (
  employeeId: number
): Promise<TimeSlotsResponse> => {
  const { data } = await dbsClient.get(
    `api/booking/locations/${DBS_ID}/timeslots:search`,
    {
      params: {
        employee_id: employeeId,
        slot_minutes: 60,
        period_days: 31,
        start_date: getToday(),
      },
    }
  );

  return data;
};

export const createAppointment = async ({
  name,
  phone,
  vin,
  comment,
  employeeId,
  serviceIds,
  dateStart,
  dateEnd
}: {
  name: string
  phone: string
  vin: string
  comment?: string
  employeeId: number
  serviceIds: number[]
  dateStart: string
  dateEnd: string
}) => {
  const { data } = await dbsClient.post(
    `/api/booking/locations/186414/appointment`,
    {
      client: {
      name,
      phone,
      },
      comment,
      vin,
      employee_id: employeeId,
      service_ids: serviceIds,
      date_start: dateStart,
      date_end: dateEnd
    },
    {
      headers: {
        accept: "application/json",
        authorization: "Bearer 7ea69d5e734046ef8e46ec2ea6338ec1"
      }
    }
  )

  return data
}
