'use client';

import { useState, useEffect } from 'react';
import { useRouter } from '@/navigation';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  createdAt?: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Read user data from localStorage (set during login/register)
    const checkAuth = () => {
      try {
        const token = localStorage.getItem('auth_token');
        const savedUser = localStorage.getItem('user');

        if (!token || !savedUser) {
          setUser(null);
          setIsLoading(false);
          return;
        }

        const userData = JSON.parse(savedUser);
        if (userData) {
          setUser(userData);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    // Listen for localStorage changes (e.g., login/logout from another tab)
    const handleStorageChange = () => {
      checkAuth();
    };
    window.addEventListener('storage', handleStorageChange);

    // Listen for custom auth change event (same tab login/logout)
    const handleAuthChange = () => {
      checkAuth();
    };
    window.addEventListener('auth-change', handleAuthChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('auth-change', handleAuthChange);
    };
  }, []);

  const logout = async () => {
    try {
      const response = await fetch('/api/auth/logout', { method: 'POST' });
      if (response.ok) {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        setUser(null);
        router.push('/login');
        router.refresh();
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return { user, isLoading, isAuthenticated: !!user, logout };
}