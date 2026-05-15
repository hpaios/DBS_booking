import type { VercelRequest, VercelResponse } from '@vercel/node'
import axios from 'axios'
import { createClient } from '@supabase/supabase-js'

const ROAPP_API_KEY = process.env.ROAPP_API_KEY

const WAZZUP_API_KEY = process.env.WAZZUP_API_KEY
const WAZZUP_API_BASE_URL =
  process.env.WAZZUP_API_BASE_URL || 'https://api.wazzup24.com/v3'
const WAZZUP_CHANNEL_ID = process.env.WAZZUP_CHANNEL_ID
const WAZZUP_CHAT_TYPE = process.env.WAZZUP_CHAT_TYPE || 'whatsapp'

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

const CLIENT_CONVERTED_STATUS_ID = 4324936
const DISABLE_REMINDERS_STATUS_ID = 4324967

const LEAD_FOLLOWUP_CANCEL_STATUS_IDS = [
  CLIENT_CONVERTED_STATUS_ID,
  DISABLE_REMINDERS_STATUS_ID,
]

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

function buildLeadFollowupMessage({
  reminderType,
  clientName,
}: {
  reminderType: string
  clientName?: string | null
}) {
  const name = formatName(clientName)

  switch (reminderType) {
    case 'frequent_1d':
      return `Dobrý den, ${name},

včera jsem Vám posílal naši nabídku. Chci se jen ujistit, že vše v pořádku dorazilo. 

Pokud máte jakékoliv dotazy k postupu práce, materiálům nebo detailům rozpočtu, dejte mi vědět – rád Vám vše vysvětlím.

S úctou,
Ilja
DBS`

    case 'frequent_3d':
      return `Dobrý den, ${name},

stále přemýšlíte nad naším návrhem? 

Chápeme, že kvalitní péče o vůz je investice. Pokud by Vám aktuální návrh úplně nevyhovoval, určitě se nám ozvěte – můžeme probrat i alternativní varianty (např. výběr jiných materiálů nebo rozdělení prací na etapy), abychom našli řešení, které Vám sedne.

Zakládáme si na férovém přístupu a kvalitě, což potvrzují i naše recenze na Google Maps (⭐ 5.0 a 25+ hodnocení).

Hezký den,
Ilja
DBS`

    case 'frequent_7d':
      return `Dobrý den, ${name},

nechci na Vás nijak tlačit, jen posílám poslední slíbené připomenutí. 

Pokud se rozhodnete využít naše služby nyní nebo kdykoliv v budoucnu, dveře u nás máte otevřené. Mezitím se můžete podívat na ukázky našich reálných prací na Instagramu: [Odkaz na Instagram].

Kdykoliv budete naši pomoc potřebovat, jsme tu pro Vás.

S pozdravem,
Ilja
DBS`

    case 'medium_2d':
      return `Dobrý den, ${name},

před pár dny jsme spolu řešili péči o Váš vůz. Chci se jen krátce připomenout a zeptat se, zda máte k zaslanému návrhu nějaké doplňující dotazy?

Rád Vám vše upřesním.

S úctou,
Ilja
DBS`

    case 'medium_7d':
      return `Dobrý den, ${name},

jen zpráva pro doplnění: uvědomujeme si, že údržba a péče o vůz je vždy investicí. Kdyby Vám náš původní návrh nevyhovoval, rádi s Vámi probereme i jiné dostupné možnosti, aby výsledek odpovídal Vaší představě.

Naší prioritou je vždy spokojený klient – podívejte se na naše recenze na Google Maps (⭐ 5.0, 25+ hodnocení).

Dejte mi vědět, jaké řešení by pro Vás bylo nejlepší.

Hezký den,
Ilja
DBS`

    case 'medium_14d':
      return `Dobrý den, ${name},

jen se v krátkosti připomínám, jak jsme se domluvili.

Výsledky naší pečlivé práce a projekty, na kterých zrovna děláme, můžete sledovat na našem Instagramu: [Odkaz na Instagram].

Až bude Váš vůz potřebovat naši péči, stačí se ozvat. Jsme připraveni pomoci.

Přeji vše dobré,
Ilja
DBS`

    case 'rare_7d':
      return `Dobrý den, ${name},

před týdnem jsem Vám posílal cenovou nabídku na péči o Váš vůz. Vím, že toho můžete mít přes týden hodně, tak se chci jen nezávazně zeptat, zda se Vám podařilo si návrh v klidu projít. 

Pokud by Vás k tomu cokoliv zajímalo, jsem Vám plně k dispozici.

S úctou,
Ilja
DBS`

    case 'rare_14d':
      return `Dobrý den, ${name},

jen se v krátkosti připomínám. V DBS si zakládáme na individuálním a férovém přístupu – pokud by Vám zaslaný rozpočet z jakéhokoliv důvodu nevyhovoval, stačí říct. Rád s Vámi proberu i jiné alternativy údržby, které Vám lépe sednou. 

Za naši kvalitu mluví především spokojení klienti (máme hodnocení ⭐ 5.0 a 25+ recenzí na Google Maps). 

Budu rád, když mi dáte vědět, jak to vidíte.

Hezký den,
Ilja
DBS`

    case 'rare_28d':
      return `Dobrý den, ${name},

nechci Vás nijak rušit dalšími zprávami, proto Vám píšu ohledně naší nabídky naposledy. 

Dveře u nás máte kdykoliv otevřené – až se v budoucnu rozhodnete dopřát Vašemu vozu péči, stačí se nám ozvat. Do té doby můžete sledovat naše aktuální projekty a práci na Instagramu: [Odkaz na Instagram].

Přeji Vám vše dobré a ať Vám auto dělá jen radost.

S pozdravem,
Ilja
DBS`

    default:
      return `Dobrý den, ${name},

jen se Vám krátce připomínám ohledně naší nabídky.

S pozdravem,
Ilja
DBS`
  }
}

async function processLeadFollowup(followup: {
  id: string
  lead_id: number
  reminder_type: string
  client_name: string
  phone: string
  message_sent: boolean
  canceled: boolean
}) {
  const leadResponse = await getLeadById(followup.lead_id)
  const lead = Array.isArray(leadResponse) ? leadResponse[0] : leadResponse

  const currentStatusId = lead?.status?.id

  if (LEAD_FOLLOWUP_CANCEL_STATUS_IDS.includes(Number(currentStatusId))) {
    await supabase
      .from('lead_followups')
      .update({
        canceled: true,
      })
      .eq('id', followup.id)

    return {
      ok: true,
      skipped: true,
      reason: 'lead converted or reminders disabled',
      leadId: followup.lead_id,
      currentStatusId,
    }
  }

  const phone =
    followup.phone ||
    normalizePhone(
      lead?.client?.phone?.[0] ||
        lead?.client?.phones?.[0] ||
        lead?.client?.phone
    )

  if (!phone) {
    await supabase
      .from('lead_followups')
      .update({
        canceled: true,
      })
      .eq('id', followup.id)

    return {
      ok: true,
      skipped: true,
      reason: 'phone not found',
      leadId: followup.lead_id,
    }
  }

  const clientName =
    followup.client_name ||
    lead?.client?.name ||
    lead?.client?.fullname ||
    'zákazníku'

  const text = buildLeadFollowupMessage({
    reminderType: followup.reminder_type,
    clientName,
  })

  await sendWazzupMessage({
    phone,
    text,
    crmMessageId: `lead-followup-${followup.lead_id}-${followup.reminder_type}`,
  })

  const { error } = await supabase
    .from('lead_followups')
    .update({
      message_sent: true,
      sent_at: new Date().toISOString(),
      phone,
      client_name: clientName,
    })
    .eq('id', followup.id)

  if (error) {
    throw error
  }

  return {
    ok: true,
    sent: true,
    leadId: followup.lead_id,
    reminderType: followup.reminder_type,
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

    const { data: followups, error } = await supabase
      .from('lead_followups')
      .select('*')
      .lte('send_at', now)
      .eq('message_sent', false)
      .eq('canceled', false)
      .order('send_at', { ascending: true })
      .limit(20)

    if (error) {
      throw error
    }

    if (!followups || followups.length === 0) {
      return res.status(200).json({
        ok: true,
        message: 'No lead followups to send',
      })
    }

    type LeadFollowupProcessResult = {
      ok: boolean
      sent?: boolean
      skipped?: boolean
      reason?: string
    
      followupId?: string
      leadId?: number
      reminderType?: string
      currentStatusId?: number
    
      phone?: string
    }

    const results: LeadFollowupProcessResult[] = []

    for (const followup of followups) {
      try {
        const result = await processLeadFollowup(followup)
        results.push(result)
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error('Lead followup send axios error:', {
            followupId: followup.id,
            leadId: followup.lead_id,
            message: error.message,
            url: error.config?.url,
            status: error.response?.status,
            data: error.response?.data,
          })
        } else {
          console.error('Lead followup send unexpected error:', {
            followupId: followup.id,
            leadId: followup.lead_id,
            error,
          })
        }

        results.push({
          ok: false,
          followupId: followup.id,
          leadId: followup.lead_id,
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
      console.error('send-lead-followups axios error:', {
        message: error.message,
        url: error.config?.url,
        status: error.response?.status,
        data: error.response?.data,
      })
    } else {
      console.error('send-lead-followups unexpected error:', error)
    }

    return res.status(500).json({
      ok: false,
      error: 'Failed to send lead followups',
    })
  }
}