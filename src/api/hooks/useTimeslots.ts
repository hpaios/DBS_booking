import { useQueries } from "@tanstack/react-query";
import { getTimeSlots } from '../api/requests'
import type { TimeSlotsResponse } from '../../interfaces'

type TimeSlotsMap = Record<number, TimeSlotsResponse>;

export const useTimeSlots = (employeeIds: number[]) => {
  const queries = useQueries({
    queries: employeeIds.map((employeeId) => ({
      queryKey: ["timeSlots", employeeId],
      queryFn: () => getTimeSlots(employeeId),
      enabled: employeeIds.length > 0,
      staleTime: 1000 * 60
    })),
  });

  const timeSlots = queries.reduce<TimeSlotsMap>((acc, query, index) => {
    const employeeId = employeeIds[index];

    if (query.data) {
      acc[employeeId] = query.data;
    }

    return acc;
  }, {});

  return {
    timeSlots,
    isLoading: queries.some((q) => q.isLoading),
    isFetching: queries.some((q) => q.isFetching),
    isError: queries.some((q) => q.isError),
  };
};