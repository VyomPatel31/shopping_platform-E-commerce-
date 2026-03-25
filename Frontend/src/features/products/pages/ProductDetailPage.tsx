import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { productService } from '../services/product.service';
import Navbar from '../../../components/layout/Navbar';
import Footer from '../../../components/layout/Footer';
import { motion } from 'framer-motion';
import { Star, ShoppingCart, ArrowLeft, Loader2, AlertCircle, Heart, Share2, ShieldCheck, Truck, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../../store/authStore';
import { useCartStore } from '../../cart/store/cartStore';
import { useWishlistStore } from '../../wishlist/store/wishlistStore';
import { reviewService } from '../../reviews/services/review.service';
import ReviewForm from '../../reviews/components/ReviewForm';
import ReviewList from '../../reviews/components/ReviewList';

const ProductDetailPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const addItem = useCartStore(state => state.addItem);
  const { toggleWishlist, items: wishlistItems } = useWishlistStore();
  
  const [quantity, setQuantity] = React.useState(1);
  const [selectedImage, setSelectedImage] = React.useState(0);
  const [reviews, setReviews] = React.useState<any[]>([]);
  const [canReview, setCanReview] = React.useState(false);
  const [isReviewsLoading, setIsReviewsLoading] = React.useState(true);

  const { data: productData, isLoading, error } = useQuery({
    queryKey: ['product', productId],
    queryFn: () => productService.getProductById(productId!),
    enabled: !!productId,
  });

  const fetchReviews = React.useCallback(async () => {
    if (!productId) return;
    try {
      const res = await reviewService.getReviewsByProduct(productId);
      setReviews(res.data || []);
    } catch (err) {
      console.error('Failed to fetch reviews');
    } finally {
      setIsReviewsLoading(false);
    }
  }, [productId]);

  const checkEligibility = React.useCallback(async () => {
    if (!productId || !isAuthenticated) return;
    try {
      const res = await reviewService.checkEligibility(productId);
      setCanReview(res.data.canReview);
    } catch (err) {
      console.error('Failed to check review eligibility');
    }
  }, [productId, isAuthenticated]);

  React.useEffect(() => {
    fetchReviews();
    checkEligibility();
  }, [fetchReviews, checkEligibility]);

  const product = productData?.data; 
  const isInWishlist = wishlistItems.some(item => item.product?._id === product?._id);

  const handleAddToCart = async () => {
    if (!product) return;

    try {
      await addItem(product, quantity);
      toast.success('Added to your cart');
    } catch (error) {
      toast.error('Unable to add item');
    }
  };

  const handleWishlist = async () => {
    try {
      if(product) {
        await toggleWishlist(product);
        toast.success(isInWishlist ? 'Removed from wishlist' : 'Added to wishlist');
      }
    } catch (error) {
      toast.error('Wishlist action failed');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-black mb-6 opacity-20" />
        <span className="text-[10px] uppercase font-black tracking-[0.5em] text-gray-400 animate-pulse">Accessing Collections</span>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex items-center justify-center min-h-[80vh] px-6">
          <div className="text-center max-w-lg space-y-8">
            <AlertCircle className="w-16 h-16 text-black mx-auto mb-8 opacity-20 font-light" />
            <h2 className="text-4xl font-black text-black mb-4 uppercase tracking-tighter">Product Record Missing</h2>
            <p className="text-gray-400 text-xs tracking-widest uppercase font-bold leading-relaxed">The item you seek is currently unavailable in our digital inventory.</p>
            <button
              onClick={() => navigate('/products')}
              className="bg-black text-white px-12 py-4 rounded-full font-black text-xs uppercase tracking-[0.3em] hover:bg-gray-800 transition-all transform hover:scale-105 shadow-xl"
            >
              Examine Collection
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const images = product.images && product.images.length > 0 ? product.images : ['https://via.placeholder.com/800?text=No+Image'];
  const discount = 15; // Simulated
  const originalPrice = Math.round(product.price / (1 - discount / 100));

  return (
    <div className="min-h-screen bg-white text-black">
      <Navbar />
      
      <main className="pt-32 pb-32 px-6 max-w-[1400px] mx-auto">
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate('/products')}
          className="flex items-center space-x-3 text-gray-400 hover:text-black mb-12 transition-all group font-black text-[10px] uppercase tracking-[0.4em]"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Boutique Inventory</span>
        </motion.button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          {/* LEFT: Image Gallery */}
          <div className="flex flex-col space-y-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="relative w-full aspect-square rounded-3xl overflow-hidden bg-gray-50 border border-gray-100 flex items-center justify-center p-12 group shadow-inner"
            >
              <img
                src={images[selectedImage]}
                alt={product.name}
                className="max-h-full w-auto object-contain transition-transform duration-700 group-hover:scale-105"
              />
              <button 
                onClick={handleWishlist}
                className={`absolute top-6 right-6 p-4 rounded-full shadow-lg border transition-all ${isInWishlist ? 'bg-black text-white border-black' : 'bg-white text-black border-gray-100 hover:bg-black hover:text-white'}`}
              >
                 <Heart className={`w-5 h-5 ${isInWishlist ? 'fill-current' : ''}`} />
              </button>
            </motion.div>

            {/* Thumbnails */}
            {images.length > 1 && (
               <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4">
                  {images.map((img: string, idx: number) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedImage(idx)}
                        className={`w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all shrink-0 ${
                          selectedImage === idx ? 'border-black scale-105' : 'border-gray-100 opacity-40 hover:opacity-100'
                        }`}
                      >
                        <img src={img} className="w-full h-full object-contain p-2 grayscale hover:grayscale-0 transition-all" alt="thumbnail" />
                      </button>
                  ))}
               </div>
            )}
          </div>

          {/* RIGHT: Sophisticated Details */}
          <div className="flex flex-col justify-center py-4 space-y-10">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="space-y-4 mb-10">
                <span className="text-[11px] font-black text-gray-400 uppercase tracking-[0.5em] block">{product.category || 'Lifestyle Collection'}</span>
                <h1 className="text-5xl md:text-6xl font-black text-black leading-none uppercase tracking-tighter">{product.name}</h1>
                <div className="flex items-center space-x-2 pt-2">
                   <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-3.5 h-3.5 ${i < Math.floor(product.rating || 4) ? 'text-black fill-current' : 'text-gray-100'}`} />
                      ))}
                   </div>
                   <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest pl-2">Rated {product.rating} by Clientele</span>
                </div>
              </div>

              <div className="flex items-baseline space-x-6 mb-12">
                 <div className="flex flex-col">
                    <span className="text-[8px] uppercase tracking-[0.5em] text-gray-400 font-black mb-2 leading-none">Net Price / INR</span>
                    <span className="text-5xl font-black text-black tracking-tighter">₹{product.price.toLocaleString()}</span>
                 </div>
                 {discount > 0 && (
                    <div className="flex flex-col opacity-20 hover:opacity-100 transition-opacity">
                        <span className="text-[8px] uppercase tracking-[0.5em] text-gray-400 font-black mb-2 leading-none">MRP</span>
                        <span className="text-2xl font-black text-gray-400 line-through tracking-tighter">₹{originalPrice.toLocaleString()}</span>
                    </div>
                 )}
              </div>

              <p className="text-sm text-gray-500 font-bold leading-relaxed mb-12 uppercase tracking-widest italic border-l-4 border-black/10 pl-8 max-w-xl">
                {product.description || "A refined interpretation of modern utility. Sourced with meticulous attention to detail and material integrity."}
              </p>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 gap-px bg-gray-100 border border-gray-100 rounded-3xl overflow-hidden mb-12 max-w-md shadow-sm">
                 {[
                   { label: 'Origin', value: 'Bespoke Manufacture' },
                   { label: 'Inventory', value: product.stock > 0 ? `${product.stock} Units Available` : 'Current Archive' }
                 ].map((stat) => (
                    <div key={stat.label} className="bg-white p-6 hover:bg-gray-50 transition-colors">
                      <p className="text-[9px] text-gray-400 uppercase tracking-[0.3em] font-black mb-1">{stat.label}</p>
                      <p className="text-xs font-black uppercase tracking-widest text-black">{stat.value}</p>
                    </div>
                 ))}
              </div>

              {/* Action Buttons */}
              <div className="space-y-6">
                 <div className="flex items-center space-x-6 p-4 border border-gray-100 rounded-full px-8 w-fit shadow-sm">
                    <span className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-400 pr-4">Quantity</span>
                    <div className="flex items-center space-x-6">
                       <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-black hover:text-gray-400 transition-colors text-2xl font-light">−</button>
                       <span className="text-sm font-black w-4 text-center">{quantity}</span>
                       <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} className="text-black hover:text-gray-400 transition-colors text-2xl font-light">+</button>
                    </div>
                 </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <button
                      onClick={handleAddToCart}
                      className="flex-1 bg-black text-white h-20 rounded-full font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center space-x-4 hover:bg-gray-900 transition-all transform hover:scale-[1.02] active:scale-95 shadow-2xl shadow-black/10"
                    >
                      <ShoppingCart className="w-5 h-5" />
                      <span>Acquire Piece</span>
                    </button>
                    <button
                      onClick={async () => {
                        if (product.stock < quantity) {
                          toast.error('Insufficient inventory');
                          return;
                        }
                        try {
                          await addItem(product, quantity);
                          navigate('/cart');
                        } catch (err) {
                          toast.error('Acquisition failure');
                        }
                      }}
                      className="flex-1 bg-gray-50 border border-gray-100 text-black h-20 rounded-full font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center space-x-4 hover:bg-black hover:text-white hover:border-black transition-all transform hover:scale-[1.02] active:scale-95 shadow-md"
                    >
                      <span>Direct Buy</span>
                    </button>
                    <button className="h-20 w-20 rounded-full border border-gray-100 flex items-center justify-center hover:bg-gray-50 transition-all text-gray-400 hover:text-black shadow-sm">
                      <Share2 className="w-5 h-5" />
                    </button>
                  </div>
              </div>

              {/* Assurance Flags */}
              <div className="mt-16 grid grid-cols-3 gap-8 pt-12 border-t border-gray-100 opacity-40 hover:opacity-100 transition-opacity">
                 {[
                   { Icon: ShieldCheck, label: 'Quality Assured' },
                   { Icon: Truck, label: 'Global Secure' },
                   { Icon: RefreshCw, label: 'Exchange Policy' }
                 ].map((trust) => (
                    <div key={trust.label} className="flex flex-col items-center text-center space-y-3">
                       <trust.Icon className="w-6 h-6 text-black/40 group-hover:text-black transition-colors" />
                       <span className="text-[8px] font-black uppercase tracking-[0.2em] text-gray-500">{trust.label}</span>
                    </div>
                 ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* REVIEWS SECTION */}
        <div className="mt-40 pt-40 border-t border-gray-50">
           <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
              <div className="lg:col-span-4">
                 <div className="sticky top-40 space-y-8">
                    <h2 className="text-5xl font-black uppercase tracking-tighter leading-none">Clientele <br/> Feedback</h2>
                    <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest leading-relaxed max-w-[200px]">
                       Authentic narratives from our global community regarding product integrity and utility.
                    </p>
                    
                    {canReview && (
                       <div className="pt-8">
                          <ReviewForm productId={productId!} onSuccess={() => { fetchReviews(); setCanReview(false); }} />
                       </div>
                    )}
                 </div>
              </div>
              
              <div className="lg:col-span-8">
                 {isReviewsLoading ? (
                    <div className="py-20 flex justify-center opacity-10">
                       <Loader2 className="w-8 h-8 animate-spin" />
                    </div>
                 ) : (
                    <ReviewList reviews={reviews} />
                 )}
              </div>
           </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetailPage;
