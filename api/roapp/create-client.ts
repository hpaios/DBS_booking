import type { VercelRequest, VercelResponse } from '@vercel/node'
import axios from 'axios'

const ROAPP_API_BASE_URL =
  process.env.ROAPP_API_BASE_URL || 'https://api.roapp.io/v2'
const ROAPP_API_KEY = process.env.ROAPP_API_KEY

function normalizePhone(phone: string) {
  const trimmed = phone.trim()

  if (!trimmed) return ''
  if (trimmed.startsWith('+')) return trimmed

  return `+${trimmed.replace(/^\+/, '')}`
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      ok: false,
      error: 'Method not allowed',
    })
  }

  if (!ROAPP_API_KEY) {
    return res.status(500).json({
      ok: false,
      error: 'ROAPP_API_KEY is missing',
    })
  }

  try {
    const { first_name, name, phone, email } = req.body || {}

    const clientName = first_name || name

    if (!clientName || !phone) {
      return res.status(400).json({
        ok: false,
        error: 'name/first_name and phone are required',
      })
    }

    const payload = {
      first_name: clientName,
      phone: normalizePhone(phone),
      email: email || '',
    }

    const response = await axios.post(
      `${ROAPP_API_BASE_URL}/contacts/people`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${ROAPP_API_KEY}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        timeout: 15000,
      }
    )

    const rawData = response.data
    const createdClient = rawData?.data || rawData

    return res.status(200).json({
      ok: true,
      clientId: createdClient?.id || null,
      data: createdClient,
    })
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('create-client axios error:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      })
    } else {
      console.error('create-client unexpected error:', error)
    }

    return res.status(500).json({
      ok: false,
      error: 'Failed to create client',
    })
  }
}