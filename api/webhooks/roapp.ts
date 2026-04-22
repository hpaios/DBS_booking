import type { VercelRequest, VercelResponse } from '@vercel/node'
import axios from 'axios'

const WAZZUP_API_KEY = process.env.WAZZUP_API_KEY
const WAZZUP_API_BASE_URL =
  process.env.WAZZUP_API_BASE_URL || 'https://api.wazzup24.com/v3'
const WAZZUP_CHANNEL_ID = process.env.WAZZUP_CHANNEL_ID
const WAZZUP_CHAT_TYPE = process.env.WAZZUP_CHAT_TYPE || 'whatsapp'

type RoappWebhookPayload = {
  id?: string
  created_at?: string
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
    status?: {
      id?: number
    }
    client?: {
      fullname?: string
      phone?: string
    }
  }
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

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' })
  }

  const payload = req.body as RoappWebhookPayload

  console.log('Incoming ROAPP webhook:', JSON.stringify(payload, null, 2))

  if (payload?.event_name !== 'Lead.Created') {
    return res.status(200).json({
      ok: true,
      ignored: true,
      reason: `Unsupported event: ${payload?.event_name || 'unknown'}`,
    })
  }

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

    // ВАЖНО:
    // если phone не приходит в webhook, тут надо будет либо:
    // 1) получить lead details через правильный lead endpoint
    // 2) или не отправлять WA до тех пор, пока не узнаем phone
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
      console.error('Axios error:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      })
    } else {
      console.error('Unexpected error:', error)
    }

    return res.status(500).json({
      ok: false,
      error: 'Webhook processing failed',
    })
  }
}
