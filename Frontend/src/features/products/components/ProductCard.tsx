import React from 'react';
import { motion } from 'framer-motion';
import { Star, ShoppingBag, Heart, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCartStore } from '../../cart/store/cartStore';
import { useWishlistStore } from '../../wishlist/store/wishlistStore';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: {
    _id: string;
    name: string;
    price: number;
    description?: string;
    images?: string[];
    thumbnails?: string[];
    category?: string;
    rating?: number;
    [key: string]: any;
  };
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const addItem = useCartStore(state => state.addItem);
  const { toggleWishlist, items: wishlistItems } = useWishlistStore();

  const imageUrl = (product.images && product.images[0]) || (product.thumbnails && product.thumbnails[0]) || 'https://via.placeholder.com/400?text=No+Image';
  const isInWishlist = wishlistItems.some(item => item.product?._id === product._id);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      await addItem(product);
      toast.success('Added to cart!');
    } catch (error) {
      toast.error('Failed to add item');
    }
  };

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      await toggleWishlist(product);
      toast.success(isInWishlist ? 'Removed from wishlist' : 'Added to wishlist');
    } catch (error) {
      toast.error('Action failed');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="group bg-white border border-gray-100 rounded-2xl overflow-hidden flex flex-col transition-all duration-300 hover:border-black hover:shadow-xl h-full relative"
    >
      {/* Product Image */}
      <Link to={`/products/${product._id}`} className="block relative w-full h-[280px] overflow-hidden bg-gray-50 border-b border-gray-100 flex items-center justify-center p-6">
        <img
          src={imageUrl}
          alt={product.namemax}
          className="h-full w-auto object-contain transition-transform duration-700 group-hover:scale-110"
        />

        {/* Quick Actions (Floating) */}
        <div className="absolute top-4 right-4 translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 flex flex-col space-y-2">
          <button
            onClick={handleWishlist}
            className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all ${isInWishlist ? 'bg-black text-white border-black' : 'bg-white text-black border-gray-200 hover:bg-black hover:text-white hover:border-black'}`}
          >
            <Heart className={`w-4 h-4 ${isInWishlist ? 'fill-current' : ''}`} />
          </button>
          <button
            onClick={handleAddToCart}
            className="w-10 h-10 bg-white text-black rounded-full flex items-center justify-center border border-gray-200 hover:bg-black hover:text-white hover:border-black transition-all"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </Link>

      {/* Product Content */}
      <div className="p-6 flex flex-col flex-1">
        <div className="space-y-1 mb-4">
          <span className="text-[10px] uppercase font-bold text-gray-400 tracking-widest leading-none">{(product.category || 'Lifestyle').toUpperCase()}</span>
          <Link to={`/products/${product._id}`} className="block">
            <h3 className="text-md font-black text-black line-clamp-2 leading-tight uppercase tracking-tighter h-12 group-hover:text-gray-500 transition-colors">{product.name}</h3>
          </Link>
          <div className="flex items-center space-x-1 pt-1 opacity-50 group-hover:opacity-100 transition-opacity">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-3 h-3 ${i < Math.floor(product.rating || 4) ? 'text-black fill-current' : 'text-gray-200'}`} />
              ))}
            </div>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest ml-1">({product.numReviews || 0})</span>
          </div>
        </div>

        <div className="mt-auto flex items-end justify-between border-t border-gray-100 pt-4">
          <div className="flex flex-col">
            <span className="text-[8px] uppercase tracking-widest text-gray-400 font-black mb-1">MRP / INR</span>
            <div className="flex items-baseline text-black font-black">
              <span className="text-2xl tracking-tighter">₹{Math.floor(product.price)}</span>
              <span className="text-xs opacity-60">{(product.price % 1).toFixed(2).substring(1)}</span>
            </div>
          </div>

          <Link to={`/products/${product._id}`} className="p-2 border border-black hover:bg-black hover:text-white transition-all rounded-full group">
            <ArrowUpRight className="w-4 h-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
