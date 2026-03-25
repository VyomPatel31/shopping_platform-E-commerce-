import axiosInstance from '../../../api/axiosInstance'
import { Order, CreateOrderPayload } from '../types/order.types'

const ORDER_API = '/api/orders'

export const orderService = {
  createOrder: async (payload: CreateOrderPayload): Promise<Order> => {
    const response = await axiosInstance.post(`${ORDER_API}`, payload)
    return response.data.data
  },

  getOrders: async (): Promise<Order[]> => {
    const response = await axiosInstance.get(`${ORDER_API}`)
    return response.data.data
  },

  getOrderById: async (id: string): Promise<Order> => {
    const response = await axiosInstance.get(`${ORDER_API}/${id}`)
    return response.data.data
  },

  updateOrderStatus: async (id: string, status: string): Promise<Order> => {
    const response = await axiosInstance.put(`${ORDER_API}/${id}/status`, { status })
    return response.data.data
  },

  cancelOrder: async (id: string): Promise<Order> => {
    const response = await axiosInstance.post(`${ORDER_API}/${id}/cancel`)
    return response.data.data
  },
}
