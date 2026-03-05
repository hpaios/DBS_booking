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

export interface TimeslotsResponse {
  slots: {
    start: string;
    end: string;
  }[];
}

export type Timeslot = string;

export interface TimeslotsProps {
  date: string;
  onSelect: (slot: Timeslot) => void;
  selectedSlot?: Timeslot;
};
