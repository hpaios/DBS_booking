import { useQuery } from '@tanstack/react-query'
import { getLocation } from '../api/requests'

export const useLocation = () => {
  return useQuery({
    queryKey: ["location"],
    queryFn: getLocation,
    staleTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
    retry: 1, 
  });
};