'use client';

import { useQuery } from '@tanstack/react-query';
import { getGlobalPriceRange } from '@/services/api';

export function useGlobalPriceRange() {
  return useQuery({
    queryKey: ['globalPriceRange'],
    queryFn: () => getGlobalPriceRange(),
    staleTime: 10 * 60 * 1000, // 10 minutes - price range doesn't change often
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
}