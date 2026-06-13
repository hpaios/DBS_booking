import { useMemo } from 'react'
import { useServices } from '../api/hooks/useServices'
import { servicesConfig } from '../config'
import { mapServicesByCategory } from '../utils'
import type { TFunction } from 'i18next'

export const useGroupedServices = (categoriesIds: number[], t: TFunction) => {
  const { services = [], ...rest } = useServices(categoriesIds);

  const groupedServices = useMemo(() => {
    return mapServicesByCategory(servicesConfig, services, t)
      .filter((category) => category.services.length > 0);
  }, [services, t]);

  return {
    groupedServices,
    ...rest,
  };
};