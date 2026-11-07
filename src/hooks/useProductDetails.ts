'use client';

import { useQuery } from '@tanstack/react-query';
import { axiosInstance } from '@/lib/axios';
import { Product } from '@/types/api';

export interface ProductDetailsResponse {
  data: Product;
}

export function useProductDetails(id: string | undefined) {
  return useQuery<ProductDetailsResponse>({
    queryKey: ['product', id],
    queryFn: async () => {
      if (!id) throw new Error('Product ID is required');
      const response = await axiosInstance.get<ProductDetailsResponse>(`/v1/products/${id}`);
      return response.data;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}