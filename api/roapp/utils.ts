import { CAR_PICKED_UP_STATUS_ID_RU } from '../constants.js'

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
          `Спасибо, что выбрали DBS.`,
          `Хотел узнать, всё ли прошло так, как Вы ожидали, и остались ли Вы довольны нашим сервисом?`,
          `Если появятся какие-либо вопросы или потребуется наша помощь, всегда буду рад помочь.`,
          ``,
          `С уважением,`,
          `Илья`,
          `DBS`,
          ].join('\n')
        }
      
        return [
          `Dobrý den, ${formattedName}.`,
          ``,
          `Děkujeme, že jste si vybral DBS.`,
          `Jen jsem se chtěl zeptat, zda vše proběhlo podle Vašich očekávání a zda bylo vše v pořádku.`,
          `Pokud budete mít jakékoliv dotazy nebo budete potřebovat naši pomoc, kdykoliv se na nás můžete obrátit.`,
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