import { Request, Response } from 'express'
import httpStatus from 'http-status'
import Order from '../models/order.schema.js'
import Cart from '../models/cart.schema.js'
import buildResponse from '../utils/buildResponse.js'
import handleError from '../utils/handleError.js'

// create order
export const createOrderController = async (req: Request, res: Response): Promise<void> => {
  try {
    const cart = await Cart.findOne({ user: req.user?._id }).populate('items.product')

    if (!cart || cart.items.length === 0) {
      res.status(httpStatus.BAD_REQUEST).json(
        buildResponse(httpStatus.BAD_REQUEST, { message: 'Cart is empty' })
      )
      return
    }

    const totalAmount = (cart.items as any).reduce(
      (acc: number, item: any) => acc + item.product.price * item.quantity,
      0
    )

    const order = await Order.create({
      user: req.user?._id,
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

// get user order
export const getOrdersController = async (req: Request, res: Response): Promise<void> => {
  try {
    const orders = await Order.find({ user: req.user?._id })
      .populate('items.product')

    res.status(200).json(buildResponse(200, orders))
  } catch (err) {
    handleError(res, err)
  }
}

// get order by id
export const getOrderByIdController = async (req: Request, res: Response): Promise<void> => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.product')

    res.status(200).json(buildResponse(200, order))
  } catch (err) {
    handleError(res, err)
  }
}

// update order status(admin can change)
export const updateOrderStatusController = async (req: Request, res: Response): Promise<void> => {
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

// cancel order
export const cancelOrderController = async (req: Request, res: Response): Promise<void> => {
  try {
    const order = await Order.findById(req.params.id)

    if (!order) {
      res.status(httpStatus.NOT_FOUND).json(
        buildResponse(httpStatus.NOT_FOUND, { message: 'Order not found' })
      )
      return
    }

    if (order.orderStatus !== 'placed') {
      res.status(httpStatus.BAD_REQUEST).json(
        buildResponse(httpStatus.BAD_REQUEST, { message: 'Can only cancel placed orders' })
      )
      return
    }

    order.orderStatus = 'cancelled'
    await order.save()

    res.status(httpStatus.OK).json(
      buildResponse(httpStatus.OK, { message: 'Order cancelled successfully', response: order })
    )
  } catch (err) {
    handleError(res, err)
  }
}
