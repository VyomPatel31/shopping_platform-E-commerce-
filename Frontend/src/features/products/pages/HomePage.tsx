import React from 'react';
import { Link } from 'react-router-dom';
import ProductList from '../components/ProductList';
import Navbar from '../../../components/layout/Navbar';
import Footer from '../../../components/layout/Footer';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const HomePage: React.FC = () => {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            <main className="pt-24 pb-24 px-6 md:px-12 max-w-[1400px] mx-auto">
                {/* HERO SECTION - Monochrome Modern */}
                <header className="mb-24">
                    <div className="relative w-full h-[70vh] rounded-3xl overflow-hidden bg-gray-50 flex items-center justify-center border border-gray-100 group shadow-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 1.05 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1.5 }}
                            className="absolute inset-0"
                        >
                            <img
                                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=2600"
                                className="w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000"
                                alt="Modern Retail"
                            />
                        </motion.div>

                        <div className="relative z-10 text-center max-w-2xl bg-white/80 backdrop-blur-sm p-12 rounded-3xl border border-gray-100/50 shadow-xl mx-4">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3, duration: 0.8 }}
                            >
                                <span className="text-[10px] font-black uppercase tracking-[0.6em] text-gray-500 mb-4 block">New Season ARRIVALS</span>
                                <h1 className="text-5xl md:text-7xl font-black mb-8 leading-[0.9] text-black tracking-tighter uppercase">
                                    Style in <span className="border-b-4 border-black">Focus.</span>
                                </h1>
                                <p className="text-gray-500 text-sm md:text-md font-bold mb-10 tracking-widest leading-relaxed uppercase">
                                    Premium essentials for the modern lifestyle. Minimalist and refined.
                                </p>

                                <div className="flex items-center justify-center space-x-6">
                                    <Link to="/products" className="bg-black text-white px-10 py-4 rounded-full font-black text-xs uppercase tracking-[0.2em] flex items-center space-x-3 hover:bg-gray-800 transition-all transform hover:scale-105 active:scale-95 shadow-lg">
                                        <span>Shop Entire Boutique</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </Link>
                                    <button className="hidden sm:flex items-center space-x-2 text-black/40 hover:text-black transition-colors">
                                        <span className="text-[10px] uppercase font-black tracking-widest border-b-2 border-transparent hover:border-black transition-all">Seasonal Concept</span>
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </header>

                {/* FEATURED CATEGORIES - Modern Grid */}
                <section className="mb-32">
                    <div className="flex items-end justify-between mb-16 px-2">
                        <div className="space-y-2">
                            <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.5em]">Curated Essentials</h2>
                            <p className="text-4xl font-black text-black uppercase tracking-tighter">Shop by Category</p>
                        </div>
                        <Link to="/products" className="text-[10px] font-black text-black border-b-2 border-black uppercase tracking-[0.3em] hover:text-gray-500 hover:border-gray-500 transition-all">Browse all</Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { name: 'Timepieces', desc: 'Precision & Style', img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800' },
                            { name: 'Aesthetics', desc: 'Daily Essentials', img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800' },
                            { name: 'Apparel', desc: 'Modern Couture', img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800' },
                            { name: 'Lifestyle', desc: 'Home Atmosphere', img: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=800' }
                        ].map((cat) => (
                            <motion.div
                                whileHover={{ y: -8 }}
                                key={cat.name}
                                className="group relative h-[450px] rounded-3xl overflow-hidden border border-gray-100 bg-gray-50"
                            >
                                <img src={cat.img} className="absolute inset-0 w-full h-full object-cover  transition-all duration-1000 group-hover:scale-105" alt="" />
                                <div className="absolute inset-0 bg-gradient-to-t from-white via-white/5 to-transparent z-10" />

                                <div className="absolute bottom-6 left-6 z-20 space-y-2">
                                    <h3 className="text-2xl font-black text-black tracking-tight uppercase">{cat.name}</h3>
                                    <p className="text-[10px] font-black text-black/40 uppercase tracking-widest">{cat.desc}</p>
                                    <Link to="/products" className="mt-4 flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-black hover:tracking-[0.4em] transition-all">
                                        <span>Enter</span>
                                        <ArrowRight className="w-3 h-3" />
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* INVENTORY PREVIEW */}
                <section>
                    <div className="flex items-center justify-between mb-16">
                        <div className="space-y-1">
                            <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em]">Our Best Sellers</h2>
                            <p className="text-4xl font-black text-black border-l-8 border-black pl-6 uppercase tracking-tighter">Newest Releases</p>
                        </div>
                    </div>

                    <ProductList />
                </section>
            </main>
            <Footer />
        </div>
    );
};

export default HomePage;
