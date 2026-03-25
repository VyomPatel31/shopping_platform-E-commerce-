import httpStatus from 'http-status'
import Review from '../models/review.schema.js'
import buildResponse from '../utils/buildResponse.js'
import handleError from '../utils/handleError.js'

// create Review
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

// get Review
export const getReviewsController = async (req, res) => {
  try {
    const reviews = await Review.find({
      product: req.params.productId,
    }).populate("user", "name")

    res.status(200).json(buildResponse(200, reviews))
  } catch (err) {
    handleError(res, err)
  }
}

// delete Review(admin can do)
export const deleteReviewController = async (req, res) => {
  try {
    await Review.findByIdAndDelete(req.params.id)

    res.status(200).json(buildResponse(200, { message: "Deleted" }))
  } catch (err) {
    handleError(res, err)
  }
}