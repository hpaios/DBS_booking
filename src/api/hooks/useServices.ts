import { useQueries } from '@tanstack/react-query'
import { getServices } from '../api/requests'
import { useMemo } from 'react'

export const useServices = (selectedCategoriesIds: number[]) => {
  const queries = useQueries({
    queries: selectedCategoriesIds.map((categoryId) => ({
      queryKey: ["services", categoryId],
      queryFn: () => getServices(categoryId),
      staleTime: 1000 * 60 * 10,
      refetchOnWindowFocus: false,
      retry: 1,
      enabled: selectedCategoriesIds.length > 0,
    })),
  });

  const services = useMemo(() => {
    return queries
      .map((q) => q.data?.data ?? [])
      .flat();
  }, [queries]);

  const isLoading = queries.some((q) => q.isLoading);
  const isError = queries.some((q) => q.isError);
  const error = queries.find((q) => q.error)?.error;

  return {
    services,
    isLoading,
    isError,
    error,
  };
};
