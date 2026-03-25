import { Request, Response } from 'express'
import httpStatus from 'http-status'
import Review from '../models/review.schema.js'
import buildResponse from '../utils/buildResponse.js'
import handleError from '../utils/handleError.js'

// create Review
export const createReviewController = async (req: Request, res: Response): Promise<void> => {
  try {
    const review = await Review.create({
      ...req.body,
      user: req.user?._id,
    })

    res.status(httpStatus.CREATED).json(
      buildResponse(httpStatus.CREATED, review)
    )
  } catch (err) {
    handleError(res, err)
  }
}

// get Review
export const getReviewsController = async (req: Request, res: Response): Promise<void> => {
  try {
    const reviews = await Review.find({
      product: req.params.productId,
    }).populate('user', 'name')

    res.status(200).json(buildResponse(200, reviews))
  } catch (err) {
    handleError(res, err)
  }
}

// delete Review(admin can do)
export const deleteReviewController = async (req: Request, res: Response): Promise<void> => {
  try {
    await Review.findByIdAndDelete(req.params.id)

    res.status(200).json(buildResponse(200, { message: 'Deleted' }))
  } catch (err) {
    handleError(res, err)
  }
}

// get user reviews
export const getUserReviewsController = async (req: Request, res: Response): Promise<void> => {
  try {
    const reviews = await Review.find({ user: req.user?._id })
      .populate('product', 'name images')

    res.status(200).json(buildResponse(200, reviews))
  } catch (err) {
    handleError(res, err)
  }
}

// update review
export const updateReviewController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { rating, comment } = req.body

    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { rating, comment },
      { new: true }
    )

    if (!review) {
      res.status(httpStatus.NOT_FOUND).json(
        buildResponse(httpStatus.NOT_FOUND, { message: 'Review not found' })
      )
      return
    }

    res.status(200).json(buildResponse(200, review))
  } catch (err) {
    handleError(res, err)
  }
}
