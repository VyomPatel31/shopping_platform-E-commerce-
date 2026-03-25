export interface ReviewData {
  _id: string
  product: string
  user: string
  rating: number
  comment: string
  createdAt?: string
  updatedAt?: string
}

export interface CreateReviewPayload {
  productId: string
  rating: number
  comment: string
}

export interface UpdateReviewPayload {
  rating: number
  comment: string
}

export interface ReviewResponse {
  statusCode: number
  message: string
  data?: ReviewData
}
