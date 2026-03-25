import { useCallback } from 'react'
import { useGetOrders, useGetOrderById, useCreateOrder, useUpdateOrderStatus, useCancelOrder } from '../quaries/order.query'
import { CreateOrderPayload } from '../types/order.types'
import toast from 'react-hot-toast'

export interface UseOrdersReturn {
  orders: any[]
  isLoading: boolean
  isError: boolean
  error: Error | null

  createOrder: (payload: CreateOrderPayload) => Promise<void>
  cancelOrder: (orderId: string) => Promise<void>

  isCreating: boolean
  isCancelling: boolean
}

export function useOrders(): UseOrdersReturn {
  const { data: orders = [], isLoading, isError, error } = useGetOrders()

  const { mutateAsync: createOrderMutation, isPending: isCreating } = useCreateOrder()
  const { mutateAsync: cancelOrderMutation, isPending: isCancelling } = useCancelOrder()

  const createOrder = useCallback(async (payload: CreateOrderPayload) => {
    try {
      await createOrderMutation(payload)
      toast.success('Order created successfully')
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create order')
    }
  }, [createOrderMutation])

  const cancelOrder = useCallback(async (orderId: string) => {
    try {
      await cancelOrderMutation(orderId)
      toast.success('Order cancelled')
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to cancel order')
    }
  }, [cancelOrderMutation])

  return {
    orders,
    isLoading,
    isError,
    error,
    createOrder,
    cancelOrder,
    isCreating,
    isCancelling,
  }
}

export function useOrderById(id: string) {
  const { data: order, isLoading, isError, error } = useGetOrderById(id)

  return {
    order,
    isLoading,
    isError,
    error,
  }
}
