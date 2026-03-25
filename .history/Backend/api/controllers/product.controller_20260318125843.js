// controllers/product.controller.js
import { matchedData } from 'express-validator'
import httpStatus from 'http-status'
import Product from '../models/product.schema.js'
import buildResponse from '../utils/buildResponse.js'
import handleError from '../utils/handleError.js'

export const getProductsController = async (req, res) => {
  try {
    const { page = 1, limit = 10, category, minPrice, maxPrice, search, sort } = req.query

    const query = {}

    if (category) query.category = category
    if (minPrice || maxPrice) {
      query.price = {}
      if (minPrice) query.price.$gte = Number(minPrice)
      if (maxPrice) query.price.$lte = Number(maxPrice)
    }

    if (search) {
      query.name = { $regex: search, $options: 'i' }
    }

    let sortOption = {}
    if (sort === 'price_asc') sortOption.price = 1
    if (sort === 'price_desc') sortOption.price = -1
    if (sort === 'latest') sortOption.createdAt = -1

    const skip = (page - 1) * limit

    const products = await Product.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit))

    const total = await Product.countDocuments(query)

    res.status(httpStatus.OK).json(
      buildResponse(httpStatus.OK, {
        products,
        totalPages: Math.ceil(total / limit),
        currentPage: Number(page),
      })
    )
  } catch (err) {
    handleError(res, err)
  }
}

// get product by id
export const getProductByIdController = async (req, res) => {
  try {
    const { id } = req.params

    const product = await Product.findById(id)

    if (!product) {
      return res.status(httpStatus.NOT_FOUND).json(
        buildResponse(httpStatus.NOT_FOUND, { message: 'Product not found' })
      )
    }

    res.status(httpStatus.OK).json(
      buildResponse(httpStatus.OK, product)
    )
  } catch (err) {
    handleError(res, err)
  }
}

// get featured products
export const getFeaturedProductsController = async (req, res) => {
  try {
    const products = await Product.find({ isFeatured: true }).limit(10)

    res.status(httpStatus.OK).json(
      buildResponse(httpStatus.OK, products)
    )
  } catch (err) {
    handleError(res, err)
  }
}

// get trending products
export const getTrendingProductsController = async (req, res) => {
  try {
    const products = await Product.find({ isTrending: true }).limit(10)

    res.status(httpStatus.OK).json(
      buildResponse(httpStatus.OK, products)
    )
  } catch (err) {
    handleError(res, err)
  }
}

// search products
export const searchProductsController = async (req, res) => {
  try {
    const { q } = req.query

    if (!q) {
      return res.status(httpStatus.BAD_REQUEST).json(
        buildResponse(httpStatus.BAD_REQUEST, { message: 'Search query is required' })
      )
    }

    const products = await Product.find({
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { category: { $regex: q, $options: 'i' } },
      ],
    }).limit(20)

    res.status(httpStatus.OK).json(
      buildResponse(httpStatus.OK, products)
    )
  } catch (err) {
    handleError(res, err)
  }
}