import { Request, Response } from 'express'
import httpStatus from 'http-status'
import Cart from '../models/cart.schema.js'
import buildResponse from '../utils/buildResponse.js'
import handleError from '../utils/handleError.js'

// add item in the cart
export const addToCartController = async (req: Request, res: Response) => {
  try {
    const { productId, quantity = 1 } = req.body

    let cart: any = await Cart.findOne({
      $or: [{ user: (req as any).user?._id }, { sessionId: (req as any).sessionID }],
    })

    if (!cart) {
      cart = await Cart.create({
        user: (req as any).user?._id,
        sessionId: (req as any).sessionID,
        items: [],
      })
    }

    const itemIndex = cart.items.findIndex(
      (item: any) => item.product.toString() === productId
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
  } catch (err: any) {
    handleError(res, err)
  }
}
// /remove the item from the cart
export const removeFromCartController = async (req: Request, res: Response) => {
  try {
    const { productId } = req.body

    const cart: any = await Cart.findOne({
      $or: [{ user: (req as any).user?._id }, { sessionId: (req as any).sessionID }],
    })

    if (cart) {
      cart.items = cart.items.filter(
        (item: any) => item.product.toString() !== productId
      )
      await cart.save()
    }

    res.status(200).json(buildResponse(200, { message: "Item removed" }))
  } catch (err: any) {
    handleError(res, err)
  }
}
// update the quantity of the item
export const updateCartController = async (req: Request, res: Response) => {
  try {
    const { productId, quantity } = req.body

    const cart: any = await Cart.findOne({
      $or: [{ user: (req as any).user?._id }, { sessionId: (req as any).sessionID }],
    })

    if (cart) {
      const item = cart.items.find(
        (i: any) => i.product.toString() === productId
      )
      if (item) item.quantity = quantity
      await cart.save()
    }

    res.status(200).json(buildResponse(200, cart))
  } catch (err: any) {
    handleError(res, err)
  }
}

// get all the items from the cart
export const getCartController = async (req: Request, res: Response) => {
  try {
    const cart = await Cart.findOne({
      $or: [{ user: (req as any).user?._id }, { sessionId: (req as any).sessionID }],
    }).populate("items.product")

    res.status(200).json(buildResponse(200, cart))
  } catch (err: any) {
    handleError(res, err)
  }
}

// clear the cart
export const clearCartController = async (req: Request, res: Response) => {
  try {
    const cart: any = await Cart.findOne({
      $or: [{ user: (req as any).user?._id }, { sessionId: (req as any).sessionID }],
    })

    if (!cart) {
      return res.status(httpStatus.NOT_FOUND).json(
        buildResponse(httpStatus.NOT_FOUND, { message: 'Cart not found' })
      )
    }

    cart.items = []
    await cart.save()

    res.status(httpStatus.OK).json(
      buildResponse(httpStatus.OK, { message: 'Cart cleared' })
    )
  } catch (err: any) {
    handleError(res, err)
  }
}