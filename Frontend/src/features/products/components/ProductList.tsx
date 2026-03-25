import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { productService } from '../services/product.service';
import ProductCard from './ProductCard';
import { Loader2, AlertCircle, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSearchStore } from '../../../store/searchStore';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ProductListProps {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    rating?: number;
    sort?: string;
}

const ProductList: React.FC<ProductListProps> = ({ category, minPrice, maxPrice, rating, sort }) => {
    const { query } = useSearchStore();
    const [page, setPage] = React.useState(1);

    // Reset pagination on filter change
    React.useEffect(() => {
        setPage(1);
    }, [category, minPrice, maxPrice, rating, sort, query]);

    const { data, isLoading, error } = useQuery({
        queryKey: ['products', category, minPrice, maxPrice, rating, sort, query, page],
        queryFn: () => productService.getAllProducts({
            page,
            limit: 12, // Or any other nice grid number
            category,
            minPrice,
            maxPrice,
            rating,
            sort,
            search: query
        }),
    });

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <Loader2 className="w-12 h-12 animate-spin text-black mb-6 opacity-20" />
                <p className="text-[10px] uppercase font-black text-gray-400 tracking-[0.5em] animate-pulse">Syncing Inventory</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] border border-gray-100 rounded-[3rem] bg-gray-50 p-12">
                <AlertCircle className="w-12 h-12 mb-6 text-black opacity-20 font-light" />
                <h3 className="text-3xl font-black mb-4 uppercase tracking-tighter text-black">Sync Failure</h3>
                <p className="text-gray-400 text-[11px] font-black uppercase tracking-[0.4em] text-center">Unable to establish connection with the product database.</p>
            </div>
        );
    }

    const products = data?.data?.products || [];

    if (products.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] border border-gray-100 rounded-[3rem] bg-gray-50 p-12">
                <ShoppingBag className="w-16 h-16 mb-6 text-black opacity-10 font-light" />
                <h3 className="text-3xl font-black text-black mb-4 uppercase tracking-tighter text-center">Archive Empty</h3>
                <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.4em] text-center">No matching essentials currently archived.</p>
            </div>
        );
    }

    const totalPages = data?.data?.totalPages || 1;
    const currentPage = data?.data?.currentPage || 1;

    return (
        <div className="flex flex-col space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {products.map((product: any, index: number) => (
                    <motion.div
                        key={product._id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                    >
                        <ProductCard product={product} />
                    </motion.div>
                ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center space-x-2 pt-8 mt-8 border-t border-gray-100">
                    <button
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="p-2 rounded border border-gray-200 text-gray-600 hover:bg-gray-50 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>

                    {[...Array(totalPages)].map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setPage(i + 1)}
                            className={`w-10 h-10 rounded text-sm font-bold flex items-center justify-center transition-all ${currentPage === i + 1 ? 'bg-black text-white shadow-xl' : 'border border-gray-200 text-gray-600 hover:bg-gray-100'}`}
                        >
                            {i + 1}
                        </button>
                    ))}

                    <button
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded border border-gray-200 text-gray-600 hover:bg-gray-50 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProductList;
