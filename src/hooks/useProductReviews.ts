'use client';

import { useQuery } from '@tanstack/react-query';
import { axiosInstance } from '@/lib/axios';

export interface Review {
  _id: string;
  title: string;
  review: string;
  rating: number;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  product: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewsResponse {
  data: Review[];
  results: number;
}

export function useProductReviews(id: string | undefined) {
  return useQuery<ReviewsResponse>({
    queryKey: ['reviews', id],
    queryFn: async () => {
      if (!id) throw new Error('Product ID is required');
      const response = await axiosInstance.get<ReviewsResponse>(`/v1/products/${id}/reviews`);
      return response.data;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}