import React, { useState } from 'react';
import Navbar from '../../../components/layout/Navbar';
import Footer from '../../../components/layout/Footer';
import ProductList from '../components/ProductList';
import { Star, SlidersHorizontal, X, ArrowRight, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const categories = ['Electronics', 'Accessories', 'Fashion', 'Home Decor', 'Gaming', 'Lifestyle'];

const ProductsPage: React.FC = () => {
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000]);
    const [minRating, setMinRating] = useState<number>(0);
    const [sortBy, setSortBy] = useState<string>('latest');
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            
            <main className="pt-32 pb-32 md:pb-20 px-4 md:px-12 max-w-[1400px] mx-auto">
                {/* Header Section */}
                <div className="mb-12 space-y-4">
                    <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-black leading-none">
                        The <span className="text-gray-300">Catalog.</span>
                    </h1>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b-4 border-black pb-8">
                        <p className="text-gray-400 text-[10px] md:text-xs font-black uppercase tracking-[0.4em]">
                            Discovered {selectedCategory || 'All'} essentials curated for precision.
                        </p>
                        
                        <div className="flex items-center space-x-4">
                            <div className="relative">
                                <select 
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="appearance-none bg-gray-50 border border-gray-100 rounded-full px-8 py-3 pr-12 text-[10px] font-black uppercase tracking-widest text-black focus:outline-none focus:ring-2 focus:ring-black transition-all cursor-pointer"
                                >
                                    <option value="latest">Newest Arrivals</option>
                                    <option value="price_asc">Price: Low to High</option>
                                    <option value="price_desc">Price: High to Low</option>
                                    <option value="rating">Top Rated Only</option>
                                </select>
                                <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-3 h-3 text-black pointer-events-none" />
                            </div>
                            
                            <button 
                                onClick={() => setIsFilterOpen(!isFilterOpen)}
                                className="lg:hidden flex items-center space-x-3 bg-black text-white px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl"
                            >
                                <SlidersHorizontal className="w-4 h-4" />
                                <span>Filters</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Sidebar Filters - Desktop */}
                    <aside className="hidden lg:block w-72 space-y-12 h-fit sticky top-32">
                        <div className="space-y-6">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 border-b border-gray-100 pb-3">Department</h3>
                            <div className="flex flex-col space-y-3">
                                <button 
                                    onClick={() => setSelectedCategory('')}
                                    className={`text-left text-xs font-black uppercase tracking-widest transition-all ${selectedCategory === '' ? 'text-black translate-x-2' : 'text-gray-300 hover:text-black hover:translate-x-1'}`}
                                >
                                    All Archives
                                </button>
                                {categories.map(cat => (
                                    <button 
                                        key={cat}
                                        onClick={() => setSelectedCategory(cat)}
                                        className={`text-left text-xs font-black uppercase tracking-widest transition-all ${selectedCategory === cat ? 'text-black translate-x-2' : 'text-gray-300 hover:text-black hover:translate-x-1'}`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 border-b border-gray-100 pb-3">Performance</h3>
                            <div className="space-y-4">
                                {[4, 3, 2].map((rating) => (
                                    <button 
                                        key={rating}
                                        onClick={() => setMinRating(rating)}
                                        className={`flex items-center space-x-3 text-[10px] font-black uppercase tracking-widest transition-all ${minRating === rating ? 'text-black' : 'text-gray-300 hover:text-black'}`}
                                    >
                                        <div className="flex space-x-0.5">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className={`w-3 h-3 ${i < rating ? 'fill-current text-black' : 'text-gray-100'}`} />
                                            ))}
                                        </div>
                                        <span>& Up</span>
                                    </button>
                                ))}
                                <button 
                                    onClick={() => setMinRating(0)}
                                    className={`text-[8px] font-black uppercase tracking-[0.2em] transition-all ${minRating === 0 ? 'text-black' : 'text-gray-300'}`}
                                >
                                    Reset Quality Filter
                                </button>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 border-b border-gray-100 pb-3">Nominal Value (INR)</h3>
                            <div className="flex items-center gap-3">
                                <div className="relative flex-1">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-gray-300">₹</span>
                                    <input 
                                        type="number" 
                                        placeholder="Min" 
                                        className="w-full bg-gray-50 border-none rounded-xl py-3 pl-7 pr-3 text-[10px] font-black outline-none focus:ring-1 focus:ring-black transition-all"
                                        onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                                    />
                                </div>
                                <div className="h-[1px] w-3 bg-gray-200"></div>
                                <div className="relative flex-1">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-gray-300">₹</span>
                                    <input 
                                        type="number" 
                                        placeholder="Max" 
                                        className="w-full bg-gray-50 border-none rounded-xl py-3 pl-7 pr-3 text-[10px] font-black outline-none focus:ring-1 focus:ring-black transition-all"
                                        onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                                    />
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <div className="flex-1">
                        {/* Mobile Filters Modal */}
                        <AnimatePresence>
                            {isFilterOpen && (
                                <motion.div 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="lg:hidden fixed inset-0 z-[100] bg-white flex flex-col"
                                >
                                    <div className="flex items-center justify-between p-6 border-b border-gray-100">
                                        <h2 className="text-2xl font-black uppercase tracking-tighter">Fine-Tune Search</h2>
                                        <button onClick={() => setIsFilterOpen(false)} className="p-2 border border-gray-100 rounded-full">
                                            <X className="w-6 h-6" />
                                        </button>
                                    </div>
                                    
                                    <div className="flex-1 overflow-y-auto p-8 space-y-12">
                                        <div className="space-y-6">
                                            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Department</h3>
                                            <div className="grid grid-cols-2 gap-3">
                                                {['', ...categories].map(cat => (
                                                    <button 
                                                        key={cat}
                                                        onClick={() => {
                                                            setSelectedCategory(cat);
                                                            setIsFilterOpen(false);
                                                        }}
                                                        className={`py-4 rounded-2xl border-2 text-[10px] font-black uppercase tracking-widest transition-all ${selectedCategory === cat ? 'bg-black text-white border-black' : 'bg-gray-50 border-gray-50 text-gray-400'}`}
                                                    >
                                                        {cat || 'All Records'}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="space-y-6">
                                            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Customer Rating</h3>
                                            <div className="flex flex-col space-y-3">
                                                {[4, 3, 2, 0].map((rating) => (
                                                    <button 
                                                        key={rating}
                                                        onClick={() => {
                                                            setMinRating(rating);
                                                            setIsFilterOpen(false);
                                                        }}
                                                        className={`flex items-center justify-between p-5 rounded-2xl border-2 transition-all ${minRating === rating ? 'border-black bg-black text-white' : 'border-gray-100'}`}
                                                    >
                                                        <div className="flex space-x-1">
                                                            {[...Array(5)].map((_, i) => (
                                                                <Star key={i} className={`w-4 h-4 ${rating === 0 ? 'text-gray-100' : (i < rating ? 'fill-current' : 'opacity-20')}`} />
                                                            ))}
                                                        </div>
                                                        <span className="text-[10px] font-black uppercase tracking-widest">{rating === 0 ? 'Show All' : `& Up`}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="p-8 border-t border-gray-100">
                                        <button 
                                            onClick={() => setIsFilterOpen(false)}
                                            className="w-full bg-black text-white py-5 rounded-full font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center space-x-3 shadow-2xl"
                                        >
                                            <span>Apply Parameters</span>
                                            <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="min-h-[500px]">
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
