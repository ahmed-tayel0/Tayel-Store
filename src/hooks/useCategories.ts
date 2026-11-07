'use client';

import { useQuery } from '@tanstack/react-query';
import { getCategories } from '@/services/api';
import { Category } from '@/types/api';

export function useCategories() {
  return useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: getCategories,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 20 * 60 * 1000, // 20 minutes
  });
}