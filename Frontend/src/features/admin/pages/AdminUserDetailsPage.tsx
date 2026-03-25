import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosInstance from '../../../api/axiosInstance';
import Navbar from '../../../components/layout/Navbar';
import { Loader2, ArrowLeft, Package, Star, IndianRupee } from 'lucide-react';

const AdminUserDetailsPage: React.FC = () => {
    const { id } = useParams();
    const [data, setData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const response = await axiosInstance.get(`/admin/users/details/${id}`);
                setData(response.data.data);
            } catch (error) {
                console.error('Failed to fetch user details', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchUserDetails();
    }, [id]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col pt-24 items-center">
                <Navbar />
                <Loader2 className="w-10 h-10 animate-spin text-gray-400 mt-32" />
            </div>
        );
    }

    if (!data) return null;

    const { user, orders, reviews, stats } = data;

    return (
        <div className="min-h-screen bg-gray-50 text-black flex flex-col">
            <Navbar />
            
            <main className="flex-1 pt-32 pb-24 px-6 max-w-[1200px] mx-auto w-full">
                <Link to="/admin" className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-black transition-colors mb-10 border border-gray-200 px-4 py-2 rounded-full bg-white">
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Dashboard</span>
                </Link>

                {/* User Header */}
                <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-center md:items-start justify-between gap-8 mb-8">
                    <div className="flex flex-col items-center md:items-start text-center md:text-left">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center text-4xl font-black mb-4">
                            {user.name.charAt(0)}
                        </div>
                        <h1 className="text-3xl font-black uppercase tracking-tighter mb-2">{user.name}</h1>
                        <p className="text-gray-500 font-bold">{user.email}</p>
                        <div className="flex items-center gap-4 mt-6">
                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                                {user.role}
                            </span>
                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                                Joined {new Date(user.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Statistics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                        <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center mb-6">
                            <Package className="w-6 h-6 text-orange-500" />
                        </div>
                        <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Total Orders</h3>
                        <p className="text-3xl font-black">{stats.totalOrders}</p>
                    </div>
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                        <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mb-6">
                            <IndianRupee className="w-6 h-6 text-green-500" />
                        </div>
                        <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Total Lifetime Spent</h3>
                        <p className="text-3xl font-black">₹{stats.totalSpent.toLocaleString()}</p>
                    </div>
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                        <div className="w-12 h-12 bg-yellow-50 rounded-xl flex items-center justify-center mb-6">
                            <Star className="w-6 h-6 text-yellow-500" />
                        </div>
                        <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Average Review Rating</h3>
                        <p className="text-3xl font-black">{stats.averageRating.toFixed(1)} / 5</p>
                    </div>
                </div>

                {/* Orders Section */}
                <h2 className="text-2xl font-black uppercase tracking-tight mb-6 flex items-center gap-4">
                    <Package className="w-6 h-6 text-gray-400" />
                    Order History
                </h2>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-12">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs text-gray-500">Order ID</th>
                                    <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs text-gray-500">Date</th>
                                    <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs text-gray-500">Status</th>
                                    <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs text-gray-500">Total</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {orders.map((o: any) => (
                                    <tr key={o._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-mono text-xs">{o._id}</td>
                                        <td className="px-6 py-4 text-gray-500">{new Date(o.createdAt).toLocaleDateString()}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${o.orderStatus === 'delivered' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                                                {o.orderStatus}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-bold">₹{o.totalAmount.toLocaleString()}</td>
                                    </tr>
                                ))}
                                {orders.length === 0 && (
                                    <tr><td colSpan={4} className="px-6 py-12 text-center text-gray-400">No orders found.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Reviews Section */}
                <h2 className="text-2xl font-black uppercase tracking-tight mb-6 flex items-center gap-4">
                    <Star className="w-6 h-6 text-gray-400" />
                    Reviews & Feedback
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {reviews.map((r: any) => (
                        <div key={r._id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h4 className="font-bold text-lg mb-1">{r.product?.name || 'Unknown Product'}</h4>
                                    <div className="flex items-center text-orange-400 text-sm">
                                        {[...Array(5)].map((_, i) => <span key={i} className={i < r.rating ? 'text-orange-400' : 'text-gray-200'}>★</span>)}
                                    </div>
                                </div>
                                <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-full ${r.isPublished ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                    {r.isPublished ? 'Live' : 'Hidden'}
                                </span>
                            </div>
                            <p className="text-gray-600 text-sm italic">"{r.comment}"</p>
                        </div>
                    ))}
                    {reviews.length === 0 && (
                        <div className="col-span-1 md:col-span-2 bg-white p-12 text-center rounded-2xl border border-gray-100 text-gray-400">
                            No reviews submitted.
                        </div>
                    )}
                </div>

            </main>
        </div>
    );
};

export default AdminUserDetailsPage;
