export interface Product {
  _id: string
  name: string
  description: string
  price: number
  category: string
  brand: string
  stock: number
  images: string[]
  rating: number
  numReviews: number
  isFeatured: boolean
  isTrending: boolean
  createdAt?: string
  updatedAt?: string
}

export interface ProductFilters {
  category?: string
  brand?: string
  minPrice?: number
  maxPrice?: number
  search?: string
  page?: number
  limit?: number
}

export interface ProductResponse {
  statusCode: number
  message: string
  data: Product[] | Product
}

export interface ProductListResponse {
  statusCode: number
  message: string
  data: {
    products: Product[]
    total: number
    page: number
    limit: number
  }
}
