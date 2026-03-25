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
  Users,
  TrendingUp,
  ClipboardList,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
type AdminTab = "products" | "orders";

const AdminDashboard: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [isFetchingOrders, setIsFetchingOrders] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [imageMode, setImageMode] = useState<ImageMode>("url");
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [activeTab, setActiveTab] = useState<AdminTab>("products");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, reset, setValue, watch } =
    useForm<ProductFormData>();
  const watchedImages = watch("images");

  // Update preview when URL changes
  useEffect(() => {
    if (imageMode === "url" && watchedImages) {
      const firstUrl = watchedImages.split(",")[0].trim();
      setImagePreview(firstUrl);
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

  const fetchProducts = async () => {
    setIsFetching(true);
    try {
      const response = await productService.getAllProducts({ limit: 100 });
      setProducts(response.data.products || []);
    } catch (error: any) {
      toast.error("Failed to fetch products");
    } finally {
      setIsFetching(false);
    }
  };

  const fetchOrders = async () => {
    setIsFetchingOrders(true);
    try {
      const response = await axiosInstance.get("/admin/orders");
      setOrders(response.data.data || []);
    } catch (error: any) {
      toast.error("Failed to fetch orders");
    } finally {
      setIsFetchingOrders(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchStats();
  }, []);

  useEffect(() => {
    if (activeTab === "orders") fetchOrders();
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
      
      setImagePreview(url);

      setValue('images', url);
      toast.success("Image uploaded successfully!");
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

     setUploadedImageUrl('');
    setValue("name", product.name);
    setValue("brand", product.brand);
    setValue("category", product.category);
    setValue("price", product.price);
    setValue("stock", product.stock);
    setValue("description", product.description);
    setValue("images", product.images.join(", "));
    setImageMode("url");
    setImagePreview(product.images[0] || "");
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
                <Users className="w-3 h-3" /> Users
              </p>
              <h2 className="text-3xl font-black text-gray-900">
                {stats.userCount}
              </h2>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-300">
          <button
            onClick={() => setActiveTab("products")}
            className={`pb-3 px-1 font-bold text-sm flex items-center gap-2 transition-colors border-b-2 ${
              activeTab === "products"
                ? "border-[#febd69] text-black"
                : "border-transparent text-gray-500 hover:text-black"
            }`}
          >
            <Package className="w-4 h-4" /> Inventory
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`pb-3 px-1 font-bold text-sm flex items-center gap-2 transition-colors border-b-2 ${
              activeTab === "orders"
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
        </div>

        {/* ═══════════ PRODUCTS TAB ═══════════ */}
        {activeTab === "products" && (
          <>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <h1 className="text-2xl font-bold text-gray-900">
                Inventory Management
              </h1>
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
                              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded border transition-colors ${
                                imageMode === "url"
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
                              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded border transition-colors ${
                                imageMode === "upload"
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
            </div>
          </>
        )}

        {/* ═══════════ ORDERS TAB ═══════════ */}
        {activeTab === "orders" && (
          <>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900">All Orders</h1>
              <button
                onClick={fetchOrders}
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
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
