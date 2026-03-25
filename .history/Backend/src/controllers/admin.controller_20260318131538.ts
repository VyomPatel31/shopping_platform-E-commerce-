import { Request, Response } from 'express'
import User from '../models/user.schema.js'
import Order from '../models/order.schema.js'
import Product from '../models/product.schema.js'
import buildResponse from '../utils/buildResponse.js'
import handleError from '../utils/handleError.js'

export const getDashboardController = async (req: Request, res: Response): Promise<void> => {
  try {
    const totalUsers = await User.countDocuments()
    const totalOrders = await Order.countDocuments()
    const totalProducts = await Product.countDocuments()

    const revenue = await Order.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: '$totalAmount' },
        },
      },
    ])

    res.status(200).json(
      buildResponse(200, {
        totalUsers,
        totalOrders,
        totalProducts,
        totalRevenue: revenue[0]?.total || 0,
      })
    )
  } catch (err) {
    handleError(res, err)
  }
}

export const getAllUsersController = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.find({}).select('-password')

    res.status(200).json(buildResponse(200, users))
  } catch (err) {
    handleError(res, err)
  }
}

export const deleteUserController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params

    await User.findByIdAndDelete(id)

    res.status(200).json(buildResponse(200, { message: 'User deleted' }))
  } catch (err) {
    handleError(res, err)
  }
}

export const createProductController = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await Product.create(req.body)

    res.status(201).json(buildResponse(201, product))
  } catch (err) {
    handleError(res, err)
  }
}

export const updateProductController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params

    const product = await Product.findByIdAndUpdate(id, req.body, { new: true })

    res.status(200).json(buildResponse(200, product))
  } catch (err) {
    handleError(res, err)
  }
}

export const deleteProductController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params

    await Product.findByIdAndDelete(id)

    res.status(200).json(buildResponse(200, { message: 'Product deleted' }))
  } catch (err) {
    handleError(res, err)
  }
}
