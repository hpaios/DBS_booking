import type { VercelRequest, VercelResponse } from '@vercel/node'
import axios from 'axios'

const WAZZUP_API_KEY = process.env.WAZZUP_API_KEY
const WAZZUP_CHANNEL_ID = process.env.WAZZUP_CHANNEL_ID
const WAZZUP_API_BASE_URL = process.env.WAZZUP_API_BASE_URL
const WAZZUP_CHAT_TYPE = process.env.WAZZUP_CHAT_TYPE

const DBS_NOTIFICATION_PHONE = '420720773201'

type PriceRequestBody = {
  service: string
  name: string
  phone: string
  vin?: string
  description: string
}

function getServiceLabel(service: string): string {
  if (service === 'autoservice') return 'Автосервис'
  if (service === 'detailing') return 'Детейлинг'

  return service || 'Не указан'
}

function buildPriceRequestMessage(data: PriceRequestBody): string {
  const lines = [
    'Заявка с карточки',
    '',
    `Сервис: ${getServiceLabel(data.service)}`,
    `Имя: ${data.name}`,
    `Телефон: ${data.phone}`,
  ]

  if (data.vin?.trim()) {
    lines.push(`VIN: ${data.vin.trim()}`)
  }

  lines.push(
    `Описание: ${data.description?.trim() || 'Не указано'}`
  )

  return lines.join('\n')
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(204).end()
  }

  if (req.method === 'GET') {
    return res.status(200).json({
      ok: true,
      message: 'webflow-price-request endpoint is alive',
    })
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      ok: false,
      error: 'Method not allowed',
    })
  }

  try {
    const {
      service,
      name,
      phone,
      vin,
      description,
    } = req.body as PriceRequestBody

    console.log(
      '🟡 webflow price request body:',
      JSON.stringify(req.body, null, 2)
    )

    if (!service || !name || !phone || !description) {
      return res.status(400).json({
        ok: false,
        error: 'Missing required fields',
      })
    }

    if (
      !WAZZUP_API_KEY ||
      !WAZZUP_CHANNEL_ID ||
      !WAZZUP_API_BASE_URL ||
      !WAZZUP_CHAT_TYPE
    ) {
      console.error('❌ Wazzup env is missing')

      return res.status(500).json({
        ok: false,
        error: 'Wazzup configuration is missing',
      })
    }

    const text = buildPriceRequestMessage({
      service,
      name,
      phone,
      vin,
      description,
    })

    const response = await axios.post(
      `${WAZZUP_API_BASE_URL}/message`,
      {
        channelId: WAZZUP_CHANNEL_ID,
        chatType: WAZZUP_CHAT_TYPE,
        chatId: DBS_NOTIFICATION_PHONE,
        text,
      },
      {
        headers: {
          Authorization: `Bearer ${WAZZUP_API_KEY}`,
          'Content-Type': 'application/json',
        },
        timeout: 15000,
      }
    )

    console.log('🟢 Price request sent to DBS WhatsApp')

    return res.status(200).json({
      ok: true,
      wazzup: response.data,
    })
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        '❌ Wazzup price request failed:',
        JSON.stringify(
          {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data,
            innerData: error.response?.data?.data,
          },
          null,
          2
        )
      )
    } else {
      console.error(
        '❌ webflow-price-request unexpected error:',
        error
      )
    }

    return res.status(500).json({
      ok: false,
      error: 'Failed to send price request',
    })
  }
}
