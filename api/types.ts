export type RoappWebhookPayload = {
  id?: string
  created_at?: string
  created_at_ts?: number
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
    order?: {
      id?: number
      name?: string
      client?: {
        id?: number
      }
    }
    status?: {
      id?: number
    }
    new?: {
      id?: number
    }
    old?: {
      id?: number
    }
    client?: {
      fullname?: string
      phone?: string
    }
    closed_at?: string | null
  }
}

export type RoappOrderResponse = {
  id: number
  status?: {
    id?: number
    name?: string
  }
  client?: {
    id?: number
    name?: string
    first_name?: string
    phone?: string[]
  }
  scheduled_for?: string | null
  scheduled_to?: string | null
}