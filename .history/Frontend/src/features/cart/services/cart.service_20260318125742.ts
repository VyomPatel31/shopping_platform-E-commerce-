import axiosInstance from '../../../api/axiosInstance'
import { AddToCartPayload, UpdateCartPayload, RemoveFromCartPayload, Cart } from '../types/cart.types'

const CART_API = '/api/cart'

export const cartService = {
  addToCart: async (payload: AddToCartPayload): Promise<Cart> => {
    const response = await axiosInstance.post(`${CART_API}/add`, payload)
    return response.data.data
  },

  removeFromCart: async (payload: RemoveFromCartPayload): Promise<Cart> => {
    const response = await axiosInstance.post(`${CART_API}/remove`, payload)
    return response.data.data
  },

  updateCart: async (payload: UpdateCartPayload): Promise<Cart> => {
    const response = await axiosInstance.put(`${CART_API}/update`, payload)
    return response.data.data
  },

  getCart: async (): Promise<Cart> => {
    const response = await axiosInstance.get(`${CART_API}`)
    return response.data.data
  },

  clearCart: async (): Promise<void> => {
    await axiosInstance.delete(`${CART_API}/clear`)
  },

  mergeCart: async (): Promise<Cart> => {
    const response = await axiosInstance.post(`${CART_API}/merge`)
    return response.data.data
  },
}
