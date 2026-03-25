import { Request, Response } from 'express'
import Cart from '../models/cart.schema.js'
import buildResponse from '../utils/buildResponse.js'
import handleError from '../utils/handleError.js'

export const mergeCartController = async (req: Request, res: Response): Promise<void> => {
  try {
    const guestCart = await Cart.findOne({ sessionId: req.sessionID })
    const userCart = await Cart.findOne({ user: req.user?._id })

    if (!guestCart) {
      return
    }

    if (!userCart) {
      res.status(200).json(buildResponse(200, { message: 'Cart merged' }))
      return
    }

    guestCart.items.forEach((item) => {
      const existing = userCart.items.find(
        (i) => i.product.toString() === item.product.toString()
      )

      if (existing) {
        existing.quantity += item.quantity
      } else {
        userCart.items.push(item)
      }
    })

    await userCart.save()
    await Cart.deleteOne({ sessionId: req.sessionID })

    res.status(200).json(buildResponse(200, { message: 'Cart merged' }))
  } catch (err) {
    handleError(res, err)
  }
}
