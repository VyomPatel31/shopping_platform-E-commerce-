import { useCallback, useState } from 'react'
import { useGetProducts, useGetProductById, useGetFeaturedProducts, useGetTrendingProducts, useSearchProducts } from '../quaries/product.query'
import { Product, ProductFilters } from '../types/product.types'

export interface UseProductsReturn {
  products: Product[]
  isLoading: boolean
  isError: boolean
  error: Error | null
  filters: ProductFilters
  setFilters: (filters: ProductFilters) => void
  refetch: () => void
}

export function useProducts(initialFilters?: ProductFilters): UseProductsReturn {
  const [filters, setFilters] = useState<ProductFilters>(initialFilters || {})

  const { data = [], isLoading, isError, error, refetch } = useGetProducts(filters)

  return {
    products: data,
    isLoading,
    isError,
    error,
    filters,
    setFilters,
    refetch,
  }
}

export interface UseProductByIdReturn {
  product: Product | undefined
  isLoading: boolean
  isError: boolean
  error: Error | null
}

export function useProductById(id: string): UseProductByIdReturn {
  const { data, isLoading, isError, error } = useGetProductById(id)

  return {
    product: data,
    isLoading,
    isError,
    error,
  }
}

export interface UseFeaturedProductsReturn {
  products: Product[]
  isLoading: boolean
  isError: boolean
  error: Error | null
}

export function useFeaturedProducts(): UseFeaturedProductsReturn {
  const { data = [], isLoading, isError, error } = useGetFeaturedProducts()

  return {
    products: data,
    isLoading,
    isError,
    error,
  }
}

export interface UseTrendingProductsReturn {
  products: Product[]
  isLoading: boolean
  isError: boolean
  error: Error | null
}

export function useTrendingProducts(): UseTrendingProductsReturn {
  const { data = [], isLoading, isError, error } = useGetTrendingProducts()

  return {
    products: data,
    isLoading,
    isError,
    error,
  }
}

export interface UseSearchProductsReturn {
  products: Product[]
  isLoading: boolean
  isError: boolean
  error: Error | null
  search: (query: string) => void
}

export function useSearchProductsHook(): UseSearchProductsReturn {
  const [query, setQuery] = useState('')
  const { data = [], isLoading, isError, error } = useSearchProducts(query)

  const search = useCallback((q: string) => {
    setQuery(q)
  }, [])

  return {
    products: data,
    isLoading,
    isError,
    error,
    search,
  }
}
