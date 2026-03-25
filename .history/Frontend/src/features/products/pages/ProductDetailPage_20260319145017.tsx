import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { productService } from '../services/product.service';
import Navbar from '../../../components/layout/Navbar';
import { motion } from 'framer-motion';
import { Star, ShoppingCart, ArrowLeft, Loader2, AlertCircle, Heart } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../../store/authStore';


const ProductDetailPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const [quantity, setQuantity] = React.useState(1);
  const [selectedImage, setSelectedImage] = React.useState(0);
  const [isFavorite, setIsFavorite] = React.useState(false);

  // Fetch product details
  const { data: productData, isLoading, error } = useQuery({
    queryKey: ['product', productId],
    queryFn: () => productService.getProductById(productId!),
    enabled: !!productId,
  });

  const product = productData?.response;

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      navigate('/login');
      return;
    }

    if (!product) return;

    toast.success(`${product.name} added to cart!`);
    // TODO: Implement cart store functionality
  };

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast.success(isFavorite ? 'Removed from wishlist' : 'Added to wishlist');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center">
            <Loader2 className="w-12 h-12 animate-spin text-blue-600 mb-4" />
            <p className="text-gray-400">Loading product details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-black">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Product not found</h2>
            <p className="text-gray-400 mb-6">The product you're looking for doesn't exist.</p>
            <button
              onClick={() => navigate('/')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  const images = product.images && product.images.length > 0 ? product.images : ['/placeholder.png'];
  const discount = Math.floor(Math.random() * 31 + 10); // Random discount 10-40%
  const originalPrice = Math.round(product.price / (1 - discount / 100));

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      
      <main className="pt-24 pb-12 px-6 max-w-7xl mx-auto">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate('/')}
          className="flex items-center space-x-2 text-gray-400 hover:text-white mb-8 transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Products</span>
        </motion.button>

        {/* Product Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col space-y-4"
          >
            {/* Main Image */}
            <div className="relative w-full aspect-square rounded-2xl overflow-hidden glassmorphism border border-white/5">
              <img
                src={images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
              {discount > 0 && (
                <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                  -{discount}%
                </div>
              )}
            </div>

            {/* Thumbnail Images */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {images.map((img: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                      selectedImage === idx
                        ? 'border-blue-500 scale-105'
                        : 'border-gray-800 hover:border-gray-700'
                    }`}
                  >
                    <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Details Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col justify-between py-4"
          >
            {/* Header */}
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm text-blue-400 font-semibold mb-2">
                    {product.category || 'Uncategorized'}
                  </p>
                  <h1 className="text-4xl font-black text-white mb-2">{product.name}</h1>
                  <p className="text-gray-400 text-lg mb-4">{product.brand || 'Premium Brand'}</p>
                </div>
                <button
                  onClick={handleToggleFavorite}
                  className={`p-3 rounded-full transition-all ${
                    isFavorite
                      ? 'bg-red-500/20 text-red-500'
                      : 'bg-gray-800/50 text-gray-400 hover:text-red-500'
                  }`}
                >
                  <Heart className={`w-6 h-6 ${isFavorite ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Rating */}
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.rating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-600'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-gray-400">({product.numReviews} reviews)</span>
              </div>

              {/* Description */}
              <p className="text-gray-300 text-lg leading-relaxed mb-6">
                {product.description || 'Premium quality product with excellent features and durability.'}
              </p>

              {/* Price Section */}
              <div className="mb-6 p-6 rounded-xl glassmorphism border border-white/5">
                <div className="flex items-baseline space-x-3 mb-2">
                  <span className="text-4xl font-bold text-white">
                    ${product.price.toFixed(2)}
                  </span>
                  {discount > 0 && (
                    <>
                      <span className="text-lg text-gray-500 line-through">
                        ${originalPrice.toFixed(2)}
                      </span>
                      <span className="text-green-400 font-semibold">Save ${(originalPrice - product.price).toFixed(2)}</span>
                    </>
                  )}
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                  <span className={`font-semibold text-lg ${
                    product.stock > 10 ? 'text-green-400' : product.stock > 0 ? 'text-yellow-400' : 'text-red-400'
                  }`}>
                    {product.stock > 10 ? 'In Stock' : product.stock > 0 ? 'Low Stock' : 'Out of Stock'}
                  </span>
                  <span className="text-gray-400">{product.stock} items available</span>
                </div>
              </div>

              {/* Features */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="p-3 rounded-lg bg-gray-900/50 border border-gray-800">
                  <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Category</p>
                  <p className="text-white font-semibold">{product.category || 'Electronics'}</p>
                </div>
                <div className="p-3 rounded-lg bg-gray-900/50 border border-gray-800">
                  <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Brand</p>
                  <p className="text-white font-semibold">{product.brand || 'Premium'}</p>
                </div>
                {product.isFeatured && (
                  <div className="p-3 rounded-lg bg-blue-900/30 border border-blue-700">
                    <p className="text-blue-400 text-xs uppercase tracking-wider mb-1">Featured</p>
                    <p className="text-blue-300 font-semibold">⭐ Featured Product</p>
                  </div>
                )}
                {product.isTrending && (
                  <div className="p-3 rounded-lg bg-purple-900/30 border border-purple-700">
                    <p className="text-purple-400 text-xs uppercase tracking-wider mb-1">Trending</p>
                    <p className="text-purple-300 font-semibold">🔥 Trending Now</p>
                  </div>
                )}
              </div>
            </div>

            {/* Quantity and Action */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <span className="text-white font-semibold">Quantity:</span>
                <div className="flex items-center border border-gray-700 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity === 1}
                    className="px-4 py-2 text-gray-400 hover:text-white disabled:opacity-50 transition-colors"
                  >
                    −
                  </button>
                  <span className="px-6 py-2 text-white font-bold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity === product.stock}
                    className="px-4 py-2 text-gray-400 hover:text-white disabled:opacity-50 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl flex items-center justify-center space-x-3 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <ShoppingCart className="w-6 h-6" />
                <span>{product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}</span>
              </button>

              <button
                onClick={() => navigate('/')}
                className="w-full border border-gray-700 hover:border-gray-500 text-gray-300 hover:text-white font-semibold py-3 rounded-xl transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          </motion.div>
        </div>

        {/* Related Products Placeholder */}
        <div className="mt-20 pt-12 border-t border-gray-800">
          <h2 className="text-3xl font-bold text-white mb-8">You Might Also Like</h2>
          <div className="text-center py-12 glassmorphism rounded-2xl border border-white/5">
            <p className="text-gray-400">More products coming soon...</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductDetailPage;
