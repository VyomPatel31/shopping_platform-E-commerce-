import { useQuery, useMutation, useQueryClient, UseQueryResult, UseMutationResult } from '@tanstack/react-query'
import { wishlistService } from '../services/wishlist.service'
import { Wishlist, AddToWishlistPayload, RemoveFromWishlistPayload } from '../types/wishlist.types'

const WISHLIST_QUERY_KEYS = {
  all: ['wishlist'] as const,
  detail: () => [...WISHLIST_QUERY_KEYS.all, 'detail'] as const,
}

export function useGetWishlist(): UseQueryResult<Wishlist, Error> {
  return useQuery({
    queryKey: WISHLIST_QUERY_KEYS.detail(),
    queryFn: () => wishlistService.getWishlist(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

export function useAddToWishlist(): UseMutationResult<Wishlist, Error, AddToWishlistPayload> {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: AddToWishlistPayload) => wishlistService.addToWishlist(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WISHLIST_QUERY_KEYS.detail() })
    },
  })
}

export function useRemoveFromWishlist(): UseMutationResult<Wishlist, Error, RemoveFromWishlistPayload> {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: RemoveFromWishlistPayload) => wishlistService.removeFromWishlist(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WISHLIST_QUERY_KEYS.detail() })
    },
  })
}

export function useClearWishlist(): UseMutationResult<void, Error, void> {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => wishlistService.clearWishlist(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WISHLIST_QUERY_KEYS.detail() })
    },
  })
}
