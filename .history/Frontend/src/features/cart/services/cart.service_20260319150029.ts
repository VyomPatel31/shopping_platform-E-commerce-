import axiosInstance from "../../../api/axiosInstance";

export const cartService = {
  async getCart() {
    const response = await axiosInstance.get('/cart');
    return response.data;
  },

  async addToCart(productId: string, quantity: number = 1) {
    const response = await axiosInstance.post('/cart/add', { productId, quantity });
    return response.data;
  },

  async removeFromCart(productId: string) {
    const response = await axiosInstance.delete('/cart/remove', { data: { productId } });
    return response.data;
  },

  async updateQuantity(productId: string, quantity: number) {
    const response = await axiosInstance.put('/cart/update', { productId, quantity });
    return response.data;
  },

  async clearCart() {
    const response = await axiosInstance.delete('/cart/clear');
    return response.data;
  }
};
