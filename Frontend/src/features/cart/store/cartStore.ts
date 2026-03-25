import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { cartService } from '../services/cart.service';
import axiosInstance from '../../../api/axiosInstance';
import { useAuthStore } from '../../../store/authStore';

interface CartItem {
  product: {
    _id: string;
    name: string;
    price: number;
    images?: string[];
    [key: string]: any;
  };
  quantity: number;
}

interface CartState {
  items: CartItem[];
  isLoading: boolean;
  error: string | null;
  fetchCart: () => Promise<void>;
  addItem: (product: any, quantity?: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,
      error: null,

      fetchCart: async () => {
        const { accessToken } = useAuthStore.getState();
        if (!accessToken) return; // Stay with local items if guest

        set({ isLoading: true });
        try {
          const response = await axiosInstance.get('/cart');
          const cart = response.data.data;
          const items = cart?.items || [];
          set({ items, error: null, isLoading: false });
        } catch (error: any) {
          const errorMsg = error.response?.data?.message || 'Failed to fetch cart';
          set({ error: errorMsg, items: [], isLoading: false });
        }
      },

      addItem: async (product, quantity = 1) => {
        const { accessToken } = useAuthStore.getState();
        const { items } = get();
        
        // 1. Update Local State (Guest or User)
        const existingItemIndex = items.findIndex(i => i.product._id === product._id);
        let newItems = [...items];
        
        if (existingItemIndex > -1) {
          newItems[existingItemIndex].quantity += quantity;
        } else {
          newItems.push({ product, quantity });
        }
        set({ items: newItems });

        // 2. If Auth, Sync with Backend
        if (accessToken) {
          set({ isLoading: true });
          try {
            await cartService.addToCart(product._id, quantity);
            set({ isLoading: false });
          } catch (error: any) {
            set({ isLoading: false });
            throw error;
          }
        }
      },

      removeItem: async (productId) => {
        const { accessToken } = useAuthStore.getState();
        const { items } = get();
        
        const newItems = items.filter(i => i.product._id !== productId);
        set({ items: newItems });

        if (accessToken) {
          try {
            await cartService.removeFromCart(productId);
          } catch (error) {
            console.error(error);
          }
        }
      },

      updateQuantity: async (productId, quantity) => {
        const { accessToken } = useAuthStore.getState();
        const { items } = get();
        
        const newItems = items.map(i => 
          i.product._id === productId ? { ...i, quantity } : i
        );
        set({ items: newItems });

        if (accessToken) {
          try {
            await cartService.updateQuantity(productId, quantity);
          } catch (error) {
            console.error(error);
          }
        }
      },

      clearCart: async () => {
        const { accessToken } = useAuthStore.getState();
        set({ items: [] });
        if (accessToken) {
          try {
            await cartService.clearCart();
          } catch (error) {
            console.error(error);
          }
        }
      }
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
    }
  )
);
