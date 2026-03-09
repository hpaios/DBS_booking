export type StepKey =
  | "select_categories"
  | "select_services"
  | "select_slots"
  | "booking_confirmation";

export interface Step {
  key: StepKey;
  label: string;
}

export interface Service {
  id: number;
  title: string;
  description: string;
  durationMinutes: number;
  price: number;
  parentCategoryId: number;
};

export interface ServicesResponse {
  count: number;
  page: number;
  pageSize: number;
  totalPages: number;
  data: Service[];
};

export interface Category {
  label: string;
  servicesIds: number[];
  parentCategoryId: number;
};

export interface MappedCategory {
  label: string;
  services: Service[];
};

export interface TimeSlotsResponse {
  slots: {
    start: string;
    end: string;
  }[];
}

export type TimeSlot = string;

export interface TimeSlotsProps {
  date: string;
  onSelect: (slot: TimeSlot) => void;
  selectedSlot?: TimeSlot;
};

export interface GroupedServices {
    parentCategoryId: number;
    services: Service[];
 };

 export interface ApiTimeSlot {
  dateStart: string;
  dateEnd: string;
};

export interface DaySlots {
  morning: ApiTimeSlot[];
  afternoon: ApiTimeSlot[];
}

export interface WeekScheduleItem {
  idx: number; // 0-6
  workDay: boolean;
  startTime: string; // "08:00"
  endTime: string;   // "18:00"
}
