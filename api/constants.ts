const STATUS_WAITING_FOR_PARTS_ORDER = 4317344 // Ждем приезда (заказать детали)
const STATUS_WAITING_FOR_CLIENT_ARRIVAL = 4287767 // Ждем приезда клиента (все есть)
const STATUS_WAITING_FOR_PARTS_DELIVERY = 4317345 // Ждем приезда (детали заказаны)

export const STATUS_NOT_RELEVANT = 3543295 // Не актуально

const FREQUENT_REMINDERS_STATUS_ID = 4324903 // частые напоминалки CZ
const MEDIUM_REMINDERS_STATUS_ID = 4324902 // средние напоминалки CZ
const RARE_REMINDERS_STATUS_ID = 4325775 // редкие напоминалки CZ

const FREQUENT_REMINDERS_STATUS_ID_RU = 4355565 // частые напоминалки RU
const MEDIUM_REMINDERS_STATUS_ID_RU = 4355564 // средние напоминалки RU
const RARE_REMINDERS_STATUS_ID_RU = 4355566 // редкие напоминалки RU

const CLIENT_CONVERTED_STATUS_ID = 4324936 // конвертнулся в клиента (отключить напоминалки)
const DISABLE_REMINDERS_STATUS_ID = 4324967 // выключить напоминалки (отключить напоминалки)

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

// Test client +390988990758
export const TARGET_CLIENT_ID = 37567839 // for test