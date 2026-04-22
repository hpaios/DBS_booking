import type { VercelRequest, VercelResponse } from '@vercel/node'
import axios from 'axios'

const WAZZUP_API_KEY = process.env.WAZZUP_API_KEY
const WAZZUP_API_BASE_URL =
  process.env.WAZZUP_API_BASE_URL || 'https://api.wazzup24.com/v3'
const WAZZUP_CHANNEL_ID = process.env.WAZZUP_CHANNEL_ID
const WAZZUP_CHAT_TYPE = process.env.WAZZUP_CHAT_TYPE || 'whatsapp'

type BookingConfirmationBody = {
  clientFirstName: string
  phone: string
  bookingDate: string
  bookingTime: string
}

function normalizePhone(phone: string): string {
  return phone.replace(/\D/g, '')
}

function buildBookingConfirmationMessage(data: BookingConfirmationBody): string 
{
  const formattedName = data.clientFirstName
  ? data.clientFirstName.charAt(0).toUpperCase() +
    data.clientFirstName.slice(1).toLowerCase()
  : ''
  return [
    `Dobrý den, ${formattedName}. Váš termín v DBS Autoservis & Detailing je potvrzen!`,
    `🗓 Datum: ${data.bookingDate}`,
    `⏰ Čas: ${data.bookingTime}`,
    `📍 Adresa: Františka Kadlece 2441, 180 00 Praha 8`,
    `Náš přijímací technik nebo manažer DBS Autoservis & Detailing se s vámi brzy spojí pro upřesnění detailů. Mějte prosím na paměti, že pokud se jedná o servisní zakázku, cena uvedená při rezervaci zahrnuje pouze práci. V případě potřeby objednání náhradních dílů vám v nejbližší době zašleme cenovou nabídku. Těšíme se na vaši návštěvu.`,
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
    const { clientFirstName, phone, bookingDate, bookingTime } =
      req.body as BookingConfirmationBody

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

    return res.status(200).json({
      ok: true,
      data: response.data,
    })
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('send-booking-confirmation axios error:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      })
    } else {
      console.error('send-booking-confirmation unexpected error:', error)
    }

    return res.status(500).json({
      ok: false,
      error: 'Failed to send booking confirmation',
    })
  }
}