import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import axiosInstance from '../../../api/axiosInstance';
import { useAuthStore } from '../../../store/authStore';

interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  images: string[];
}

interface WishlistItem {
  product: Product;
}

interface WishlistStore {
  items: WishlistItem[];
  isLoading: boolean;
  error: string | null;
  fetchWishlist: () => Promise<void>;
  addToWishlist: (product: any) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  toggleWishlist: (product: any) => Promise<void>;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,
      error: null,
      
      fetchWishlist: async () => {
        const { accessToken } = useAuthStore.getState();
        if (!accessToken) return;

        set({ isLoading: true, error: null });
        try {
          const response = await axiosInstance.get('/wishlist');
          const wishlist = response.data.data;
          const products = wishlist?.products || [];
          const items = products.filter((p: any) => p !== null).map((p: any) => ({ product: p }));
          set({ items, isLoading: false });
        } catch (error: any) {
          set({ error: error.message, isLoading: false, items: [] });
        }
      },

      clearWishlist: () => set({ items: [] }),

      addToWishlist: async (product) => {
        const { accessToken } = useAuthStore.getState();
        const { items } = get();

        if (!items.some(i => i.product?._id === product._id)) {
           set({ items: [...items, { product }] });
        }

        if (accessToken) {
          try {
            await axiosInstance.post('/wishlist/add', { productId: product._id });
          } catch (error) {
            console.error('Add to wishlist failed');
          }
        }
      },

      removeFromWishlist: async (productId) => {
        const { accessToken } = useAuthStore.getState();
        const { items } = get();

        set({ items: items.filter(i => i.product?._id !== productId) });

        if (accessToken) {
          try {
            await axiosInstance.delete(`/wishlist/remove/${productId}`);
          } catch (error) {
            console.error('Remove from wishlist failed');
          }
        }
      },

      toggleWishlist: async (product) => {
        const { items } = get();
        const productId = product._id;
        const isInWishlist = items.some(item => item.product?._id === productId);
        
        if (isInWishlist) {
          await get().removeFromWishlist(productId);
        } else {
          await get().addToWishlist(product);
        }
      }
    }),
    {
      name: 'wishlist-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
    }
  )
);
