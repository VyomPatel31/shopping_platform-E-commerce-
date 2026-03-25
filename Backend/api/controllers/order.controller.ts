import { Request, Response } from 'express'
import httpStatus from 'http-status'
import Order from '../models/order.schema.js'
import Cart from '../models/cart.schema.js'
import Address from '../models/address.schema.js'
import buildResponse from '../utils/buildResponse.js'
import handleError from "../utils/handleError.js"

// create order
export const createOrderController = async (req: Request, res: Response) => {
  try {
    const { razorpayPaymentId, razorpayOrderId, razorpaySignature, addressId, paymentMethod } = req.body;
    const cart: any = await Cart.findOne({ user: (req as any).user._id }).populate('items.product')

    if (!cart || cart.items.length === 0) {
      return res.status(httpStatus.BAD_REQUEST).json(
        buildResponse(httpStatus.BAD_REQUEST, { message: 'Cart is empty' })
      )
    }

    // 1. Validate Stock First
    const Product = (await import('../models/product.schema.js')).default;
    for (const item of cart.items) {
      if (!item.product) {
        return res.status(httpStatus.BAD_REQUEST).json(buildResponse(httpStatus.BAD_REQUEST, { message: 'Invalid product in cart' }));
      }
      if (item.product.stock < item.quantity) {
        return res.status(httpStatus.BAD_REQUEST).json(
          buildResponse(httpStatus.BAD_REQUEST, { message: `Insufficient stock for ${item.product.name}. Only ${item.product.stock} left.` })
        );
      }
    }

    const address = await Address.findById(addressId);
    if (!address) {
      return res.status(httpStatus.NOT_FOUND).json(
        buildResponse(httpStatus.NOT_FOUND, { message: 'Address not found' })
      )
    }

    const totalAmount = cart.items.reduce(
      (acc: number, item: any) => acc + item.product.price * item.quantity,
      0
    )

    // 2. Decrement Stock (Atomic operations)
    const stockUpdatePromises = cart.items.map((item: any) => 
      Product.findByIdAndUpdate(
        item.product._id, 
        { $inc: { stock: -item.quantity } },
        { new: true }
      )
    );
    await Promise.all(stockUpdatePromises);

    const order = await Order.create({
      user: (req as any).user._id,
      items: cart.items.map((item: any) => ({
        product: item.product._id,
        quantity: item.quantity,
        price: item.product.price
      })),
      totalAmount,
      address: {
        fullName: address.fullName,
        phone: address.phone,
        city: address.city,
        state: address.state,
        pincode: address.pincode,
        addressLine1: address.addressLine1,
        addressLine2: address.addressLine2,
      },
      paymentStatus: razorpayPaymentId ? 'paid' : 'pending',
      paymentMethod,
      razorpayPaymentId,
      razorpayOrderId,
    })

    // Clear cart after successful order creation
    cart.items = [];
    await cart.save();

    res.status(httpStatus.CREATED).json(
      buildResponse(httpStatus.CREATED, order)
    )
  } catch (err: any) {
    handleError(res, err)
  }
}

// get user order
export const getOrdersController = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find({ user: (req as any).user._id })
      .populate("items.product")
      .sort({ createdAt: -1 })

    res.status(200).json(buildResponse(200, orders))
  } catch (err: any) {
    handleError(res, err)
  }
}

// get order by id 
export const getOrderByIdController = async (req: Request, res: Response) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("items.product")

    res.status(200).json(buildResponse(200, order))
  } catch (err: any) {
    handleError(res, err)
  }
}

// update order status (admin can change)
export const updateOrderStatusController = async (req: Request, res: Response) => {
  try {
    const { status } = req.body

    // Build the update payload
    const updatePayload: any = { orderStatus: status }

    // When order is delivered → automatically mark payment as paid
    if (status === 'delivered') {
      updatePayload.paymentStatus = 'paid'
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      updatePayload,
      { new: true }
    )

    if (!order) {
      return res.status(httpStatus.NOT_FOUND).json(
        buildResponse(httpStatus.NOT_FOUND, { message: 'Order not found' })
      )
    }

    res.status(200).json(buildResponse(200, order))
  } catch (err: any) {
    handleError(res, err)
  }
}

// cancel order
export const cancelOrderController = async (req: Request, res: Response) => {
  try {
    const order: any = await Order.findById(req.params.id)

    if (!order) {
      return res.status(httpStatus.NOT_FOUND).json(
        buildResponse(httpStatus.NOT_FOUND, { message: 'Order not found' })
      )
    }

    if (order.orderStatus !== 'pending') {
      return res.status(httpStatus.BAD_REQUEST).json(
        buildResponse(httpStatus.BAD_REQUEST, { message: 'Can only cancel pending orders' })
      )
    }

    order.orderStatus = 'cancelled'
    await order.save()

    res.status(httpStatus.OK).json(
      buildResponse(httpStatus.OK, { message: 'Order cancelled successfully', data: order })
    )
  } catch (err: any) {
    handleError(res, err)
  }
}

// check if user can review a product
export const checkReviewEligibility = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const userId = (req as any).user._id;

    // 1. Check if user has a delivered order for this product
    const order = await Order.findOne({
      user: userId,
      'items.product': productId,
      orderStatus: 'delivered'
    });

    if (!order) {
      return res.status(200).json(
        buildResponse(200, { canReview: false, message: 'Only delivered items can be reviewed.' })
      )
    }

    // 2. Check if user has already reviewed this product
    // We import Review dynamically or at top.
    const Review = (await import('../models/review.schema.js')).default;
    const existingReview = await Review.findOne({
       user: userId,
       product: productId
    });

    res.status(200).json(
      buildResponse(200, { canReview: !existingReview, message: existingReview ? 'Review already submitted.' : '' })
    )
  } catch (err: any) {
    handleError(res, err)
  }
}
