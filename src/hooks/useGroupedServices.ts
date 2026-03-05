import { useMemo } from 'react'
import { useServices } from '../api/hooks/useServices'
import { servicesConfig } from '../config'
import { mapServicesByCategory } from '../utils'

export const useGroupedServices = (categoriesIds: number[]) => {
  const { services = [], ...rest } = useServices(categoriesIds);

  const groupedServices = useMemo(() => {
    return mapServicesByCategory(servicesConfig, services)
      .filter((category) => category.services.length > 0);
  }, [services]);

  return {
    groupedServices,
    ...rest,
  };
};