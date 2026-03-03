export type StepKey =
  | "select_categories"
  | "select_services"
  | "select_slots"
  | "booking_confirmation";

export interface Step {
  key: StepKey;
  label: string;
}
