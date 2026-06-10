import { CAR_PICKED_UP_STATUS_ID_RU } from '../constants'

export function buildReminderMessage({
  reminderType,
  bookingAt,
  clientName,
  statusId,
}: {
  reminderType: string
  bookingAt: string
  clientName?: string | null
  statusId?: number | null
}): string {
  const formattedName = clientName
    ?.trim()
    .split(/\s+/)
    .map(
      word =>
        word.charAt(0).toUpperCase() +
        word.slice(1).toLowerCase()
    )
    .join(' ') || 'zákazníku'

  const date = new Date(bookingAt)

  const weekday = new Intl.DateTimeFormat('cs-CZ', {
    weekday: 'long',
    timeZone: 'Europe/Prague',
  }).format(date)

  const day = new Intl.DateTimeFormat('cs-CZ', {
    day: 'numeric',
    timeZone: 'Europe/Prague',
  })
    .format(date)
    .replace('.', '')

  const month = new Intl.DateTimeFormat('cs-CZ', {
    month: 'long',
    timeZone: 'Europe/Prague',
  }).format(date)

  const bookingDate = `${weekday}, ${day} ${month}`

  const bookingTime = date.toLocaleTimeString('cs-CZ', {
    timeZone: 'Europe/Prague',
    hour: '2-digit',
    minute: '2-digit',
  })

  const commonLines = [
    `🗓 Datum: ${bookingDate}`,
    `⏰ Čas: ${bookingTime}`,
    `📍 Adresa: Františka Kadlece 2441, 180 00 Praha 8`,
  ]

  switch (reminderType) {
    case '48h':
      return [
        `Dobrý den, ${formattedName}.`,
        `Rádi bychom Vám připomněli Vaši rezervaci v DBS Autoservis & Detailing.`,
        ...commonLines,
        `Těšíme se na Vaši návštěvu!`,
      ].join('\n')
  
    case '24h':
      return [
        `Dobrý den, ${formattedName}.`,
        `Vaše návštěva v DBS Autoservis & Detailing proběhne již zítra.`,
        ...commonLines,
        `Těšíme se na Vaši návštěvu!`,
      ].join('\n')
  
    case '12h':
      return [
        `Dobrý den, ${formattedName}.`,
        `Rádi bychom Vám připomněli Vaši rezervaci v DBS Autoservis & Detailing.`,
        ...commonLines,
        ``,
        `Pokud se Vaše plány změnily, informujte nás prosím na telefonním čísle +420 720 773 201.`,
        `Těšíme se na Vaši návštěvu!`,
      ].join('\n')
  
    case '2h':
      return [
        `Dobrý den, ${formattedName}.`,
        `Za 2 hodiny Vás očekáváme v DBS Autoservis & Detailing.`,
        ...commonLines,
        ``,
        `Pokud se Vaše plány změnily, informujte nás prosím na telefonním čísle +420 720 773 201.`,
        `Těšíme se na Vaši návštěvu!`,
      ].join('\n')

      case 'car_picked_up_2d':
        if (statusId === CAR_PICKED_UP_STATUS_ID_RU) {
          return [
            `Добрый день, ${formattedName}.`,
            ``,
            `Спасибо, что воспользовались услугами DBS.`,
            `Хотел уточнить, всё ли в порядке с автомобилем после посещения сервиса и остались ли Вы довольны нашей работой?`,
            ``,
            `Если возникнут любые вопросы, я с удовольствием помогу.`,
            ``,
            `С уважением,`,
            `Илья`,
            `DBS`,
          ].join('\n')
        }
      
        return [
          `Dobrý den, ${formattedName}.`,
          ``,
          `Děkujeme, že jste využil služeb DBS.`,
          `Jen se chci zeptat, zda je po návštěvě vše v pořádku a zda jste byl spokojený s naší prací.`,
          ``,
          `Pokud budete mít jakýkoliv dotaz, rád Vám pomohu.`,
          ``,
          `S pozdravem,`,
          `Ilja`,
          `DBS`,
        ].join('\n')
  
    default:
      return [
        `Dobrý den, ${formattedName}.`,
        `Rádi bychom Vám připomněli Vaši rezervaci v DBS Autoservis & Detailing.`,
        ...commonLines,
        `Těšíme se na Vaši návštěvu!`,
      ].join('\n')
  }
}