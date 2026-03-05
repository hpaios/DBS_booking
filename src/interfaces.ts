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
};

export interface Category {
  label: string;
  servicesIds: number[];
};

export interface MappedCategory {
  label: string;
  services: Service[];
};
