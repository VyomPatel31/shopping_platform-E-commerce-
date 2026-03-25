import { Request, Response } from 'express'
import httpStatus from 'http-status'
import Wishlist from '../models/wishlist.schema.js'
import buildResponse from '../utils/buildResponse.js'
import handleError from '../utils/handleError.js'

// add item into the wishlist
export const addToWishlistController = async (req: Request, res: Response) => {
  try {
    const { productId } = req.body

    let wishlist: any = await Wishlist.findOne({ user: (req as any).user._id })

    if (!wishlist) {
      wishlist = await Wishlist.create({
        user: (req as any).user._id,
        products: [],
      })
    }

    if (!wishlist.products.some((id: any) => id.toString() === productId)) {
      wishlist.products.push(productId)
    }

    await wishlist.save()

    res.status(httpStatus.OK).json(
      buildResponse(httpStatus.OK, { message: 'Added to wishlist' })
    )
  } catch (err: any) {
    handleError(res, err)
  }
}

// get all the wishlist items
export const getWishlistController = async (req: Request, res: Response) => {
  try {
    const wishlist = await Wishlist.findOne({
      user: (req as any).user._id,
    }).populate("products")

    res.status(200).json(buildResponse(200, wishlist))
  } catch (err: any) {
    handleError(res, err)
  }
}

// remove the item from the wishlist
export const removeFromWishlistController = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params

    const wishlist: any = await Wishlist.findOne({ user: (req as any).user._id })

    if (wishlist) {
      wishlist.products = wishlist.products.filter(
        (id: any) => id.toString() !== productId
      )
      await wishlist.save()
    }

    res.status(200).json(buildResponse(200, { message: "Removed" }))
  } catch (err: any) {
    handleError(res, err)
  }
}

// clear wishlist
export const clearWishlistController = async (req: Request, res: Response) => {
  try {
    const wishlist: any = await Wishlist.findOne({ user: (req as any).user._id })

    if (!wishlist) {
      return res.status(httpStatus.NOT_FOUND).json(
        buildResponse(httpStatus.NOT_FOUND, { message: 'Wishlist not found' })
      )
    }

    wishlist.products = []
    await wishlist.save()

    res.status(httpStatus.OK).json(
      buildResponse(httpStatus.OK, { message: 'Wishlist cleared' })
    )
  } catch (err: any) {
    handleError(res, err)
  }
}