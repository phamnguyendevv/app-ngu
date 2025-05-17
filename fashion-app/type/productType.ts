export type Product = {
  id: string;
  name: string;
  price: number;
  rating: number;
  image: string | number | any; // Supports URL, number (for API), or require
  carouselImages?: any[]; // Array of require assets
  isFavorite?: boolean; // Optional, as not used in WishlistScreen API
  isNew?: boolean;
  isPopular?: boolean;
  isMan?: boolean;
  category?: string; // Optional, for filtering in WishlistScreen
  _id?: string; // Optional, for API response
  description?: string; // Optional, for product details
  productId?: string; // Added for cart functionality
  quantity?: number; // Added for cart functionality
};
type ProductList = {
  id: string;
  name: string;
  price: number;
  rating: number;
  image: string | number | any; // Supports URL, number (for API), or require
  isFavorite?: boolean; // Optional, as not used in WishlistScreen API
  isNew?: boolean;
  isPopular?: boolean;
  isMan?: boolean;
  category?: string; // Optional, for filtering in WishlistScreen
};

export type ProductCart = {
  id: string;
  name: string;
  price: number;
  rating: number;
  image: string | number | any; // Supports URL, number (for API), or require
  carouselImages?: any[]; // Array of require assets
  isFavorite?: boolean; // Optional, as not used in WishlistScreen API
  isNew?: boolean;
  isPopular?: boolean;
  isMan?: boolean;
  category?: string; // Optional, for filtering in WishlistScreen
  _id?: string; // Optional, for API response
  description?: string; // Optional, for product details
  quantity: number; // Added for cart functionality
  user_id: string; // Added for cart functionality
  product_id: string; // Added for cart functionality
  isSelected: boolean; // Added for cart functionality
  isChecked: boolean; // Added for cart functionality
  isCheckedAll: boolean; // Added for cart functionality
  productId: any;
};

export type CartResponse = {
  id: string;
  name: string;
  price: number;
  rating: number;
  image: string | number | any; // Supports URL, number (for API), or require
  carouselImages?: any[]; // Array of require assets
  isFavorite?: boolean; // Optional, as not used in WishlistScreen API
  isNew?: boolean;
  isPopular?: boolean;
  isMan?: boolean;
  category?: string; // Optional, for filtering in WishlistScreen
  _id?: string; // Optional, for API response
  description?: string; // Optional, for product details
};

export type Address = {
  id?: string;
  _id: string;
  type?: string;
  address?: string;
  city?: string;
  country?: string;
  name?: string;
};

export type Category = {
  id: string;
  name: string;
  image: string | number | any; // Supports URL, number (for API), or require
};

export type OrderItem = {
  id: string;
  quantity: number;
  priceAtOrder: number;
  product: Product;
};

export type Order = {
  id: string;
  status: string;
  totalPrice: number;
  deliveryFee: number;
  paymentMethod: string;
  createdAt: string;
  shippingAddress: Address;
  products: OrderItem[];
  rating?: number;
};
