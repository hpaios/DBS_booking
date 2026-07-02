const STATUS_WAITING_FOR_PARTS_ORDER = 4317344 // Ждем приезда (заказать детали)
const STATUS_WAITING_FOR_CLIENT_ARRIVAL = 4287767 // Ждем приезда клиента (все есть)
const STATUS_WAITING_FOR_PARTS_DELIVERY = 4317345 // Ждем приезда (детали заказаны)

const STATUS_WAITING_NEW_FOR_PARTS_ORDER = 5596962 // Ждем NEW (заказать детали)
const STATUS_WAITING_NEW_FOR_PARTS_DELIVERY = 5596963 // Ждем NEW (детали заказаны)
const STATUS_WAITING_NEW_FOR_CLIENT_ARRIVAL = 5596961 // Ждем NEW клиента (все есть)

const CAR_PICKED_UP_STATUS_ID_CZ = 4280182 // Авто забрали CZ
export const CAR_PICKED_UP_STATUS_ID_RU = 5569527 // Авто забрали RU
export const CAR_PICKED_UP_NO_MESSAGE_STATUS_ID = 5596551 // Авто забрали, сообщение не отправляем

export const STATUS_NOT_RELEVANT = 3543295 // Не актуально

const FREQUENT_REMINDERS_STATUS_ID = 4324903 // частые напоминалки CZ
const MEDIUM_REMINDERS_STATUS_ID = 4324902 // средние напоминалки CZ
const RARE_REMINDERS_STATUS_ID = 4325775 // редкие напоминалки CZ

const FREQUENT_REMINDERS_STATUS_ID_RU = 4355565 // частые напоминалки RU
const MEDIUM_REMINDERS_STATUS_ID_RU = 4355564 // средние напоминалки RU
const RARE_REMINDERS_STATUS_ID_RU = 4355566 // редкие напоминалки RU

const INVITATION_STATUS_ID_CZ = 4356502 // приглашение CZ
const INVITATION_STATUS_ID_RU = 4356503 // приглашение RU

const CLIENT_CONVERTED_STATUS_ID = 4324936 // конвертнулся в клиента (отключить напоминалки)
const DISABLE_REMINDERS_STATUS_ID = 4324967 // выключить напоминалки (отключить напоминалки)
const DISABLE_INVITATION_STATUS_ID = 4356504 // выключить приглашение (отключить приглашение)

export const CAR_PICKED_UP_STATUS_IDS = [
  CAR_PICKED_UP_STATUS_ID_CZ,
  CAR_PICKED_UP_STATUS_ID_RU,
]

export const TARGET_STATUS_IDS = [STATUS_WAITING_FOR_PARTS_ORDER, STATUS_WAITING_FOR_CLIENT_ARRIVAL, STATUS_WAITING_FOR_PARTS_DELIVERY]

export const LEAD_FOLLOWUP_TRIGGER_STATUS_IDS = [
  FREQUENT_REMINDERS_STATUS_ID,
  MEDIUM_REMINDERS_STATUS_ID,
  RARE_REMINDERS_STATUS_ID,

  FREQUENT_REMINDERS_STATUS_ID_RU,
  MEDIUM_REMINDERS_STATUS_ID_RU,
  RARE_REMINDERS_STATUS_ID_RU,
]

export const LEAD_FOLLOWUP_CANCEL_STATUS_IDS = [
  CLIENT_CONVERTED_STATUS_ID,
  DISABLE_REMINDERS_STATUS_ID,
]

export const LEAD_INVITATION_TRIGGER_STATUS_IDS = [
  INVITATION_STATUS_ID_CZ,
  INVITATION_STATUS_ID_RU,
]

export const LEAD_INVITATION_CANCEL_STATUS_IDS = [
  CLIENT_CONVERTED_STATUS_ID,
  DISABLE_INVITATION_STATUS_ID,
]

export const NEW_CLIENT_STATUS_IDS = [
  STATUS_WAITING_NEW_FOR_PARTS_ORDER,
  STATUS_WAITING_NEW_FOR_PARTS_DELIVERY,
  STATUS_WAITING_NEW_FOR_CLIENT_ARRIVAL,
]

export const LEAD_FOLLOWUP_SCHEDULES: Record<number, { days: number; reminderType: string }[]> = {
  [FREQUENT_REMINDERS_STATUS_ID]: [
    { days: 1, reminderType: 'frequent_1d' },
    { days: 3, reminderType: 'frequent_3d' },
    { days: 7, reminderType: 'frequent_7d' },
  ],

  [MEDIUM_REMINDERS_STATUS_ID]: [
    { days: 2, reminderType: 'medium_2d' },
    { days: 7, reminderType: 'medium_7d' },
    { days: 14, reminderType: 'medium_14d' },
  ],

  [RARE_REMINDERS_STATUS_ID]: [
    { days: 7, reminderType: 'rare_7d' },
    { days: 14, reminderType: 'rare_14d' },
    { days: 28, reminderType: 'rare_28d' },
  ],
  [FREQUENT_REMINDERS_STATUS_ID_RU]: [
    { days: 1, reminderType: 'frequent_ru_1d' },
    { days: 3, reminderType: 'frequent_ru_3d' },
    { days: 7, reminderType: 'frequent_ru_7d' },
  ],
  [MEDIUM_REMINDERS_STATUS_ID_RU]: [
    { days: 2, reminderType: 'medium_ru_2d' },
    { days: 7, reminderType: 'medium_ru_7d' },
    { days: 14, reminderType: 'medium_ru_14d' },
  ],
  [RARE_REMINDERS_STATUS_ID_RU]: [
    { days: 7, reminderType: 'rare_ru_7d' },
    { days: 14, reminderType: 'rare_ru_14d' },
    { days: 28, reminderType: 'rare_ru_28d' },
  ],
}

export const LEAD_INVITATION_SCHEDULES: Record<
  number,
  { days: number; invitationType: string }[]
> = {
  [INVITATION_STATUS_ID_CZ]: [
    { days: 2, invitationType: 'invitation_cz_2d' },
    { days: 7, invitationType: 'invitation_cz_7d' },
    { days: 14, invitationType: 'invitation_cz_14d' },
  ],

  [INVITATION_STATUS_ID_RU]: [
    { days: 2, invitationType: 'invitation_ru_2d' },
    { days: 7, invitationType: 'invitation_ru_7d' },
    { days: 14, invitationType: 'invitation_ru_14d' },
  ],
}

// Test client +390988990758
export const TARGET_CLIENT_ID = 37567839 // for test