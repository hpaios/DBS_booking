// import type { VercelRequest, VercelResponse } from '@vercel/node'
// import axios from 'axios'

// const WAZZUP_API_KEY = process.env.WAZZUP_API_KEY
// const WAZZUP_API_BASE_URL =
//   process.env.WAZZUP_API_BASE_URL || 'https://api.wazzup24.com/v3'
// const WAZZUP_CHANNEL_ID = process.env.WAZZUP_CHANNEL_ID
// const WAZZUP_CHAT_TYPE = process.env.WAZZUP_CHAT_TYPE || 'whatsapp'

// type RoappWebhookPayload = {
//   id?: string
//   created_at?: string
//   created_at_ts?: number
//   event_name?: string
//   context?: {
//     object_id?: number
//     object_type?: string
//   }
//   metadata?: {
//     lead?: {
//       id?: number
//       name?: string
//       type?: number
//     }
//     order?: {
//       id?: number
//       name?: string
//     }
//     status?: {
//       id?: number
//     }
//     new?: {
//       id?: number
//     }
//     old?: {
//       id?: number
//     }
//     client?: {
//       fullname?: string
//       phone?: string
//     }
//   }
// }

// function normalizePhone(phone: unknown): string | null {
//   if (!phone) return null

//   const digits = String(phone).replace(/\D/g, '')
//   return digits || null
// }

// function getFirstName(fullName: unknown): string {
//   if (!fullName) return 'zákazníku'

//   const value = String(fullName).trim()
//   if (!value) return 'zákazníku'

//   return value.split(/\s+/)[0]
// }

// function buildLeadCreatedMessage(clientFirstName: string): string {
//   return `Dobrý den, ${clientFirstName}. Děkujeme za váš zájem o DBS Autoservis & Detailing! Vaši poptávku jsme v pořádku přijali a brzy se s vámi spojíme.`
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

// async function handleLeadCreated(
//   payload: RoappWebhookPayload,
//   res: VercelResponse
// ) {
//   const leadId = payload?.context?.object_id

//   if (!leadId) {
//     return res.status(400).json({
//       ok: false,
//       error: 'Missing context.object_id',
//     })
//   }

//   try {
//     const fullName = payload?.metadata?.client?.fullname || 'zákazníku'
//     const clientFirstName = getFirstName(fullName)
//     const phone = normalizePhone(payload?.metadata?.client?.phone)

//     if (!phone) {
//       return res.status(200).json({
//         ok: true,
//         ignored: true,
//         reason: 'Phone not found in lead webhook payload',
//         leadId,
//       })
//     }

//     const messageText = buildLeadCreatedMessage(clientFirstName)

//     const wazzupResponse = await sendWazzupMessage({
//       phone,
//       text: messageText,
//       crmMessageId: String(leadId),
//     })

//     console.log('WAZZUP response:', JSON.stringify(wazzupResponse, null, 2))

//     return res.status(200).json({
//       ok: true,
//       event: payload.event_name,
//       leadId,
//       phone,
//     })
//   } catch (error) {
//     if (axios.isAxiosError(error)) {
//       console.error('Lead.Created axios error:', {
//         message: error.message,
//         status: error.response?.status,
//         data: error.response?.data,
//       })
//     } else {
//       console.error('Lead.Created unexpected error:', error)
//     }

//     return res.status(500).json({
//       ok: false,
//       error: 'Webhook processing failed',
//     })
//   }
// }

// function handleOrderStatusChanged(
//   payload: RoappWebhookPayload,
//   res: VercelResponse
// ) {
//   const orderId = payload?.context?.object_id
//   const newStatusId = payload?.metadata?.new?.id
//   const oldStatusId = payload?.metadata?.old?.id

//   return res.status(200).json({
//     ok: true,
//     event: payload.event_name,
//     orderId: orderId || null,
//     newStatusId: newStatusId || null,
//     oldStatusId: oldStatusId || null,
//     message: 'Order.Status.Changed received',
//   })
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

//   switch (payload?.event_name) {
//     case 'Lead.Created':
//       return handleLeadCreated(payload, res)

//     case 'Order.Status.Changed':
//       return handleOrderStatusChanged(payload, res)

//     default:
//       return res.status(200).json({
//         ok: true,
//         ignored: true,
//         reason: `Unsupported event: ${payload?.event_name || 'unknown'}`,
//       })
//   }
// }

import type { VercelRequest, VercelResponse } from '@vercel/node'
import axios from 'axios'
import { supabase } from '../lib/supabase'

const WAZZUP_API_KEY = process.env.WAZZUP_API_KEY
const WAZZUP_API_BASE_URL =
  process.env.WAZZUP_API_BASE_URL || 'https://api.wazzup24.com/v3'
const WAZZUP_CHANNEL_ID = process.env.WAZZUP_CHANNEL_ID
const WAZZUP_CHAT_TYPE = process.env.WAZZUP_CHAT_TYPE || 'whatsapp'

const ROAPP_API_BASE_URL =
  process.env.ROAPP_API_BASE_URL || 'https://api.roapp.io/v2'
const ROAPP_API_TOKEN = process.env.ROAPP_API_TOKEN

const TARGET_STATUS_ID = 4287767
const TARGET_CLIENT_ID = 37567839

type RoappWebhookPayload = {
  id?: string
  created_at?: string
  created_at_ts?: number
  event_name?: string
  context?: {
    object_id?: number
    object_type?: string
  }
  metadata?: {
    lead?: {
      id?: number
      name?: string
      type?: number
    }
    order?: {
      id?: number
      name?: string
    }
    status?: {
      id?: number
    }
    new?: {
      id?: number
    }
    old?: {
      id?: number
    }
    client?: {
      fullname?: string
      phone?: string
    }
    closed_at?: string | null
  }
}

type RoappOrderResponse = {
  id: number
  status?: {
    id?: number
    name?: string
  }
  client?: {
    id?: number
    name?: string
    first_name?: string
    phone?: string[]
  }
  scheduled_for?: string | null
  scheduled_to?: string | null
}

function normalizePhone(phone: unknown): string | null {
  if (!phone) return null

  const digits = String(phone).replace(/\D/g, '')
  return digits || null
}

function getFirstName(fullName: unknown): string {
  if (!fullName) return 'zákazníku'

  const value = String(fullName).trim()
  if (!value) return 'zákazníku'

  return value.split(/\s+/)[0]
}

function buildLeadCreatedMessage(clientFirstName: string): string {
  return `Dobrý den, ${clientFirstName}. Děkujeme za váš zájem o DBS Autoservis & Detailing! Vaši poptávku jsme v pořádku přijali a brzy se s vámi spojíme.`
}

function buildReminderMessage(clientFirstName: string): string {
  return `Dobrý den, ${clientFirstName}, připomínáme Vám Vaši rezervaci v DBS Autoservis & Detailing. V případě dotazů nás neváhejte kontaktovat.`
}

async function sendWazzupMessage({
  phone,
  text,
  crmMessageId,
}: {
  phone: string
  text: string
  crmMessageId: string
}) {
  if (!WAZZUP_API_KEY) {
    throw new Error('WAZZUP_API_KEY is missing')
  }

  if (!WAZZUP_CHANNEL_ID) {
    throw new Error('WAZZUP_CHANNEL_ID is missing')
  }

  const response = await axios.post(
    `${WAZZUP_API_BASE_URL}/message`,
    {
      channelId: WAZZUP_CHANNEL_ID,
      chatType: WAZZUP_CHAT_TYPE,
      chatId: phone,
      text,
      crmMessageId,
    },
    {
      headers: {
        Authorization: `Bearer ${WAZZUP_API_KEY}`,
        'Content-Type': 'application/json',
      },
      timeout: 15000,
    }
  )

  return response.data
}

async function getOrderById(orderId: number): Promise<RoappOrderResponse> {
  if (!ROAPP_API_TOKEN) {
    throw new Error('ROAPP_API_TOKEN is missing')
  }

  const response = await axios.get(`${ROAPP_API_BASE_URL}/orders/${orderId}`, {
    headers: {
      Authorization: `Bearer ${ROAPP_API_TOKEN}`,
      Accept: 'application/json',
    },
    timeout: 15000,
  })

  return response.data
}

async function handleLeadCreated(
  payload: RoappWebhookPayload,
  res: VercelResponse
) {
  const leadId = payload?.context?.object_id

  if (!leadId) {
    return res.status(400).json({
      ok: false,
      error: 'Missing context.object_id',
    })
  }

  try {
    const fullName = payload?.metadata?.client?.fullname || 'zákazníku'
    const clientFirstName = getFirstName(fullName)
    const phone = normalizePhone(payload?.metadata?.client?.phone)

    if (!phone) {
      return res.status(200).json({
        ok: true,
        ignored: true,
        reason: 'Phone not found in lead webhook payload',
        leadId,
      })
    }

    const messageText = buildLeadCreatedMessage(clientFirstName)

    const wazzupResponse = await sendWazzupMessage({
      phone,
      text: messageText,
      crmMessageId: String(leadId),
    })

    console.log('WAZZUP response:', JSON.stringify(wazzupResponse, null, 2))

    return res.status(200).json({
      ok: true,
      event: payload.event_name,
      leadId,
      phone,
    })
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Lead.Created axios error:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      })
    } else {
      console.error('Lead.Created unexpected error:', error)
    }

    return res.status(500).json({
      ok: false,
      error: 'Webhook processing failed',
    })
  }
}

async function handleOrderStatusChanged(
  payload: RoappWebhookPayload,
  res: VercelResponse
) {
  const orderId = payload?.metadata?.order?.id
  const webhookNewStatusId = payload?.metadata?.new?.id
  const webhookOldStatusId = payload?.metadata?.old?.id

  console.log('DEBUG status from webhook:', webhookNewStatusId)

  if (webhookNewStatusId !== TARGET_STATUS_ID) {
    return res.status(200).json({
      ok: true,
      ignored: true,
      reason: 'status mismatch',
      webhookNewStatusId
    })
  }

  console.log(
    '🟡 Order.Status.Changed payload:',
    JSON.stringify(payload, null, 2)
  )

  if (!orderId) {
    return res.status(400).json({
      ok: false,
      error: 'Missing metadata.order.id',
    })
  }

  try {
    const order = await getOrderById(orderId)

    const statusId = order?.status?.id
    const clientId = order?.client?.id
    const fullName = order?.client?.first_name || order?.client?.name || 'zákazníku'
    const clientFirstName = getFirstName(fullName)
    const phone = normalizePhone(order?.client?.phone?.[0])

    if (statusId !== TARGET_STATUS_ID || clientId !== TARGET_CLIENT_ID) {
      return res.status(200).json({
        ok: true,
        ignored: true,
        reason: 'Order does not match target status/client',
        orderId,
        webhookNewStatusId: webhookNewStatusId || null,
        webhookOldStatusId: webhookOldStatusId || null,
        statusId: statusId || null,
        clientId: clientId || null,
      })
    }

    if (!phone) {
      return res.status(200).json({
        ok: true,
        ignored: true,
        reason: 'Phone not found in order details',
        orderId,
        clientId,
      })
    }

    const sendAt = new Date(Date.now() + 15 * 60 * 1000).toISOString()

    const { error } = await supabase
      .from('order_reminders')
      .upsert(
        {
          order_id: orderId,
          client_id: clientId,
          phone,
          status_id: statusId,
          send_at: sendAt,
          message_sent: false,
        },
        {
          onConflict: 'order_id',
        }
      )

    if (error) {
      throw error
    }

    return res.status(200).json({
      ok: true,
      event: payload.event_name,
      orderId,
      clientId,
      statusId,
      phone,
      sendAt,
      scheduled: true,
    })
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Order.Status.Changed axios error:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      })
    } else {
      console.error('Order.Status.Changed unexpected error:', error)
    }

    return res.status(500).json({
      ok: false,
      error: 'Order.Status.Changed processing failed',
    })
  }
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' })
  }

  const payload = req.body as RoappWebhookPayload

  console.log('Incoming ROAPP webhook:', JSON.stringify(payload, null, 2))

  switch (payload?.event_name) {
    case 'Lead.Created':
      return handleLeadCreated(payload, res)

    case 'Order.Status.Changed':
      return handleOrderStatusChanged(payload, res)

    default:
      return res.status(200).json({
        ok: true,
        ignored: true,
        reason: `Unsupported event: ${payload?.event_name || 'unknown'}`,
      })
  }
}