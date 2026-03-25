import React, { useState } from 'react';
import Navbar from '../../../components/layout/Navbar';
import Footer from '../../../components/layout/Footer';
import ProductList from '../components/ProductList';
import { Star, SlidersHorizontal, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const categories = ['Electronics', 'Accessories', 'Fashion', 'Home Decor', 'Gaming', 'Lifestyle'];

const ProductsPage: React.FC = () => {
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
    const [minRating, setMinRating] = useState<number>(0);
    const [sortBy, setSortBy] = useState<string>('latest');
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // This component will pass these filters to ProductList or handle fetching itself.
    // Let's modify ProductList to accept these as props.

    return (
        <div className="min-h-screen bg-[#f3f3f3]">
            <Navbar />
            
            <main className="pt-24 pb-20 px-4 md:px-8 max-w-[1700px] mx-auto">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar Filters */}
                    <aside className="hidden lg:block w-72 space-y-8 bg-white p-6 rounded-sm shadow-sm border border-gray-100 h-fit sticky top-28">
                        <div>
                            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-900 border-b border-gray-100 pb-2 mb-4">Category</h3>
                            <div className="space-y-2">
                                <button 
                                    onClick={() => setSelectedCategory('')}
                                    className={`block text-xs font-medium hover:text-[#e47911] transition-colors ${selectedCategory === '' ? 'text-[#e47911] font-bold underline' : 'text-gray-600'}`}
                                >
                                    All Categories
                                </button>
                                {categories.map(cat => (
                                    <button 
                                        key={cat}
                                        onClick={() => setSelectedCategory(cat)}
                                        className={`block text-xs font-medium hover:text-[#e47911] transition-colors ${selectedCategory === cat ? 'text-[#e47911] font-bold underline' : 'text-gray-600'}`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-900 border-b border-gray-100 pb-2 mb-4">Customer Rating</h3>
                            <div className="space-y-3">
                                {[4, 3, 2, 1].map((rating) => (
                                    <button 
                                        key={rating}
                                        onClick={() => setMinRating(rating)}
                                        className={`flex items-center space-x-2 text-xs font-medium hover:text-[#e47911] transition-colors ${minRating === rating ? 'text-[#e47911] font-bold' : 'text-gray-600'}`}
                                    >
                                        <div className="flex text-[#febd69]">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className={`w-4 h-4 ${i < rating ? 'fill-current' : 'text-gray-300'}`} />
                                            ))}
                                        </div>
                                        <span>& Up</span>
                                    </button>
                                ))}
                                <button 
                                    onClick={() => setMinRating(0)}
                                    className="text-[10px] text-blue-600 hover:underline"
                                >
                                    Clear Rating
                                </button>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-900 border-b border-gray-100 pb-2 mb-4">Price</h3>
                            <div className="flex items-center space-x-4">
                                <input 
                                    type="number" 
                                    placeholder="Min" 
                                    className="w-full border border-gray-300 rounded p-1.5 text-xs outline-none focus:border-[#febd69]"
                                    onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                                />
                                <span className="text-gray-400">-</span>
                                <input 
                                    type="number" 
                                    placeholder="Max" 
                                    className="w-full border border-gray-300 rounded p-1.5 text-xs outline-none focus:border-[#febd69]"
                                    onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                                />
                            </div>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <div className="flex-1">
                        <div className="bg-white p-4 rounded-sm shadow-sm border border-gray-100 mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                            <div className="text-sm text-gray-700">
                                Showing results for <span className="font-bold text-gray-900">"{selectedCategory || 'All Products'}"</span>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="flex items-center space-x-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Sort by:</label>
                                    <select 
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        className="bg-gray-50 border border-gray-300 rounded px-2 py-1 text-xs outline-none focus:border-[#febd69] cursor-pointer"
                                    >
                                        <option value="latest">Newest Arrivals</option>
                                        <option value="price_asc">Price: Low to High</option>
                                        <option value="price_desc">Price: High to Low</option>
                                        <option value="rating">Avg. Customer Review</option>
                                    </select>
                                </div>
                                <button 
                                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                                    className="lg:hidden flex items-center gap-2 bg-black text-white px-4 py-1.5 rounded text-xs"
                                >
                                    <SlidersHorizontal className="w-4 h-4" /> Filters
                                </button>
                            </div>
                        </div>

                        {/* Mobile Filters */}
                        <AnimatePresence>
                            {isFilterOpen && (
                                <motion.div 
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="lg:hidden bg-white mb-6 overflow-hidden rounded shadow-md border border-gray-200"
                                >
                                    <div className="p-6 space-y-8">
                                        <div className="flex items-center justify-between">
                                            <h2 className="text-xl font-bold">Filters</h2>
                                            <X className="w-6 h-6 cursor-pointer" onClick={() => setIsFilterOpen(false)} />
                                        </div>
                                        {/* Mobile categories/price/rating UI here... same as above but bigger for touch */}
                                        <div className="grid grid-cols-2 gap-8">
                                            <div>
                                                <h3 className="font-bold mb-3">Category</h3>
                                                <select className="w-full border p-2" value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}>
                                                    <option value="">All</option>
                                                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                                </select>
                                            </div>
                                            <div>
                                                <h3 className="font-bold mb-3">Rating</h3>
                                                <select className="w-full border p-2" value={minRating} onChange={e => setMinRating(Number(e.target.value))}>
                                                    <option value="0">All</option>
                                                    {[4,3,2,1].map(r => <option key={r} value={r}>{r} & Up</option>)}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="bg-white p-6 shadow-sm border border-gray-100">
                             <ProductList 
                                category={selectedCategory} 
                                minPrice={priceRange[0]} 
                                maxPrice={priceRange[1]} 
                                rating={minRating}
                                sort={sortBy}
                             />
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default ProductsPage;
