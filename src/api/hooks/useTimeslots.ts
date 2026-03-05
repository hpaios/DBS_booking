import { useQueries } from "@tanstack/react-query";
import { getTimeslots } from '../api/requests'
import type { TimeslotsResponse } from '../../interfaces'

type TimeslotsMap = Record<number, TimeslotsResponse>;

export const useTimeslots = (employeeIds: number[]) => {
  const queries = useQueries({
    queries: employeeIds.map((employeeId) => ({
      queryKey: ["timeslots", employeeId],
      queryFn: () => getTimeslots(employeeId),
      enabled: employeeIds.length > 0,
      staleTime: 1000 * 60 * 5,
    })),
  });

  const timeslots = queries.reduce<TimeslotsMap>((acc, query, index) => {
    const employeeId = employeeIds[index];

    if (query.data) {
      acc[employeeId] = query.data;
    }

    return acc;
  }, {});

  return {
    timeslots,
    isLoading: queries.some((q) => q.isLoading),
    isFetching: queries.some((q) => q.isFetching),
    isError: queries.some((q) => q.isError),
  };
};