import { useCallback } from 'react'
import { useGetCart, useAddToCart, useUpdateCart, useRemoveFromCart, useClearCart, useMergeCart } from '../quaries/cart.query'
import { AddToCartPayload, UpdateCartPayload } from '../types/cart.types'
import toast from 'react-hot-toast'

export interface UseCartReturn {
  cart: any
  isLoading: boolean
  isError: boolean
  error: Error | null

  addToCart: (productId: string, quantity?: number) => Promise<void>
  updateCart: (productId: string, quantity: number) => Promise<void>
  removeFromCart: (productId: string) => Promise<void>
  clearCart: () => Promise<void>
  mergeCart: () => Promise<void>

  isAdding: boolean
  isUpdating: boolean
  isRemoving: boolean
  isClearing: boolean
  isMerging: boolean
}

export function useCart(): UseCartReturn {
  const { data: cart, isLoading, isError, error } = useGetCart()

  const {
    mutateAsync: addToCartMutation,
    isPending: isAdding,
  } = useAddToCart()

  const {
    mutateAsync: updateCartMutation,
    isPending: isUpdating,
  } = useUpdateCart()

  const {
    mutateAsync: removeFromCartMutation,
    isPending: isRemoving,
  } = useRemoveFromCart()

  const {
    mutateAsync: clearCartMutation,
    isPending: isClearing,
  } = useClearCart()

  const {
    mutateAsync: mergeCartMutation,
    isPending: isMerging,
  } = useMergeCart()

  const addToCart = useCallback(async (productId: string, quantity: number = 1) => {
    try {
      const payload: AddToCartPayload = { productId, quantity }
      await addToCartMutation(payload)
      toast.success('Item added to cart')
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to add item to cart')
    }
  }, [addToCartMutation])

  const updateCart = useCallback(async (productId: string, quantity: number) => {
    try {
      const payload: UpdateCartPayload = { productId, quantity }
      await updateCartMutation(payload)
      toast.success('Cart updated')
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update cart')
    }
  }, [updateCartMutation])

  const removeFromCart = useCallback(async (productId: string) => {
    try {
      await removeFromCartMutation({ productId })
      toast.success('Item removed from cart')
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to remove item')
    }
  }, [removeFromCartMutation])

  const clearCart = useCallback(async () => {
    try {
      await clearCartMutation()
      toast.success('Cart cleared')
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to clear cart')
    }
  }, [clearCartMutation])

  const mergeCart = useCallback(async () => {
    try {
      await mergeCartMutation()
      toast.success('Carts merged successfully')
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to merge carts')
    }
  }, [mergeCartMutation])

  return {
    cart,
    isLoading,
    isError,
    error,
    addToCart,
    updateCart,
    removeFromCart,
    clearCart,
    mergeCart,
    isAdding,
    isUpdating,
    isRemoving,
    isClearing,
    isMerging,
  }
}
