document.addEventListener("DOMContentLoaded", () => {
const cards = [...document.querySelectorAll(".quiz-card")];
// Dynamic text only: static content is localized in Webflow.
const quizLang = (document.documentElement.lang || "cs").toLowerCase().split("-")[0];
const activeLang = ["cs", "en", "uk", "ru"].includes(quizLang) ? quizLang : "cs";
const quizLocale = { cs: "cs-CZ", en: "en-GB", uk: "uk-UA", ru: "ru-RU" }[activeLang];
const quizTranslations = {
  cs: {
    autoservice: "AUTOSERVIS", detailing: "DETAILING",
    priceAutoservice: "Poslat VIN", priceDetailing: "Napsat",
    sending: "Odesíláme vaši žádost…",
    invalidVin: "VIN musí obsahovat přesně 17 znaků.",
    slotsError: "Nepodařilo se načíst dostupné termíny."
  },
  en: {
    autoservice: "CAR SERVICE", detailing: "DETAILING",
    priceAutoservice: "Send VIN", priceDetailing: "Message Us",
    sending: "Sending your request…",
    invalidVin: "VIN must contain exactly 17 characters.",
    slotsError: "Unable to load available appointments."
  },
  uk: {
    autoservice: "АВТОСЕРВІС", detailing: "ДЕТЕЙЛІНГ",
    priceAutoservice: "Надіслати VIN", priceDetailing: "Написати",
    sending: "Надсилаємо ваш запит…",
    invalidVin: "VIN має містити рівно 17 символів.",
    slotsError: "Не вдалося завантажити доступні дати та час."
  },
  ru: {
    autoservice: "АВТОСЕРВИС", detailing: "ДЕТЕЙЛИНГ",
    priceAutoservice: "Отправить VIN", priceDetailing: "Написать",
    sending: "Отправляем ваш запрос…",
    invalidVin: "VIN должен содержать ровно 17 символов.",
    slotsError: "Не удалось загрузить доступные даты и время."
  }
};
function t(key) {
  return quizTranslations[activeLang][key] ?? quizTranslations.cs[key] ?? key;
}
cards.forEach(card => {
  if (card.querySelector(":scope > .quiz-gradient-border")) return;
  const border = document.createElement("div");
  border.className = "quiz-gradient-border";
  border.setAttribute("aria-hidden", "true");
  card.append(border);
});
const restartBtn = document.querySelector('[data-quiz="restart"]');
const topBackBtn = document.querySelector('[data-quiz="back"]');
const closeBtn = document.querySelector('[data-quiz="close"]');
const overlay = document.querySelector('[data-quiz="overlay"]');
function lockPageScroll() {
  document.documentElement.classList.add("quiz-open");
  document.body.classList.add("quiz-open");
}
function unlockPageScroll() {
  document.documentElement.classList.remove("quiz-open");
  document.body.classList.remove("quiz-open");
}
const datesList = document.querySelector('[data-dates="list"]');
const timesList = document.querySelector('[data-times="list"]');
const bookingLoader = document.querySelector('[data-booking-loader="true"]');
cards.filter(card => ["booking-contact", "price-contact"].includes(card.dataset.step)).forEach(card => {
  const content = card.querySelector(".card-content") || card;
  if (content.querySelector(":scope > .quiz-submit-overlay")) return;
  const loader = document.createElement("div");
  loader.className = "quiz-submit-overlay";
  loader.setAttribute("role", "status");
  loader.setAttribute("aria-live", "polite");
  loader.innerHTML = `<span class="quiz-submit-spinner" aria-hidden="true"></span><span>${t("sending")}</span>`;
  content.append(loader);
});
function setSubmitting(card, active) {
  if (!card) return;
  card.classList.toggle("is-submitting", active);
  card.setAttribute("aria-busy", String(active));
}
const LOCATION_ID = 186414;
const BOOKING_CONFIG = {
  autoservice: {
    employeeId: 308291,
    serviceId: 58017002,
    durationMinutes: 60
  },
  detailing: {
    employeeId: 310673,
    serviceId: 58009290,
    durationMinutes: 60
  }
};
const state = {
  step: "start",
  service: null,
  intent: null,
  vin: "",
  description: "",
  date: null,
  time: null,
  slotStart: null,
  slotEnd: null,
  name: "",
  phone: "",
  email: "",
  history: []
};
let bookingSlots = [];
let bookingWeekSchedule = [];
let bookingSlotsLoadedFor = null;
let isBookingSubmitting = false;
let isPriceSubmitting = false;
let currentCard = null;
let isDragging = false;
let startX = 0;
let currentX = 0;
const SWIPE_THRESHOLD = 100;
const SWIPE_DURATION = 750;
const SWIPE_ROTATION = 12;
const SWIPE_EXIT_ROTATION = 16;
const STATIC_STEPS = [
  "success",
  "price-success-wa",
  "price-list"
];
function isStaticCard(card) {
  if (!card) return false;
  return STATIC_STEPS.includes(
    card.dataset.step
  );
}
function getCard(step) {
  return cards.find(
    card => card.dataset.step === step
  );
}
function isVinValid(value) {
  return /^[A-HJ-NPR-Z0-9]{17}$/.test(
    value.trim().toUpperCase()
  );
}
function isCardValid(card) {
  if (!card) return false;
  if (card.dataset.step === "booking-datetime") {
    return Boolean(
      state.date &&
      state.time &&
      state.slotStart
    );
  }
  const requiredFields = [
    ...card.querySelectorAll(
      "input[required], textarea[required], select[required]"
    )
  ];
  if (!requiredFields.length) {
    return true;
  }
  return requiredFields.every(field => {
    if (field.offsetParent === null) {
      return true;
    }
    if (field.type === "checkbox") {
      return field.checked;
    }
    if (field.type === "radio") {
      if (!field.name) {
        return field.checked;
      }
      const group = [
        ...card.querySelectorAll(
          `input[type="radio"][name="${CSS.escape(field.name)}"]`
        )
      ];
      return group
        .filter(radio => radio.offsetParent !== null)
        .some(radio => radio.checked);
    }
    const value = field.value.trim();
    if (field.dataset.field === "vin") {
      return (
        isVinValid(value) &&
        field.checkValidity()
      );
    }
    return (
      value !== "" &&
      field.checkValidity()
    );
  });
}
function showValidation(card) {
  if (!card) return;
  if (card.dataset.step === "booking-datetime") {
    if (!state.date) {
      return;
    }
    if (!state.time) {
      return;
    }
    return;
  }
  const requiredFields = [
    ...card.querySelectorAll(
      "input[required], textarea[required], select[required]"
    )
  ];
  const invalidField = requiredFields.find(field => {
    if (field.offsetParent === null) {
      return false;
    }
    if (field.type === "checkbox") {
      return !field.checked;
    }
    if (field.type === "radio") {
      if (!field.name) {
        return !field.checked;
      }
      const group = [
        ...card.querySelectorAll(
          `input[type="radio"][name="${CSS.escape(field.name)}"]`
        )
      ];
      return !group
        .filter(radio => radio.offsetParent !== null)
        .some(radio => radio.checked);
    }
    const value = field.value.trim();
    if (field.dataset.field === "vin") {
      return (
        !isVinValid(value) ||
        !field.checkValidity()
      );
    }
    return (
      value === "" ||
      !field.checkValidity()
    );
  });
  if (!invalidField) return;
  if (invalidField.dataset.field === "vin") {
    invalidField.setCustomValidity(
      t("invalidVin")
    );
  }
  if (
    typeof invalidField.reportValidity === "function"
  ) {
    invalidField.reportValidity();
  }
  invalidField.focus();
  if (invalidField.dataset.field === "vin") {
    invalidField.setCustomValidity("");
  }
}
function showCard(step, addHistory = true) {
  const nextCard = getCard(step);
  if (!nextCard) {
    return;
  }
  if (
    addHistory &&
    state.step &&
    state.step !== step
  ) {
    state.history.push(state.step);
  }
  cards.forEach(card => {
    card.style.display = "none";
    card.style.transform = "translateX(0px) rotate(0deg)";
    card.style.transition = "";
    card.style.cursor = "";
    clearSwipeGlow(card, true);
    card.classList.remove("is-final-glow");
  });
  nextCard.style.display = "flex";
  nextCard.style.transform = "translateX(0px) rotate(0deg)";
  if (isStaticCard(nextCard)) {
    nextCard.classList.add("is-final-glow");
    nextCard.style.setProperty("--swipe-glow-right", 1);
  }
  currentCard = nextCard;
  state.step = step;
  updateDynamicContent();
  updateSummary();
  restoreFields();
  restoreDateTimeSelection();
  updateControls();
  updateProgress();
  if (step === "booking-datetime") {
    loadBookingDateTime();
  }
}
function updateDynamicContent() {
  document
    .querySelectorAll("[data-show-for]")
    .forEach(element => {
      element.style.display =
        element.dataset.showFor === state.service
          ? ""
          : "none";
    });
  document
    .querySelectorAll('[data-content="service-label"]')
    .forEach(element => {
      element.textContent = state.service ? t(state.service) : "";
    });
  document
    .querySelectorAll('[data-content="price-action-primary"]')
    .forEach(element => {
      element.textContent = state.service === "autoservice"
        ? t("priceAutoservice")
        : state.service === "detailing" ? t("priceDetailing") : "";
    });
}
function updateSummary() {
  document
    .querySelectorAll('[data-summary="service"]')
    .forEach(element => {
      element.textContent = state.service ? t(state.service) : "";
    });
  document
    .querySelectorAll('[data-summary="vin"]')
    .forEach(element => {
      element.textContent = state.vin || "";
    });
  document
    .querySelectorAll('[data-summary="date"]')
    .forEach(element => {
      if (!state.date) {
        element.textContent = "";
        return;
      }
      const date =
        new Date(
          `${state.date}T12:00:00`
        );
      element.textContent =
        new Intl.DateTimeFormat(
          quizLocale,
          {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
          }
        ).format(date);
    });
  document
    .querySelectorAll('[data-summary="time"]')
    .forEach(element => {
      element.textContent =
        state.time || "";
    });
  updateReadyButtons();
  document
  .querySelectorAll('[data-content="success-datetime"]')
  .forEach(element => {
    if (!state.date || !state.time) {
      element.textContent = "";
      return;
    }

    const lang = document.documentElement.lang
      .toLowerCase()
      .split("-")[0];

    const locales = {
      cs: "cs-CZ",
      en: "en-GB",
      uk: "uk-UA",
      ru: "ru-RU"
    };

    const locale = locales[lang] || "cs-CZ";
    const date = new Date(`${state.date}T12:00:00`);

    const formattedDate = new Intl.DateTimeFormat(locale, {
      weekday: "short",
      day: "numeric",
      month: "short"
    }).format(date);

    element.textContent = `${formattedDate} · ${state.time}`;
  });
}
function updateReadyButtons() {
  cards.forEach(card => {
    const ready = card === currentCard && isCardValid(card);

    card.querySelectorAll(
      '.card-actions [data-action="next"], .card-actions [data-action="submit-booking"], .card-actions [data-action="submit-price"]'
    ).forEach(button => {
      button.classList.toggle("is-ready", ready);
    });
  });
}
function saveCurrentFields() {
  if (!currentCard) return;
  currentCard
    .querySelectorAll("[data-field]")
    .forEach(field => {
      const name = field.dataset.field;
      if (!name) return;
      if (
        field.type === "checkbox" ||
        field.type === "radio"
      ) {
        state[name] = field.checked;
      } else {
        state[name] = field.value.trim();
      }
    });
  updateSummary();
}
function restoreFields() {
  if (!currentCard) return;
  currentCard
    .querySelectorAll("[data-field]")
    .forEach(field => {
      const name = field.dataset.field;
      if (!name) return;
      const value = state[name];
      if (
        value === null ||
        value === undefined
      ) {
        return;
      }
      if (
        field.type === "checkbox" ||
        field.type === "radio"
      ) {
        field.checked = Boolean(value);
      } else {
        field.value = value;
      }
    });
}
function getToday() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const year = today.getFullYear();
  const month = String(
    today.getMonth() + 1
  ).padStart(2, "0");
  const day = String(
    today.getDate()
  ).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
// function shiftIsoByTwoHours(iso) {
//   const date = iso.slice(0, 10);
//   const [hours, minutes] =
//     iso
//       .slice(11, 16)
//       .split(":")
//       .map(Number);
//   let newHours = hours + 2;
//   let newDate = date;
//   if (newHours >= 24) {
//     newHours -= 24;
//     const dateObject =
//       new Date(`${date}T00:00:00Z`);
//     dateObject.setUTCDate(
//       dateObject.getUTCDate() + 1
//     );
//     newDate =
//       dateObject
//         .toISOString()
//         .slice(0, 10);
//   }
//   return (
//     `${newDate}T` +
//     `${String(newHours).padStart(2, "0")}:` +
//     `${String(minutes).padStart(2, "0")}:00Z`
//   );
// }
function shiftIsoByTwoHours(iso) {
  const date = new Date(iso);

  if (Number.isNaN(date.getTime())) {
    return iso;
  }

  const formatter = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Prague",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23"
  });

  const parts = formatter.formatToParts(date);

  const get = type =>
    parts.find(part => part.type === type)?.value;

  return (
    `${get("year")}-${get("month")}-${get("day")}T` +
    `${get("hour")}:${get("minute")}:${get("second")}`
  );
}
function shiftSlotsByTwoHours(slots) {
  return slots.map(slot => ({
    ...slot,
    dateStart:
      shiftIsoByTwoHours(
        slot.dateStart
      ),
    dateEnd:
      shiftIsoByTwoHours(
        slot.dateEnd
      )
  }));
}
function getWeekday(dateString) {
  const [year, month, day] =
    dateString.split("-").map(Number);
  const date = new Date(
    year,
    month - 1,
    day
  );
  return (date.getDay() + 6) % 7;
}
function normalizeBookingSlots(
  slots,
  weekSchedule
) {
  const scheduleMap =
    new Map(
      weekSchedule.map(
        day => [
          day.idx,
          day
        ]
      )
    );
  const now = new Date();
  const today =
    `${now.getFullYear()}-` +
    `${String(now.getMonth() + 1).padStart(2, "0")}-` +
    `${String(now.getDate()).padStart(2, "0")}`;
  const currentTime =
    `${String(now.getHours()).padStart(2, "0")}:` +
    `${String(now.getMinutes()).padStart(2, "0")}`;
  return slots
    .filter(slot => {
      const day =
        slot.dateStart.slice(0, 10);
      const start =
        slot.dateStart.slice(11, 16);
      const end =
        slot.dateEnd.slice(11, 16);
      const weekday =
        getWeekday(day);
      const schedule =
        scheduleMap.get(weekday);
      if (!schedule) {
        return false;
      }
      if (!schedule.workDay) {
        return false;
      }
      if (start < schedule.startTime) {
        return false;
      }
      if (end > schedule.endTime) {
        return false;
      }
      if (
        day === today &&
        start <= currentTime
      ) {
        return false;
      }
      return true;
    })
    .sort(
      (a, b) =>
        a.dateStart.localeCompare(
          b.dateStart
        )
    );
}
function showBookingLoader() {
  if (bookingLoader) {
    bookingLoader.style.display = "flex";
  }
  if (datesList) {
    datesList.style.display = "none";
  }
  if (timesList) {
    timesList.style.display = "none";
  }
}
function hideBookingLoader() {
  if (bookingLoader) {
    bookingLoader.style.display = "none";
  }
  if (datesList) {
    datesList.style.display = "";
  }
  if (timesList) {
    timesList.style.display = "";
  }
}
async function loadBookingDateTime() {
  if (!state.service) return;
  const config =
    BOOKING_CONFIG[state.service];
  if (!config) return;
  if (
    bookingSlotsLoadedFor === state.service &&
    bookingSlots.length
  ) {
    hideBookingLoader();
    renderBookingDates();
    return;
  }
  showBookingLoader();
  try {
    state.date = null;
    state.time = null;
    state.slotStart = null;
    state.slotEnd = null;
    bookingSlots = [];
    if (datesList) {
      datesList.innerHTML = "";
    }
    if (timesList) {
      timesList.innerHTML = "";
    }
    const locationResponse =
      await fetch(
        "https://booking.dbservice.cz/api/booking-slots?type=location"
      );
    if (!locationResponse.ok) {
      throw new Error(
        `Locations request failed: ${locationResponse.status}`
      );
    }
    const locations =
      await locationResponse.json();
    const location =
      locations.find(
        item =>
          item.id === LOCATION_ID
      );
    if (!location) {
      throw new Error(
        `Location ${LOCATION_ID} not found`
      );
    }
    bookingWeekSchedule =
      location.weekSchedule || [];
    const params =
      new URLSearchParams({
        employee_id:
          String(
            config.employeeId
          ),
        slot_minutes:
          String(
            config.durationMinutes
          ),
        period_days:
          "31",
        start_date:
          getToday()
      });
    const slotsResponse =
      await fetch(
        `https://booking.dbservice.cz/api/booking-slots?type=timeslots&${params.toString()}`
      );
    if (!slotsResponse.ok) {
      throw new Error(
        `Timeslots request failed: ${slotsResponse.status}`
      );
    }
    const rawSlots =
      await slotsResponse.json();
    const shiftedSlots =
      shiftSlotsByTwoHours(
        rawSlots
      );
    bookingSlots =
      normalizeBookingSlots(
        shiftedSlots,
        bookingWeekSchedule
      );
    bookingSlotsLoadedFor =
      state.service;
    hideBookingLoader();
    renderBookingDates();
  } catch (error) {
    console.error(
      "DATE/TIME ERROR:",
      error
    );
    hideBookingLoader();
    if (datesList) {
      datesList.innerHTML =
        `<div class="booking-slots-error">
          ${t("slotsError")}
        </div>`;
    }
    if (timesList) {
      timesList.innerHTML = "";
    }
  }
}
function getCalendarDates() {
  const dates = [];
  const [year, month, day] =
    getToday()
      .split("-")
      .map(Number);
  const start =
    new Date(
      year,
      month - 1,
      day,
      12,
      0,
      0
    );
  for (
    let i = 0;
    i < 31;
    i++
  ) {
    const date =
      new Date(start);
    date.setDate(
      start.getDate() + i
    );
    const dateYear =
      date.getFullYear();
    const dateMonth =
      String(
        date.getMonth() + 1
      ).padStart(2, "0");
    const dateDay =
      String(
        date.getDate()
      ).padStart(2, "0");
    dates.push(
      `${dateYear}-${dateMonth}-${dateDay}`
    );
  }
  return dates;
}
function formatBookingDate(dateString) {
  const date =
    new Date(
      `${dateString}T12:00:00`
    );
  const weekday =
    new Intl.DateTimeFormat(
      quizLocale,
      { weekday: "short" }
    )
      .format(date)
      .replace(".", "");
  const day =
    new Intl.DateTimeFormat(
      quizLocale,
      { day: "numeric" }
    ).format(date);
  const month =
    new Intl.DateTimeFormat(
      quizLocale,
      { month: "short" }
    )
      .format(date)
      .replace(".", "");
  return {
    weekday,
    day,
    month
  };
}
function getSlotsForDate(dateString) {
  return bookingSlots.filter(
    slot =>
      slot.dateStart.slice(
        0,
        10
      ) === dateString
  );
}
function renderBookingDates() {
  if (!datesList) return;
  datesList.innerHTML = "";
  const dates =
    getCalendarDates();
  const today =
    getToday();
  const previewDate = !state.date
    ? dates.find(date => getSlotsForDate(date).length > 0)
    : state.date;
  dates.forEach(dateString => {
    const formatted =
      formatBookingDate(
        dateString
      );
    const slots =
      getSlotsForDate(
        dateString
      );
    const isDisabled =
      slots.length === 0;
    const dayElement =
      document.createElement(
        "div"
      );
    dayElement.className =
      "day";
    dayElement.dataset.date =
      dateString;
    if (isDisabled) {
      dayElement.classList.add(
        "is-disabled"
      );
      dayElement.setAttribute(
        "aria-disabled",
        "true"
      );
    }
    if (
      !isDisabled &&
      state.date === dateString
    ) {
      dayElement.classList.add(
        "is-selected"
      );
    }
    dayElement.innerHTML = `
      <div class="day-weekday">
        ${formatted.weekday}
      </div>
      <div class="day-number">
        ${formatted.day}
      </div>
      <div class="day-month">
        ${formatted.month}
      </div>
    `;
    datesList.appendChild(
      dayElement
    );
  });
  if (previewDate && getSlotsForDate(previewDate).length) {
    renderBookingTimes(previewDate);
  } else if (timesList) {
    timesList.innerHTML = "";
  }
  updateSummary();
}
function renderBookingTimes(dateString) {
  if (!timesList) return;
  timesList.innerHTML = "";
  const slots =
    getSlotsForDate(
      dateString
    );
  slots.forEach(slot => {
    const time =
      slot.dateStart.slice(
        11,
        16
      );
    const timeElement =
      document.createElement(
        "div"
      );
    timeElement.className =
      "time";
    timeElement.dataset.time =
      time;
    timeElement.dataset.slotStart =
      slot.dateStart;
    timeElement.dataset.slotEnd =
      slot.dateEnd;
    timeElement.textContent =
      time;
    if (
      state.time === time
    ) {
      timeElement.classList.add(
        "is-selected"
      );
    }
    timesList.appendChild(
      timeElement
    );
  });
}
if (datesList) {
  datesList.addEventListener(
    "click",
    event => {
      const day =
        event.target.closest(
          "[data-date]"
        );
      if (
        !day ||
        !datesList.contains(day)
      ) {
        return;
      }
      if (
        day.classList.contains(
          "is-disabled"
        )
      ) {
        return;
      }
      datesList
        .querySelectorAll(
          "[data-date]"
        )
        .forEach(item => {
          item.classList.remove(
            "is-selected"
          );
        });
      day.classList.add(
        "is-selected"
      );
      state.date =
        day.dataset.date;
      state.time = null;
      state.slotStart = null;
      state.slotEnd = null;
      renderBookingTimes(
        state.date
      );
      updateSummary();
    }
  );
}
if (timesList) {
  timesList.addEventListener(
    "click",
    event => {
      const time =
        event.target.closest(
          "[data-time]"
        );
      if (
        !time ||
        !timesList.contains(time)
      ) {
        return;
      }
      timesList
        .querySelectorAll(
          "[data-time]"
        )
        .forEach(item => {
          item.classList.remove(
            "is-selected"
          );
        });
      time.classList.add(
        "is-selected"
      );
      state.time =
        time.dataset.time;
      state.slotStart =
        time.dataset.slotStart;
      state.slotEnd =
        time.dataset.slotEnd;
      state.date = state.slotStart.slice(0, 10);
      if (datesList) {
        datesList.querySelectorAll("[data-date]").forEach(day => {
          day.classList.toggle("is-selected", day.dataset.date === state.date);
        });
      }
      updateSummary();
    }
  );
}
function restoreDateTimeSelection() {
  if (datesList) {
    datesList
      .querySelectorAll(
        "[data-date]"
      )
      .forEach(day => {
        day.classList.toggle(
          "is-selected",
          day.dataset.date === state.date
        );
      });
  }
  if (timesList) {
    timesList
      .querySelectorAll(
        "[data-time]"
      )
      .forEach(time => {
        time.classList.toggle(
          "is-selected",
          time.dataset.time === state.time
        );
      });
  }
}
async function submitBooking(button) {
  if (isBookingSubmitting) {
    return;
  }
  saveCurrentFields();
  const submittingCard = currentCard;
  try {
    isBookingSubmitting = true;
    setSubmitting(submittingCard, true);
    if (button) {
      button.disabled = true;
      button.setAttribute(
        "aria-disabled",
        "true"
      );
    }
    const response =
      await fetch(
        "https://booking.dbservice.cz/api/webflow-booking",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json"
          },
          body: JSON.stringify({
            service:
              state.service,
            name:
              state.name,
            phone:
              state.phone,
            email:
              state.email,
            vin:
              state.vin,
            description:
              state.description,
            slotStart:
              state.slotStart,
            slotEnd:
              state.slotEnd,
            bookingSource: window.DBSBookingTracking?.getSource() || {}
          })
        }
      );
    const data =
      await response.json();
    if (
      !response.ok ||
      !data?.ok
    ) {
      throw new Error(
        data?.error ||
        `Booking failed (${response.status})`
      );
    }
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "booking_submit",
      source: "assistant",
      service: state.service
    });
    showCard(
      "success"
    );
  } catch (error) {
    console.error(error);
    resetCard(
      currentCard
    );
  } finally {
    setSubmitting(submittingCard, false);
    isBookingSubmitting =
      false;
    if (button) {
      button.disabled = false;
      button.removeAttribute(
        "aria-disabled"
      );
    }
  }
}
async function submitPriceRequest(button) {
  if (isPriceSubmitting) {
    return;
  }
  saveCurrentFields();
  const submittingCard = currentCard;
  try {
    isPriceSubmitting = true;
    setSubmitting(submittingCard, true);
    if (button) {
      button.disabled = true;
      button.setAttribute(
        "aria-disabled",
        "true"
      );
    }
    const response =
      await fetch(
        "https://booking.dbservice.cz/api/webflow-price-request",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json"
          },
          body: JSON.stringify({
            service:
              state.service,
            name:
              state.name,
            phone:
              state.phone,
            vin:
              state.vin,
            description:
              state.description,
            bookingSource: window.DBSBookingTracking?.getSource() || {}
          })
        }
      );
    let data = null;
    try {
      data = await response.json();
    } catch (_) {
      data = null;
    }
    if (
      !response.ok ||
      !data?.ok
    ) {
      throw new Error(
        data?.error ||
        `Price request failed (${response.status})`
      );
    }
    showCard(
      "price-success-wa"
    );
  } catch (error) {
    console.error(
      error
    );
    resetCard(
      currentCard
    );
  } finally {
    setSubmitting(submittingCard, false);
    isPriceSubmitting =
      false;
    if (button) {
      button.disabled = false;
      button.removeAttribute(
        "aria-disabled"
      );
    }
  }
}
function getNextStep(
  action,
  value
) {
  if (action === "service") {
    return "intent";
  }
  if (action === "intent") {
    if (
      value === "booking" ||
      value === "reserve" ||
      value === "reservation"
    ) {
      return "booking-description";
    }
    if (
      value === "price" ||
      value === "pricing"
    ) {
      return "price-action";
    }
  }
  if (
    action === "price-details"
  ) {
    return "price-details";
  }
  if (
    action === "view-price"
  ) {
    return "price-list";
  }
  if (action === "next") {
    if (
      state.step ===
      "booking-description"
    ) {
      return "booking-datetime";
    }
    if (
      state.step ===
      "booking-datetime"
    ) {
      return "booking-contact";
    }
    if (
      state.step ===
      "price-details"
    ) {
      return "price-contact";
    }
  }
  if (
    action ===
    "submit-booking"
  ) {
    return null;
  }
  if (
    action ===
    "submit-price"
  ) {
    return "price-success-wa";
  }
  return null;
}
function actionRequiresValidation(
  action
) {
  if (
    action === "back" ||
    action === "finish"
  ) {
    return false;
  }
  return [
    "next",
    "submit-booking",
    "submit-price"
  ].includes(action);
}
function finishQuiz() {
  saveCurrentFields();
  if (overlay) {
    overlay.style.display =
      "none";
  }
  unlockPageScroll();
}
function processAction(button) {
  if (!button || isBookingSubmitting || isPriceSubmitting) return;
  const action =
    button.dataset.action;
  const value =
    button.dataset.value;
  if (!action) return;
  if (action === "finish") {
    finishQuiz();
    return;
  }
  if (
    actionRequiresValidation(action) &&
    !isCardValid(currentCard)
  ) {
    resetCard(
      currentCard
    );
    showValidation(
      currentCard
    );
    return;
  }
  saveCurrentFields();
  if (action === "back") {
    goBack();
    return;
  }
  if (
    action ===
    "submit-booking"
  ) {
    submitBooking(
      button
    );
    return;
  }
  if (
    action ===
    "submit-price"
  ) {
    submitPriceRequest(
      button
    );
    return;
  }
  if (action === "service") {
    const serviceChanged =
      state.service &&
      state.service !== value;
    state.service =
      value;
    if (serviceChanged) {
      bookingSlots = [];
      bookingSlotsLoadedFor = null;
      state.date = null;
      state.time = null;
      state.slotStart = null;
      state.slotEnd = null;
    }
  }
  if (action === "intent") {
    state.intent =
      value;
  }
  const nextStep =
    getNextStep(
      action,
      value
    );
  if (!nextStep) {
    return;
  }
  showCard(
    nextStep
  );
}
function getCardActions(card) {
  if (!card) {
    return {
      left: null,
      right: null
    };
  }
  const buttons = [
    ...card.querySelectorAll(
      '.card-actions [data-action]:not([data-action="finish"]):not([data-action="back"])'
    )
  ];
  if (!buttons.length) {
    return {
      left: null,
      right: null
    };
  }
  const cardRect =
    card.getBoundingClientRect();
  const cardCenter =
    cardRect.left +
    cardRect.width / 2;
  let left = null;
  let right = null;
  buttons.forEach(button => {
    const rect =
      button.getBoundingClientRect();
    const center =
      rect.left +
      rect.width / 2;
    if (
      center <
      cardCenter
    ) {
      left = button;
    } else {
      right = button;
    }
  });
  return {
    left,
    right
  };
}
function updateSwipeGlow(card, deltaX) {
  if (!card) return;
  const intensity = Math.min(Math.abs(deltaX) / 170, 1);
  const left = deltaX < -2 ? intensity : 0;
  const right = deltaX > 2 ? intensity : 0;
  card.style.setProperty("--swipe-glow-left", left);
  card.style.setProperty("--swipe-glow-right", right);
  const actions = getCardActions(card);
  if (actions.left) {
    actions.left.style.setProperty("--swipe-choice-intensity", left);
    actions.left.classList.toggle("is-swipe-choice", left > 0);
  }
  if (actions.right) {
    actions.right.style.setProperty("--swipe-choice-intensity", right);
    actions.right.classList.toggle("is-swipe-choice", right > 0);
  }
}
function clearSwipeGlow(card, immediate = false) {
  if (!card) return;
  if (immediate) card.classList.add("swipe-glow-instant");
  else card.classList.remove("swipe-glow-instant");
  card.style.setProperty("--swipe-glow-left", 0);
  card.style.setProperty("--swipe-glow-right", 0);
  card.querySelectorAll(".card-actions .is-swipe-choice")
    .forEach(button => {
      button.style.setProperty("--swipe-choice-intensity", 0);
      button.classList.remove("is-swipe-choice");
    });
  if (immediate) {
    void card.offsetWidth;
    card.classList.remove("swipe-glow-instant");
  }
}
function completeSwipe(
  direction,
  button
) {
  if (!currentCard || isBookingSubmitting || isPriceSubmitting) return;
  if (!button) {
    resetCard(
      currentCard
    );
    return;
  }
  const action =
    button.dataset.action;
  if (
    action ===
    "submit-booking"
  ) {
    if (
      !isCardValid(
        currentCard
      )
    ) {
      resetCard(
        currentCard
      );
      showValidation(
        currentCard
      );
      return;
    }
    resetCard(
      currentCard
    );
    submitBooking(
      button
    );
    return;
  }
  if (
    action ===
    "submit-price"
  ) {
    if (
      !isCardValid(
        currentCard
      )
    ) {
      resetCard(
        currentCard
      );
      showValidation(
        currentCard
      );
      return;
    }
    resetCard(
      currentCard
    );
    submitPriceRequest(
      button
    );
    return;
  }
  if (action === "finish") {
    finishQuiz();
    return;
  }
  if (action === "back") {
    goBack();
    return;
  }
  if (
    actionRequiresValidation(action) &&
    !isCardValid(currentCard)
  ) {
    resetCard(
      currentCard
    );
    showValidation(
      currentCard
    );
    return;
  }
  if (
    button.disabled ||
    button.getAttribute(
      "aria-disabled"
    ) === "true"
  ) {
    resetCard(
      currentCard
    );
    return;
  }
  const card =
    currentCard;
  const moveX =
    direction === "right"
      ? window.innerWidth
      : -window.innerWidth;
  updateSwipeGlow(card, direction === "right" ? 170 : -170);
  card.style.transition =
    `transform ${SWIPE_DURATION}ms cubic-bezier(.22,.61,.36,1)`;
  card.style.transform =
    `translateX(${moveX}px) rotate(${
      direction === "right"
        ? SWIPE_EXIT_ROTATION
        : -SWIPE_EXIT_ROTATION
    }deg)`;
  setTimeout(
    () => {
      processAction(
        button
      );
    },
    SWIPE_DURATION
  );
}
function resetCard(card) {
  if (!card) return;
  clearSwipeGlow(card);
  card.style.transition =
    "transform 0.3s cubic-bezier(.22,.61,.36,1)";
  card.style.transform =
    "translateX(0px) rotate(0deg)";
}
cards.forEach(card => {
  card.addEventListener(
    "pointerdown",
    event => {
      if (
        card !== currentCard ||
        isStaticCard(card) ||
        !isCardValid(card)
      ) {
        return;
      }
      if (
        event.target.closest(
          "input, textarea, select, [data-date], [data-time], .card-actions"
        )
      ) {
        return;
      }
      isDragging = true;
      startX =
        event.clientX;
      currentX = 0;
      try {
        card.setPointerCapture(
          event.pointerId
        );
      } catch (error) {}
      card.style.transition =
        "none";
      card.classList.add("swipe-glow-dragging");
      card.style.cursor =
        "grabbing";
    }
  );
  card.addEventListener(
    "pointermove",
    event => {
      if (
        !isDragging ||
        card !== currentCard
      ) {
        return;
      }
      currentX =
        event.clientX -
        startX;
      const rotation =
        Math.max(-SWIPE_ROTATION, Math.min(SWIPE_ROTATION, currentX / 170 * SWIPE_ROTATION));
      card.style.transform =
        `translateX(${currentX}px) rotate(${rotation}deg)`;
      updateSwipeGlow(card, currentX);
    }
  );
  card.addEventListener(
    "pointerup",
    () => {
      if (
        !isDragging ||
        card !== currentCard
      ) {
        return;
      }
      isDragging = false;
      card.classList.remove("swipe-glow-dragging");
      card.style.cursor = "";
      const actions =
        getCardActions(card);
      if (
        currentX >
        SWIPE_THRESHOLD
      ) {
        completeSwipe(
          "right",
          actions.right
        );
        return;
      }
      if (
        currentX <
        -SWIPE_THRESHOLD
      ) {
        completeSwipe(
          "left",
          actions.left
        );
        return;
      }
      resetCard(card);
    }
  );
  card.addEventListener(
    "pointercancel",
    () => {
      if (!isDragging) return;
      isDragging = false;
      card.classList.remove("swipe-glow-dragging");
      card.style.cursor = "";
      resetCard(card);
    }
  );
});
cards.forEach(card => {
  card.addEventListener(
    "click",
    event => {
      const button =
        event.target.closest(
          ".card-actions [data-action]"
        );
      if (
        !button ||
        card !== currentCard ||
        isBookingSubmitting || isPriceSubmitting
      ) {
        return;
      }
      event.preventDefault();
      const action =
        button.dataset.action;
      if (
        action ===
        "submit-booking"
      ) {
        if (
          !isCardValid(
            currentCard
          )
        ) {
          resetCard(
            currentCard
          );
          showValidation(
            currentCard
          );
          return;
        }
        submitBooking(
          button
        );
        return;
      }
      if (
        action === "finish"
      ) {
        finishQuiz();
        return;
      }
      if (
        action === "back"
      ) {
        goBack();
        return;
      }
      const buttonRect =
        button.getBoundingClientRect();
      const cardRect =
        card.getBoundingClientRect();
      const buttonCenter =
        buttonRect.left +
        buttonRect.width / 2;
      const cardCenter =
        cardRect.left +
        cardRect.width / 2;
      if (
        buttonCenter <
        cardCenter
      ) {
        completeSwipe(
          "left",
          button
        );
        return;
      }
      if (
        buttonCenter >
        cardCenter
      ) {
        completeSwipe(
          "right",
          button
        );
        return;
      }
      processAction(
        button
      );
    }
  );
});
function goBack() {
  saveCurrentFields();
  if (
    !state.history.length
  ) {
    return;
  }
  const previousStep =
    state.history.pop();
  showCard(
    previousStep,
    false
  );
}
if (topBackBtn) {
  topBackBtn.addEventListener(
    "click",
    event => {
      event.preventDefault();
      event.stopPropagation();
      goBack();
    }
  );
}
function updateControls() {
  const isFirstStep =
    state.step === "start";
  if (topBackBtn) {
    topBackBtn.style.opacity =
      isFirstStep
        ? "0.35"
        : "1";
    topBackBtn.style.pointerEvents =
      isFirstStep
        ? "none"
        : "auto";
  }
  if (restartBtn) {
    restartBtn.style.opacity =
      isFirstStep
        ? "0.35"
        : "1";
    restartBtn.style.pointerEvents =
      isFirstStep
        ? "none"
        : "auto";
  }
}
function restartQuiz() {
  state.step = "start";
  state.service = null;
  state.intent = null;
  state.vin = "";
  state.description = "";
  state.date = null;
  state.time = null;
  state.slotStart = null;
  state.slotEnd = null;
  state.name = "";
  state.phone = "";
  state.email = "";
  state.history = [];
  bookingSlots = [];
  bookingWeekSchedule = [];
  bookingSlotsLoadedFor = null;
  isBookingSubmitting = false;
  isPriceSubmitting = false;
  document
    .querySelectorAll(
      ".quiz-card [data-field]"
    )
    .forEach(field => {
      if (
        field.type === "checkbox" ||
        field.type === "radio"
      ) {
        field.checked = false;
      } else {
        field.value = "";
      }
      if (
        typeof field.setCustomValidity ===
        "function"
      ) {
        field.setCustomValidity("");
      }
    });
  document
    .querySelectorAll(
      ".quiz-card .is-selected"
    )
    .forEach(element => {
      element.classList.remove(
        "is-selected"
      );
    });
  if (datesList) {
    datesList.innerHTML = "";
  }
  if (timesList) {
    timesList.innerHTML = "";
  }
  showCard(
    "start",
    false
  );
}
if (restartBtn) {
  restartBtn.addEventListener(
    "click",
    event => {
      event.preventDefault();
      event.stopPropagation();
      restartQuiz();
    }
  );
}
if (closeBtn) {
  closeBtn.addEventListener("click", event => {
    event.preventDefault();
    event.stopPropagation();

    saveCurrentFields();

    if (overlay) {
      overlay.style.display = "none";
    }

    unlockPageScroll();
  });
}
document.addEventListener(
  "input",
  event => {
    const field =
      event.target.closest(
        "[data-field]"
      );
    if (!field) return;
    const name =
      field.dataset.field;
    if (!name) return;
    if (name === "phone") {
      const value =
        field.value.replace(
          /[^0-9+\-() ]/g,
          ""
        );
      field.value =
        value;
      state.phone =
        value.trim();
      return;
    }
    if (name === "vin") {
      const value =
        field.value
          .toUpperCase()
          .replace(
            /[^A-HJ-NPR-Z0-9]/g,
            ""
          )
          .slice(0, 17);
      field.value =
        value;
      field.setCustomValidity("");
      state.vin =
        value;
      updateSummary();
      return;
    }
    if (
      field.type === "checkbox" ||
      field.type === "radio"
    ) {
      state[name] =
        field.checked;
    } else {
      state[name] =
        field.value.trim();
    }
    updateSummary();
  }
);
function updateProgress() {
  let progress = 1;
  switch (state.step) {
    case "start":
    case "intent":
      progress = 1;
      break;
    case "price-action":
    case "booking-description":
      progress = 2;
      break;
    case "price-details":
    case "booking-datetime":
      progress = 3;
      break;
    case "price-contact":
    case "booking-contact":
    case "price-list":
    case "price-success-wa":
    case "success":
      progress = 4;
      break;
  }
  for (
    let i = 1;
    i <= 4;
    i++
  ) {
    const segment =
      document.querySelector(
        `[data-progress="${i}"]`
      );
    if (!segment) continue;
    segment.classList.toggle(
      "is-active",
      i <= progress
    );
  }
}
if (overlay && getComputedStyle(overlay).display !== "none") {
  lockPageScroll();
}
hideBookingLoader();
showCard(
  "start",
  false
);
});