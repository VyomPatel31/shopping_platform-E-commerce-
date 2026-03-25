import { useQuery, useMutation, useQueryClient, UseQueryResult, UseMutationResult } from '@tanstack/react-query'
import { orderService } from '../services/order.service'
import { Order, CreateOrderPayload } from '../types/order.types'

const ORDER_QUERY_KEYS = {
  all: ['orders'] as const,
  list: () => [...ORDER_QUERY_KEYS.all, 'list'] as const,
  detail: (id: string) => [...ORDER_QUERY_KEYS.all, 'detail', id] as const,
}

export function useGetOrders(): UseQueryResult<Order[], Error> {
  return useQuery({
    queryKey: ORDER_QUERY_KEYS.list(),
    queryFn: () => orderService.getOrders(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

export function useGetOrderById(id: string): UseQueryResult<Order, Error> {
  return useQuery({
    queryKey: ORDER_QUERY_KEYS.detail(id),
    queryFn: () => orderService.getOrderById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 10, // 10 minutes
  })
}

export function useCreateOrder(): UseMutationResult<Order, Error, CreateOrderPayload> {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateOrderPayload) => orderService.createOrder(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ORDER_QUERY_KEYS.list() })
    },
  })
}

export function useUpdateOrderStatus(): UseMutationResult<Order, Error, { id: string; status: string }> {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, status }) => orderService.updateOrderStatus(id, status),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ORDER_QUERY_KEYS.list() })
      queryClient.invalidateQueries({ queryKey: ORDER_QUERY_KEYS.detail(data._id) })
    },
  })
}

export function useCancelOrder(): UseMutationResult<Order, Error, string> {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => orderService.cancelOrder(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ORDER_QUERY_KEYS.list() })
      queryClient.invalidateQueries({ queryKey: ORDER_QUERY_KEYS.detail(data._id) })
    },
  })
}
