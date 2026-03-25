import axiosInstance from "../../../api/axiosInstance";

export const productService = {
  async getAllProducts(params: any = {}) {
    const response = await axiosInstance.get('/products', { params });
    return response.data;
  },

  async getProductById(id: string) {
    const response = await axiosInstance.get(`/products/${id}`);
    return response.data;
  },

  async getFeaturedProducts() {
    const response = await axiosInstance.get('/products/featured');
    return response.data;
  },

  async getTrendingProducts() {
    const response = await axiosInstance.get('/products/trending');
    return response.data;
  },

  async searchProducts(query: string) {
    const response = await axiosInstance.get('/products/search', { params: { q: query } });
    return response.data;
  },

  async createProduct(data: any) {
    const response = await axiosInstance.post('/products', data);
    return response.data;
  },

  async updateProduct(id: string, data: any) {
    const response = await axiosInstance.put(`/products/${id}`, data);
    return response.data;
  },

  async deleteProduct(id: string) {
    const response = await axiosInstance.delete(`/products/${id}`);
    return response.data;
  },

  async uploadProductImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('image', file);
    const response = await axiosInstance.post('/products/upload-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.data.url;
  }
};

