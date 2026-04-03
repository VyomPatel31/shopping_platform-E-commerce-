import React from 'react';
import { Apple, Smartphone, Instagram, Twitter, Github, Linkedin, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
    return (
        <footer className="bg-white text-black pt-20 pb-10 px-6 border-t border-gray-100 mt-20">
            <div className="max-w-[1400px] mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand Section */}
                    <div className="space-y-6">
                        <Link to="/" className="flex items-center group">
                            <span className="text-3xl font-black tracking-tighter text-black uppercase">
                                SHOP<span className="text-gray-400">HUB</span>
                            </span>
                        </Link>
                        <p className="text-gray-500 text-sm leading-relaxed max-w-xs font-medium">
                            Premium marketplace for curated essentials. Delivering quality and style since 2026.
                        </p>
                        <div className="flex items-center space-x-5">
                            <a href="#" className="p-2 border border-black hover:bg-black hover:text-white transition-all rounded-full group">
                                <Instagram className="w-4 h-4 font-light transform group-hover:scale-110 duration-200" />
                            </a>
                            <a href="#" className="p-2 border border-black hover:bg-black hover:text-white transition-all rounded-full group">
                                <Twitter className="w-4 h-4 font-light transform group-hover:scale-110 duration-200" />
                            </a>
                            <a href="#" className="p-2 border border-black hover:bg-black hover:text-white transition-all rounded-full group">
                                <Linkedin className="w-4 h-4 font-light transform group-hover:scale-110 duration-200" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-6">
                        <h3 className="font-black text-xs uppercase tracking-[0.2em] text-gray-400">Shop</h3>
                        <ul className="space-y-4 text-sm font-bold uppercase tracking-wider">
                            <li><Link to="/products" className="hover:text-gray-500 transition-colors flex items-center gap-2 group border-b-2 border-transparent hover:border-black w-fit">All Products</Link></li>
                            <li><Link to="/orders" className="hover:text-gray-500 transition-colors flex items-center gap-2 group border-b-2 border-transparent hover:border-black w-fit">Track Orders</Link></li>
                            <li><Link to="/wishlist" className="hover:text-gray-500 transition-colors flex items-center gap-2 group border-b-2 border-transparent hover:border-black w-fit">My Wishlist</Link></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div className="space-y-6">
                        <h3 className="font-black text-xs uppercase tracking-[0.2em] text-gray-400">Company</h3>
                        <ul className="space-y-4 text-sm font-bold uppercase tracking-wider">
                            <li><Link to="/" className="hover:text-gray-500 transition-colors border-b-2 border-transparent hover:border-black w-fit">Privacy Policy</Link></li>
                            <li><Link to="/" className="hover:text-gray-500 transition-colors border-b-2 border-transparent hover:border-black w-fit">Terms of Service</Link></li>
                            <li><Link to="/" className="hover:text-gray-500 transition-colors border-b-2 border-transparent hover:border-black w-fit">Affiliate Program</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-6">
                        <h3 className="font-black text-xs uppercase tracking-[0.2em] text-gray-400">Newsletter</h3>
                        <p className="text-gray-500 text-xs font-medium leading-relaxed">Join our list for exclusive releases and insights.</p>
                        <div className="flex border-b-2 border-black pb-2 items-center space-x-4">
                            <input type="email" placeholder="Email address" className="bg-transparent text-sm w-full outline-none font-bold" />
                            <Link to="/"><MessageSquare className="w-4 h-4" /></Link>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-100 pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-gray-400 text-[11px] font-bold uppercase tracking-[0.3em]">
                        © {new Date().getFullYear()} SHOPHUB GLOBAL. ALL RIGHTS RESERVED.
                    </p>
                    <div className="flex items-center space-x-6 grayscale opacity-30 hover:grayscale-0 hover:opacity-100 transition-all duration-500 cursor-default">
                         <Apple className="w-5 h-5" />
                         <Smartphone className="w-5 h-5" />
                         <span className="font-black text-xl italic tracking-tighter">VISA</span>
                         <span className="font-black text-xl italic tracking-tighter">PAYPAL</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
