import { Request, Response } from 'express'
import Cart from '../models/cart.schema.js'
import buildResponse from '../utils/buildResponse.js'
import handleError from '../utils/handleError.js'

export const mergeCartController = async (req: Request, res: Response) => {
  try {
    const guestCart: any = await Cart.findOne({ sessionId: (req as any).sessionID })
    const userCart: any = await Cart.findOne({ user: (req as any).user._id })

    if (!guestCart) {
      return res.status(200).json(buildResponse(200, { message: "No guest cart to merge" }))
    }

    if (!userCart) {
      // If user has no cart, just assign the guest items to user
      await Cart.create({
        user: (req as any).user._id,
        items: guestCart.items
      })
    } else {
      guestCart.items.forEach((item: any) => {
        const existing = userCart.items.find(
          (i: any) => i.product.toString() === item.product.toString()
        )

        if (existing) {
          existing.quantity += item.quantity
        } else {
          userCart.items.push(item)
        }
      })
      await userCart.save()
    }

    await Cart.deleteOne({ sessionId: (req as any).sessionID })

    res.status(200).json(buildResponse(200, { message: "Cart merged" }))
  } catch (err: any) {
    handleError(res, err)
  }
}