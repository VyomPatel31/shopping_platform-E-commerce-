export interface CartItem {
  product: string | {
    _id: string
    name: string
    price: number
    images?: string[]
    description?: string
  }
  quantity: number
  _id?: string
}

export interface Cart {
  _id: string
  user?: string
  sessionId?: string
  items: CartItem[]
  createdAt?: string
  updatedAt?: string
}

export interface AddToCartPayload {
  productId: string
  quantity?: number
}

export interface UpdateCartPayload {
  productId: string
  quantity: number
}

export interface RemoveFromCartPayload {
  productId: string
}

export interface CartResponse {
  statusCode: number
  message: string
  data?: Cart
}
