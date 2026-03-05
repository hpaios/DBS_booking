import type { Category, MappedCategory, Service } from './interfaces'

export const toggleId = (arr: number[], id: number): number[] => {
  return arr.includes(id)
    ? arr.filter((item) => item !== id)
    : [...arr, id];
};

export const mapServicesByCategory = (
  categories: Category[],
  services: Service[]
): MappedCategory[] => {
  const servicesMap = new Map<number, Service>(
    services.map((service) => [service.id, service])
  );

  return categories.map((category) => ({
    label: category.label,
    services: category.servicesIds
      .map((id) => servicesMap.get(id))
      .filter((service): service is Service => Boolean(service)),
  }));
};
