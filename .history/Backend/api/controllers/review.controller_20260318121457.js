// controllers/review.controller.js
import httpStatus from 'http-status'
import Review from '../models/review.schema.js'
import buildResponse from '../utils/buildResponse.js'
import handleError from '../utils/handleError.js'

export const createReviewController = async (req, res) => {
  try {
    const review = await Review.create({
      ...req.body,
      user: req.user._id,
    })

    res.status(httpStatus.CREATED).json(
      buildResponse(httpStatus.CREATED, review)
    )
  } catch (err) {
    handleError(res, err)
  }
}