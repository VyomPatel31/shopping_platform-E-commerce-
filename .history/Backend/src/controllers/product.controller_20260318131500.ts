import { Request, Response } from 'express'
import httpStatus from 'http-status'
import Product from '../models/product.schema.js'
import buildResponse from '../utils/buildResponse.js'
import handleError from '../utils/handleError.js'
import { PaginationQuery } from '../types/index.d.js'

export const getProductsController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { 
      page = '1', 
      limit = '10', 
      category, 
      minPrice, 
      maxPrice, 
      search, 
      sort 
    } = req.query as unknown as PaginationQuery & { sort?: string }

    const query: any = {}

    if (category) query.category = category
    if (minPrice || maxPrice) {
      query.price = {}
      if (minPrice) query.price.$gte = Number(minPrice)
      if (maxPrice) query.price.$lte = Number(maxPrice)
    }

    if (search) {
      query.name = { $regex: search, $options: 'i' }
    }

    let sortOption: any = {}
    if (sort === 'price_asc') sortOption.price = 1
    if (sort === 'price_desc') sortOption.price = -1
    if (sort === 'latest') sortOption.createdAt = -1

    const pageNum = Number(page)
    const limitNum = Number(limit)
    const skip = (pageNum - 1) * limitNum

    const products = await Product.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum)

    const total = await Product.countDocuments(query)

    res.status(httpStatus.OK).json(
      buildResponse(httpStatus.OK, {
        products,
        totalPages: Math.ceil(total / limitNum),
        currentPage: pageNum,
      })
    )
  } catch (err) {
    handleError(res, err)
  }
}

// get product by id
export const getProductByIdController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params

    const product = await Product.findById(id)

    if (!product) {
      res.status(httpStatus.NOT_FOUND).json(
        buildResponse(httpStatus.NOT_FOUND, { message: 'Product not found' })
      )
      return
    }

    res.status(httpStatus.OK).json(
      buildResponse(httpStatus.OK, product)
    )
  } catch (err) {
    handleError(res, err)
  }
}

// get featured products
export const getFeaturedProductsController = async (req: Request, res: Response): Promise<void> => {
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
export const getTrendingProductsController = async (req: Request, res: Response): Promise<void> => {
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
export const searchProductsController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { q } = req.query

    if (!q) {
      res.status(httpStatus.BAD_REQUEST).json(
        buildResponse(httpStatus.BAD_REQUEST, { message: 'Search query is required' })
      )
      return
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
