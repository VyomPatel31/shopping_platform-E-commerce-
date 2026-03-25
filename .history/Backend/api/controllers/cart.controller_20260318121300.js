// controllers/cart.controller.js
import httpStatus from 'http-status'
import Cart from '../models/cart.schema.js'
import buildResponse from '../utils/buildResponse.js'
import handleError from '../utils/handleError.js'

export const addToCartController = async (req, res) => {
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