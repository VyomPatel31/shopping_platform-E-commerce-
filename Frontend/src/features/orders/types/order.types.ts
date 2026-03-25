export interface OrderItem {
  product: string | {
    _id: string
    name: string
    price: number
    images?: string[]
  }
  quantity: number
  price: number
  _id?: string
}

export interface Order {
  _id: string
  user: string
  items: OrderItem[]
  totalAmount: number
  orderStatus: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
  paymentStatus: 'pending' | 'paid' | 'failed'
  shippingAddress?: string
  createdAt?: string
  updatedAt?: string
}

export interface CreateOrderPayload {
  shippingAddressId?: string
  paymentMethod?: string
}

export interface UpdateOrderStatusPayload {
  status: string
}

export interface OrderResponse {
  statusCode: number
  message: string
  data?: Order
}
