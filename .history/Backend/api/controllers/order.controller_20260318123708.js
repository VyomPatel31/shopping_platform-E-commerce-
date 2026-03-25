// controllers/order.controller.js
import httpStatus from 'http-status'
import Order from '../models/order.schema.js'
import Cart from '../models/cart.schema.js'
import buildResponse from '../utils/buildResponse.js'
import handleError from '../utils/handleError.js'

export const createOrderController = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product')

    if (!cart || cart.items.length === 0) {
      return res.status(httpStatus.BAD_REQUEST).json(
        buildResponse(httpStatus.BAD_REQUEST, { message: 'Cart is empty' })
      )
    }

    const totalAmount = cart.items.reduce(
      (acc, item) => acc + item.product.price * item.quantity,
      0
    )

    const order = await Order.create({
      user: req.user._id,
      items: cart.items,
      totalAmount,
      paymentStatus: 'pending',
    })

    res.status(httpStatus.CREATED).json(
      buildResponse(httpStatus.CREATED, order)
    )
  } catch (err) {
    handleError(res, err)
  }
}

export const getOrdersController = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("items.product")

    res.status(200).json(buildResponse(200, orders))
  } catch (err) {
    handleError(res, err)
  }
}

export const getOrderByIdController = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("items.product")

    res.status(200).json(buildResponse(200, order))
  } catch (err) {
    handleError(res, err)
  }
}

export const updateOrderStatusController = async (req, res) => {
  try {
    const { status } = req.body

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { orderStatus: status },
      { new: true }
    )

    res.status(200).json(buildResponse(200, order))
  } catch (err) {
    handleError(res, err)
  }
}