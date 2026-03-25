import axiosInstance from '../../../api/axiosInstance'
import { Product, ProductFilters, ProductListResponse } from '../types/product.types'

const PRODUCT_API = '/api/products'

export const productService = {
  getProducts: async (filters?: ProductFilters): Promise<Product[]> => {
    const params = new URLSearchParams()
    if (filters?.search) params.append('search', filters.search)
    if (filters?.category) params.append('category', filters.category)
    if (filters?.brand) params.append('brand', filters.brand)
    if (filters?.minPrice) params.append('minPrice', filters.minPrice.toString())
    if (filters?.maxPrice) params.append('maxPrice', filters.maxPrice.toString())
    if (filters?.page) params.append('page', filters.page.toString())
    if (filters?.limit) params.append('limit', filters.limit.toString())

    const response = await axiosInstance.get(`${PRODUCT_API}?${params.toString()}`)
    return response.data.data.products || response.data.data
  },

  getProductById: async (id: string): Promise<Product> => {
    const response = await axiosInstance.get(`${PRODUCT_API}/${id}`)
    return response.data.data
  },

  getFeaturedProducts: async (): Promise<Product[]> => {
    const response = await axiosInstance.get(`${PRODUCT_API}/featured`)
    return response.data.data
  },

  getTrendingProducts: async (): Promise<Product[]> => {
    const response = await axiosInstance.get(`${PRODUCT_API}/trending`)
    return response.data.data
  },

  searchProducts: async (query: string): Promise<Product[]> => {
    const response = await axiosInstance.get(`${PRODUCT_API}/search?q=${query}`)
    return response.data.data
  },
}
