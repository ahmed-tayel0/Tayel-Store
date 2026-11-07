'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Wishlist, Product } from '@/types/api';
import { toast } from 'sonner';

interface WishlistState {
  wishlistData: Wishlist | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchWishlist: () => Promise<void>;
  addItem: (product: Product) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  getItemCount: () => number;
  setWishlistData: (data: Wishlist | null) => void;
}

// Helper to generate unique ID (uses crypto.randomUUID available in modern browsers)
function generateId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback for older environments
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

function createEmptyWishlist(): Wishlist {
  return {
    _id: generateId(),
    user: 'local',
    products: [],
    count: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    __v: 0,
  };
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      wishlistData: null,
      isLoading: false,
      error: null,

      fetchWishlist: async () => {
        // Local-only: wishlist is loaded from localStorage via persist middleware
        set({ isLoading: false });
      },

      setWishlistData: (data: Wishlist | null) => {
        set({ wishlistData: data });
      },

      addItem: async (product: Product) => {
        const currentWishlist = get().wishlistData || createEmptyWishlist();
        const isAlreadyInWishlist = currentWishlist.products.some((p) => p._id === product._id);

        if (isAlreadyInWishlist) {
          toast.info('Already in wishlist');
          return;
        }

        const newWishlist: Wishlist = {
          ...currentWishlist,
          products: [...currentWishlist.products, product],
          count: currentWishlist.products.length + 1,
          updatedAt: new Date().toISOString(),
        };
        set({ wishlistData: newWishlist });
        toast.success('Added to wishlist');
      },

      removeItem: async (productId: string) => {
        const currentWishlist = get().wishlistData;
        if (!currentWishlist) return;

        const updatedProducts = currentWishlist.products.filter((p) => p._id !== productId);
        set({
          wishlistData: {
            ...currentWishlist,
            products: updatedProducts,
            count: updatedProducts.length,
            updatedAt: new Date().toISOString(),
          }
        });
        toast.success('Removed from wishlist');
      },

      isInWishlist: (productId: string) => {
        const wishlist = get().wishlistData;
        if (!wishlist) return false;
        return wishlist.products.some((p) => p._id === productId);
      },

      getItemCount: () => {
        const wishlist = get().wishlistData;
        if (!wishlist) return 0;
        return wishlist.count || wishlist.products.length;
      },
    }),
    {
      name: 'wishlist-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ wishlistData: state.wishlistData }),
    }
  )
);