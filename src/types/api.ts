export interface ApiResponse<T> {
  results: number;
  metadata?: {
    currentPage: number;
    numberOfPages: number;
    limit: number;
    nextPage?: number;
  };
  data: T[];
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  image: string;
  createdAt: string;
  updatedAt: string;
}

export interface Brand {
  _id: string;
  name: string;
  slug: string;
  image: string;
  createdAt: string;
  updatedAt: string;
}

export interface Subcategory {
  _id: string;
  name: string;
  slug: string;
  category: string;
}

export interface ProductCategory {
  _id: string;
  name: string;
  slug: string;
  image: string;
}

export interface ProductBrand {
  _id: string;
  name: string;
  slug: string;
  image: string;
}

export interface Product {
  sold: number;
  images: string[];
  subcategory: Subcategory[];
  ratingsQuantity: number;
  _id: string;
  title: string;
  slug: string;
  description: string;
  quantity: number;
  price: number;
  priceAfterDiscount?: number;
  imageCover: string;
  category: ProductCategory;
  brand: ProductBrand;
  ratingsAverage: number;
  createdAt: string;
  updatedAt: string;
  id: string;
}

// Cart Types
export interface CartItem {
  _id: string;
  count: number;
  price: number;
  product: Product;
}

export interface Cart {
  _id: string;
  cartOwner: string;
  products: CartItem[];
  totalCartPrice: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// Wishlist Types
export interface Wishlist {
  _id: string;
  user: string;
  products: Product[];
  count: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// Cart API Response Types
export interface CartResponse {
  status: string;
  numOfCartItems: number;
  data: Cart;
}

export interface AddToCartResponse {
  status: string;
  message: string;
  numOfCartItems: number;
  data: Cart;
}

export interface UpdateCartQuantityResponse {
  status: string;
  numOfCartItems: number;
  data: Cart;
  message?: string;
}

export interface RemoveFromCartResponse {
  status: string;
  numOfCartItems: number;
  data: Cart;
  message?: string;
}

// Wishlist API Response Types
export interface WishlistResponse {
  status: string;
  count: number;
  data: Wishlist;
}

export interface AddToWishlistResponse {
  status: string;
  message: string;
  data: Wishlist;
}