import { Request, Response } from 'express'
import httpStatus from 'http-status'
import Cart from '../models/cart.schema.js'
import buildResponse from '../utils/buildResponse.js'
import handleError from '../utils/handleError.js'
import { ICart } from '../models/cart.schema.js'

// add item in the cart
export const addToCartController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { productId, quantity = 1 } = req.body

    let cart = await Cart.findOne({
      $or: [{ user: req.user?._id }, { sessionId: req.sessionID }],
    })

    if (!cart) {
      cart = await Cart.create({
        user: req.user?._id,
        sessionId: req.sessionID,
        items: [],
      })
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    )

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity
    } else {
      cart.items.push({ product: productId, quantity })
    }

    await cart.save()

    res.status(httpStatus.OK).json(
      buildResponse(httpStatus.OK, { message: 'Item added to cart' })
    )
  } catch (err) {
    handleError(res, err)
  }
}

// remove the item from the cart
export const removeFromCartController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { productId } = req.body

    const cart = await Cart.findOne({
      $or: [{ user: req.user?._id }, { sessionId: req.sessionID }],
    })

    if (!cart) {
      res.status(httpStatus.NOT_FOUND).json(
        buildResponse(httpStatus.NOT_FOUND, { message: 'Cart not found' })
      )
      return
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    )

    await cart.save()

    res.status(200).json(buildResponse(200, { message: 'Item removed' }))
  } catch (err) {
    handleError(res, err)
  }
}

// update the quantity of the item
export const updateCartController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { productId, quantity } = req.body

    const cart = await Cart.findOne({
      $or: [{ user: req.user?._id }, { sessionId: req.sessionID }],
    })

    if (!cart) {
      res.status(httpStatus.NOT_FOUND).json(
        buildResponse(httpStatus.NOT_FOUND, { message: 'Cart not found' })
      )
      return
    }

    const item = cart.items.find(
      (i) => i.product.toString() === productId
    )

    if (item) item.quantity = quantity

    await cart.save()

    res.status(200).json(buildResponse(200, cart))
  } catch (err) {
    handleError(res, err)
  }
}

// get all the items from the cart
export const getCartController = async (req: Request, res: Response): Promise<void> => {
  try {
    const cart = await Cart.findOne({
      $or: [{ user: req.user?._id }, { sessionId: req.sessionID }],
    }).populate('items.product')

    res.status(200).json(buildResponse(200, cart))
  } catch (err) {
    handleError(res, err)
  }
}

// clear the cart
export const clearCartController = async (req: Request, res: Response): Promise<void> => {
  try {
    const cart = await Cart.findOne({
      $or: [{ user: req.user?._id }, { sessionId: req.sessionID }],
    })

    if (!cart) {
      res.status(httpStatus.NOT_FOUND).json(
        buildResponse(httpStatus.NOT_FOUND, { message: 'Cart not found' })
      )
      return
    }

    cart.items = []
    await cart.save()

    res.status(httpStatus.OK).json(
      buildResponse(httpStatus.OK, { message: 'Cart cleared' })
    )
  } catch (err) {
    handleError(res, err)
  }
}
