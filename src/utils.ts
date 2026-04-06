import { afternoonSlots, morningSlots } from './config'
import type { ApiTimeSlot, Category, DaySlots, FormattedDate, GroupedArray, GroupedServices, GroupedServicesByCategory, MappedCategory, Service, WeekScheduleItem } from './interfaces'

export const isObjectEmpty = (obj: Record<string, unknown>) =>
  obj && Object.keys(obj).length === 0 && obj.constructor === Object;

export const toggleId = (arr: number[], id: number): number[] =>
  arr.includes(id) ? arr.filter((i) => i !== id) : [...arr, id];

export const toggleObjectById = <T extends { id: number | string }>(
  arr: T[],
  obj: T
): T[] =>
  arr.some((i) => i.id === obj.id)
    ? arr.filter((i) => i.id !== obj.id)
    : [...arr, obj];

export const mapServicesByCategory = (
  categories: Category[],
  services: Service[]
): MappedCategory[] => {
  const servicesMap = new Map<number, Service>(
    services.map((service) => [service.id, service])
  );

  return categories.map((category) => ({
    label: category.label,
    parentCategoryId: category.parentCategoryId,
    services: category.servicesIds
      .map((id) => servicesMap.get(id))
      .filter((service): service is Service => Boolean(service))
      .map((service) => ({
        ...service,
        parentCategoryId: category.parentCategoryId,
        parentCategoryLabel: category.parentCategoryLabel
      })),
  }));
};

export const getUniqueParentCategoryIds = (services: Service[]) => {
  return [...new Set(services.map((service) => service.parentCategoryId))];
};

export const getToday = (): string => {
  const today = new Date();
  today.setHours(0,0,0,0);
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export const groupServicesByParentCategory = (services: Service[]): GroupedServices[] => {
  const map = new Map<number, Service[]>();

  services.forEach((service) => {
    if (!map.has(service.parentCategoryId)) {
      map.set(service.parentCategoryId, []);
    }

    map.get(service.parentCategoryId)!.push(service);
  });

  return Array.from(map.entries()).map(([parentCategoryId, services]) => ({
    parentCategoryId,
    services,
  }));
};

export const getLocalDateKey = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export const getLocalTime = (date: Date): string => {
  return date.toTimeString().slice(0, 5);
};

export const addDays = (date: Date, days: number): Date => {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
};

export const getSlotTime = (iso: string): string => {
  return iso.slice(11, 16);
};

export const mapSlotsByDays = (slots: ApiTimeSlot[]) => {
  const calendar: Record<string, DaySlots> = {};

  const today = new Date();
  today.setHours(0,0,0,0);

  for (let i = 0; i < 31; i++) {
    const date = addDays(today, i);
    const dateKey = getLocalDateKey(date);

    calendar[dateKey] = {
      morning: [],
      afternoon: [],
    };
  }

  slots.forEach((slot) => {
    const date = new Date(slot.dateStart);

    const dateKey = getLocalDateKey(date);
    const time = getSlotTime(slot.dateStart);

    if (!calendar[dateKey]) return;

    if (morningSlots.includes(time)) {
      calendar[dateKey].morning.push(slot);
    }

    if (afternoonSlots.includes(time)) {
      calendar[dateKey].afternoon.push(slot);
    }
  });

  return calendar;
};

const getWeekday = (date: string) => {
  const [y, m, d] = date.split("-").map(Number);

  const t = [0, 3, 2, 5, 0, 3, 5, 1, 4, 6, 2, 4];
  const year = m < 3 ? y - 1 : y;

  const weekday =
    (year +
      Math.floor(year / 4) -
      Math.floor(year / 100) +
      Math.floor(year / 400) +
      t[m - 1] +
      d) %
    7;

  return (weekday + 6) % 7;
};

export const normalizeSlotsBySchedule = (
  slots: ApiTimeSlot[],
  weekSchedule: WeekScheduleItem[]
): ApiTimeSlot[] => {

  const slotsByDay = new Map<string, ApiTimeSlot[]>();

  const getDate = (iso: string) => iso.slice(0, 10);
  const getTime = (iso: string) => iso.slice(11, 16);

  const scheduleMap = new Map(weekSchedule.map((d) => [d.idx, d]));

  const now = new Date();
  const today = now.toLocaleDateString("sv-SE"); // YYYY-MM-DD
  const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(
    now.getMinutes()
  ).padStart(2, "0")}`;

  // группировка слотов по дню
  for (const slot of slots) {
    const day = getDate(slot.dateStart);

    if (!slotsByDay.has(day)) {
      slotsByDay.set(day, []);
    }

    slotsByDay.get(day)!.push(slot);
  }

  const result: ApiTimeSlot[] = [];

  for (const [day, daySlots] of slotsByDay) {

    const weekday = getWeekday(day); // Monday = 0
    const schedule = scheduleMap.get(weekday);

    if (!schedule || !schedule.workDay) continue;

    daySlots.sort((a, b) => a.dateStart.localeCompare(b.dateStart));

    const filtered: ApiTimeSlot[] = [];

    for (const slot of daySlots) {

      const start = getTime(slot.dateStart);
      const end = getTime(slot.dateEnd);

      if (start < schedule.startTime) continue;
      if (end > schedule.endTime) continue;

      // удаляем прошедшие слоты сегодня
      if (day === today && start <= currentTime) continue;

      filtered.push(slot);
    }

    result.push(...filtered);
  }

  return result.sort((a, b) => a.dateStart.localeCompare(b.dateStart));
};

export const formatIsoDateCs = (iso: string): FormattedDate => {
  const date = new Date(iso);

  const weekdayRaw = date.toLocaleDateString("cs-CZ", { weekday: "short" });
  const weekday = weekdayRaw.charAt(0).toUpperCase() + weekdayRaw.slice(1);

  const day = date.toLocaleDateString("cs-CZ", { day: "numeric" }).replace(/\.$/, "")
  const month = date.toLocaleDateString("cs-CZ", { month: "short" });

  const label = `${weekday} ${day}. ${month}`;

  return { weekday, day, month, label };
};

export const formatDurationCsShort = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  const hourStr = hours > 0 ? `${hours} hod` : "";
  const minStr = mins > 0 ? `${mins} min` : "";

  return [hourStr, minStr].filter(Boolean).join(" ");
};

export const shiftSlotsByHour = (slots: ApiTimeSlot[]): ApiTimeSlot[] => {

  const shift = (iso: string) => {
    const date = iso.slice(0, 10)
    const [h, m] = iso.slice(11, 16).split(":").map(Number)

    const newH = String(h + 1).padStart(2, "0")
    const newM = String(m).padStart(2, "0")

    return `${date}T${newH}:${newM}:00Z`
  }

  return slots.map(slot => ({
    dateStart: shift(slot.dateStart),
    dateEnd: shift(slot.dateEnd)
  }))
}

export const shiftSlotsByTwoHours = (slots: ApiTimeSlot[]): ApiTimeSlot[] => {

  const shift = (iso: string) => {
    const date = iso.slice(0, 10)
    const [h, m] = iso.slice(11, 16).split(":").map(Number)

    const newH = String(h + 2).padStart(2, "0")
    const newM = String(m).padStart(2, "0")

    return `${date}T${newH}:${newM}:00Z`
  }

  return slots.map(slot => ({
    dateStart: shift(slot.dateStart),
    dateEnd: shift(slot.dateEnd)
  }))
}

export const addMinutes = (iso: string, minutes: number) => {
  const date = new Date(iso);
  date.setMinutes(date.getMinutes() + minutes);

  return date.toISOString();
};

export const subtractHour = (iso: string) => {
  const date = iso.slice(0, 10)
  const [h, m] = iso.slice(11, 16).split(":").map(Number)

  const newH = String(h - 1).padStart(2, "0")
  const newM = String(m).padStart(2, "0")

  return `${date}T${newH}:${newM}:00Z`
}

export const subtractTwoHours = (iso: string) => {
  const datePart = iso.slice(0, 10)
  const [h, m] = iso.slice(11, 16).split(":").map(Number)

  let newH = h - 2
  let newDate = datePart

  if (newH < 0) {
    newH += 24

    const d = new Date(datePart)
    d.setDate(d.getDate() - 1)

    newDate = d.toISOString().slice(0, 10)
  }

  return `${newDate}T${String(newH).padStart(2, "0")}:${String(m).padStart(2, "0")}:00Z`
}

// export const subtractHour = (iso: string) => {
//   const date = iso.slice(0, 10)
//   const [h, m] = iso.slice(11, 16).split(":").map(Number)

//   const newH = String(h - 1).padStart(2, "0")
//   const newM = String(m).padStart(2, "0")

//   return `${date}T${newH}:${newM}:00Z`
// }

export const filterSlotsByDuration = (
  slots: ApiTimeSlot[],
  requiredSlots: number
): ApiTimeSlot[] => {

  if (requiredSlots <= 1) return slots

  const result: ApiTimeSlot[] = []

  const slotsByDay: Record<string, ApiTimeSlot[]> = {}

  for (const slot of slots) {
    const day = slot.dateStart.slice(0, 10)
    if (!slotsByDay[day]) slotsByDay[day] = []
    slotsByDay[day].push(slot)
  }

  for (const daySlots of Object.values(slotsByDay)) {

    daySlots.sort((a, b) =>
      a.dateStart.localeCompare(b.dateStart)
    )

    for (let i = 0; i <= daySlots.length - requiredSlots; i++) {

      let valid = true

      for (let j = 0; j < requiredSlots - 1; j++) {

        const currentEnd = daySlots[i + j].dateEnd
        const nextStart = daySlots[i + j + 1].dateStart

        if (currentEnd !== nextStart) {
          valid = false
          break
        }
      }

      if (valid) {
        result.push(daySlots[i])
      }
    }
  }

  return result
}

export const groupByCategory = (services: Service[]): GroupedServicesByCategory => {
  return services.reduce((acc, service) => {
    const key = service.parentCategoryLabel;

    if (!acc[key]) {
      acc[key] = [];
    }

    acc[key].push(service);

    return acc;
  }, {} as GroupedServicesByCategory);
};

export const groupServicesToArray = (services: Service[]): GroupedArray[] => {
  const grouped = groupByCategory(services);

  return Object.entries(grouped).map(([label, services]) => ({
    label,
    services
  }));
};

export const formatBookingDateTimeCs = (
  date: string,
  time: string
) => {
  const d = new Date(`${date}T${time}:00`)

  const parts = new Intl.DateTimeFormat("cs-CZ", {
    weekday: "long",
    day: "numeric",
    month: "long"
  }).formatToParts(d)

  const weekday = parts.find(p => p.type === "weekday")?.value ?? ""
  const day = parts.find(p => p.type === "day")?.value ?? ""
  const month = parts.find(p => p.type === "month")?.value ?? ""

  const formattedTime = new Intl.DateTimeFormat("cs-CZ", {
    hour: "2-digit",
    minute: "2-digit"
  }).format(d)

  return `${weekday}, ${day} ${month} v ${formattedTime}`
}