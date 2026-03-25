// controllers/wishlist.controller.js
import httpStatus from 'http-status'
import Wishlist from '../models/wishlist.schema.js'
import buildResponse from '../utils/buildResponse.js'
import handleError from '../utils/handleError.js'

export const addToWishlistController = async (req, res) => {
  try {
    const { productId } = req.body

    let wishlist = await Wishlist.findOne({ user: req.user._id })

    if (!wishlist) {
      wishlist = await Wishlist.create({
        user: req.user._id,
        products: [],
      })
    }

    if (!wishlist.products.includes(productId)) {
      wishlist.products.push(productId)
    }

    await wishlist.save()

    res.status(httpStatus.OK).json(
      buildResponse(httpStatus.OK, { message: 'Added to wishlist' })
    )
  } catch (err) {
    handleError(res, err)
  }
}

export const getWishlistController = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({
      user: req.user._id,
    }).populate("products")

    res.status(200).json(buildResponse(200, wishlist))
  } catch (err) {
    handleError(res, err)
  }
}