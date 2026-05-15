function getTimezoneOffsetMs(date: Date, timeZone: string): number {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date)

  const values = Object.fromEntries(
    parts
      .filter(part => part.type !== 'literal')
      .map(part => [part.type, Number(part.value)])
  ) as Record<string, number>

  const utcFromParts = Date.UTC(
    values.year,
    values.month - 1,
    values.day,
    values.hour,
    values.minute,
    values.second
  )

  return utcFromParts - date.getTime()
}

function makeZonedDateTimeUtc({
  year,
  month,
  day,
  hour,
  minute,
  second = 0,
  timeZone,
}: {
  year: number
  month: number
  day: number
  hour: number
  minute: number
  second?: number
  timeZone: string
}): Date {
  const utcGuess = new Date(Date.UTC(year, month - 1, day, hour, minute, second))
  const offsetMs = getTimezoneOffsetMs(utcGuess, timeZone)

  return new Date(utcGuess.getTime() - offsetMs)
}

function addDaysToYmd({
  year,
  month,
  day,
  days,
}: {
  year: number
  month: number
  day: number
  days: number
}) {
  const date = new Date(Date.UTC(year, month - 1, day + days, 12, 0, 0))

  return {
    year: date.getUTCFullYear(),
    month: date.getUTCMonth() + 1,
    day: date.getUTCDate(),
  }
}

export function getPragueFollowupSendAt({
  baseDateString,
  daysToAdd,
}: {
  baseDateString?: string
  daysToAdd: number
}) {
  const timeZone = 'Europe/Prague'
  const baseDate = baseDateString ? new Date(baseDateString) : new Date()

  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(baseDate)

  const year = Number(parts.find(part => part.type === 'year')?.value)
  const month = Number(parts.find(part => part.type === 'month')?.value)
  const day = Number(parts.find(part => part.type === 'day')?.value)

  const targetYmd = addDaysToYmd({
    year,
    month,
    day,
    days: daysToAdd,
  })

  return makeZonedDateTimeUtc({
    ...targetYmd,
    hour: 14,
    minute: 0,
    timeZone,
  }).toISOString()
}

export function mapLeadClientDetails(lead: {
  client?: {
    id?: number
    name?: string
    fullname?: string
    full_name?: string
    first_name?: string
    phone?: string[]
    phones?: string[]
    phone_number?: string
    client_phone?: string
  }
}) {
  const client = lead?.client || null

  const clientId = client?.id || null
  const fullName =
    client?.name ||
    client?.fullname ||
    client?.full_name ||
    client?.first_name ||
    'zákazníku'

  const phone = client?.phone?.[0] || null

  return {
    clientId,
    fullName,
    phone,
  }
}