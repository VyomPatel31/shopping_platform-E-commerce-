import axiosInstance from '../../../api/axiosInstance'
import { ReviewData, CreateReviewPayload, UpdateReviewPayload } from '../types/review.types'

const REVIEW_API = '/api/reviews'

export const reviewService = {
  getProductReviews: async (productId: string): Promise<ReviewData[]> => {
    const response = await axiosInstance.get(`${REVIEW_API}/product/${productId}`)
    return response.data.data
  },

  getUserReviews: async (): Promise<ReviewData[]> => {
    const response = await axiosInstance.get(`${REVIEW_API}/user`)
    return response.data.data
  },

  createReview: async (payload: CreateReviewPayload): Promise<ReviewData> => {
    const response = await axiosInstance.post(`${REVIEW_API}`, payload)
    return response.data.data
  },

  updateReview: async (id: string, payload: UpdateReviewPayload): Promise<ReviewData> => {
    const response = await axiosInstance.put(`${REVIEW_API}/${id}`, payload)
    return response.data.data
  },

  deleteReview: async (id: string): Promise<void> => {
    await axiosInstance.delete(`${REVIEW_API}/${id}`)
  },
}
