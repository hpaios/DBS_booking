import type { Category, MappedCategory, Service } from './interfaces'

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
      })),
  }));
};

export const getUniqueParentCategoryIds = (services: Service[]) => {
  return [...new Set(services.map((service) => service.parentCategoryId))];
};

export const getToday = (): string => new Date().toISOString().split("T")[0];