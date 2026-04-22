// import axios from 'axios'
// import type { ServicesResponse, TimeSlotsResponse } from '../../interfaces'
// import { getToday } from '../../utils'
import type { ServicesResponse, TimeSlotsResponse } from '../../interfaces'
import { getToday } from '../../utils'
import { dbsClient } from './dbsClient'
// import { roapiClient } from './roapiClient'

import axios from 'axios'

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

// export const createClient = async ({
//   first_name,
//   phone,
//   email,
// }: {
//   first_name: string
//   phone: string
//   email: string
// }) => {
//   const res = await fetch('/roapi/contacts/people', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       Authorization: `Bearer ${import.meta.env.VITE_ROAPP_TOKEN}`,
//     },
//     body: JSON.stringify({
//       first_name,
//       phone,
//       email,
//     }),
//   })

//   return res.json()
// }

// export const createAppointment = async ({
//   clientId,
//   name,
//   phone,
//   vin,
//   comment,
//   employeeId,
//   serviceIds,
//   dateStart,
//   dateEnd
// }: {
//   clientId: number
//   name: string
//   phone: string
//   vin: string
//   comment?: string
//   employeeId: number
//   serviceIds: number[],
//   dateStart: string
//   dateEnd: string
// }) => {
//   const { data } = await roapiClient.post(
//     // `/api/booking/locations/186414/appointment`,
//     `/bookings`,
//     {
//       client: {
//       name,
//       phone,
//       },
//       comment,
//       vin,
//       employee_id: employeeId,
//       serviceIds,
//       // date_start: dateStart,
//       // date_end: dateEnd,
//       branch_id: DBS_ID,
//       assignee_id: employeeId,
//       scheduled_for: dateStart,
//       scheduled_to: dateEnd,

//       // order_type_id: 344068,
//       client_id: clientId
//     },
//     {
//       headers: {
//         accept: "application/json",
//         authorization: "Bearer 7ea69d5e734046ef8e46ec2ea6338ec1"
//       }
//     }
//   )

//   return { data }
// }

// export const findClientByEmail = async (email: string) => {
//   const { data } = await roapiClient.get('/contacts/people', {
//     headers: {
//       accept: 'application/json',
//       authorization: `Bearer ${import.meta.env.VITE_ROAPP_TOKEN}`,
//     },
//   })

//   const clients = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : []

//   console.log(clients.find((client: {email: string, id: number}) => 
//     client.email === email
//   ))

//   return clients.find((client: {email: string, id: number}) => 
//     client.email === email
//   )?.id || null
// }

// export const findClientByPhone = async (phone: string) => {
//   const { data } = await roapiClient.get(
//     `/contacts/people?phones=${encodeURIComponent(phone)}`,
//     {
//       headers: {
//         accept: 'application/json',
//         authorization: `Bearer ${import.meta.env.VITE_ROAPP_TOKEN}`,
//       },
//     }
//   )

//   const people = data?.data || data || []

//   return people[0].id || null
// }

// export const findClientByPhone = async (phone: string) => {
//   const { data } = await axios.get('/api/roapp/find-client-by-phone', {
//     params: { phone },
//   })

//   return data?.clientId || null
// }

// export const getOrCreateClient = async ({
//   first_name,
//   phone,
//   email,
// }: {
//   first_name: string
//   phone: string
//   email: string
// }) => {
//   const existingClient = await findClientByPhone(phone)

//   if (existingClient) {
//     return existingClient
//   }

//   const createdClient = await createClient({
//     first_name,
//     phone,
//     email,
//   })

//   return createdClient?.data?.id || createdClient?.id || null
// }


// export const getOrCreateClient = async ({
//   first_name,
//   phone,
//   email,
// }: {
//   first_name: string
//   phone: string
//   email: string
// }) => {
//   const existingClientRes = await findClientByPhone(phone)

//   console.log(existingClientRes)

//   if (existingClientRes?.ok && existingClientRes?.clientId) {
//     return existingClientRes.clientId
//   }

//   const createdClientRes = await createClient({
//     first_name,
//     phone,
//     email,
//   })

//   if (createdClientRes?.ok && createdClientRes?.clientId) {
//     return createdClientRes.clientId
//   }

//   return null
// }

export const findClientByPhone = async (phone: string) => {
  const { data } = await axios.get('/api/roapp/find-client-by-phone', {
    params: { phone },
  })

  return data?.clientId || null
}

export const createClient = async ({
  first_name,
  phone,
  email,
}: {
  first_name: string
  phone: string
  email: string
}) => {
  const { data } = await axios.post('/api/roapp/create-client', {
    first_name,
    phone,
    email,
  })

  return data?.clientId || null
}

export const getOrCreateClient = async ({
  first_name,
  phone,
  email,
}: {
  first_name: string
  phone: string
  email: string
}) => {
  const existingClientId = await findClientByPhone(phone)

  if (existingClientId) {
    return existingClientId
  }

  const createdClientId = await createClient({
    first_name,
    phone,
    email,
  })

  return createdClientId || null
}

export const createAppointment = async ({
  client,
  vin,
  comment,
  employeeId,
  serviceIds,
  dateStart,
  dateEnd,
}: {
  client: {
    name: string
    phone: string
    email: string
  },
  vin: string
  comment?: string
  employeeId: number
  serviceIds: number[]
  dateStart: string
  dateEnd: string
}) => {
  const { data } = await dbsClient.post(
    // '/api/booking/locations/186414/appointment',
    '/api/orders',
    {
      client,
      vin,
      comment,
      employee_id: employeeId,
      service_ids: serviceIds,
      date_start: dateStart,
      date_end: dateEnd,
    }
  )

  return { data }
}