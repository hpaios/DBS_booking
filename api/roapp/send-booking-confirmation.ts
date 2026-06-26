import type { VercelRequest, VercelResponse } from '@vercel/node'
import axios from 'axios'
import { supabase } from '../../lib/supabase.js'

const WAZZUP_API_KEY = process.env.WAZZUP_API_KEY
const WAZZUP_API_BASE_URL =
  process.env.WAZZUP_API_BASE_URL || 'https://api.wazzup24.com/v3'
const WAZZUP_CHANNEL_ID = process.env.WAZZUP_CHANNEL_ID
const WAZZUP_CHAT_TYPE = process.env.WAZZUP_CHAT_TYPE || 'whatsapp'

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID

type BookingSource = {
  utm_source?: string | null
  utm_medium?: string | null
  utm_campaign?: string | null
  utm_content?: string | null
  utm_term?: string | null
  gclid?: string | null
  fbclid?: string | null
  landing_url?: string | null
  referrer?: string | null
}

type BookingConfirmationBody = {
  clientFirstName: string
  phone: string
  bookingDate: string
  bookingTime: string
  email?: string
  bookingSource?: BookingSource
}

async function sendTelegramMessage(text: string) {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.warn('Telegram env is missing')
    return null
  }

  const response = await axios.post(
    `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
    {
      chat_id: TELEGRAM_CHAT_ID,
      text,
      parse_mode: 'HTML',
    },
    {
      timeout: 15000,
    }
  )

  return response.data
}

function normalizePhone(phone: string): string {
  return phone.replace(/\D/g, '')
}

function buildBookingConfirmationMessage(data: BookingConfirmationBody): string 
{
  const formattedName = () => {
    return data.clientFirstName
      .trim()
      .split(/\s+/)
      .map(
        word =>
          word.charAt(0).toUpperCase() +
          word.slice(1).toLowerCase()
      )
      .join(' ')
  }

  return [
    `Dobrý den, ${formattedName()}. Váš termín v DBS Autoservis & Detailing je potvrzen!`,
    `🗓 Datum: ${data.bookingDate}`,
    `⏰ Čas: ${data.bookingTime}`,
    `📍 Adresa: Františka Kadlece 2441, 180 00 Praha 8`,
    `Náš přijímací technik nebo manažer DBS Autoservis & Detailing se s vámi brzy spojí pro upřesnění detailů. Mějte prosím na paměti, že pokud se jedná o servisní zakázku, cena uvedená při rezervaci zahrnuje pouze práci. V případě potřeby objednání náhradních dílů vám v nejbližší době zašleme cenovou nabídku. Těšíme se na vaši návštěvu.`,
  ].join('\n')
}

function buildTelegramBookingMessage({
  clientFirstName,
  phone,
  bookingDate,
  bookingTime,
}: {
  clientFirstName: string
  phone: string
  bookingDate: string
  bookingTime: string
}) {
  return [
    `🚗 <b>Nová rezervace DBS</b>`,
    ``,
    `👤 Klient: ${clientFirstName}`,
    `📞 Telefon: ${phone}`,
    `🗓 Datum: ${bookingDate}`,
    `⏰ Čas: ${bookingTime}`,
  ].join('\n')
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method === 'GET') {
    return res.status(200).json({
      ok: true,
      message: 'send-booking-confirmation endpoint is alive',
    })
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      ok: false,
      error: 'Method not allowed',
    })
  }

  try {
    const { clientFirstName, phone, bookingDate, bookingTime, email, bookingSource } =
      req.body as BookingConfirmationBody

      console.log('🟡 booking confirmation body:', JSON.stringify(req.body, null, 2))
      console.log('🟡 bookingSource:', bookingSource)

    if (!clientFirstName || !phone || !bookingDate || !bookingTime) {
      return res.status(400).json({
        ok: false,
        error: 'Missing required fields',
      })
    }

    if (!WAZZUP_API_KEY || !WAZZUP_CHANNEL_ID) {
      return res.status(500).json({
        ok: false,
        error: 'Wazzup env is missing',
      })
    }

    const text = buildBookingConfirmationMessage({
      clientFirstName,
      phone,
      bookingDate,
      bookingTime,
    })

    const response = await axios.post(
      `${WAZZUP_API_BASE_URL}/message`,
      {
        channelId: WAZZUP_CHANNEL_ID,
        chatType: WAZZUP_CHAT_TYPE,
        chatId: normalizePhone(phone),
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

    const telegramText = buildTelegramBookingMessage({
      clientFirstName,
      phone,
      bookingDate,
      bookingTime,
    })
    
    try {
      await sendTelegramMessage(telegramText)
    } catch (error) {
      console.error('Telegram send failed:', error)
    }

    try {
      if (bookingSource) {
        const { error: sourceError } = await supabase
          .from('booking_sources')
          .insert({
            client_name: clientFirstName,
            phone,
            email: email || null,
    
            booking_date: bookingDate,
            booking_time: bookingTime,
    
            utm_source: bookingSource.utm_source || null,
            utm_medium: bookingSource.utm_medium || null,
            utm_campaign: bookingSource.utm_campaign || null,
            utm_content: bookingSource.utm_content || null,
            utm_term: bookingSource.utm_term || null,
            gclid: bookingSource.gclid || null,
            fbclid: bookingSource.fbclid || null,
    
            landing_url: bookingSource.landing_url || null,
            referrer: bookingSource.referrer || null,
          })
    
        if (sourceError) {
          console.error('Failed to save booking source:', sourceError)
        }
      }
    } catch (error) {
      console.error('Unexpected booking source save error:', error)
    }

    return res.status(200).json({
      ok: true,
      data: response.data,
    })
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        'send-booking-confirmation axios error:',
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
      console.error('send-booking-confirmation unexpected error:', error)
    }

    return res.status(500).json({
      ok: false,
      error: 'Failed to send booking confirmation',
    })
  }
}