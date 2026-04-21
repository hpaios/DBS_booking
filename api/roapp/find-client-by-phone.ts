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
  if (req.method === 'GET') {
    const phone = String(req.query.phone || '')

    if (!phone) {
      return res.status(400).json({
        ok: false,
        error: 'phone is required',
      })
    }

    if (!ROAPP_API_KEY) {
      return res.status(500).json({
        ok: false,
        error: 'ROAPP_API_KEY is missing',
      })
    }

    try {
      const normalizedPhone = normalizePhone(phone)

      const response = await axios.get(
        `${ROAPP_API_BASE_URL}/contacts/people`,
        {
          params: {
            names: '',
            phones: normalizedPhone,
          },
          headers: {
            Authorization: `Bearer ${ROAPP_API_KEY}`,
            Accept: 'application/json',
          },
          timeout: 15000,
        }
      )

      const rawData = response.data
      const people = rawData?.data || rawData?.results || rawData || []

      const person = Array.isArray(people) ? people[0] : null

      return res.status(200).json({
        ok: true,
        found: Boolean(person?.id),
        clientId: person?.id || null,
        person: person || null,
      })
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('find-client-by-phone axios error:', {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data,
        })
      } else {
        console.error('find-client-by-phone unexpected error:', error)
      }

      return res.status(500).json({
        ok: false,
        error: 'Failed to find client by phone',
      })
    }
  }

  return res.status(405).json({
    ok: false,
    error: 'Method not allowed',
  })
}