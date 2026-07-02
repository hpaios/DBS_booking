import type { VercelRequest, VercelResponse } from '@vercel/node'
import axios from 'axios'
import { supabase } from '../../lib/supabase.js'
import { RoappOrderResponse, RoappWebhookPayload } from '../types.js'
import { CAR_PICKED_UP_NO_MESSAGE_STATUS_ID, CAR_PICKED_UP_STATUS_IDS, LEAD_FOLLOWUP_CANCEL_STATUS_IDS, LEAD_FOLLOWUP_SCHEDULES, LEAD_FOLLOWUP_TRIGGER_STATUS_IDS, LEAD_INVITATION_CANCEL_STATUS_IDS, LEAD_INVITATION_SCHEDULES, LEAD_INVITATION_TRIGGER_STATUS_IDS, STATUS_NOT_RELEVANT, TARGET_STATUS_IDS } from '../constants.js'
import { getPragueFollowupSendAt, mapLeadClientDetails } from '../utils.js'

const WAZZUP_API_KEY = process.env.WAZZUP_API_KEY
const WAZZUP_API_BASE_URL =
  process.env.WAZZUP_API_BASE_URL || 'https://api.wazzup24.com/v3'
const WAZZUP_CHANNEL_ID = process.env.WAZZUP_CHANNEL_ID
const WAZZUP_CHAT_TYPE = process.env.WAZZUP_CHAT_TYPE || 'whatsapp'

const ROAPP_API_BASE_URL =
  process.env.ROAPP_API_BASE_URL || 'https://api.roapp.io/v2'
const ROAPP_API_TOKEN = process.env.ROAPP_API_TOKEN
const ROAPP_API_KEY = process.env.ROAPP_API_KEY

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

function addHours(date: Date, hours: number) {
  return new Date(date.getTime() + hours * 60 * 60 * 1000)
}

function getPragueDateKey(date: Date): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Prague',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date)
}

function getPragueHour(date: Date): number {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Prague',
    hour: '2-digit',
    hour12: false,
  }).formatToParts(date)

  return Number(parts.find((part) => part.type === 'hour')?.value)
}

function getReminderDates(scheduledFor: string) {
  const bookingDate = new Date(scheduledFor)

  const reminder48h = addHours(bookingDate, -48)
  const reminder24h = addHours(bookingDate, -24)

  const bookingHourPrague = getPragueHour(bookingDate)

  const finalReminderType = bookingHourPrague >= 10 ? '2h' : '12h'
  const finalReminder = addHours(
    bookingDate,
    bookingHourPrague >= 10 ? -2 : -12
  )

  let reminders = [
    {
      reminder_type: '48h',
      send_at: reminder48h.toISOString(),
    },
    {
      reminder_type: '24h',
      send_at: reminder24h.toISOString(),
    },
    {
      reminder_type: finalReminderType,
      send_at: finalReminder.toISOString(),
    },
  ]

  // Якщо 24h і 12h потрапляють в один день по Чехії — залишаємо тільки 12h
  if (
    finalReminderType === '12h' &&
    getPragueDateKey(reminder24h) === getPragueDateKey(finalReminder)
  ) {
    reminders = reminders.filter((item) => item.reminder_type !== '24h')
  }

  return reminders
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

  console.log('✅ ROAPP order:', JSON.stringify(payload?.metadata?.order, null, 2))

  if (Number(webhookNewStatusId) === STATUS_NOT_RELEVANT) {
    if (!orderId) {
      return res.status(400).json({
        ok: false,
        error: 'Missing orderId',
      })
    }
  
    const { error } = await supabase
      .from('order_reminders')
      .delete()
      .eq('order_id', orderId)
  
    if (error) {
      console.error('Failed to delete reminders:', error)
  
      return res.status(500).json({
        ok: false,
        error: 'Failed to delete reminders',
      })
    }
  
    console.log(`✅ Deleted reminders for order ${orderId}`)
  
    return res.status(200).json({
      ok: true,
      deleted: true,
      orderId,
    })
  }

  if (Number(webhookNewStatusId) === CAR_PICKED_UP_NO_MESSAGE_STATUS_ID) {
    return res.status(200).json({
      ok: true,
      ignored: true,
      reason: 'car picked up without followup message',
      orderId,
      statusId: webhookNewStatusId,
    })
  }

  if (CAR_PICKED_UP_STATUS_IDS.includes(Number(webhookNewStatusId))) {
    if (!orderId) {
      return res.status(400).json({
        ok: false,
        error: 'Missing orderId',
      })
    }
  
    try {
      const order = await getOrderById(orderId)
  
      const clientId = order?.client?.id
      const fullName =
        order?.client?.first_name ||
        order?.client?.name ||
        'zákazníku'
  
      const phone = normalizePhone(order?.client?.phone?.[0])
  
      if (!phone) {
        return res.status(200).json({
          ok: true,
          ignored: true,
          reason: 'Phone not found in order details',
          orderId,
          clientId,
        })
      }
  
      const sendAt = getPragueFollowupSendAt({
        baseDateString: payload.created_at,
        daysToAdd: 2,
      })
  
      if (new Date(sendAt).getTime() <= Date.now()) {
        return res.status(200).json({
          ok: true,
          ignored: true,
          reason: 'send_at is already in the past',
          orderId,
          sendAt,
        })
      }
  
      const reminderToSave = {
        order_id: orderId,
        client_id: clientId,
        phone,
        status_id: Number(webhookNewStatusId),
        reminder_type: 'car_picked_up_2d',
        send_at: sendAt,
        booking_at: order?.scheduled_for || null,
        client_name: fullName,
        message_sent: false,
      }
  
      const { error } = await supabase
        .from('order_reminders')
        .upsert(reminderToSave, {
          onConflict: 'order_id,reminder_type',
        })
  
      if (error) {
        throw error
      }
  
      return res.status(200).json({
        ok: true,
        event: payload.event_name,
        type: 'car_picked_up_2d',
        orderId,
        clientId,
        phone,
        sendAt,
        scheduled: true,
      })
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Car picked up followup axios error:', {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data,
        })
      } else {
        console.error('Car picked up followup unexpected error:', error)
      }
  
      return res.status(500).json({
        ok: false,
        error: 'Car picked up followup processing failed',
      })
    }
  }

  if (!TARGET_STATUS_IDS.includes(Number(webhookNewStatusId))) {
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
    const { data: existingReminders, error: existingError } = await supabase
    .from('order_reminders')
    .select('id, order_id, reminder_type, message_sent')
    .eq('order_id', orderId)
    .limit(1)

    if (existingError) {
      throw existingError
    }

    if (existingReminders && existingReminders.length > 0) {
      return res.status(200).json({
        ok: true,
        ignored: true,
        reason: 'reminders already scheduled for this order',
        orderId,
      })
    }

    const order = await getOrderById(orderId)

    const statusId = order?.status?.id
    const clientId = order?.client?.id
    const fullName = order?.client?.first_name || order?.client?.name || 'zákazníku'

    // Test client +390988990758
    // if (clientId !== TARGET_CLIENT_ID) {
    //   return res.status(200).json({
    //     ok: true,
    //     ignored: true,
    //     reason: 'client mismatch',
    //     orderId,
    //     clientId,
    //   })
    // }

    const clientFirstName = getFirstName(fullName)
    console.log('DEBUG client first name:', clientFirstName)
    const phone = normalizePhone(order?.client?.phone?.[0])
    const orderScheduledFor = order?.scheduled_for

    if (!TARGET_STATUS_IDS.includes(Number(statusId))) {
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

    if (!orderScheduledFor) {
      return res.status(200).json({
        ok: true,
        ignored: true,
        reason: 'scheduled_for not found in order details',
        orderId,
        clientId,
      })
    }
    
    const reminders = getReminderDates(orderScheduledFor)
    const now = new Date()
    
    const remindersToSave = reminders
      .filter((item) => new Date(item.send_at).getTime() > now.getTime())
      .map((item) => ({
        order_id: orderId,
        client_id: clientId,
        phone,
        status_id: statusId,
        reminder_type: item.reminder_type,
        send_at: item.send_at,
        booking_at: orderScheduledFor,
        client_name: fullName,
        message_sent: false,
      }))
    
    if (!remindersToSave.length) {
      return res.status(200).json({
        ok: true,
        ignored: true,
        reason: 'All reminder times are already in the past',
        orderId,
        orderScheduledFor,
      })
    }
    
    const { error } = await supabase
      .from('order_reminders')
      .upsert(remindersToSave, {
        onConflict: 'order_id,reminder_type',
      })

    console.log('✅ reminders saved:', remindersToSave.length)

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
      orderScheduledFor,
      reminders: remindersToSave,
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

  console.log('🟡 getLeadById response summary:', {
    status: response.status,
    hasData: Boolean(response.data),
    isArray: Array.isArray(response.data),
    dataSummary: {
      name: response.data?.data?.[0]?.client?.name,
      phone: response.data?.data?.[0]?.client?.phone?.[0],
      statusName: response.data?.data?.[0]?.status?.name,
    },
  })

  return response.data?.data || response.data
}

async function handleLeadStatusChanged(
  payload: RoappWebhookPayload,
  res: VercelResponse
) {
  const leadId = payload?.metadata?.lead?.id || payload?.context?.object_id
  const newStatusId = payload?.metadata?.new?.id
  const oldStatusId = payload?.metadata?.old?.id

  console.log('🟡 Lead.Status.Changed:', {
    leadId,
    newStatusId,
    oldStatusId,
  })

  if (!leadId) {
    return res.status(400).json({
      ok: false,
      error: 'Missing lead id',
    })
  }

  const numericStatusId = Number(newStatusId)

  try {
    if (LEAD_FOLLOWUP_CANCEL_STATUS_IDS.includes(numericStatusId)) {
      const { error } = await supabase
        .from('lead_followups')
        .delete()
        .eq('lead_id', leadId)
        .eq('message_sent', false)

      if (error) {
        throw error
      }

      return res.status(200).json({
        ok: true,
        deleted: true,
        table: 'lead_followups',
        reason: 'lead converted or reminders disabled',
        leadId,
        newStatusId,
      })
    }

    if (LEAD_INVITATION_CANCEL_STATUS_IDS.includes(numericStatusId)) {
      const { error } = await supabase
        .from('lead_invitations')
        .delete()
        .eq('lead_id', leadId)
        .eq('message_sent', false)

      if (error) {
        throw error
      }

      return res.status(200).json({
        ok: true,
        deleted: true,
        table: 'lead_invitations',
        reason: 'lead converted or invitations disabled',
        leadId,
        newStatusId,
      })
    }

    const isFollowupStatus =
      LEAD_FOLLOWUP_TRIGGER_STATUS_IDS.includes(numericStatusId)

    const isInvitationStatus =
      LEAD_INVITATION_TRIGGER_STATUS_IDS.includes(numericStatusId)

    if (!isFollowupStatus && !isInvitationStatus) {
      return res.status(200).json({
        ok: true,
        ignored: true,
        reason: 'status is not a followup or invitation trigger',
        leadId,
        newStatusId,
      })
    }

    const leadResponse = await getLeadById(leadId)
    const lead = Array.isArray(leadResponse) ? leadResponse[0] : leadResponse

    console.log('🟡 Lead details summary:', {
      leadId,
      clientName: lead?.client?.name,
      clientId: lead?.client?.id,
      phone: lead?.client?.phone?.[0],
      statusId: lead?.status?.id,
      statusName: lead?.status?.name,
    })

    const { clientId, fullName, phone } = mapLeadClientDetails(lead)

    if (!phone) {
      return res.status(200).json({
        ok: true,
        ignored: true,
        reason: 'Phone not found in lead details',
        leadId,
        clientId,
      })
    }

    const now = Date.now()

    if (isFollowupStatus) {
      const { error: deleteOldFollowupsError } = await supabase
        .from('lead_followups')
        .delete()
        .eq('lead_id', leadId)
        .eq('message_sent', false)

      if (deleteOldFollowupsError) {
        throw deleteOldFollowupsError
      }

      const schedule = LEAD_FOLLOWUP_SCHEDULES[numericStatusId] || []

      const followupsToSave = schedule
        .map(item => ({
          lead_id: leadId,
          client_id: clientId,
          phone,
          client_name: fullName,
          trigger_status_id: numericStatusId,
          reminder_type: item.reminderType,
          send_at: getPragueFollowupSendAt({
            baseDateString: payload.created_at,
            daysToAdd: item.days,
          }),
          message_sent: false,
          canceled: false,
        }))
        .filter(item => new Date(item.send_at).getTime() > now)

      console.log('🟡 followupsToSave:', followupsToSave)

      if (!followupsToSave.length) {
        return res.status(200).json({
          ok: true,
          ignored: true,
          reason: 'All followup times are already in the past',
          leadId,
        })
      }

      const { error } = await supabase
        .from('lead_followups')
        .insert(followupsToSave)

      if (error) {
        throw error
      }

      return res.status(200).json({
        ok: true,
        event: payload.event_name,
        type: 'followup',
        leadId,
        clientId,
        statusId: numericStatusId,
        scheduled: true,
        followups: followupsToSave,
      })
    }

    if (isInvitationStatus) {
      const { error: deleteOldInvitationsError } = await supabase
        .from('lead_invitations')
        .delete()
        .eq('lead_id', leadId)
        .eq('message_sent', false)

      if (deleteOldInvitationsError) {
        throw deleteOldInvitationsError
      }

      const schedule = LEAD_INVITATION_SCHEDULES[numericStatusId] || []

      const invitationsToSave = schedule
        .map(item => ({
          lead_id: leadId,
          client_id: clientId,
          phone,
          client_name: fullName,
          trigger_status_id: numericStatusId,
          invitation_type: item.invitationType,
          send_at: getPragueFollowupSendAt({
            baseDateString: payload.created_at,
            daysToAdd: item.days,
          }),
          message_sent: false,
          canceled: false,
        }))
        .filter(item => new Date(item.send_at).getTime() > now)

      console.log('🟡 invitationsToSave:', invitationsToSave)

      if (!invitationsToSave.length) {
        return res.status(200).json({
          ok: true,
          ignored: true,
          reason: 'All invitation times are already in the past',
          leadId,
        })
      }

      const { error } = await supabase
        .from('lead_invitations')
        .insert(invitationsToSave)

      if (error) {
        throw error
      }

      return res.status(200).json({
        ok: true,
        event: payload.event_name,
        type: 'invitation',
        leadId,
        clientId,
        statusId: numericStatusId,
        scheduled: true,
        invitations: invitationsToSave,
      })
    }

    return res.status(200).json({
      ok: true,
      ignored: true,
      reason: 'No matching handler',
      leadId,
      newStatusId,
    })
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Lead.Status.Changed axios error:', {
        message: error.message,
        url: error.config?.url,
        status: error.response?.status,
        data: error.response?.data,
      })
    } else {
      console.error('Lead.Status.Changed unexpected error:', error)
    }

    return res.status(500).json({
      ok: false,
      error: 'Lead.Status.Changed processing failed',
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

    case 'Lead.Status.Changed':
      return handleLeadStatusChanged(payload, res)

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