import type { VercelRequest, VercelResponse } from '@vercel/node'
import axios from 'axios'
import { supabase } from '../../lib/supabase.js'

const WAZZUP_API_KEY = process.env.WAZZUP_API_KEY
const WAZZUP_API_BASE_URL =
  process.env.WAZZUP_API_BASE_URL || 'https://api.wazzup24.com/v3'
const WAZZUP_CHANNEL_ID = process.env.WAZZUP_CHANNEL_ID
const WAZZUP_CHAT_TYPE = process.env.WAZZUP_CHAT_TYPE || 'whatsapp'

function buildReminderMessage({
  bookingAt,
  clientName,
}: {
  bookingAt: string
  clientName?: string | null
}): string {
  const formattedName = clientName?.trim() || 'zákazníku'
  const date = new Date(bookingAt)

  const bookingDate = date.toLocaleDateString('cs-CZ', {
    timeZone: 'Europe/Prague',
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  const bookingTime = date.toLocaleTimeString('cs-CZ', {
    timeZone: 'Europe/Prague',
    hour: '2-digit',
    minute: '2-digit',
  })

  return [
    `Dobrý den, ${formattedName}.`,
    `rádi bychom Vám připomněli Vaši rezervaci v DBS Autoservis & Detailing.`,
    `🗓 Datum: ${bookingDate}`,
    `⏰ Čas: ${bookingTime}`,
    `📍 Adresa: Františka Kadlece 2441, 180 00 Praha 8`,
    `Těšíme se na Vaši návštěvu!`,
  ].join('\n')
}

async function sendWazzupMessage(
  phone: string,
  text: string,
  crmMessageId: string
) {
  if (!WAZZUP_API_KEY || !WAZZUP_CHANNEL_ID) {
    throw new Error('Missing Wazzup config')
  }

  try {
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

    console.log(
      'WAZZUP success:',
      JSON.stringify(response.data, null, 2)
    )

    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        'WAZZUP axios error:',
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
      console.error('WAZZUP unexpected error:', error)
    }

    throw error
  }
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  try {
    const now = new Date().toISOString()

    const { data: reminders, error } = await supabase
      .from('order_reminders')
      .select('*')
      .lte('send_at', now)
      .eq('message_sent', false)

    if (error) {
      throw error
    }

    if (!reminders || reminders.length === 0) {
      return res.status(200).json({
        ok: true,
        message: 'No reminders to send',
      })
    }

    for (const reminder of reminders) {
      try {
        const text = buildReminderMessage({
          bookingAt: reminder.booking_at,
          clientName: reminder.client_name,
        })

        await sendWazzupMessage(
          reminder.phone,
          text,
          String(reminder.order_id)
        )

        await supabase
          .from('order_reminders')
          .update({ message_sent: true })
          .eq('id', reminder.id)

        console.log(`✅ Sent reminder for order ${reminder.order_id}`)
      } catch (err) {
        console.error(`❌ Failed for order ${reminder.order_id}`, err)
      }
    }

    return res.status(200).json({
      ok: true,
      processed: reminders.length,
    })
  } catch (error) {
    console.error('Cron error:', error)

    return res.status(500).json({
      ok: false,
      error: 'Cron failed',
    })
  }
}