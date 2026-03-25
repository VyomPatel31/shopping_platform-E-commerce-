// controllers/product.controller.ts
import { Request, Response } from 'express'
import httpStatus from 'http-status'
import Product from '../models/product.schema.js'
import buildResponse from '../utils/buildResponse.js'
import handleError from '../utils/handleError.js'

// upload product image from PC
export const uploadProductImageController = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(httpStatus.BAD_REQUEST).json(
        buildResponse(httpStatus.BAD_REQUEST, { message: 'No file uploaded' })
      )
    }

    const baseUrl = `${req.protocol}://${req.get('host')}`
    const imageUrl = `${baseUrl}/uploads/${req.file.filename}`

    res.status(httpStatus.OK).json(
      buildResponse(httpStatus.OK, { url: imageUrl })
    )
  } catch (err: any) {
    handleError(res, err)
  }
}

export const getProductsController = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, category, minPrice, maxPrice, rating, search, sort } = req.query as any

    const query: any = {}

    if (category) query.category = category
    if (minPrice || maxPrice) {
      query.price = {}
      if (minPrice) query.price.$gte = Number(minPrice)
      if (maxPrice) query.price.$lte = Number(maxPrice)
    }

    if (rating) {
        query.rating = { $gte: Number(rating) }
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } }
      ]
    }

    let sortOption: any = { createdAt: -1 }
    if (sort === 'price_asc') sortOption = { price: 1 }
    if (sort === 'price_desc') sortOption = { price: -1 }
    if (sort === 'latest') sortOption = { createdAt: -1 }
    if (sort === 'rating') sortOption = { rating: -1 }

    const skip = (Number(page) - 1) * Number(limit)

    const products = await Product.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit))

    const total = await Product.countDocuments(query)

    res.status(httpStatus.OK).json(
      buildResponse(httpStatus.OK, {
        products,
        totalPages: Math.ceil(total / Number(limit)),
        currentPage: Number(page),
      })
    )
  } catch (err: any) {
    handleError(res, err)
  }
}

// get product by id
export const getProductByIdController = async (req: Request, res: Response) => {
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
  } catch (err: any) {
    handleError(res, err)
  }
}

// get featured products
export const getFeaturedProductsController = async (req: Request, res: Response) => {
  try {
    const products = await Product.find({ isFeatured: true }).limit(10)

    res.status(httpStatus.OK).json(
      buildResponse(httpStatus.OK, products)
    )
  } catch (err: any) {
    handleError(res, err)
  }
}

// get trending products
export const getTrendingProductsController = async (req: Request, res: Response) => {
  try {
    const products = await Product.find({ isTrending: true }).limit(10)

    res.status(httpStatus.OK).json(
      buildResponse(httpStatus.OK, products)
    )
  } catch (err: any) {
    handleError(res, err)
  }
}

// search products
export const searchProductsController = async (req: Request, res: Response) => {
  try {
    const { q } = req.query as any

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
  } catch (err: any) {
    handleError(res, err)
  }
}

// create product (Admin)
export const createProductController = async (req: Request, res: Response) => {
  try {
    const product = await Product.create(req.body)

    res.status(httpStatus.CREATED).json(
      buildResponse(httpStatus.CREATED, product)
    )
  } catch (err: any) {
    handleError(res, err)
  }
}

// update product (Admin)
export const updateProductController = async (req: Request, res: Response) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )

    if (!product) {
      return res.status(httpStatus.NOT_FOUND).json(
        buildResponse(httpStatus.NOT_FOUND, { message: 'Product not found' })
      )
    }

    res.status(httpStatus.OK).json(
      buildResponse(httpStatus.OK, product)
    )
  } catch (err: any) {
    handleError(res, err)
  }
}

// delete product (Admin)
export const deleteProductController = async (req: Request, res: Response) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id)

    if (!product) {
      return res.status(httpStatus.NOT_FOUND).json(
        buildResponse(httpStatus.NOT_FOUND, { message: 'Product not found' })
      )
    }

    res.status(httpStatus.OK).json(
      buildResponse(httpStatus.OK, { message: 'Product deleted' })
    )
  } catch (err: any) {
    handleError(res, err)
  }
}