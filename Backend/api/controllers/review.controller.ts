import { Request, Response } from 'express'
import httpStatus from 'http-status'
import Review from '../models/review.schema.js'
import Product from '../models/product.schema.js'
import Order from '../models/order.schema.js'
import buildResponse from '../utils/buildResponse.js'
import handleError from '../utils/handleError.js'

// create Review
export const createReviewController = async (req: Request, res: Response) => {
  try {
    const { product: productId, order: orderId, rating, comment } = req.body;
    const userId = (req as any).user._id;

    // 1. Check eligibility and existence
    const order = await Order.findOne({
      _id: orderId,
      user: userId,
      'items.product': productId,
      orderStatus: 'delivered'
    });

    if (!order) {
      return res.status(httpStatus.FORBIDDEN).json(
        buildResponse(httpStatus.FORBIDDEN, { message: 'You can only review products from your delivered orders' })
      )
    }

    // 2. Prevent Duplicate Reviews per Order
    const existingReview = await Review.findOne({
      user: userId,
      product: productId,
      order: orderId
    });

    if (existingReview) {
      return res.status(httpStatus.CONFLICT).json(
        buildResponse(httpStatus.CONFLICT, { message: 'You have already reviewed this product for this order' })
      )
    }

    // 3. Create the review
    const review = await Review.create({
      product: productId,
      order: orderId,
      rating,
      comment,
      user: userId,
    })

    // 3. Update Product Stats (only using published ones)
    const publishedReviews = await Review.find({ product: productId, isPublished: true });
    const numReviews = publishedReviews.length;
    const averageRating = numReviews > 0 
        ? publishedReviews.reduce((acc, item) => item.rating + acc, 0) / numReviews 
        : 0;

    await Product.findByIdAndUpdate(productId, {
      rating: averageRating,
      numReviews: numReviews
    });

    res.status(httpStatus.CREATED).json(
      buildResponse(httpStatus.CREATED, review)
    )
  } catch (err: any) {
    handleError(res, err)
  }
}

// get Review
export const getReviewsController = async (req: Request, res: Response) => {
  try {
    const reviews = await Review.find({
      product: req.params.productId,
      isPublished: true,
    }).populate("user", "name")

    res.status(200).json(buildResponse(200, reviews))
  } catch (err: any) {
    handleError(res, err)
  }
}

// delete Review(admin can do)
export const deleteReviewController = async (req: Request, res: Response) => {
  try {
    await Review.findByIdAndDelete(req.params.id)

    res.status(200).json(buildResponse(200, { message: "Deleted" }))
  } catch (err: any) {
    handleError(res, err)
  }
}

// get user reviews
export const getUserReviewsController = async (req: Request, res: Response) => {
  try {
    const reviews = await Review.find({ user: (req as any).user._id })
      .populate("product", "name images")

    res.status(200).json(buildResponse(200, reviews))
  } catch (err: any) {
    handleError(res, err)
  }
}

// update review
export const updateReviewController = async (req: Request, res: Response) => {
  try {
    const { rating, comment } = req.body

    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { rating, comment },
      { new: true }
    )

    if (!review) {
      return res.status(httpStatus.NOT_FOUND).json(
        buildResponse(httpStatus.NOT_FOUND, { message: 'Review not found' })
      )
    }

    res.status(200).json(buildResponse(200, review))
  } catch (err: any) {
    handleError(res, err)
  }
}