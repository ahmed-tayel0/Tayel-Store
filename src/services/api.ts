import { axiosInstance } from '@/lib/axios';
import { ApiResponse, Category, Brand, Product, Cart, CartItem, Wishlist, CartResponse, AddToCartResponse, UpdateCartQuantityResponse, RemoveFromCartResponse, WishlistResponse, AddToWishlistResponse } from '@/types/api';

// Use Next.js API routes as proxy for cart/wishlist to handle auth correctly
// The external API's cart/wishlist endpoints don't accept Bearer tokens directly
const CART_API_BASE = '/api/cart';
const WISHLIST_API_BASE = '/api/wishlist';

export interface ProductFilters {
  category?: string[];  // category IDs
  brand?: string[];     // brand IDs
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;      // 'price', '-price', 'createdAt', '-createdAt'
  page?: number;
  limit?: number;
}

// Auth Types
export interface SignupData {
  name: string;
  email: string;
  password: string;
  rePassword: string;
  phone: string;
}

export interface SigninData {
  email: string;
  password: string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface VerifyResetCodeData {
  resetCode: string;
}

export interface ResetPasswordData {
  email: string;
  newPassword: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface AuthResponse {
  message: string;
  statusMsg?: string; // For error responses: "fail" or "success"
  user?: {
    name: string;
    email: string;
    role: string;
    // Note: API doesn't return _id field
  };
  token: string;
}

export interface ForgotPasswordResponse {
  status: string;
  message: string;
}

export interface VerifyCodeResponse {
  status: string;
  message: string;
}

export interface ResetPasswordResponse {
  status: string;
  message: string;
}

export async function getCategories(): Promise<Category[]> {
  const response = await axiosInstance.get<ApiResponse<Category>>('/v1/categories');
  return response.data.data;
}

export async function getBrands(): Promise<Brand[]> {
  const response = await axiosInstance.get<ApiResponse<Brand>>('/v1/brands');
  return response.data.data;
}

export interface ProductsResponse {
  data: Product[];
  metadata: {
    currentPage?: number;
    numberOfPages?: number;
    limit?: number;
    nextPage?: number;
    prevPage?: number;
    results?: number;
    [key: string]: any;
  };
}

// Fetch global min/max prices (all products without pagination filters)
export async function getGlobalPriceRange(): Promise<{ minPrice: number; maxPrice: number }> {
  // Fetch a large batch without filters to get global price range
  const params = new URLSearchParams();
  params.set('limit', '1000'); // Large limit to get most products
  params.set('page', '1');

  const queryString = params.toString();
  const url = `/v1/products${queryString ? `?${queryString}` : ''}`;

  const response = await axiosInstance.get<ApiResponse<Product>>(url);
  const products = response.data.data || [];

  const prices = products.map((p) => p.price).filter((p) => p > 0);
  return {
    minPrice: prices.length > 0 ? Math.min(...prices) : 0,
    maxPrice: prices.length > 0 ? Math.max(...prices) : 10000,
  };
}

export async function getProducts(filters: ProductFilters = {}): Promise<ProductsResponse> {
  const params = new URLSearchParams();

  if (filters.category && filters.category.length > 0) {
    filters.category.forEach((cat) => params.append('category', cat));
  }
  if (filters.brand && filters.brand.length > 0) {
    filters.brand.forEach((brand) => params.append('brand', brand));
  }
  if (filters.minPrice !== undefined && filters.minPrice > 0) {
    params.set('price[gte]', String(filters.minPrice));
  }
  if (filters.maxPrice !== undefined && filters.maxPrice > 0) {
    params.set('price[lte]', String(filters.maxPrice));
  }
  // Only send sort if it's not 'default' (newest is the default)
  if (filters.sortBy && filters.sortBy !== 'default') {
    params.set('sort', filters.sortBy);
  }
  // Default page=1, limit=20
  const page = filters.page && filters.page > 1 ? filters.page : 1;
  const limit = filters.limit || 20;
  params.set('page', String(page));
  params.set('limit', String(limit));

  const queryString = params.toString();
  const url = `/v1/products${queryString ? `?${queryString}` : ''}`;

  const response = await axiosInstance.get<ApiResponse<Product>>(url);
  // API returns total results at top-level 'results', pagination info in 'metadata'
  // Merge results into metadata for consistent access
  const metadata = response.data.metadata || {};
  return {
    data: response.data.data,
    metadata: {
      ...metadata,
      results: response.data.results
    }
  };
}

// Auth API Functions
export async function signup(data: SignupData): Promise<AuthResponse> {
  const response = await axiosInstance.post<AuthResponse>('/v1/auth/signup', data);
  return response.data;
}

export async function signin(data: SigninData): Promise<AuthResponse> {
  const response = await axiosInstance.post<AuthResponse>('/v1/auth/signin', data);
  return response.data;
}

export async function forgotPassword(data: ForgotPasswordData): Promise<ForgotPasswordResponse> {
  const response = await axiosInstance.post<ForgotPasswordResponse>('/v1/auth/forgotPasswords', data);
  return response.data;
}

export async function verifyResetCode(data: VerifyResetCodeData): Promise<VerifyCodeResponse> {
  const response = await axiosInstance.post<VerifyCodeResponse>('/v1/auth/verifyResetCode', data);
  return response.data;
}

export async function resetPassword(data: ResetPasswordData): Promise<ResetPasswordResponse> {
  const response = await axiosInstance.put<ResetPasswordResponse>('/v1/auth/resetPassword', data);
  return response.data;
}

export async function changePassword(data: ChangePasswordData): Promise<{ status: string; message: string }> {
  const response = await axiosInstance.put<{ status: string; message: string }>('/v1/users/changeMyPassword', data);
  return response.data;
}

// Profile API Types
export interface UpdateProfileData {
  name?: string;
  email?: string;
  phone?: string;
}

export interface UserProfile {
  name: string;
  email: string;
  phone?: string;
  role: string;
  createdAt?: string;
}

// Profile API Functions
export async function updateProfile(data: UpdateProfileData): Promise<{ status: string; message: string; data: UserProfile }> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
  const response = await axiosInstance.put<{ status: string; message: string; data: UserProfile }>('/v1/users/updateMe', data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}

// Cart API - Use Next.js proxy routes since external API doesn't accept Bearer tokens

async function cartRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${CART_API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || 'Request failed');
  }

  return response.json();
}

export async function getCart(): Promise<CartResponse> {
  return cartRequest<CartResponse>('', { method: 'GET' });
}

export interface AddToCartData {
  productId: string;
}

export async function addToCart(data: AddToCartData): Promise<AddToCartResponse> {
  return cartRequest<AddToCartResponse>('', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export interface UpdateCartQuantityData {
  productId: string;
  count: number;
}

export async function updateCartQuantity(data: UpdateCartQuantityData): Promise<UpdateCartQuantityResponse> {
  return cartRequest<UpdateCartQuantityResponse>(`/${data.productId}`, {
    method: 'PUT',
    body: JSON.stringify({ count: data.count }),
  });
}

export async function removeFromCart(productId: string): Promise<RemoveFromCartResponse> {
  return cartRequest<RemoveFromCartResponse>(`/${productId}`, { method: 'DELETE' });
}

export async function clearCart(): Promise<{ status: string; message: string }> {
  return cartRequest<{ status: string; message: string }>('', { method: 'DELETE' });
}

// Wishlist API - Use Next.js proxy routes since external API doesn't accept Bearer tokens

async function wishlistRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${WISHLIST_API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || 'Request failed');
  }

  return response.json();
}

export async function getWishlist(): Promise<WishlistResponse> {
  return wishlistRequest<WishlistResponse>('', { method: 'GET' });
}

export interface AddToWishlistData {
  productId: string;
}

export async function addToWishlist(data: AddToWishlistData): Promise<AddToWishlistResponse> {
  return wishlistRequest<AddToWishlistResponse>('', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function removeFromWishlist(productId: string): Promise<{ status: string; message: string; data: Wishlist }> {
  return wishlistRequest<{ status: string; message: string; data: Wishlist }>(`/${productId}`, { method: 'DELETE' });
}