'use client';

import { useQuery } from '@tanstack/react-query';
import { getProducts, ProductFilters, ProductsResponse } from '@/services/api';
import { Product } from '@/types/api';

export function useProducts(filters: ProductFilters = {}) {
  return useQuery<ProductsResponse>({
    queryKey: ['products', filters],
    queryFn: () => getProducts(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}