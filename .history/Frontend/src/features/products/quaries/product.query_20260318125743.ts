import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { productService } from '../services/product.service'
import { Product, ProductFilters } from '../types/product.types'

const PRODUCT_QUERY_KEYS = {
  all: ['products'] as const,
  list: (filters?: ProductFilters) => [...PRODUCT_QUERY_KEYS.all, 'list', filters] as const,
  detail: (id: string) => [...PRODUCT_QUERY_KEYS.all, 'detail', id] as const,
  featured: () => [...PRODUCT_QUERY_KEYS.all, 'featured'] as const,
  trending: () => [...PRODUCT_QUERY_KEYS.all, 'trending'] as const,
  search: (query: string) => [...PRODUCT_QUERY_KEYS.all, 'search', query] as const,
}

export function useGetProducts(filters?: ProductFilters): UseQueryResult<Product[], Error> {
  return useQuery({
    queryKey: PRODUCT_QUERY_KEYS.list(filters),
    queryFn: () => productService.getProducts(filters),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

export function useGetProductById(id: string): UseQueryResult<Product, Error> {
  return useQuery({
    queryKey: PRODUCT_QUERY_KEYS.detail(id),
    queryFn: () => productService.getProductById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 10, // 10 minutes
  })
}

export function useGetFeaturedProducts(): UseQueryResult<Product[], Error> {
  return useQuery({
    queryKey: PRODUCT_QUERY_KEYS.featured(),
    queryFn: () => productService.getFeaturedProducts(),
    staleTime: 1000 * 60 * 10, // 10 minutes
  })
}

export function useGetTrendingProducts(): UseQueryResult<Product[], Error> {
  return useQuery({
    queryKey: PRODUCT_QUERY_KEYS.trending(),
    queryFn: () => productService.getTrendingProducts(),
    staleTime: 1000 * 60 * 10, // 10 minutes
  })
}

export function useSearchProducts(query: string): UseQueryResult<Product[], Error> {
  return useQuery({
    queryKey: PRODUCT_QUERY_KEYS.search(query),
    queryFn: () => productService.searchProducts(query),
    enabled: !!query,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}
