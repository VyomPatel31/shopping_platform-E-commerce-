import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import Navbar from "../../../components/layout/Navbar";
import { productService } from "../../products/services/product.service";
import axiosInstance from "../../../api/axiosInstance";
import toast from "react-hot-toast";
import {
  Loader2,
  Plus,
  Edit,
  Trash2,
  X,
  Save,
  Upload,
  Link2,
  Package,
  IndianRupee,
  ShoppingCart,
  TrendingUp,
  ClipboardList,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  Search,
  User,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

interface ProductFormData {
  _id?: string;
  name: string;
  description: string;
  price: number;
  category: string;
  brand: string;
  stock: number;
  images: string;
}

const CATEGORIES = [
  "Electronics",
  "Mobiles & Accessories",
  "Computers & Laptops",
  "Clothing & Apparel",
  "Shoes & Footwear",
  "Home & Kitchen",
  "Books",
  "Sports & Fitness",
  "Beauty & Personal Care",
  "Toys & Games",
  "Jewellery",
  "Automotive",
  "Grocery & Food",
  "Health & Wellness",
  "Other",
];

type ImageMode = "url" | "upload";
type AdminTab = "products" | "orders" | "reviews" | "users";

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [isFetchingOrders, setIsFetchingOrders] = useState(false);
  const [isFetchingReviews, setIsFetchingReviews] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [imageMode, setImageMode] = useState<ImageMode>("url");
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [activeTab, setActiveTab] = useState<AdminTab>("products");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Pagination & Search States
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [ordersPage, setOrdersPage] = useState(1);
  const [ordersTotalPages, setOrdersTotalPages] = useState(1);
  const [ordersSearch, setOrdersSearch] = useState("");
  
  const [users, setUsers] = useState<any[]>([]);
  const [usersPage, setUsersPage] = useState(1);
  const [usersTotalPages, setUsersTotalPages] = useState(1);
  const [usersSearch, setUsersSearch] = useState("");

  const { register, handleSubmit, reset, setValue, watch } =
    useForm<ProductFormData>();
  const watchedImages = watch("images");

  // Update preview when URL/Form changes
  useEffect(() => {
    // If we're in URL mode, parse the comma-separated string
    if (imageMode === "url") {
      if (!watchedImages) {
        setImagePreview("");
        return;
      }
      const firstUrl = watchedImages.split(",")[0].trim();
      if (firstUrl) setImagePreview(firstUrl);
    }
  }, [watchedImages, imageMode]);

  const fetchStats = async () => {
    try {
      const response = await axiosInstance.get("/admin/dashboard");
      setStats(response.data.data);
    } catch (err) {
      console.error("Failed to fetch stats");
    }
  };

  const productsPerPage = 10;

  const fetchProducts = async (page = 1, search = "") => {
    setIsFetching(true);
    try {
      const response = await productService.getAllProducts({ 
        page, 
        limit: productsPerPage,
        search 
      });
      setProducts(response.data.products || []);
      setTotalPages(response.data.totalPages || 1);
      setCurrentPage(response.data.currentPage || 1);
    } catch (error: any) {
      toast.error("Failed to fetch products");
    } finally {
      setIsFetching(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    fetchProducts(newPage, searchQuery);
  };

  const fetchOrders = async (page = 1, search = "") => {
    setIsFetchingOrders(true);
    try {
      const response = await axiosInstance.get(`/admin/orders`, {
        params: { page, limit: 10, search }
      });
      setOrders(response.data.data.orders || []);
      setOrdersTotalPages(response.data.data.totalPages || 1);
      setOrdersPage(response.data.data.currentPage || 1);
    } catch (error: any) {
      toast.error("Failed to fetch orders");
    } finally {
      setIsFetchingOrders(false);
    }
  };

  const fetchUsers = async (page = 1, search = "") => {
    try {
      const response = await axiosInstance.get(`/admin/users`, {
        params: { page, limit: 10, search }
      });
      setUsers(response.data.data.users || []);
      setUsersTotalPages(response.data.data.totalPages || 1);
      setUsersPage(response.data.data.currentPage || 1);
    } catch (error: any) {
      toast.error("Failed to fetch users");
    }
  };

  const deleteUser = async (userId: string) => {
    if (!window.confirm("Permanently delete this user?")) return;
    try {
      await axiosInstance.delete(`/admin/users/${userId}`);
      toast.success("User removed");
      fetchUsers(usersPage, usersSearch);
    } catch (err) {
      toast.error("Failed to delete user");
    }
  };

  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      await axiosInstance.put(`/admin/users/role/${userId}`, { role: newRole });
      toast.success("Role updated");
      fetchUsers(usersPage, usersSearch);
    } catch (err) {
      toast.error("Update failed");
    }
  };

  const fetchReviews = async () => {
    setIsFetchingReviews(true);
    try {
      const response = await axiosInstance.get("/admin/reviews");
      setReviews(response.data.data || []);
    } catch (error: any) {
      toast.error("Failed to fetch reviews");
    } finally {
      setIsFetchingReviews(false);
    }
  };

  const toggleReviewStatus = async (reviewId: string, currentStatus: boolean) => {
    try {
      await axiosInstance.put(`/admin/reviews/status/${reviewId}`, {
        isPublished: !currentStatus,
      });
      toast.success(`Review ${!currentStatus ? "published" : "hidden"}`);
      fetchReviews();
    } catch (err) {
      toast.error("Failed to update review status");
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchStats();
  }, []);

  useEffect(() => {
    if (activeTab === "orders") fetchOrders(ordersPage, ordersSearch);
    if (activeTab === "reviews") fetchReviews();
    if (activeTab === "users") fetchUsers(usersPage, usersSearch);
  }, [activeTab]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show local preview immediately
    const localPreview = URL.createObjectURL(file);
    setImagePreview(localPreview);
    setIsUploading(true);

    try {
      const url = await productService.uploadProductImage(file);
      console.log("New image uploaded, URL:", url);

      setImagePreview(`${url}?t=${Date.now()}`); // Force new preview
      setUploadedImageUrl(url);
      setValue('images', url);
      toast.success("Image uploaded successfully!");

      // Clear file input so the same file can be selected again
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Image upload failed");
      setImagePreview("");
      setUploadedImageUrl("");
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = async (data: ProductFormData) => {
    setIsLoading(true);
    try {
      let imagesArray: string[] = [];

      if (imageMode === "upload") {
        if (!uploadedImageUrl) {
          toast.error("Please upload an image first");
          setIsLoading(false);
          return;
        }
        imagesArray = [uploadedImageUrl];
      } else {
        imagesArray =
          typeof data.images === "string"
            ? data.images
              .split(",")
              .map((url) => url.trim())
              .filter((url) => url.length > 0)
            : data.images;
      }

      const payload = {
        ...data,
        price: Number(data.price),
        stock: Number(data.stock),
        images: imagesArray,
      };

      if (editingId) {
        await productService.updateProduct(editingId, payload);
        toast.success("Product updated successfully!");
      } else {
        await productService.createProduct(payload);
        toast.success("Product added successfully!");
      }

      reset();
      setEditingId(null);
      setShowAddForm(false);
      setUploadedImageUrl("");
      setImagePreview("");
      setImageMode("url");
      fetchProducts();
      fetchStats();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Action failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (product: any) => {
    setEditingId(product._id);
    setShowAddForm(true);

    // Initially set mode to 'url' to show current database images
    setImageMode("url");
    setUploadedImageUrl("");

    const firstImage = product.images?.[0] || "";
    setImagePreview(firstImage);

    // Populate form fields
    setValue("name", product.name);
    setValue("brand", product.brand);
    setValue("category", product.category);
    setValue("price", product.price);
    setValue("stock", product.stock);
    setValue("description", product.description);
    setValue("images", product.images.join(", "));

    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;
    try {
      await productService.deleteProduct(id);
      toast.success("Product deleted");
      fetchProducts();
      fetchStats();
    } catch (error) {
      toast.error("Failed to delete product");
    }
  };

  const handleOrderStatusChange = async (orderId: string, status: string) => {
    try {
      await axiosInstance.put(`/orders/status/${orderId}`, { status });
      if (status === "delivered") {
        toast.success(
          "✅ Order delivered! Payment marked as Paid — Revenue updated.",
          { duration: 4000 },
        );
      } else {
        toast.success(`Order status changed to "${status}"`);
      }
      fetchOrders();
      fetchStats();
    } catch (err: any) {
      toast.error(
        err.response?.data?.message || "Failed to update order status",
      );
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "processing":
        return "bg-blue-100 text-blue-700";
      case "shipped":
        return "bg-indigo-100 text-indigo-700";
      case "delivered":
        return "bg-green-100 text-green-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getPaymentBadge = (status: string) => {
    return status === "paid"
      ? "bg-green-100 text-green-700"
      : "bg-orange-100 text-orange-700";
  };

  return (
    <div className="min-h-screen bg-[#f3f3f3] text-black pb-20">
      <Navbar />
      <main className="pt-24 px-4 max-w-7xl mx-auto">
        {/* Stats Grid */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-10">
            <div className="bg-white p-5 rounded-sm shadow-sm border-l-4 border-blue-500 flex flex-col gap-1">
              <p className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1">
                <Package className="w-3 h-3" /> Products
              </p>
              <h2 className="text-3xl font-black text-gray-900">
                {stats.productCount}
              </h2>
            </div>
            <div className="bg-white p-5 rounded-sm shadow-sm border-l-4 border-green-500 flex flex-col gap-1">
              <p className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1">
                <IndianRupee className="w-3 h-3" /> Monthly Revenue
              </p>
              <h2 className="text-2xl font-black text-green-600">
                ₹{stats.monthlyRevenue?.toFixed(2)}
              </h2>
            </div>
            <div className="bg-white p-5 rounded-sm shadow-sm border-l-4 border-teal-500 flex flex-col gap-1">
              <p className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> Total Revenue
              </p>
              <h2 className="text-2xl font-black text-teal-600">
                ₹{stats.totalRevenue?.toFixed(2)}
              </h2>
            </div>
            <div className="bg-white p-5 rounded-sm shadow-sm border-l-4 border-orange-500 flex flex-col gap-1">
              <p className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1">
                <ShoppingCart className="w-3 h-3" /> Orders
              </p>
              <h2 className="text-3xl font-black text-gray-900">
                {stats.orderCount}
              </h2>
            </div>
            <div className="bg-white p-5 rounded-sm shadow-sm border-l-4 border-purple-500 flex flex-col gap-1">
              <p className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1">
                <MessageSquare className="w-3 h-3" /> Reviews
              </p>
              <h2 className="text-3xl font-black text-gray-900">
                {stats.reviewCount}
              </h2>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-300">
          <button
            onClick={() => setActiveTab("products")}
            className={`pb-3 px-1 font-bold text-sm flex items-center gap-2 transition-colors border-b-2 ${activeTab === "products"
              ? "border-[#febd69] text-black"
              : "border-transparent text-gray-500 hover:text-black"
              }`}
          >
            <Package className="w-4 h-4" /> Inventory
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`pb-3 px-1 font-bold text-sm flex items-center gap-2 transition-colors border-b-2 ${activeTab === "orders"
              ? "border-[#febd69] text-black"
              : "border-transparent text-gray-500 hover:text-black"
              }`}
          >
            <ClipboardList className="w-4 h-4" /> Orders
            {stats?.orderCount > 0 && (
              <span className="bg-orange-500 text-white text-xs px-1.5 py-0.5 rounded-full font-bold">
                {stats.orderCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("reviews")}
            className={`pb-3 px-1 font-bold text-sm flex items-center gap-2 transition-colors border-b-2 ${activeTab === "reviews"
              ? "border-[#febd69] text-black"
              : "border-transparent text-gray-500 hover:text-black"
              }`}
          >
            <MessageSquare className="w-4 h-4" /> Reviews
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`pb-3 px-1 font-bold text-sm flex items-center gap-2 transition-colors border-b-2 ${activeTab === "users"
              ? "border-[#febd69] text-black"
              : "border-transparent text-gray-500 hover:text-black"
              }`}
          >
            <User className="w-4 h-4" /> Users
          </button>
        </div>

        {/* ═══════════ PRODUCTS TAB ═══════════ */}
        {activeTab === "products" && (
          <>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-bold text-gray-900">
                   Inventory Management
                </h1>
                <div className="relative mt-2">
                   <input 
                      type="text" 
                      placeholder="Search products..." 
                      className="text-xs border border-gray-300 rounded-lg pl-8 pr-4 py-2 outline-none focus:ring-1 focus:ring-[#febd69] w-full md:w-64"
                      value={searchQuery}
                      onChange={(e) => {
                         setSearchQuery(e.target.value);
                         fetchProducts(1, e.target.value);
                      }}
                   />
                   <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
              </div>
              <button
                onClick={() => {
                  if (showAddForm) {
                    reset();
                    setEditingId(null);
                    setUploadedImageUrl("");
                    setImagePreview("");
                    setImageMode("url");
                  } else {
                    // ✅ ADD THIS PART (important)
                    reset();
                    setEditingId(null);
                    setUploadedImageUrl("");
                    setImagePreview("");
                  }
                  setShowAddForm(!showAddForm);
                }}
                className="flex items-center gap-2 bg-[#febd69] hover:bg-[#f3a847] text-black font-bold py-2 px-4 rounded shadow-sm border border-[#f2a14e] transition-colors"
              >
                {showAddForm ? (
                  <X className="w-4 h-4" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
                {showAddForm ? "Cancel" : "Add New Product"}
              </button>
            </div>

            {/* Add/Edit Form */}
            <AnimatePresence>
              {showAddForm && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden mb-8"
                >
                  <div className="bg-white p-8 rounded shadow-sm border border-gray-200">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                      {editingId ? (
                        <Edit className="w-5 h-5" />
                      ) : (
                        <Plus className="w-5 h-5" />
                      )}
                      {editingId ? "Edit Product" : "Create New Product"}
                    </h2>

                    <form
                      onSubmit={handleSubmit(onSubmit)}
                      className="space-y-6"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Name */}
                        <div className="lg:col-span-2">
                          <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
                            Product Name *
                          </label>
                          <input
                            {...register("name", {
                              required: "Name is required",
                            })}
                            className="w-full border border-gray-300 rounded py-2 px-3 focus:ring-1 focus:ring-[#febd69] outline-none"
                            placeholder="e.g. Samsung Galaxy S24"
                          />
                        </div>

                        {/* Brand */}
                        <div>
                          <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
                            Brand
                          </label>
                          <input
                            {...register("brand")}
                            className="w-full border border-gray-300 rounded py-2 px-3 focus:ring-1 focus:ring-[#febd69] outline-none"
                            placeholder="e.g. Samsung"
                          />
                        </div>

                        {/* Category — DROPDOWN */}
                        <div>
                          <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
                            Category
                          </label>
                          <select
                            {...register("category")}
                            className="w-full border border-gray-300 rounded py-2 px-3 focus:ring-1 focus:ring-[#febd69] outline-none bg-white"
                          >
                            <option value="">— Select Category —</option>
                            {CATEGORIES.map((cat) => (
                              <option key={cat} value={cat}>
                                {cat}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Price */}
                        <div>
                          <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
                            Price (₹) *
                          </label>
                          <input
                            {...register("price", {
                              valueAsNumber: true,
                              required: true,
                            })}
                            type="number"
                            step="0.01"
                            min="0"
                            className="w-full border border-gray-300 rounded py-2 px-3 focus:ring-1 focus:ring-[#febd69] outline-none"
                            placeholder="0.00"
                          />
                        </div>

                        {/* Stock */}
                        <div>
                          <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
                            Stock *
                          </label>
                          <input
                            {...register("stock", {
                              valueAsNumber: true,
                              required: true,
                            })}
                            type="number"
                            min="0"
                            className="w-full border border-gray-300 rounded py-2 px-3 focus:ring-1 focus:ring-[#febd69] outline-none"
                            placeholder="0"
                          />
                        </div>

                        {/* Description */}
                        <div className="md:col-span-2 lg:col-span-3">
                          <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
                            Description
                          </label>
                          <textarea
                            {...register("description")}
                            rows={3}
                            className="w-full border border-gray-300 rounded py-2 px-3 focus:ring-1 focus:ring-[#febd69] outline-none"
                            placeholder="Write product description…"
                          />
                        </div>

                        {/* Image Section */}
                        <div className="md:col-span-2 lg:col-span-3">
                          <label className="block text-xs font-bold uppercase text-gray-500 mb-2">
                            Product Image
                          </label>

                          {/* Mode Toggle */}
                          <div className="flex gap-2 mb-3">
                            <button
                              type="button"
                              onClick={() => {
                                setImageMode("url");
                                setImagePreview("");
                              }}
                              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded border transition-colors ${imageMode === "url"
                                ? "bg-[#febd69] border-[#f2a14e] text-black"
                                : "bg-white border-gray-300 text-gray-600 hover:border-gray-400"
                                }`}
                            >
                              <Link2 className="w-3.5 h-3.5" /> Paste URL
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setImageMode("upload");
                                setValue("images", "");
                                setUploadedImageUrl("");
                                setImagePreview("");
                              }}
                              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded border transition-colors ${imageMode === "upload"
                                ? "bg-[#febd69] border-[#f2a14e] text-black"
                                : "bg-white border-gray-300 text-gray-600 hover:border-gray-400"
                                }`}
                            >
                              <Upload className="w-3.5 h-3.5" /> Upload from PC
                            </button>
                          </div>

                          <div className="flex gap-4 items-start">
                            {/* Input area */}
                            {imageMode === "url" ? (
                              <input
                                {...register("images")}
                                className="flex-1 border border-gray-300 rounded py-2 px-3 focus:ring-1 focus:ring-[#febd69] outline-none"
                                placeholder="https://example.com/image.jpg (comma-separated for multiple)"
                              />
                            ) : (
                              <div className="flex-1">
                                <input
                                  ref={fileInputRef}
                                  type="file"
                                  accept="image/*"
                                  onChange={handleFileChange}
                                  className="hidden"
                                />
                                <div
                                  onClick={() => fileInputRef.current?.click()}
                                  className="w-full border-2 border-dashed border-gray-300 rounded py-6 px-3 text-center cursor-pointer hover:border-[#febd69] hover:bg-yellow-50 transition-colors"
                                >
                                  {isUploading ? (
                                    <div className="flex flex-col items-center gap-2 text-gray-500">
                                      <Loader2 className="w-6 h-6 animate-spin" />
                                      <span className="text-sm">
                                        Uploading…
                                      </span>
                                    </div>
                                  ) : uploadedImageUrl ? (
                                    <div className="flex flex-col items-center gap-1 text-green-600">
                                      <span className="text-sm font-bold">
                                        ✓ Image uploaded
                                      </span>
                                      <span className="text-xs text-gray-500 truncate max-w-xs">
                                        {uploadedImageUrl}
                                      </span>
                                      <span className="text-xs text-blue-500 mt-1">
                                        Click to change
                                      </span>
                                    </div>
                                  ) : (
                                    <div className="flex flex-col items-center gap-2 text-gray-400">
                                      <Upload className="w-6 h-6" />
                                      <span className="text-sm">
                                        Click to select image from PC
                                      </span>
                                      <span className="text-xs">
                                        JPG, PNG, WebP up to 5MB
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}

                            {/* Preview */}
                            {imagePreview && (
                              <div className="w-24 h-24 rounded border border-gray-200 overflow-hidden flex-shrink-0 bg-gray-50">
                                <img
                                  src={imagePreview}
                                  alt="Preview"
                                  className="w-full h-full object-contain"
                                  onError={() => setImagePreview("")}
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={isLoading || isUploading}
                        className="w-full md:w-auto px-12 bg-[#febd69] hover:bg-[#f3a847] disabled:opacity-60 text-black font-bold py-3 rounded shadow-sm border border-[#f2a14e] transition-colors flex items-center justify-center gap-2"
                      >
                        {isLoading ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : editingId ? (
                          <Save className="w-5 h-5" />
                        ) : (
                          <Plus className="w-5 h-5" />
                        )}
                        {isLoading
                          ? "Saving…"
                          : editingId
                            ? "Update Product"
                            : "Add Product"}
                      </button>
                    </form>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Products Table */}
            <div className="bg-white rounded shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="px-6 py-4 text-xs font-bold uppercase text-gray-600">
                        Product
                      </th>
                      <th className="px-6 py-4 text-xs font-bold uppercase text-gray-600">
                        Category
                      </th>
                      <th className="px-6 py-4 text-xs font-bold uppercase text-gray-600">
                        Price
                      </th>
                      <th className="px-6 py-4 text-xs font-bold uppercase text-gray-600">
                        Stock
                      </th>
                      <th className="px-6 py-4 text-xs font-bold uppercase text-gray-600 text-right">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {isFetching ? (
                      <tr>
                        <td colSpan={5} className="text-center py-20">
                          <Loader2 className="w-10 h-10 animate-spin mx-auto text-gray-300" />
                        </td>
                      </tr>
                    ) : products.length === 0 ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="text-center py-20 text-gray-500"
                        >
                          No products found in inventory.
                        </td>
                      </tr>
                    ) : (
                      products.map((product) => (
                        <tr
                          key={product._id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-gray-100 rounded flex-shrink-0">
                                {product.images?.[0] && (
                                  <img
                                    src={product.images[0]}
                                    alt=""
                                    className="w-full h-full object-contain p-1"
                                  />
                                )}
                              </div>
                              <div>
                                <div className="font-bold text-gray-900 line-clamp-1">
                                  {product.name}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {product.brand}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {product.category || "—"}
                          </td>
                          <td className="px-6 py-4 font-bold text-gray-900">
                            ₹{product.price.toFixed(2)}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-bold ${product.stock > 10 ? "bg-green-100 text-green-700" : product.stock > 0 ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`}
                            >
                              {product.stock > 0
                                ? `${product.stock} in stock`
                                : "Out of stock"}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => handleEdit(product)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                              >
                                <Edit className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => handleDelete(product._id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination UI */}
              {totalPages > 1 && (
                <div className="bg-white px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                  <div className="text-sm text-gray-500 font-bold">
                    Showing Page <span className="text-gray-900">{currentPage}</span> of <span className="text-gray-900">{totalPages}</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="p-2 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => handlePageChange(i + 1)}
                        className={`w-10 h-10 border rounded font-black text-xs transition-colors ${currentPage === i + 1
                          ? "bg-[#febd69] border-[#f2a14e] text-black"
                          : "border-gray-300 text-gray-500 hover:bg-gray-50 hover:text-black"
                          }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="p-2 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* ═══════════ ORDERS TAB ═══════════ */}
        {activeTab === "orders" && (
          <>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-bold text-gray-900">All Orders</h1>
                <div className="relative mt-2">
                   <input 
                      type="text" 
                      placeholder="Search Order ID or Client..." 
                      className="text-xs border border-gray-300 rounded-lg pl-8 pr-4 py-2 outline-none focus:ring-1 focus:ring-[#febd69] w-full md:w-72"
                      value={ordersSearch}
                      onChange={(e) => {
                         setOrdersSearch(e.target.value);
                         fetchOrders(1, e.target.value);
                      }}
                   />
                   <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
              </div>
              <button
                onClick={() => fetchOrders(ordersPage, ordersSearch)}
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-black font-bold border border-gray-300 px-3 py-1.5 rounded transition-colors"
              >
                ↻ Refresh
              </button>
            </div>

            <div className="bg-white rounded shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="px-5 py-4 text-xs font-bold uppercase text-gray-600">
                        Order ID
                      </th>
                      <th className="px-5 py-4 text-xs font-bold uppercase text-gray-600">
                        Customer
                      </th>
                      <th className="px-5 py-4 text-xs font-bold uppercase text-gray-600">
                        Items
                      </th>
                      <th className="px-5 py-4 text-xs font-bold uppercase text-gray-600">
                        Amount
                      </th>
                      <th className="px-5 py-4 text-xs font-bold uppercase text-gray-600">
                        Payment
                      </th>
                      <th className="px-5 py-4 text-xs font-bold uppercase text-gray-600">
                        Status
                      </th>
                      <th className="px-5 py-4 text-xs font-bold uppercase text-gray-600">
                        Date
                      </th>
                      <th className="px-5 py-4 text-xs font-bold uppercase text-gray-600">
                        Role
                      </th>
                      <th className="px-5 py-4 text-xs font-bold uppercase text-gray-600">
                        Update
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {isFetchingOrders ? (
                      <tr>
                        <td colSpan={8} className="text-center py-20">
                          <Loader2 className="w-10 h-10 animate-spin mx-auto text-gray-300" />
                        </td>
                      </tr>
                    ) : orders.length === 0 ? (
                      <tr>
                        <td
                          colSpan={8}
                          className="text-center py-20 text-gray-500"
                        >
                          No orders placed yet.
                        </td>
                      </tr>
                    ) : (
                      orders.map((order) => (
                        <tr
                          key={order._id}
                          className="hover:bg-gray-50 transition-colors text-sm"
                        >
                          <td className="px-5 py-4 font-mono text-xs text-gray-500">
                            #{order._id.slice(-8).toUpperCase()}
                          </td>
                          <td className="px-5 py-4">
                            <div className="font-bold text-gray-900">
                              {order.user?.name || "N/A"}
                            </div>
                            <div className="text-xs text-gray-500">
                              {order.user?.email}
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex flex-col gap-0.5">
                              {order.items
                                ?.slice(0, 2)
                                .map((item: any, i: number) => (
                                  <span
                                    key={i}
                                    className="text-xs text-gray-600 line-clamp-1"
                                  >
                                    {item.product?.name || "Product"} ×{" "}
                                    {item.quantity}
                                  </span>
                                ))}
                              {order.items?.length > 2 && (
                                <span className="text-xs text-gray-400">
                                  +{order.items.length - 2} more
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-5 py-4 font-bold text-gray-900">
                            <div className="flex items-center gap-1">
                              ₹{order.totalAmount?.toFixed(2)}
                              {order.paymentStatus === "paid" && (
                                <span
                                  title="Revenue counted"
                                  className="text-green-500 text-xs"
                                >
                                  ✓
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <span
                              className={`px-2 py-0.5 rounded-full text-xs font-bold ${getPaymentBadge(order.paymentStatus)}`}
                            >
                              {order.paymentStatus === "paid"
                                ? "✓ Paid"
                                : order.paymentStatus}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <span
                              className={`px-2 py-0.5 rounded-full text-xs font-bold ${getStatusColor(order.orderStatus)}`}
                            >
                              {order.orderStatus}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-xs text-gray-500">
                            {new Date(order.createdAt).toLocaleDateString(
                              "en-IN",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              },
                            )}
                          </td>
                          <td className="px-5 py-4">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest ${order.user?.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                              {order.user?.role || 'user'}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <select
                              value={order.orderStatus}
                              onChange={(e) =>
                                handleOrderStatusChange(
                                  order._id,
                                  e.target.value,
                                )
                              }
                              title="Change order status. Marking as 'Delivered' auto-marks payment as Paid and updates revenue."
                              className="text-xs border border-gray-300 rounded px-2 py-1 outline-none focus:ring-1 focus:ring-[#febd69] bg-white"
                            >
                              <option value="pending">Pending</option>
                              <option value="processing">Processing</option>
                              <option value="shipped">Shipped</option>
                              <option value="delivered">
                                ✓ Delivered (marks paid)
                              </option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Orders Pagination */}
              {ordersTotalPages > 1 && (
                <div className="bg-white px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                  <div className="text-sm text-gray-500 font-bold">
                    Showing Page <span className="text-gray-900">{ordersPage}</span> of <span className="text-gray-900">{ordersTotalPages}</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => fetchOrders(ordersPage - 1, ordersSearch)}
                      disabled={ordersPage === 1}
                      className="p-2 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-40"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    {[...Array(ordersTotalPages)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => fetchOrders(i + 1, ordersSearch)}
                        className={`w-10 h-10 border rounded font-black text-xs ${ordersPage === i + 1 ? "bg-black text-white" : "text-gray-500"}`}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <button
                      onClick={() => fetchOrders(ordersPage + 1, ordersSearch)}
                      disabled={ordersPage === ordersTotalPages}
                      className="p-2 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-40"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* ═══════════ USERS TAB ═══════════ */}
        {activeTab === "users" && (
          <>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
                <div className="relative mt-2">
                   <input 
                      type="text" 
                      placeholder="Search name or email..." 
                      className="text-xs border border-gray-300 rounded-lg pl-8 pr-4 py-2 outline-none focus:ring-1 focus:ring-[#febd69] w-full md:w-72"
                      value={usersSearch}
                      onChange={(e) => {
                         setUsersSearch(e.target.value);
                         fetchUsers(1, e.target.value);
                      }}
                   />
                   <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="px-5 py-4 text-xs font-bold uppercase text-gray-600">User</th>
                      <th className="px-5 py-4 text-xs font-bold uppercase text-gray-600">Email</th>
                      <th className="px-5 py-4 text-xs font-bold uppercase text-gray-600">Role</th>
                      <th className="px-5 py-4 text-xs font-bold uppercase text-gray-600">Joined</th>
                      <th className="px-5 py-4 text-xs font-bold uppercase text-gray-600 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {users.map((u) => (
                      <tr key={u._id} className="text-sm hover:bg-gray-50">
                         <td className="px-5 py-4 font-bold">{u.name}</td>
                         <td className="px-5 py-4 text-gray-500">{u.email}</td>
                         <td className="px-5 py-4">
                            <select 
                               value={u.role} 
                               onChange={(e) => updateUserRole(u._id, e.target.value)}
                               className="text-xs border border-gray-200 rounded px-2 py-1 outline-none"
                            >
                               <option value="user">User</option>
                               <option value="admin">Admin</option>
                            </select>
                         </td>
                         <td className="px-5 py-4 text-xs text-gray-400">{new Date(u.createdAt).toLocaleDateString()}</td>
                         <td className="px-5 py-4 text-right">
                             <button 
                                onClick={() => navigate(`/admin/users/${u._id}`)}
                                className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-full mr-2"
                                title="View User Details"
                             >
                                <Eye className="w-4 h-4" />
                             </button>
                             <button 
                               onClick={() => deleteUser(u._id)}
                               className="p-2 text-red-500 hover:bg-red-50 rounded-full"
                               title="Delete User"
                             >
                                <Trash2 className="w-4 h-4" />
                             </button>
                         </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Users Pagination */}
              {usersTotalPages > 1 && (
                <div className="bg-white px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                  <div className="text-sm text-gray-500 font-bold">
                    Showing Page <span className="text-gray-900">{usersPage}</span> of <span className="text-gray-900">{usersTotalPages}</span>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => fetchUsers(usersPage - 1, usersSearch)} disabled={usersPage === 1} className="p-2 border rounded"><ChevronLeft className="w-4 h-4" /></button>
                    <button onClick={() => fetchUsers(usersPage + 1, usersSearch)} disabled={usersPage === usersTotalPages} className="p-2 border rounded"><ChevronRight className="w-4 h-4" /></button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* ═══════════ REVIEWS TAB ═══════════ */}
        {activeTab === "reviews" && (
          <>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900">
                User Reviews & Feedback
              </h1>
              <button
                onClick={fetchReviews}
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-black font-bold border border-gray-300 px-3 py-1.5 rounded transition-colors"
              >
                ↻ Refresh
              </button>
            </div>

            <div className="bg-white rounded shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="px-5 py-4 text-xs font-bold uppercase text-gray-600">
                        Product
                      </th>
                      <th className="px-5 py-4 text-xs font-bold uppercase text-gray-600">
                        Client
                      </th>
                      <th className="px-5 py-4 text-xs font-bold uppercase text-gray-600">
                        Rating
                      </th>
                      <th className="px-5 py-4 text-xs font-bold uppercase text-gray-600">
                        Comment
                      </th>
                      <th className="px-5 py-4 text-xs font-bold uppercase text-gray-600">
                        Status
                      </th>
                      <th className="px-5 py-4 text-xs font-bold uppercase text-gray-600 text-right">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {isFetchingReviews ? (
                      <tr>
                        <td colSpan={6} className="text-center py-20">
                          <Loader2 className="w-10 h-10 animate-spin mx-auto text-gray-300" />
                        </td>
                      </tr>
                    ) : reviews.length === 0 ? (
                      <tr>
                        <td
                          colSpan={6}
                          className="text-center py-20 text-gray-500"
                        >
                          No reviews recorded yet.
                        </td>
                      </tr>
                    ) : (
                      reviews.map((rev) => (
                        <tr
                          key={rev._id}
                          className="hover:bg-gray-50 transition-colors text-sm"
                        >
                          <td className="px-5 py-4">
                            <div className="font-bold text-gray-900 line-clamp-1 max-w-[200px]">
                              {rev.product?.name || "N/A"}
                            </div>
                          </td>
                          <td className="px-5 py-4 text-gray-600">
                            {rev.user?.name || "N/A"}
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <span
                                  key={i}
                                  className={`text-xs ${i < rev.rating ? "text-orange-400" : "text-gray-200"}`}
                                >
                                  ★
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="px-5 py-4 text-gray-500 italic max-w-xs truncate">
                            "{rev.comment || "No comment"}"
                          </td>
                          <td className="px-5 py-4">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest ${rev.isPublished ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}`}
                            >
                              {rev.isPublished ? "Published" : "Pending"}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-right">
                            <button
                              onClick={() => toggleReviewStatus(rev._id, rev.isPublished)}
                              className={`p-2 rounded-full transition-colors ${rev.isPublished ? "text-orange-600 hover:bg-orange-50" : "text-green-600 hover:bg-green-50"}`}
                              title={rev.isPublished ? "Hide Review" : "Publish Review"}
                            >
                              {rev.isPublished ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
