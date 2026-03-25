import { useQuery, useMutation, useQueryClient, UseQueryResult, UseMutationResult } from '@tanstack/react-query'
import { cartService } from '../services/cart.service'
import { Cart, AddToCartPayload, UpdateCartPayload, RemoveFromCartPayload } from '../types/cart.types'

const CART_QUERY_KEYS = {
  all: ['cart'] as const,
  detail: () => [...CART_QUERY_KEYS.all, 'detail'] as const,
}

export function useGetCart(): UseQueryResult<Cart, Error> {
  return useQuery({
    queryKey: CART_QUERY_KEYS.detail(),
    queryFn: () => cartService.getCart(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

export function useAddToCart(): UseMutationResult<Cart, Error, AddToCartPayload> {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: AddToCartPayload) => cartService.addToCart(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEYS.detail() })
    },
  })
}

export function useUpdateCart(): UseMutationResult<Cart, Error, UpdateCartPayload> {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: UpdateCartPayload) => cartService.updateCart(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEYS.detail() })
    },
  })
}

export function useRemoveFromCart(): UseMutationResult<Cart, Error, RemoveFromCartPayload> {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: RemoveFromCartPayload) => cartService.removeFromCart(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEYS.detail() })
    },
  })
}

export function useClearCart(): UseMutationResult<void, Error, void> {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => cartService.clearCart(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEYS.detail() })
    },
  })
}

export function useMergeCart(): UseMutationResult<Cart, Error, void> {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => cartService.mergeCart(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEYS.detail() })
    },
  })
}
