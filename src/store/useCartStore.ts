'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Cart, CartItem, Product } from '@/types/api';
import { toast } from 'sonner';

interface CartState {
  cartData: Cart | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchCart: () => Promise<void>;
  addItem: (product: Product) => Promise<void>;
  updateQuantity: (productId: string, count: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  clear: () => Promise<void>;
  getItemCount: () => number;
  getTotalPrice: () => number;
  setCartData: (data: Cart | null) => void;
}

// Helper to generate unique ID (uses crypto.randomUUID available in modern browsers)
function generateId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback for older environments
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

// Helper to create a cart item from a product
function createCartItem(product: Product): CartItem {
  return {
    _id: generateId(),
    product,
    count: 1,
    price: product.price,
  };
}

// Helper to recalculate cart totals
function recalculateCart(cart: Cart): Cart {
  const totalCartPrice = cart.products.reduce((sum, item) => sum + item.price * item.count, 0);
  return {
    ...cart,
    totalCartPrice,
  };
}

function createEmptyCart(): Cart {
  return {
    _id: generateId(),
    cartOwner: 'local',
    products: [],
    totalCartPrice: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    __v: 0,
  };
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cartData: null,
      isLoading: false,
      error: null,

      fetchCart: async () => {
        // Local-only: cart is loaded from localStorage via persist middleware
        set({ isLoading: false });
      },

      setCartData: (data: Cart | null) => {
        set({ cartData: data });
      },

      addItem: async (product: Product) => {
        const currentCart = get().cartData || createEmptyCart();
        const existingItemIndex = currentCart.products.findIndex((item) => item.product._id === product._id);

        let newCart: Cart;
        if (existingItemIndex >= 0) {
          const updatedProducts = [...currentCart.products];
          updatedProducts[existingItemIndex] = {
            ...updatedProducts[existingItemIndex],
            count: updatedProducts[existingItemIndex].count + 1,
          };
          newCart = recalculateCart({ ...currentCart, products: updatedProducts, updatedAt: new Date().toISOString() });
        } else {
          const newItem = createCartItem(product);
          newCart = recalculateCart({
            ...currentCart,
            products: [...currentCart.products, newItem],
            updatedAt: new Date().toISOString(),
          });
        }

        set({ cartData: newCart });
        toast.success('Added to cart');
      },

      updateQuantity: async (productId: string, count: number) => {
        if (count < 1) {
          await get().removeItem(productId);
          return;
        }

        const currentCart = get().cartData;
        if (!currentCart) return;

        const updatedProducts = currentCart.products.map((item) =>
          item.product._id === productId ? { ...item, count } : item
        );
        const newCart = recalculateCart({ ...currentCart, products: updatedProducts, updatedAt: new Date().toISOString() });
        set({ cartData: newCart });
        toast.success('Cart updated');
      },

      removeItem: async (productId: string) => {
        const currentCart = get().cartData;
        if (!currentCart) return;

        const updatedProducts = currentCart.products.filter((item) => item.product._id !== productId);
        const newCart = recalculateCart({ ...currentCart, products: updatedProducts, updatedAt: new Date().toISOString() });
        set({ cartData: newCart });
        toast.success('Removed from cart');
      },

      clear: async () => {
        set({ cartData: null });
        toast.success('Cart cleared');
      },

      getItemCount: () => {
        const cart = get().cartData;
        if (!cart) return 0;
        return cart.products.reduce((sum, item) => sum + item.count, 0);
      },

      getTotalPrice: () => {
        const cart = get().cartData;
        if (!cart) return 0;
        return cart.totalCartPrice;
      },
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ cartData: state.cartData }),
    }
  )
);