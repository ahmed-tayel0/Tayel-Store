'use client';

import { useQuery } from '@tanstack/react-query';
import { getBrands } from '@/services/api';
import { Brand } from '@/types/api';

export function useBrands() {
  return useQuery<Brand[]>({
    queryKey: ['brands'],
    queryFn: getBrands,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 20 * 60 * 1000, // 20 minutes
  });
}