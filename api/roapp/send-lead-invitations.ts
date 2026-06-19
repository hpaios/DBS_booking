import type { VercelRequest, VercelResponse } from '@vercel/node'
import axios from 'axios'
import { createClient } from '@supabase/supabase-js'
import { LEAD_INVITATION_CANCEL_STATUS_IDS } from '../constants'

const ROAPP_API_KEY = process.env.ROAPP_API_KEY

const WAZZUP_API_KEY = process.env.WAZZUP_API_KEY
const WAZZUP_API_BASE_URL =
  process.env.WAZZUP_API_BASE_URL || 'https://api.wazzup24.com/v3'
const WAZZUP_CHANNEL_ID = process.env.WAZZUP_CHANNEL_ID
const WAZZUP_CHAT_TYPE = process.env.WAZZUP_CHAT_TYPE || 'whatsapp'

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY


const supabase = createClient(
  SUPABASE_URL || '',
  SUPABASE_SERVICE_ROLE_KEY || ''
)

export function normalizePhone(phone: unknown): string | null {
  if (!phone) return null

  const digits = String(phone).replace(/\D/g, '')
  return digits || null
}

function formatName(name?: string | null) {
  if (!name) return 'zákazníku'

  return name
    .trim()
    .split(/\s+/)
    .map(
      word =>
        word.charAt(0).toUpperCase() +
        word.slice(1).toLowerCase()
    )
    .join(' ')
}

async function getLeadById(leadId: number) {
  if (!ROAPP_API_KEY) {
    throw new Error('ROAPP_API_KEY is missing')
  }

  const response = await axios.get(`https://api.roapp.io/lead/`, {
    params: {
      'ids[]': leadId,
    },
    headers: {
      Authorization: `Bearer ${ROAPP_API_KEY}`,
      Accept: 'application/json',
    },
    timeout: 15000,
  })

  return response.data?.data || response.data
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

function buildLeadInvitationMessage({
  invitationType,
  clientName,
}: {
  invitationType: string
  clientName?: string | null
}) {
  const name = formatName(clientName)

  switch (invitationType) {
    case 'invitation_cz_2d':
      return `Dobrý den, ${name},

před několika dny jsme Vás zvali na konzultaci ohledně péče o Váš vůz.

Během osobní schůzky můžeme zhodnotit stav vozidla, odpovědět na Vaše dotazy a doporučit nejvhodnější řešení právě pro Vás.

Ukázky naší práce najdete zde:
https://www.instagram.com/dbspraha.

Pokud Vám to bude vyhovovat, rádi pro Vás najdeme vhodný termín.

S pozdravem,
Ilja
DBS`

    case 'invitation_cz_7d':
      return `Dobrý den, ${name},

rádi bychom Vás znovu pozvali na konzultaci do DBS Autoservis & Detailing.

Osobní setkání často pomůže rychleji projít všechny možnosti a vybrat nejvhodnější řešení pro Váš vůz.

Naše aktuální projekty si můžete prohlédnout zde:
https://www.instagram.com/dbspraha.

Pokud budete mít jakékoliv dotazy, neváhejte se na nás obrátit.

S pozdravem,
Ilja
DBS`
    case 'invitation_cz_14d':
      return `Dobrý den, ${name},

toto je poslední připomenutí možnosti objednat se na konzultaci v DBS Autoservis & Detailing.

Pokud pro Vás nyní péče o vůz není aktuální, můžete se na nás kdykoliv v budoucnu obrátit.

Naše nové projekty a realizace najdete zde:
https://www.instagram.com/dbspraha.

S pozdravem,
Ilja
DBS`

    case 'invitation_ru_2d':
      return `Добрый день, ${name},

несколько дней назад мы приглашали Вас на консультацию по уходу за Вашим автомобилем.

Во время встречи мы сможем оценить состояние автомобиля, ответить на Ваши вопросы и предложить оптимальное решение именно для Вашей ситуации.

Наши работы Вы можете посмотреть здесь:
https://www.instagram.com/dbspraha.

Если Вам будет удобно, будем рады подобрать подходящее время для визита.

С уважением,
Илья
DBS`

    case 'invitation_ru_7d':
      return `Добрый день, ${name},

хочу ещё раз пригласить Вас на консультацию в DBS Autoservis & Detailing.

Личная встреча часто помогает быстрее разобраться во всех деталях и подобрать лучший вариант обслуживания автомобиля.

Наши актуальные проекты можно посмотреть здесь:
https://www.instagram.com/dbspraha.

Если возникнут вопросы, с удовольствием помогу.

С уважением,
Илья
DBS`

    case 'invitation_ru_14d':
      return `Добрый день, ${name},

это последнее напоминание о возможности записаться на консультацию в DBS Autoservis & Detailing.

Если сейчас вопрос обслуживания автомобиля не актуален, будем рады помочь Вам в будущем.

Наши новые проекты и работы Вы можете посмотреть здесь:
https://www.instagram.com/dbspraha.

С уважением,
Илья
DBS`

    default:
      return `Dobrý den, ${name},

rádi bychom Vás pozvali na konzultaci do DBS Autoservis & Detailing.

Během osobní schůzky Vám rádi poradíme, zodpovíme Vaše dotazy a doporučíme nejvhodnější řešení pro Váš vůz.ы

Ukázky naší práce najdete zde:
https://www.instagram.com/dbspraha.

Pokud Vám to bude vyhovovat, budeme rádi, když se nám ozvete.

S pozdravem,
Ilja
DBS`
  }
}

type LeadInvitation = {
  id: string
  lead_id: number
  invitation_type: string
  client_name?: string | null
  phone?: string | null
  message_sent: boolean
  canceled: boolean
}

type LeadInvitationProcessResult = {
  ok: boolean
  sent?: boolean
  skipped?: boolean
  reason?: string

  invitationId?: string
  leadId?: number
  invitationType?: string
  currentStatusId?: number

  phone?: string
}

async function processLeadInvitation(
  invitation: LeadInvitation
): Promise<LeadInvitationProcessResult> {
  const leadResponse = await getLeadById(invitation.lead_id)
  const lead = Array.isArray(leadResponse) ? leadResponse[0] : leadResponse

  const currentStatusId = lead?.status?.id

  if (LEAD_INVITATION_CANCEL_STATUS_IDS.includes(Number(currentStatusId))) {
    await supabase
      .from('lead_invitations')
      .update({
        canceled: true,
      })
      .eq('id', invitation.id)

    return {
      ok: true,
      skipped: true,
      reason: 'lead converted or invitations disabled',
      invitationId: invitation.id,
      leadId: invitation.lead_id,
      currentStatusId,
    }
  }

  const phone =
    invitation.phone ||
    normalizePhone(
      lead?.client?.phone?.[0] ||
        lead?.client?.phones?.[0] ||
        lead?.client?.phone
    )

  if (!phone) {
    await supabase
      .from('lead_invitations')
      .update({
        canceled: true,
      })
      .eq('id', invitation.id)

    return {
      ok: true,
      skipped: true,
      reason: 'phone not found',
      invitationId: invitation.id,
      leadId: invitation.lead_id,
    }
  }

  const clientName =
    invitation.client_name ||
    lead?.client?.name ||
    lead?.client?.fullname ||
    'zákazníku'

  const text = buildLeadInvitationMessage({
    invitationType: invitation.invitation_type,
    clientName,
  })

  await sendWazzupMessage({
    phone,
    text,
    crmMessageId: `lead-invitation-${invitation.lead_id}-${invitation.invitation_type}`,
  })

  const { error } = await supabase
    .from('lead_invitations')
    .update({
      message_sent: true,
      sent_at: new Date().toISOString(),
      phone,
      client_name: clientName,
    })
    .eq('id', invitation.id)

  if (error) {
    throw error
  }

  return {
    ok: true,
    sent: true,
    invitationId: invitation.id,
    leadId: invitation.lead_id,
    invitationType: invitation.invitation_type,
    phone,
  }
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({
      ok: false,
      error: 'Method not allowed',
    })
  }

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return res.status(500).json({
      ok: false,
      error: 'Supabase env is missing',
    })
  }

  try {
    const now = new Date().toISOString()

    const { data: invitations, error } = await supabase
      .from('lead_invitations')
      .select('*')
      .lte('send_at', now)
      .eq('message_sent', false)
      .eq('canceled', false)
      .order('send_at', { ascending: true })
      .limit(20)

    if (error) {
      throw error
    }

    if (!invitations || invitations.length === 0) {
      return res.status(200).json({
        ok: true,
        message: 'No lead invitations to send',
      })
    }

    const results: LeadInvitationProcessResult[] = []

    for (const invitation of invitations) {
      try {
        const result = await processLeadInvitation(invitation)
        results.push(result)
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error('Lead invitation send axios error:', {
            invitationId: invitation.id,
            leadId: invitation.lead_id,
            message: error.message,
            url: error.config?.url,
            status: error.response?.status,
            data: error.response?.data,
          })
        } else {
          console.error('Lead invitation send unexpected error:', {
            invitationId: invitation.id,
            leadId: invitation.lead_id,
            error,
          })
        }

        results.push({
          ok: false,
          invitationId: invitation.id,
          leadId: invitation.lead_id,
        })
      }
    }

    return res.status(200).json({
      ok: true,
      processed: results.length,
      results,
    })
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('send-lead-invitations axios error:', {
        message: error.message,
        url: error.config?.url,
        status: error.response?.status,
        data: error.response?.data,
      })
    } else {
      console.error('send-lead-invitations unexpected error:', error)
    }

    return res.status(500).json({
      ok: false,
      error: 'Failed to send lead invitations',
    })
  }
}