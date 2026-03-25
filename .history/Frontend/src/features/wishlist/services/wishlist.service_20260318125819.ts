import axiosInstance from '../../../api/axiosInstance'
import { Wishlist, AddToWishlistPayload, RemoveFromWishlistPayload } from '../types/wishlist.types'

const WISHLIST_API = '/api/wishlist'

export const wishlistService = {
  addToWishlist: async (payload: AddToWishlistPayload): Promise<Wishlist> => {
    const response = await axiosInstance.post(`${WISHLIST_API}/add`, payload)
    return response.data.data
  },

  removeFromWishlist: async (payload: RemoveFromWishlistPayload): Promise<Wishlist> => {
    const response = await axiosInstance.post(`${WISHLIST_API}/remove`, payload)
    return response.data.data
  },

  getWishlist: async (): Promise<Wishlist> => {
    const response = await axiosInstance.get(`${WISHLIST_API}`)
    return response.data.data
  },

  clearWishlist: async (): Promise<void> => {
    await axiosInstance.delete(`${WISHLIST_API}/clear`)
  },
}
