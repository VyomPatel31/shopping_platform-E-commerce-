import React from 'react';
import { motion } from 'framer-motion';
import { Star, ShoppingCart, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCartStore } from '../../../store/cartStore';
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
  const imageUrl = (product.images && product.images[0]) || (product.thumbnails && product.thumbnails[0]) || 'https://via.placeholder.com/300?text=No+Image';

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product._id);
    toast.success('Added to cart!');
  };

  return (
    <motion.div
      whileHover={{ y: -10 }}
      className="group bg-white/5 border border-white/10 rounded-[2rem] overflow-hidden flex flex-col glassmorphism transition-all hover:border-blue-500/30 shadow-xl"
    >
      <Link to={`/products/${product._id}`} className="block relative w-full h-64 overflow-hidden">
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-4 right-4 flex flex-col space-y-2 translate-x-12 group-hover:translate-x-0 transition-transform duration-300">
          <button className="w-10 h-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-blue-600 transition-colors">
            <Heart className="w-5 h-5" />
          </button>
        </div>
      </Link>

      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] uppercase tracking-widest text-blue-500 font-bold">{product.category}</span>
          <div className="flex items-center space-x-1">
            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
            <span className="text-xs text-gray-400">{product.rating || '4.5'}</span>
          </div>
        </div>

        <Link to={`/products/${product._id}`}>
          <h3 className="text-lg font-bold text-white mb-2 line-clamp-1 hover:text-blue-400 transition-colors">{product.name}</h3>
        </Link>
        <p className="text-sm text-gray-500 mb-6 line-clamp-2 h-10">{product.description}</p>

        <div className="flex items-center justify-between mt-auto">
          <span className="text-xl font-black text-white">${product.price}</span>
          <button 
            onClick={handleAddToCart}
            className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl shadow-lg shadow-blue-500/20 transition-all active:scale-95"
          >
            <ShoppingCart className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
