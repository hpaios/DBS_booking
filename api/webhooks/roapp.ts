// import type { VercelRequest, VercelResponse } from '@vercel/node'
// import axios from 'axios'

// const ROAPP_API_KEY = process.env.ROAPP_API_KEY
// const ROAPP_API_BASE_URL = process.env.ROAPP_API_BASE_URL || 'https://api.roapp.io/v2'

// const WAZZUP_API_KEY = process.env.WAZZUP_API_KEY
// const WAZZUP_API_BASE_URL = process.env.WAZZUP_API_BASE_URL || 'https://api.wazzup24.com/v3'
// const WAZZUP_CHANNEL_ID = process.env.WAZZUP_CHANNEL_ID
// const WAZZUP_CHAT_TYPE = process.env.WAZZUP_CHAT_TYPE || 'whatsapp'

// type RoappWebhookPayload = {
//   id?: string
//   created_at?: string
//   event_name?: string
//   context?: {
//     object_id?: number
//     object_type?: string
//   }
//   metadata?: Record<string, unknown>
//   employee?: {
//     id?: number
//     full_name?: string
//     email?: string
//   }
// }

// type OrderDetails = {
//   clientFirstName: string
//   phone: string | null
//   bookingDate: string
//   bookingTime: string
// }

// function normalizePhone(phone: unknown): string | null {
//   if (!phone) return null

//   const digits = String(phone).replace(/\D/g, '')

//   if (!digits) return null

//   return digits
// }

// function getFirstName(fullName: unknown): string {
//   if (!fullName) return 'zákazníku'

//   const value = String(fullName).trim()
//   if (!value) return 'zákazníku'

//   return value.split(/\s+/)[0]
// }

// function formatDateCs(dateString: unknown): string {
//   if (!dateString) return '—'

//   const date = new Date(String(dateString))

//   if (Number.isNaN(date.getTime())) return '—'

//   return new Intl.DateTimeFormat('cs-CZ', {
//     day: '2-digit',
//     month: '2-digit',
//     year: 'numeric',
//   }).format(date)
// }

// function formatTimeCs(dateString: unknown): string {
//   if (!dateString) return '—'

//   const date = new Date(String(dateString))

//   if (Number.isNaN(date.getTime())) return '—'

//   return new Intl.DateTimeFormat('cs-CZ', {
//     hour: '2-digit',
//     minute: '2-digit',
//   }).format(date)
// }

// function mapOrderDetails(order: Record<string, unknown>): OrderDetails {
//   const client =
//     order?.client ||
//     order?.customer ||
//     order?.contact ||
//     order?.client_data ||
//     null

//   const fullName =
//     client?.full_name ||
//     client?.name ||
//     order?.client_name ||
//     order?.customer_name ||
//     order?.name ||
//     null

//   const phone =
//     client?.phone ||
//     client?.phone_number ||
//     client?.formatted_phone ||
//     order?.phone ||
//     order?.client_phone ||
//     null

//   const startAt =
//     order?.start_at ||
//     order?.startAt ||
//     order?.scheduled_at ||
//     order?.date_start ||
//     order?.created_at ||
//     null

//   return {
//     clientFirstName: getFirstName(fullName),
//     phone: normalizePhone(phone),
//     bookingDate: formatDateCs(startAt),
//     bookingTime: formatTimeCs(startAt),
//   }
// }

// function buildOrderCreatedMessage(data: OrderDetails): string {
//   return [
//     `Dobrý den, ${data.clientFirstName}. Děkujeme za váš zájem o DBS Autoservis & Detailing! Vaši poptávku jsme v pořádku přijali. Brzy se s vámi telefonicky spojíme, abychom probrali detaily. Přejeme hezký den, tým DBS`
//   ].join('\n')
// }

// async function getOrderById(orderId: number) {
//   if (!ROAPP_API_KEY) {
//     throw new Error('ROAPP_API_KEY is missing')
//   }

//   const response = await axios.get(`${ROAPP_API_BASE_URL}/orders/${orderId}`, {
//     headers: {
//       Authorization: `Bearer ${ROAPP_API_KEY}`,
//       Accept: 'application/json',
//     },
//     timeout: 15000,
//   })

//   return response.data
// }

// async function sendWazzupMessage({
//   phone,
//   text,
//   crmMessageId,
// }: {
//   phone: string
//   text: string
//   crmMessageId: string
// }) {
//   if (!WAZZUP_API_KEY) {
//     throw new Error('WAZZUP_API_KEY is missing')
//   }

//   if (!WAZZUP_CHANNEL_ID) {
//     throw new Error('WAZZUP_CHANNEL_ID is missing')
//   }

//   const response = await axios.post(
//     `${WAZZUP_API_BASE_URL}/message`,
//     {
//       channelId: WAZZUP_CHANNEL_ID,
//       chatType: WAZZUP_CHAT_TYPE,
//       chatId: phone,
//       text,
//       crmMessageId,
//     },
//     {
//       headers: {
//         Authorization: `Bearer ${WAZZUP_API_KEY}`,
//         'Content-Type': 'application/json',
//       },
//       timeout: 15000,
//     }
//   )

//   return response.data
// }

// export default async function handler(
//   req: VercelRequest,
//   res: VercelResponse
// ) {
//   if (req.method !== 'POST') {
//     return res.status(405).json({ ok: false, error: 'Method not allowed' })
//   }

//   const payload = req.body as RoappWebhookPayload

//   console.log('Incoming ROAPP webhook:', JSON.stringify(payload, null, 2))

//   if (payload?.event_name !== 'Order.Created') {
//     return res.status(200).json({
//       ok: true,
//       ignored: true,
//       reason: `Unsupported event: ${payload?.event_name || 'unknown'}`,
//     })
//   }

//   const orderId = payload?.context?.object_id

//   if (!orderId) {
//     return res.status(400).json({
//       ok: false,
//       error: 'Missing context.object_id',
//     })
//   }

//   try {
//     const orderResponse = await getOrderById(orderId)
//     console.log('ROAPP order response:', JSON.stringify(orderResponse, null, 2))

//     const order = orderResponse?.data || orderResponse
//     const mappedOrder = mapOrderDetails(order)

//     if (!mappedOrder.phone) {
//       return res.status(400).json({
//         ok: false,
//         error: 'Phone not found in order response',
//       })
//     }

//     const messageText = buildOrderCreatedMessage(mappedOrder)

//     const wazzupResponse = await sendWazzupMessage({
//       phone: mappedOrder.phone,
//       text: messageText,
//       crmMessageId: String(orderId),
//     })

//     console.log('WAZZUP response:', JSON.stringify(wazzupResponse, null, 2))

//     return res.status(200).json({
//       ok: true,
//       event: payload.event_name,
//       orderId,
//       phone: mappedOrder.phone,
//       bookingDate: mappedOrder.bookingDate,
//       bookingTime: mappedOrder.bookingTime,
//     })
//   } catch (error) {
//     if (axios.isAxiosError(error)) {
//       console.error('Axios error:', {
//         message: error.message,
//         status: error.response?.status,
//         data: error.response?.data,
//       })
//     } else {
//       console.error('Unexpected error:', error)
//     }

//     return res.status(500).json({
//       ok: false,
//       error: 'Webhook processing failed',
//     })
//   }
// }

import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  console.log('==============================')
  console.log('🔥 WEBHOOK HIT')
  console.log('Method:', req.method)

  try {
    console.log('Headers:', JSON.stringify(req.headers, null, 2))
  } catch (e) {
    console.log('Headers parse error')
  }

  try {
    console.log('Body:', JSON.stringify(req.body, null, 2))
  } catch (e) {
    console.log('Body parse error')
  }

  console.log('==============================')

  // 👉 для проверки что endpoint живой
  if (req.method === 'GET') {
    return res.status(200).json({
      ok: true,
      message: 'Webhook endpoint is alive 🚀',
    })
  }

  // 👉 если не POST — просто отвечаем
  if (req.method !== 'POST') {
    return res.status(200).json({
      ok: false,
      message: 'Not a POST, but ok',
    })
  }

  // 👉 если POST — тоже просто отвечаем
  return res.status(200).json({
    ok: true,
    received: true,
  })
}