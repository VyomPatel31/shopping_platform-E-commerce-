import axiosInstance from '../../../api/axiosInstance';

export const reviewService = {
  getReviewsByProduct: async (productId: string) => {
    const response = await axiosInstance.get(`/reviews/product/${productId}`);
    return response.data;
  },
  
  createReview: async (reviewData: { product: string; rating: number; comment?: string }) => {
    const response = await axiosInstance.post('/reviews', reviewData);
    return response.data;
  },
  
  checkEligibility: async (productId: string) => {
    // This is a custom endpoint of the future, or we can just try to create and let backend handle 403
    // But better to check first to show/hide the form.
    const response = await axiosInstance.get(`/orders/check-review-eligibility/${productId}`);
    return response.data;
  }
};
