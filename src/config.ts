import type { Step, TimeSlot } from './interfaces'

export const captchaKey = '6LdmE5AsAAAAAB6icFXF3T9v0VosP8MZakE3r5f9'

export const steps: Step[] = [
  { key: "select_categories", label: "Vyberte kategorii" },
  { key: "select_services", label: "Vyberte služby" },
  { key: "select_slots", label: "Vyberte datum a čas" },
  { key: "booking_confirmation", label: "Podrobnosti schůzky" },
  { key: "success_page", label: "Schůzka potvrzena" }
];

export const morningSlots: TimeSlot[] = ["08:00", "09:00", "10:00", "11:00"];
export const afternoonSlots: TimeSlot[] = ["12:00", "13:00", "14:00", "15:00", "16:00", "17:00"];

export const servicesConfig = [
  {
    label: '🔥 Akce',
    servicesIds: [57822361, 58010425, 58015267, 58015985, 58015870, 58015700],
    parentCategoryId: 308291,
    parentCategoryLabel: 'Autoservis'
  },
  {
    label: 'Pravidelná údržba',
    servicesIds: [58017002, 58042342, 58042544, 58042631, 58042708, 58042772, 58042986, 58043237, 58043315, 58043394, 58043585, 58043650, 58043702, 58043784, 58043901, 58046282, 58046323, 58046978, 58047192, 58047390, 58047448, 58047593],
    parentCategoryId: 308291,
    parentCategoryLabel: 'Autoservis'
  },
  {
    label: 'Zjištění závad a opravy',
    servicesIds: [58048440, 58048471, 58048748, 58048773, 58049569],
    parentCategoryId: 308291,
    parentCategoryLabel: 'Autoservis'
  },
  {
    label: 'Techcentrum',
    servicesIds: [58049726, 58049739, 58049765, 58049782, 58049829, 58049845, 58049862, 58014321, 58013892, 58014028, 58014073, 58014126, 58014262, 58014297, 58014349],
    parentCategoryId: 308291,
    parentCategoryLabel: 'Autoservis'
  },
  {
    label: 'Detailing',
    servicesIds: [58009290, 58009452, 58009540, 58009762, 58009942, 58010022, 58010077, 58010123, 58010450, 58010520, 58010932, 58010975, 58011090, 58011788, 58012150, 58012905, 58009984],
    parentCategoryId: 310673,
    parentCategoryLabel: 'Detailing'
  }
]