import { Request, Response } from 'express'
import mongoose from 'mongoose'
import User from "../models/user.schema.js"
import Order from "../models/order.schema.js"
import Product from "../models/product.schema.js"
import Review from "../models/review.schema.js"
import buildResponse from "../utils/buildResponse.js"
import handleError from "../utils/handleError.js"

// dashboard stats
export const getAdminDashboardController = async (req: Request, res: Response) => {
  try {
    const userCount = await User.countDocuments()
    const productCount = await Product.countDocuments()
    const orderCount = await Order.countDocuments()
    const reviewCount = await Review.countDocuments()
    
    // Monthly Revenue
    const startOfMonth = new Date()
    startOfMonth.setDate(1)
    startOfMonth.setHours(0, 0, 0, 0)
    
    const monthlyOrders = await Order.find({
      createdAt: { $gte: startOfMonth },
      paymentStatus: 'paid'
    })
    
    const monthlyRevenue = monthlyOrders.reduce((acc, order) => acc + order.totalAmount, 0)
    const totalPaidOrders = await Order.countDocuments({ paymentStatus: 'paid' })

    // All-time revenue from paid orders
    const allPaidOrders = await Order.find({ paymentStatus: 'paid' })
    const totalRevenue = allPaidOrders.reduce((acc, order) => acc + order.totalAmount, 0)

    res.status(200).json(buildResponse(200, { 
      userCount, 
      productCount, 
      orderCount, 
      reviewCount,
      monthlyRevenue, 
      totalPaidOrders,
      totalRevenue
    }))
  } catch (err: any) {
    handleError(res, err)
  }
}

// list all users with pagination and search
export const getAllUsersController = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search as string || '';

    let query: any = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query)
      .select("-password")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(query);

    res.status(200).json(buildResponse(200, {
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      totalUsers: total
    }))
  } catch (err: any) {
    handleError(res, err)
  }
}

// delete user
export const deleteUserController = async (req: Request, res: Response) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id)

    if (!user) {
      return res.status(404).json(buildResponse(404, { message: "User not found" }))
    }

    res.status(200).json(buildResponse(200, { message: "User deleted" }))
  } catch (err: any) {
    handleError(res, err)
  }
}

// update user role
export const updateUserRoleController = async (req: Request, res: Response) => {
  try {
    const { role } = req.body
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true })

    if (!user) {
      return res.status(404).json(buildResponse(404, { message: "User not found" }))
    }

    res.status(200).json(buildResponse(200, user))
  } catch (err: any) {
    handleError(res, err)
  }
}

// list all orders
export const getAllOrdersController = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    const search = (req.query.search as string) || '';

    let query: any = {};
    if (search) {
      // Search by Order ID or User info via populate
      if (mongoose.Types.ObjectId.isValid(search)) {
          query._id = search;
      } else {
        // Fallback: This is tricky with populate. 
        // Better to search users first and then find their orders.
        const users = await User.find({ 
           $or: [
             { name: { $regex: search, $options: 'i' } },
             { email: { $regex: search, $options: 'i' } }
           ]
        }).select('_id');
        const userIds = users.map(u => u._id);
        query.user = { $in: userIds };
      }
    }

    const orders = await Order.find(query)
      .populate("user", "name email role")
      .populate("items.product", "name price")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Order.countDocuments(query);

    res.status(200).json(buildResponse(200, {
      orders,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      totalOrders: total
    }));
  } catch (err: any) {
    handleError(res, err)
  }
}

// list all reviews for admin
export const getAllReviewsController = async (req: Request, res: Response) => {
    try {
      const reviews = await Review.find({})
        .populate("user", "name")
        .populate("product", "name images")
      
      res.status(200).json(buildResponse(200, reviews))
    } catch (err: any) {
      handleError(res, err)
    }
}

// update review status (approve/reject/publish)
export const updateReviewStatusController = async (req: Request, res: Response) => {
    try {
      const { isPublished } = req.body;
      const review = await Review.findByIdAndUpdate(req.params.id, { isPublished }, { new: true });
      
      if (!review) {
        return res.status(404).json(buildResponse(404, { message: "Review not found" }));
      }
      
      res.status(200).json(buildResponse(200, review));
    } catch (err: any) {
      handleError(res, err);
    }
}

// get specific user details for admin
export const getUserDetailsController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const user = await User.findById(id).select("-password");
    if (!user) {
       return res.status(404).json(buildResponse(404, { message: "User not found" }));
    }

    const orders = await Order.find({ user: id }).populate("items.product", "name images price").sort({ createdAt: -1 });
    const reviews = await Review.find({ user: id }).populate("product", "name images").sort({ createdAt: -1 });

    res.status(200).json(buildResponse(200, {
       user,
       orders,
       reviews,
       stats: {
          totalOrders: orders.length,
          totalSpent: orders.reduce((acc, o) => acc + (o.paymentStatus === 'paid' ? o.totalAmount : 0), 0),
          averageRating: reviews.length > 0 ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length) : 0
       }
    }))
  } catch (err: any) {
    handleError(res, err);
  }
}