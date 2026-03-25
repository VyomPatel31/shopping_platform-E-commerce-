export interface WishlistItem {
  product: string | {
    _id: string
    name: string
    price: number
    images?: string[]
  }
  addedAt?: string
  _id?: string
}

export interface Wishlist {
  _id: string
  user: string
  items: WishlistItem[]
  createdAt?: string
  updatedAt?: string
}

export interface AddToWishlistPayload {
  productId: string
}

export interface RemoveFromWishlistPayload {
  productId: string
}

export interface WishlistResponse {
  statusCode: number
  message: string
  data?: Wishlist
}
