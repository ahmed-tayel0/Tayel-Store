'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Product } from '@/types/api';
import { toast } from 'sonner';

// Order Types
export interface OrderItem {
  _id: string;
  product: Product;
  count: number;
  price: number;
  total: number;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface Order {
  _id: string;
  user: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: 'cash' | 'card' | 'wallet';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  orderStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface OrdersState {
  orders: Order[];
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchOrders: () => Promise<void>;
  createOrder: (orderData: Omit<Order, '_id' | 'user' | 'createdAt' | 'updatedAt' | '__v' | 'paymentStatus' | 'orderStatus'>) => Promise<Order | null>;
  getOrderById: (orderId: string) => Order | undefined;
  clearOrders: () => Promise<void>;
}

function generateId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

function createEmptyOrders(): Order[] {
  return [];
}

export const useOrdersStore = create<OrdersState>()(
  persist(
    (set, get) => ({
      orders: [],
      isLoading: false,
      error: null,

      fetchOrders: async () => {
        // Local-only: just return the persisted orders data
        set({ isLoading: false });
      },

      createOrder: async (orderData) => {
        const newOrder: Order = {
          ...orderData,
          _id: generateId(),
          user: 'local',
          paymentStatus: orderData.paymentMethod === 'cash' ? 'pending' : 'paid',
          orderStatus: 'pending',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          __v: 0,
        };

        const updatedOrders = [newOrder, ...get().orders];
        set({ orders: updatedOrders });
        toast.success('Order placed successfully!');
        return newOrder;
      },

      getOrderById: (orderId: string) => {
        return get().orders.find((order) => order._id === orderId);
      },

      clearOrders: async () => {
        set({ orders: [] });
        toast.success('Order history cleared');
      },
    }),
    {
      name: 'orders-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ orders: state.orders }),
    }
  )
);