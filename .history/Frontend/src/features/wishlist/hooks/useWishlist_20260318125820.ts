import { useCallback } from 'react'
import { useGetWishlist, useAddToWishlist, useRemoveFromWishlist, useClearWishlist } from '../quaries/wishlist.query'
import toast from 'react-hot-toast'

export interface UseWishlistReturn {
  wishlist: any
  isLoading: boolean
  isError: boolean
  error: Error | null

  addToWishlist: (productId: string) => Promise<void>
  removeFromWishlist: (productId: string) => Promise<void>
  clearWishlist: () => Promise<void>

  isAdding: boolean
  isRemoving: boolean
  isClearing: boolean
}

export function useWishlist(): UseWishlistReturn {
  const { data: wishlist, isLoading, isError, error } = useGetWishlist()

  const {
    mutateAsync: addToWishlistMutation,
    isPending: isAdding,
  } = useAddToWishlist()

  const {
    mutateAsync: removeFromWishlistMutation,
    isPending: isRemoving,
  } = useRemoveFromWishlist()

  const {
    mutateAsync: clearWishlistMutation,
    isPending: isClearing,
  } = useClearWishlist()

  const addToWishlist = useCallback(async (productId: string) => {
    try {
      await addToWishlistMutation({ productId })
      toast.success('Added to wishlist')
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to add to wishlist')
    }
  }, [addToWishlistMutation])

  const removeFromWishlist = useCallback(async (productId: string) => {
    try {
      await removeFromWishlistMutation({ productId })
      toast.success('Removed from wishlist')
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to remove from wishlist')
    }
  }, [removeFromWishlistMutation])

  const clearWishlist = useCallback(async () => {
    try {
      await clearWishlistMutation()
      toast.success('Wishlist cleared')
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to clear wishlist')
    }
  }, [clearWishlistMutation])

  return {
    wishlist,
    isLoading,
    isError,
    error,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
    isAdding,
    isRemoving,
    isClearing,
  }
}
