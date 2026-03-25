import { create } from 'zustand';
import { cartService } from '../services/cart.service';

interface CartItem {
  product: {
    _id: string;
    name: string;
    price: number;
    thumbnails: string[];
    [key: string]: any;
  };
  quantity: number;
}

interface CartState {
  items: CartItem[];
  isLoading: boolean;
  error: string | null;
  fetchCart: () => Promise<void>;
  addItem: (productId: string, quantity?: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  isLoading: false,
  error: null,

  fetchCart: async () => {
    set({ isLoading: true });
    try {
      const response = await cartService.getCart();
      const cart = response.response;
      const items = cart?.items || [];
      set({ items, error: null, isLoading: false });
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || error.message || 'Failed to fetch cart';
      set({ error: errorMsg, items: [], isLoading: false });
    }
  },

  addItem: async (productId, quantity = 1) => {
    set({ isLoading: true });
    try {
      await cartService.addToCart(productId, quantity);
      set({ isLoading: false, error: null });
      await get().fetchCart();
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || error.message || 'Failed to add item';
      set({ error: errorMsg, isLoading: false });
      throw error;
    }
  },

  removeItem: async (productId) => {
    set({ isLoading: true });
    try {
      await cartService.removeFromCart(productId);
      set({ isLoading: false, error: null });
      await get().fetchCart();
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || error.message || 'Failed to remove item';
      set({ error: errorMsg, isLoading: false });
      throw error;
    }
  },

  updateQuantity: async (productId, quantity) => {
    set({ isLoading: true });
    try {
      await cartService.updateQuantity(productId, quantity);
      set({ isLoading: false, error: null });
      await get().fetchCart();
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || error.message || 'Failed to update quantity';
      set({ error: errorMsg, isLoading: false });
      throw error;
    }
  },

  clearCart: async () => {
    set({ isLoading: true });
    try {
      await cartService.clearCart();
      set({ items: [], isLoading: false, error: null });
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || error.message || 'Failed to clear cart';
      set({ error: errorMsg, isLoading: false });
      throw error;
    }
  },
}));
